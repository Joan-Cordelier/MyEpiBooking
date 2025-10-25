# MyEpiBooking

> Une application web et mobile de réservation de salles pour bâtiments, développée par une équipe de 3 personnes.

## Description

MyEpiBooking est une plateforme complète permettant de réserver des salles dans les bâtiments Epitech. L'application offre une interface web et une application mobile native pour une expérience utilisateur optimale.

## Architecture

### Structure du Repo

```
MyEpiBooking/
├── apps/
│   ├── web/          # Application Next.js (React)
│   ├── mobile/       # Application Expo React Native
│   └── api/          # Backend Express + TypeScript
└── packages/
    ├── ui/           # Composants partagés
    ├── schemas/      # Schémas Zod partagés
    ├── config/       # Configurations partagées
    └── tsconfig/     # Configurations TypeScript
```

## Stack Technique

### Frontend Web
- **Framework**: Next.js 14/15 (App Router)
- **UI Library**: React + Tailwind CSS + shadcn/ui
- **State Management**: 
  - TanStack Query (React Query) pour l'état serveur
  - Zustand pour l'état local
- **Formulaires**: React Hook Form + Zod
- **Calendrier**: @fullcalendar/react
- **Authentification**: Auth.js (NextAuth)

### Mobile
- **Framework**: Expo + React Native + Expo Router
- **UI**: Tamagui ou NativeWind
- **Notifications**: Expo Notifications

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de données**: PostgreSQL avec extensions btree_gist
- **Validation**: Zod
- **Cache**: Redis
- **Jobs**: BullMQ
- **WebSockets**: Socket.IO
- **Documentation API**: OpenAPI + Swagger

### DevOps & Outils
- **Monorepo**: pnpm + Turborepo
- **Tests**: Vitest/Jest, Playwright (E2E)
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (erreurs) + Pino (logs)

## Fonctionnalités Principales

### MVP (Minimum Viable Product)

1. **Authentification**
   - Connexion par email/mot de passe
   - Authentification sociale (optionnelle)

2. **Gestion des Bâtiments et Salles**
   - CRUD bâtiments
   - CRUD salles avec capacité et équipements
   - Filtres par caractéristiques

