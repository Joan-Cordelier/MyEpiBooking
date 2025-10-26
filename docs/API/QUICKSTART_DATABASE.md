# Quick Start - Setup Database

Guide rapide pour configurer PostgreSQL pour MyEpiBooking.

## Méthode Rapide (Script Automatique)

```bash
# Exécuter le script depuis la racine du projet
./scripts/setup-database.sh
```

Ce script va automatiquement :
- Vérifier que PostgreSQL est installé et actif
- Créer l'utilisateur `myepibooking`
- Créer la database `myepibooking`
- Configurer tous les privilèges nécessaires
- Tester la connexion
- Afficher la connection string pour Prisma

## Résultat attendu

```
Base de données configurée avec succès !

Informations de connexion :
   Database: myepibooking
   User:     myepibooking
   Password: myepibooking_dev_2025
   Host:     localhost
   Port:     5432

Connection String pour Prisma :
DATABASE_URL="postgresql://myepibooking:myepibooking_dev_2025@localhost:5432/myepibooking?schema=public"

Copiez cette ligne dans votre fichier apps/api/.env
```

## Prochaines étapes

### 1. Configurer l'API

```bash
cd apps/api

# Copier le template d'environnement
cp .env.example .env

# Éditer et coller la DATABASE_URL
nano .env  # ou code .env
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Initialiser Prisma

```bash
# Générer le client Prisma
pnpm prisma:generate

# Créer et appliquer les migrations
pnpm prisma:migrate

# (Optionnel) Ouvrir Prisma Studio pour voir la DB
pnpm prisma:studio
```

### 4. Lancer l'API

```bash
pnpm dev
```

Vous devriez voir :
```
Server running on port 3001
Environment: development
Health check: http://localhost:3001/health
```

## Documentation complète

Pour plus de détails, configuration manuelle, ou troubleshooting :

**[docs/API/DATABASE_SETUP.md](./DATABASE_SETUP.md)**

## Problèmes courants

### PostgreSQL n'est pas installé

**Fedora/RHEL :**
```bash
sudo dnf install postgresql postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Ubuntu/Debian :**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS :**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Erreur de connexion

Si le script indique une erreur de connexion, configurer `pg_hba.conf` :

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Ajouter avant les autres règles :
```
host    myepibooking    myepibooking    127.0.0.1/32    md5
```

Redémarrer :
```bash
sudo systemctl restart postgresql
```

### Erreur de version de collation

Si vous voyez une erreur "collation version mismatch", exécutez :

```bash
sudo -u postgres psql -c "ALTER DATABASE template1 REFRESH COLLATION VERSION;"
sudo -u postgres psql -c "ALTER DATABASE postgres REFRESH COLLATION VERSION;"
```

Puis relancez le script.

## Réinitialiser la database

Pour repartir de zéro :

```bash
# Le script supprime automatiquement l'existant
./scripts/setup-database.sh
```

Ou manuellement :
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS myepibooking;"
sudo -u postgres psql -c "DROP USER IF EXISTS myepibooking;"
./scripts/setup-database.sh
```

---

**Une fois la DB configurée, vous êtes prêt à développer !**
