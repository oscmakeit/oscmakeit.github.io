# Makerspace OSC · Projektgalerie

Die Galerie zeigt Produkte aus dem Makerspace des OSC, St.Gallen, mit Beschrieb und Links zu Anleitungen.

**Seite:** https://oscmakeit.github.io
**Instagram:** https://www.instagram.com/osc_makeit/

## So kommt ein Projekt auf die Seite

1. **Einreichen:** Auf der Galerie auf «+ Projekt einreichen» klicken (oder hier unter *Issues › New issue › Projekt einreichen*). Formular ausfüllen und ein Foto hineinziehen. Dafür braucht es ein GitHub-Konto. Einreichen dürfen nur Teammitglieder, also Personen mit Schreibrechten in diesem Repository. Einreichungen von anderen werden automatisch geschlossen und gesperrt.
2. **Prüfen:** Das Team Makerspace schaut das Projekt an. Wichtig: keine Gesichter und keine Namen auf dem Foto.
3. **Freigeben:** Dem Issue das Label **`freigegeben`** geben. Eine Automatik verkleinert das Foto, entfernt die Metadaten (z. B. GPS), trägt das Projekt in `projects.json` ein und schliesst das Issue. Nach ein bis zwei Minuten ist es online.

Labels setzen können nur Mitglieder mit Schreibrechten. So geht nichts ohne Prüfung online.

## Teammitglied hinzufügen

In der Organisation unter *People › Invite member* einladen und im Repository unter *Settings › Collaborators and teams* die Rolle **Write** geben.

## Projekt ändern oder löschen

Alle Projekte stehen in `projects.json`. Auf GitHub die Datei öffnen, auf den Stift klicken, den Eintrag ändern oder löschen und speichern. Fotos liegen im Ordner `fotos/`.

## Einmalig einrichten

1. Labels `projekt` und `freigegeben` anlegen (*Issues › Labels*).
2. *Settings › Pages:* Source «Deploy from a branch», Branch `main`, Ordner `/ (root)`.
3. *Settings › Actions › General › Workflow permissions:* «Read and write permissions».

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | Die Galerie |
| `projects.json` | Alle Projekte |
| `fotos/` | Verkleinerte Produktfotos |
| `.github/ISSUE_TEMPLATE/projekt.yml` | Das Einreiche-Formular |
| `.github/workflows/projekt-hinzufuegen.yml` | Die Automatik nach der Freigabe |
| `.github/scripts/add-project.mjs` | Liest das Formular und trägt das Projekt ein |
