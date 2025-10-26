# API Setup Guide

Guide complet pour initialiser le backend Express + Prisma + TypeScript de MyEpiBooking.

---

## Setup Initial

> **Important**: La structure de dossiers, le schema Prisma, les configurations (package.json, tsconfig.json, .env.example), et les fichiers de base (server.ts, seed.ts) sont **déjà dans le repository**. Vous n'avez pas besoin de les créer manuellement.

### Workflow Complet de Setup

Suivez ces étapes dans l'ordre :

### 1. Cloner le repository

```bash
git clone https://github.com/Joan-Cordelier/MyEpiBooking.git
cd MyEpiBooking
```

### 2. Installer pnpm (si pas déjà installé)

```bash
# Via npm
npm install -g pnpm

# Via Homebrew (macOS)
brew install pnpm

# Via script officiel
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Vérifier l'installation :

```bash
pnpm --version  # Devrait afficher 8.x ou supérieur
```

### 3. Installer les dépendances du monorepo

```bash
# À la racine du projet
pnpm install
```

Cette commande installe toutes les dépendances pour `apps/web`, `apps/mobile`, `apps/api` et les `packages/`.

### 4. Setup de la base de données PostgreSQL

**Option A : Script automatique (recommandé)**

```bash
# Lancer le script de setup
bash scripts/setup-database.sh
```

Le script crée automatiquement :
- Base de données `myepibooking`
- Utilisateur PostgreSQL `myepibooking` avec mot de passe `myepibooking_dev_2025`
- Privilèges nécessaires

**Option B : Setup manuel**

Suivre le guide complet : [docs/API/DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 5. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cd apps/api
cp .env.example .env
```

Éditer le fichier `.env` (les valeurs par défaut correspondent au script de setup) :

```bash
DATABASE_URL="postgresql://myepibooking:myepibooking_dev_2025@localhost:5432/myepibooking?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006"
REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
```

### 6. Appliquer les migrations Prisma

```bash
# Depuis apps/api/
pnpm migrate

# Ou depuis la racine du monorepo
pnpm --filter api migrate
```

Cette commande :
- **Génère automatiquement** le client Prisma TypeScript (pas besoin de `prisma generate` séparé)
- Applique toutes les migrations de `prisma/migrations/` sur votre base de données
- Crée les tables (User, Campus, Room, Inventory, Reservation) avec toutes les contraintes
- Inclut la contrainte anti-chevauchement des réservations

### 7. (Optionnel) Seed de données de test

```bash
# Depuis apps/api/
pnpm prisma:seed

# Ou depuis la racine
pnpm --filter api prisma:seed
```

Le fichier `prisma/seed.ts` est déjà dans le repository. Il créera des données de test :
- Utilisateurs (admin, campus manager, users)
- Campus Epitech (Paris, Lyon, etc.)
- Salles avec inventaires
- Quelques réservations d'exemple

### 8. Lancer le serveur de développement

```bash
# Depuis apps/api/
pnpm dev

# Ou depuis la racine
pnpm --filter api dev
```

Le serveur démarre sur `http://localhost:3001` avec hot-reload (tsx watch).

### 9. Vérifier que tout fonctionne

