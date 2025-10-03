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

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b frontend/vr-visite`)
3. Commit les changements (`git commit -m 'ADD: vr visite'`)
4. Push sur la branche (`git push origin frontend/vr-visite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Équipe MyEpiBooking**
- Email: contact@myepibooking.eu
- Repository: [GitHub](https://github.com/Joan-Cordelier/MyEpiBooking)

---
