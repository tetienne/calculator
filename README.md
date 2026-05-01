# Calculator

Calculatrice web statique au design néomorphique, hébergée sur GitHub Pages.

**Démo :** https://tetienne.github.io/calculator/

## Fonctionnalités

- Opérations de base : `+`, `−`, `×`, `÷`
- Touches utilitaires : `AC` (tout effacer), `+/−` (changer le signe), `%`
- Décimales et chaînage d'opérations
- Responsive (mobile + desktop)
- Support clavier : chiffres, opérateurs, `Enter`/`=`, `Escape` (AC), `Backspace`

## Stack

HTML / CSS / JavaScript vanilla — aucune dépendance, aucune étape de build.

## Développement local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Le workflow `.github/workflows/deploy.yml` publie automatiquement le site à chaque push sur `main`.

**Activation initiale (une seule fois) :** dans **Settings → Pages**, choisir **Source : GitHub Actions**.
