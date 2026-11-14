// Liest ein eingereichtes Projekt (GitHub-Issue-Formular) und trägt es in projects.json ein.
import fs from 'node:fs';
import sharp from 'sharp';

const body = process.env.ISSUE_BODY || '';
const issue = Number(process.env.ISSUE_NUMBER) || null;
const token = process.env.GH_TOKEN;

// Abschnitte «### Überschrift» → Wert
const sections = {};
let current = null;
for (const line of body.split(/\r?\n/)) {
  const h = line.match(/^###\s+(.+?)\s*$/);
  if (h) { current = h[1]; sections[current] = []; continue; }
  if (current) sections[current].push(line);
}
const get = (label) => {
  const v = (sections[label] || []).join('\n').trim();
  return v === '_No response_' || v === 'None' ? '' : v;
};
const clip = (s, n) => s.replace(/\s+\n/g, '\n').slice(0, n).trim();

const titel = clip(get('Titel'), 80);
const text = clip(get('Kurzer Beschrieb'), 800);
const tech = clip(get('Technik'), 40);
if (!titel || !text || !tech) {
  console.error('Titel, Beschrieb oder Technik fehlt.');
  process.exit(1);
}

// Links: pro Zeile Bezeichnung + URL
const links = [];
for (const line of get('Links').split(/\r?\n/)) {
  const m = line.match(/https?:\/\/[^\s<>()"']+/i);
  if (!m) continue;
  let name = line.slice(0, m.index).replace(/[\s:|\-–*\[\]]+$/g, '').replace(/^[\s\-*]+/, '').trim();
  links.push({ name: (name || 'Link').slice(0, 40), url: m[0] });
  if (links.length >= 4) break;
}

const projects = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
const nr = projects.reduce((m, p) => Math.max(m, Number(p.nr) || 0), 0) + 1;
const slug = titel.toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'projekt';

// Foto: erstes Bild aus dem Feld herunterladen, verkleinern, Metadaten (z. B. GPS) entfernen
let foto = null;
const fotoField = get('Foto');
const img = fotoField.match(/https:\/\/(?:github\.com\/user-attachments\/assets\/[\w-]+|user-images\.githubusercontent\.com\/[^\s)"']+|private-user-images\.githubusercontent\.com\/[^\s)"']+)/);
if (img) {
  const res = await fetch(img[0], { headers: token ? { Authorization: `Bearer ${token}` } : {}, redirect: 'follow' });
  if (res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    const name = `${String(nr).padStart(3, '0')}-${slug}.jpg`;
    await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(`fotos/${name}`);
    foto = `fotos/${name}`;
  } else {
    console.warn(`Foto konnte nicht geladen werden (${res.status}).`);
  }
}

const entry = {
  nr, titel, text, tech,
  niveau: clip(get('Niveau'), 30),
  klasse: clip(get('Klasse'), 30),
  jahr: clip(get('Jahr'), 9),
  material: clip(get('Material'), 120),
  zeit: clip(get('Zeitaufwand'), 60),
  foto, links, issue,
  datum: new Date().toISOString().slice(0, 10),
};
projects.push(entry);
fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2) + '\n');

const out = process.env.GITHUB_OUTPUT;
if (out) fs.appendFileSync(out, `nr=${String(nr).padStart(3, '0')}\ntitel=${titel.replace(/[\r\n]/g, ' ')}\n`);
console.log(`Projekt Nr. ${nr} «${titel}» eingetragen.`);