Tester les endpoints :

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/api
```

### Résumé : Setup Complet en Une Commande

```bash
# Setup complet en une seule session
git clone https://github.com/Joan-Cordelier/MyEpiBooking.git
cd MyEpiBooking
pnpm install
bash scripts/setup-database.sh
cd apps/api
cp .env.example .env
pnpm migrate
pnpm prisma:seed  # optionnel
pnpm dev
```

---

## Routes API Prévues

### Authentication (connexion/inscription)
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter (obtenir JWT)
- `POST /api/auth/logout` - Se déconnecter
- `POST /api/auth/refresh` - Rafraîchir le token JWT
- `GET /api/auth/me` - Obtenir mon profil connecté

### Users (gestion des utilisateurs - CRUD complet)
- `GET /api/users` - Liste tous les utilisateurs (SUPER_ADMIN)
- `GET /api/users/:id` - Détails d'un utilisateur (SUPER_ADMIN / propriétaire)
- `POST /api/users` - Créer un utilisateur (SUPER_ADMIN)
- `PUT /api/users/:id` - Modifier un utilisateur (SUPER_ADMIN / propriétaire)
- `PATCH /api/users/:id/rights` - Modifier les droits (SUPER_ADMIN)
- `DELETE /api/users/:id` - Supprimer un utilisateur (SUPER_ADMIN)

### Campus (CRUD complet)
- `GET /api/campus` - Liste des campus
- `GET /api/campus/:id` - Détails d'un campus
- `POST /api/campus` - Créer un campus (SUPER_ADMIN)
- `PUT /api/campus/:id` - Modifier un campus (SUPER_ADMIN)
- `DELETE /api/campus/:id` - Supprimer un campus (SUPER_ADMIN)

### Rooms (CRUD complet)
- `GET /api/rooms` - Liste des salles (avec filtres: campus, floor, state)
- `GET /api/rooms/:id` - Détails d'une salle
- `POST /api/rooms` - Créer une salle (SUPER_ADMIN / EDIT_ROOM)
- `PUT /api/rooms/:id` - Modifier une salle (SUPER_ADMIN / EDIT_ROOM)
- `PATCH /api/rooms/:id/state` - Changer l'état (RESERVABLE/NON_RESERVABLE)
- `DELETE /api/rooms/:id` - Supprimer une salle (SUPER_ADMIN / EDIT_ROOM)

### Inventories (CRUD complet)
- `GET /api/inventories` - Liste tous les inventaires (SUPER_ADMIN)
- `GET /api/inventories/:id` - Détails d'un inventaire
- `GET /api/rooms/:roomId/inventory` - Inventaire d'une salle spécifique
- `POST /api/inventories` - Créer un inventaire (SUPER_ADMIN / EDIT_ROOM)
- `PUT /api/inventories/:id` - Modifier un inventaire (SUPER_ADMIN / EDIT_ROOM)
- `DELETE /api/inventories/:id` - Supprimer un inventaire (SUPER_ADMIN / EDIT_ROOM)

### Reservations (CRUD complet)
- `GET /api/reservations` - Liste des réservations (filtres: user, room, date)
- `GET /api/reservations/me` - Mes réservations
- `GET /api/reservations/room/:roomId` - Réservations d'une salle (calendrier)
- `GET /api/reservations/:id` - Détails d'une réservation
- `POST /api/reservations` - Créer une réservation (BOOK_ROOM)
- `PUT /api/reservations/:id` - Modifier une réservation (propriétaire / EDIT_RESERVATION)
- `DELETE /api/reservations/:id` - Annuler une réservation (propriétaire / EDIT_RESERVATION)

## Vérification

Une fois l'API lancée, tester les endpoints :

```bash
# Health check
curl http://localhost:3001/health
# Réponse: {"status":"ok","timestamp":"2025-10-26T..."}

# API info
curl http://localhost:3001/api
# Réponse: {"message":"MyEpiBooking API v1.0.0"}
```

Si les deux réponses s'affichent correctement, votre API est opérationnelle !

---

## Annexe : Détails Techniques

<details>
<summary><strong>Architecture des dossiers</strong></summary>

```
apps/api/
├── prisma/
│   ├── schema.prisma         # Modèle de données
│   ├── migrations/           # Historique des migrations
│   └── seed.ts               # Données de test
├── src/
│   ├── server.ts             # Point d'entrée Express
│   ├── config/
│   │   ├── database.ts       # Configuration Prisma
│   │   ├── env.ts            # Validation variables d'env
│   │   └── cors.ts           # Configuration CORS
│   ├── routes/
│   │   ├── index.ts               # Router principal
│   │   ├── auth.routes.ts         # Authentification (login/register)
│   │   ├── user.routes.ts         # CRUD utilisateurs
│   │   ├── campus.routes.ts       # CRUD campus
│   │   ├── room.routes.ts         # CRUD salles
│   │   ├── inventory.routes.ts    # CRUD inventaires
│   │   └── reservation.routes.ts  # CRUD réservations
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── campus.controller.ts
│   │   ├── room.controller.ts
│   │   ├── inventory.controller.ts
│   │   └── reservation.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Vérification JWT
│   │   ├── rights.middleware.ts   # Vérification droits utilisateur
│   │   ├── validate.middleware.ts # Validation Zod
│   │   └── error.middleware.ts    # Gestion erreurs
│   ├── services/
│   │   ├── auth.service.ts        # Login/register/JWT
│   │   ├── user.service.ts        # CRUD users
│   │   ├── campus.service.ts      # CRUD campus
│   │   ├── room.service.ts        # CRUD rooms
│   │   ├── inventory.service.ts   # CRUD inventories
│   │   └── reservation.service.ts # CRUD reservations
│   └── utils/
│       ├── jwt.ts
│       ├── logger.ts
│       └── validators.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

