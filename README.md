# AgriSénégal - Front-End

Application web moderne pour la gestion agricole au Sénégal.

## 🚀 Technologies

- **Angular 18+**
- **Bootstrap 5**
- **Angular Material**
- **ngx-charts** (graphiques)
- **ngx-toastr** (notifications)
- **ngx-leaflet** (cartes GPS)
- **ng2-charts** (Chart.js)

## 📦 Installation

```bash
npm install
```

## 🏃 Démarrage

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 📁 Architecture

```
src/app
├── core
│   ├── guards          # AuthGuard, RoleGuard
│   ├── interceptors    # JWT, Error
│   ├── models         # Interfaces TypeScript
│   └── services       # Auth, API, Storage
├── shared
│   ├── components     # Composants réutilisables
│   └── shared.module  # Module partagé
└── modules
    ├── auth           # Connexion, Inscription
    ├── dashboard      # Tableau de bord
    ├── parcelles      # Gestion des parcelles
    ├── journal        # Journal de culture
    ├── marketplace    # E-commerce
    ├── financement    # Microcrédit
    └── profil         # Profil utilisateur
```

## 🔐 Authentification

- Connexion
- Inscription
- Mot de passe oublié
- JWT avec interceptors

## 📊 Fonctionnalités

### Dashboard
- KPIs (Rendement, Revenu, Santé des champs)
- Graphiques de rendement
- Alertes et recommandations

### Parcelles
- CRUD complet
- Carte GPS (Leaflet)
- Gestion des cultures

### Journal de Culture
- Enregistrement des activités
- Filtres par type et date
- Graphiques d'évolution

### Marketplace
- Catalogue de produits
- Commandes (ventes/achats)
- Gestion des produits

### Financement
- Simulation de crédit
- Suivi des demandes
- Chat avec conseiller

### Profil
- Informations personnelles
- Photo de profil
- Changement de mot de passe

## 🔒 Sécurité

- Route Guards (AuthGuard, RoleGuard)
- JWT Interceptor
- Error Interceptor
- Validation des formulaires

## 📝 Notes

- L'API backend doit être configurée dans `src/environments/environment.ts`
- Les tokens JWT sont stockés dans le localStorage
- L'application est responsive (Bootstrap + Material)