3. **Système de Réservation**
   - Vue calendrier par salle (jour/semaine/mois)
   - Réservation avec validation anti-chevauchement
   - Règles métier (durée max, horaires d'ouverture)

4. **Notifications**
   - E-mails de confirmation
   - Export calendrier (.ics)
   - Notifications push (mobile)

5. **Administration**
   - Validation/annulation des réservations
   - Gestion des plages fermées
   - Dashboard statistiques

### Fonctionnalités Avancées

- Gestion des ressources (projecteur, tables, etc.)
- Réservations récurrentes
- Système d'approbation hiérarchique
- Intégrations calendrier (Intra, Google, Outlook)
- Rapports d'utilisation
- API publique pour intégrations tierces

## Modèle de Données

### Entités Principales

```typescript
// Modèle Prisma simplifié
model Building {
  id     String @id @default(cuid())
  name   String
  city   String
  rooms  Room[]
  ...
}

model Room {
  id           String @id @default(cuid())
  name         String
  capacity     Int
  features     String[] // JSON array
  buildingId   String
  building     Building @relation(fields: [buildingId], references: [id])
  reservations Reservation[]
  ...
}

model Reservation {
  id        String   @id @default(cuid())
  roomId    String
  userId    String
  startsAt  DateTime
  endsAt    DateTime
  status    ReservationStatus
  room      Room     @relation(fields: [roomId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  @@index([roomId, startsAt, endsAt])
  ...
}
```

### Contrainte Anti-Chevauchement

PostgreSQL avec extension `btree_gist` et contrainte `EXCLUDE USING GIST` pour empêcher les réservations qui se chevauchent automatiquement au niveau base de données.

## Organisation de l'Équipe

### Répartition des Rôles (3 personnes)

1. **Backend/DB Lead (Joan)**
   - Modèle Prisma et migrations
   - API Express et routes
   - Contraintes anti-overlap
   - Workers et jobs asynchrones
   - Documentation Swagger

2. **Frontend Web Lead (Sacha)**
   - Application Next.js
   - Interface calendrier
   - Flows de réservation
   - Authentification
   - Dashboard admin

3. **Mobile/DevOps (Mike)**
   - Application Expo React Native
   - Notifications push
   - Builds et déploiement
   - CI/CD et monitoring
   - Publication stores (TestFlight/Play Store)

## Installation et Développement

### Prérequis

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis 6+

### Configuration Initiale

```bash
# Cloner le repository
git clone https://github.com/Joan-Cordelier/MyEpiBooking.git
cd MyEpiBooking

# Installer les dépendances
pnpm install

# Configuration de la base de données
cp .env.example .env
# Remplir les variables d'environnement

# Migrations Prisma
cd apps/api
pnpm prisma migrate dev

# Seed de données de test
pnpm prisma db seed
```

### Développement

```bash
# Démarrer tous les services en développement
pnpm dev

# Démarrer individuellement
pnpm dev:web     # Frontend web (localhost:3000)
pnpm dev:api     # Backend API (localhost:3001)
pnpm dev:mobile  # Application mobile (Expo)

# Tests
pnpm test        # Tests unitaires
pnpm test:e2e    # Tests end-to-end
```

## Déploiement

### Environnements Cibles

- **Frontend Web**: Vercel (Next.js optimisé)
- **Backend**: Fly.io / Railway / Render
- **Base de données**: Neon / Supabase / Aiven PostgreSQL
- **Cache Redis**: Upstash / Redis Cloud
- **Stockage**: AWS S3 / Cloudflare R2

### Variables d'Environnement

```bash
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://..."
```

## Applications

### Web App
- Interface responsive desktop/tablette
- PWA avec capacités offline
- Notifications navigateur

### Mobile App
- iOS et Android natifs via Expo
- Notifications push
- Mode offline partiel
- Géolocalisation des bâtiments

## Sécurité

- Authentification JWT sécurisée
- Rate limiting sur les API
- Validation stricte des entrées (Zod)
- RBAC (Role-Based Access Control)
- Audit trail des actions critiques

## Performance

- Server-Side Rendering (Next.js)
- Cache Redis intelligent
- Optimistic updates (TanStack Query)
- Lazy loading des composants
- Compression et optimisation d'images

## Tests

- **Unitaires**: Vitest/Jest
- **Intégration**: Tests API avec base de données test
- **E2E**: Playwright (web) + Detox (mobile)
- **Coverage**: >80% sur la logique métier

## Documentation

- API: Swagger UI automatique (`/api/docs`)
- Composants: Storybook pour la UI library
- Architecture: Documentation technique dans `/docs`

## Workflow Git & Contribution

### Philosophie Git Flow

Notre projet utilise une stratégie **Git Flow simplifié** avec deux branches principales :

- **`main`** : Branche de **production** contenant uniquement les releases stables et taggées
- **`dev`** : Branche **d'intégration** par défaut où tout le développement est mergé

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTION                          │
│  main ─●────────────●─────────────────●──────────>         │
│        │ v1.0.0     │ v1.1.0          │ v2.0.0              │
└─────────┼────────────┼─────────────────┼────────────────────┘
          │            │                 │
          │  Release   │    Release      │   Release
          │     PR     │       PR        │      PR
          │            │                 │
┌─────────┼────────────┼─────────────────┼────────────────────┐
│         │            │                 │   INTEGRATION      │
│  dev ───●────●───●───●─────●───●───●───●──────────>         │
│         │    │   │   │     │   │   │   │                    │
└─────────┼────┼───┼───┼─────┼───┼───┼───┼────────────────────┘
          │    │   │   └─────┘   │   │   └─ feature/mobile/notif
          │    │   └─────────────┘   └───── feature/front/calendar
          │    └─────────────────────────── bugfix/api/validation
          └──────────────────────────────── feature/back/auth

DÉVELOPPEMENT
feature/*, bugfix/*, hotfix/*, chore/*
```

### Pourquoi ce Workflow ?

✅ **Branche `main` propre** : Uniquement du code testé, validé et déployé en production
✅ **Intégration continue sur `dev`** : Détection rapide des conflits entre features
✅ **Releases contrôlées** : Chaque release est un point de contrôle avant production
✅ **Rollback facile** : Retour à une version stable via les tags Git
✅ **Historique clair** : `main` = historique des releases, `dev` = historique du développement

### Structure des Branches

```
main (production - releases only)
  ^
  │ PR de release (milestone atteint)
  │
dev (intégration - DEFAULT BRANCH)
  ^
  │ PRs quotidiennes
  │
feature/* / bugfix/* / hotfix/* (développement)
```

### Convention de Nommage des Branches

```bash
# Features
feature/<scope>/<description>
feature/back/user-crud
feature/front/calendar-view
feature/mobile/push-notifications
feature/full-stack/booking-flow

# Corrections de bugs
bugfix/<scope>/<description>
bugfix/api/auth-validation

# Hotfixes (urgents, depuis main)
hotfix/<description>
hotfix/security-patch

# Maintenance
chore/<description>
chore/update-dependencies
```

### Convention de Commit

```bash
<TYPE>: <description courte>

Types:
ADD:      Nouvelle fonctionnalité
FIX:      Correction de bug
REFACTOR: Restructuration du code
DOCS:     Documentation
TEST:     Tests
CHORE:    Maintenance
STYLE:    Formatage
PERF:     Optimisation performance
```

### Processus de Contribution

1. **Créer une issue GitHub** pour la fonctionnalité/bug
   ```
   Issue #42: Implémenter le CRUD des utilisateurs
   ```

2. **Créer une branche depuis `dev`**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/back/user-crud
   ```

3. **Développer et commiter régulièrement**
   ```bash
   git add .
   git commit -m "ADD: user Prisma model and schema"
   git commit -m "ADD: user CRUD endpoints"
   git commit -m "TEST: user controller tests"
   ```

4. **Pousser et créer une Pull Request vers `dev`**
   ```bash
   git push origin feature/back/user-crud
   ```
   - Titre: "ADD: User CRUD operations"
   - Description: "Closes #42"
   - Assigner un reviewer approprié
   - Ajouter des labels (backend/frontend/mobile)

5. **Code Review**
   - Le reviewer (Joan/Sacha/Mike selon le scope) examine le code
   - Les tests CI/CD doivent passer
   - Corrections si nécessaires

6. **Merge vers `dev`**
   - Après approbation, merge via GitHub
   - L'issue se ferme automatiquement
   - La branche feature est supprimée

7. **Release vers `main`**
   - Périodiquement (milestone atteint ...), créer une PR de release
   - **Branche** : `release/vX.Y.Z` créée depuis `dev`
   - **Process** :
     ```bash
     # 1. Créer la branche de release
     git checkout dev
     git pull origin dev
     git checkout -b release/v1.0.0
     
     # 2. Mettre à jour les versions et CHANGELOG
     # - package.json : "version": "1.0.0"
     # - CHANGELOG.md : documenter les changements
     
     # 3. Commit et push
     git add .
     git commit -m "RELEASE: prepare v1.0.0"
     git push origin release/v1.0.0
     
     # 4. Créer PR : release/v1.0.0 → main
     gh pr create --base main --title "RELEASE: v1.0.0" --body "
     ## Release v1.0.0
     
     ### Nouvelles fonctionnalités
     - Authentification utilisateurs
     - Système de réservation de salles
     - Vue calendrier
     
     ### Corrections
     - Fix validation anti-chevauchement
     
     ### Documentation
     - README complet
     - Swagger API docs
     "
     
     # 5. Après approbation et merge, tag la version
     git checkout main
     git pull origin main
     git tag -a v1.0.0 -m "Release v1.0.0 - MVP"
     git push origin v1.0.0
     
     # 6. IMPORTANT : Merge back main -> dev
     git checkout dev
     git merge main --no-ff -m "MERGE: sync main v1.0.0 into dev"
     git push origin dev
     ```
   - **Approbations requises** : 2 (tous les tech leads)
   - **Tag Git** : Créer un tag `vX.Y.Z` sur `main` après merge
   - **Déploiement** : Déclenché automatiquement via CI/CD sur le tag

### Versioning Sémantique

Nous suivons [Semantic Versioning](https://semver.org/) : `MAJOR.MINOR.PATCH`

- **MAJOR** (v2.0.0) : Breaking changes, incompatibilités API
- **MINOR** (v1.1.0) : Nouvelles fonctionnalités, rétro-compatible
- **PATCH** (v1.0.1) : Corrections de bugs, hotfixes

**Exemples :**
```bash
v1.0.0  # MVP initial - première release
v1.1.0  # Ajout notifications push (feature)
v1.1.1  # Fix bug calendrier (patch)
v1.2.0  # Ajout réservations récurrentes (feature)
v2.0.0  # Refonte API auth (breaking change)
```

### Répartition des Reviews

- **Backend (Joan)**: Revoit les PRs `feature/back/*` et `feature/full-stack/*`
- **Frontend Web (Sacha)**: Revoit les PRs `feature/front/*` et `feature/full-stack/*`
- **Mobile (Mike)**: Revoit les PRs `feature/mobile/*` et `feature/full-stack/*`

### Règles de Protection des Branches

#### Branch `main` (Production):
- ❌ Push direct **strictement interdit**
- ✅ PR depuis `release/*` ou `hotfix/*` uniquement
- ✅ **2 approbations requises** (protection maximale)
- ✅ Tous les checks CI/CD doivent passer
- ✅ Branche doit être à jour avant merge
- ✅ Inclut les administrateurs (même les admins suivent les règles)
- 🏷️ **Chaque merge = 1 tag de version**

#### Branch `dev` (Intégration - DEFAULT):
- ❌ Push direct interdit
- ✅ PR depuis `feature/*`, `bugfix/*`, `chore/*`
- ✅ **1 approbation requise** (reviewer selon scope)
- ✅ Tous les checks CI/CD doivent passer
- ✅ Suppression automatique des branches après merge
- 🔄 **Base par défaut** pour toutes les nouvelles PRs

#### Feature Branches (Développement):
- ✅ Push direct autorisé (c'est ton espace de travail)
- ⏱️ Durée de vie courte (< 1 semaine idéalement)
- 🗑️ Supprimées automatiquement après merge

### Gestion des Hotfixes (Urgences Production)

Si un bug critique est découvert en production (`main`) :

```bash
# 1. Créer hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Fix le bug
git commit -m "FIX: critical security vulnerability"

# 3. PR vers main (prioritaire!)
gh pr create --base main --title "HOTFIX: Security patch" --label "hotfix,priority:high"

# 4. Après merge, tag
git tag -a v1.0.1 -m "Hotfix v1.0.1 - Security patch"
git push origin v1.0.1

# 5. IMPORTANT : Merge aussi dans dev
git checkout dev
git cherry-pick <commit-hash>  # ou merge main → dev
git push origin dev
```

### Exemples de Workflows Complets

#### 🎯 Exemple 1 : Feature Simple (Backend Auth)

```bash
# Joan crée issue #15 "Implémenter JWT authentication"
# Joan crée la branche
git checkout dev && git pull
git checkout -b feature/back/jwt-auth

# Joan développe
git commit -m "ADD: JWT middleware"
git commit -m "ADD: login/register endpoints"
git commit -m "TEST: auth controller tests"

# Joan push et crée PR
git push origin feature/back/jwt-auth
gh pr create --base dev --title "ADD: JWT authentication" --body "Closes #15"

# Sacha review et approve
# GitHub Actions: ✅ auto-label "backend", auto-assign Joan
# Merge -> dev, issue #15 se ferme, branche supprimée
```

#### 🎯 Exemple 2 : Feature Full-Stack (Booking System)

```bash
# Issue #25 créée : "Système de réservation complet"

# Joan (backend)
git checkout -b feature/back/booking-api
# ... développe API
gh pr create --base dev --title "ADD: Booking API endpoints"

# Sacha (frontend) - attend que PR de Joan soit mergée
git checkout dev && git pull  # récupère l'API
git checkout -b feature/front/booking-ui
# ... développe UI
gh pr create --base dev --title "ADD: Booking UI flow"

# Mike (mobile)
git checkout dev && git pull  # récupère tout
git checkout -b feature/mobile/booking-screen
# ... développe mobile
gh pr create --base dev --title "ADD: Booking mobile screens"

# Toutes les PRs mergées -> Feature complète dans dev
```

#### 🎯 Exemple 3 : Release v1.0.0 (MVP)

```bash
# Toutes les features MVP sont dans dev
# On décide de faire la première release

git checkout dev && git pull
git checkout -b release/v1.0.0

# Mise à jour versions
# package.json, CHANGELOG.md, etc.
git commit -m "RELEASE: prepare v1.0.0"

gh pr create --base main --title "RELEASE: v1.0.0 - MVP" \
  --body "Première release avec auth, booking et calendrier. Closes #milestone-mvp"

# 2 approbations → Merge
git checkout main && git pull
git tag -a v1.0.0 -m "Release v1.0.0 - MVP complet"
git push origin v1.0.0

# Sync dev
git checkout dev
git merge main
git push origin dev

# 🚀 Déploiement automatique en production !
```

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

**Équipe MyEpiBooking**
- Email: contact@myepibooking.eu
- Repository: [GitHub](https://github.com/Joan-Cordelier/MyEpiBooking)

---