</details>

<details>
<summary><strong>Schéma Prisma complet (référence)</strong></summary>

> Le fichier est dans `apps/api/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum UserRight {
    EDIT_USER
    EDIT_ROOM
    EDIT_RESERVATION
    EDIT_RIGHTS
    BOOK_ROOM
    HOST_MEETING
}

enum RoomState {
    RESERVABLE
    NON_RESERVABLE
}

enum ReservationType {
    MEETING
    WORK
    KICK_OFF
    BOOTHING
    WORKSHOP
    TALK
    UNEXPECTED
}

// ============================================
// MODELS
// ============================================

model User {
    id                  String         @id @default(cuid())
    email               String         @unique
    password            String
    name                String?
    firstName           String?
    actual_promotion    String?
    photo               String?
    Right               UserRight[]
    campusId            String
    campus              Campus        @relation(fields: [campusId], references: [id], onDelete: Cascade)
    reservations        Reservation[]
    createdAt           DateTime       @default(now())
    updatedAt           DateTime       @updatedAt
    @@map("users")
}

model Campus {
    id       String  @id @default(cuid())
    name     String  @unique
    city     String
    address  String?
    rooms    Room[]
    users    User[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    @@map("campus")
}

model Room {
    id            String      @id @default(cuid())
    name          String
    floor         String
    state         RoomState   @default(RESERVABLE)
    capacity      Int
    description   String
    campusId      String
    campus        Campus        @relation(fields: [campusId], references: [id], onDelete: Cascade)
    inventory     Inventory?
    reservations  Reservation[]
    createdAt     DateTime      @default(now())
    updatedAt     DateTime      @updatedAt
    @@unique([campusId, name])
    @@map("rooms")
}

model Inventory {
    id          String   @id @default(cuid())
    tables      Int      @default(0)
    chairs      Int      @default(0)
    hasBoard    Boolean  @default(false)
    hasTV       Boolean  @default(false)
    notes       String?
    roomId      String   @unique
    room        Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    @@map("inventories")
}

model Reservation {
    id          String            @id @default(cuid())
    type        ReservationType
    title       String
    description String?
    startDate   DateTime
    endDate     DateTime
    userId      String
    user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
    roomId      String
    room        Room              @relation(fields: [roomId], references: [id], onDelete: Cascade)
    createdAt   DateTime          @default(now())
    updatedAt   DateTime          @updatedAt
    @@index([roomId, startDate, endDate])
    @@index([userId])
    @@map("reservations")
}
```

### Contrainte Anti-Chevauchement

```sql
-- Fichier: prisma/migrations/<timestamp>_add_overlap_constraint/migration.sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE reservations
ADD CONSTRAINT no_overlapping_reservations
EXCLUDE USING GIST (
  "roomId" WITH =,
  tstzrange("startDate", "endDate") WITH &&
);
```

</details>

<details>
<summary><strong>Dependencies (package.json)</strong></summary>

```json
{
  "name": "api",
  "version": "0.1.0",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "npx prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts",
    "lint": "eslint . --ext .ts",
    "test": "vitest"
  },
  "dependencies": {
    "@prisma/client": "^5.20.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "zod": "^3.22.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "pino": "^8.16.2",
    "pino-http": "^8.5.1",
    "ioredis": "^5.3.2",
    "bullmq": "^5.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.0",
    "prisma": "^5.20.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "eslint": "^8.55.0"
  }
}
```

</details>

<details>
<summary><strong>TypeScript Configuration (tsconfig.json)</strong></summary>

```json
{
  "extends": "../../packages/tsconfig/base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

</details>

<details>
<summary><strong>Variables d'Environnement (.env.example)</strong></summary>

```bash
# Database
DATABASE_URL="postgresql://myepibooking:myepibooking_dev_2025@localhost:5432/myepibooking?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006"

# Redis (cache & jobs)
REDIS_URL="redis://localhost:6379"

# Logs
LOG_LEVEL="info"
```

</details>
