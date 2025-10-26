# Setup Base de Données PostgreSQL - MyEpiBooking

Guide complet pour configurer PostgreSQL en local pour le projet MyEpiBooking.

## Prérequis

- PostgreSQL 14+ installé sur votre machine
- Accès terminal/shell

## Installation PostgreSQL

### Sur Fedora/RHEL

```bash
# Installer PostgreSQL
sudo dnf install postgresql postgresql-server postgresql-contrib

# Initialiser la base de données
sudo postgresql-setup --initdb

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier que c'est actif
sudo systemctl status postgresql
```

### Sur Ubuntu/Debian

```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Sur macOS (Homebrew)

```bash
brew install postgresql@14
brew services start postgresql@14
```

### Sur Windows

Télécharger l'installeur depuis : https://www.postgresql.org/download/windows/

## Création de l'utilisateur et de la base de données

### Méthode 1 : Via psql (Recommandée)

```bash
# Se connecter en tant que superuser postgres
sudo -u postgres psql

# Ou sur certains systèmes :
psql -U postgres
```

Une fois dans psql, exécuter ces commandes :

```sql
-- Créer l'utilisateur myepibooking avec un mot de passe
CREATE USER myepibooking WITH PASSWORD 'your_secure_password_here';

-- Créer la base de données
CREATE DATABASE myepibooking;

-- Donner tous les privilèges sur la database à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE myepibooking TO myepibooking;

-- Se connecter à la base de données
\c myepibooking

-- Donner les privilèges sur le schéma public (nécessaire pour Prisma)
GRANT ALL ON SCHEMA public TO myepibooking;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myepibooking;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myepibooking;

-- Configurer les privilèges par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO myepibooking;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO myepibooking;

-- Vérifier que tout est ok
\du  -- Liste les utilisateurs
\l   -- Liste les databases
\q   -- Quitter psql
```

### Méthode 2 : Script Shell automatique

Un script `scripts/setup-database.sh` est disponible à la racine du projet :

```bash
./scripts/setup-database.sh
```

Ce script automatise toutes les étapes ci-dessus.

## Configuration PostgreSQL pour connexion locale

Si vous avez des problèmes de connexion, modifiez les fichiers de config PostgreSQL :

### Trouver le fichier de config

```bash
sudo -u postgres psql -c "SHOW config_file;"
# Généralement : /var/lib/pgsql/data/postgresql.conf
```

### Éditer pg_hba.conf

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Ajouter/modifier ces lignes (avant les autres règles) :

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   myepibooking    myepibooking                            md5
host    myepibooking    myepibooking    127.0.0.1/32            md5
host    myepibooking    myepibooking    ::1/128                 md5
```

Redémarrer PostgreSQL :

```bash
sudo systemctl restart postgresql
```

## Vérification de la configuration

### Test 1 : Connexion avec psql

```bash
psql -U myepibooking -d myepibooking -h localhost -W
# Entrer le mot de passe quand demandé
```

Si la connexion fonctionne, vous êtes connecté ! Tapez `\q` pour quitter.

### Test 2 : Connection string

```bash
# Tester avec psql directement
psql "postgresql://myepibooking:your_password@localhost:5432/myepibooking?schema=public"
```

### Test 3 : Depuis l'API

Créer un fichier `apps/api/.env` :

```bash
DATABASE_URL="postgresql://myepibooking:your_password@localhost:5432/myepibooking?schema=public"
```

Puis tester avec Prisma :

```bash
cd apps/api
npx prisma db pull  # Devrait se connecter sans erreur
```

## Commandes PostgreSQL utiles

```bash
# Lister les bases de données
sudo -u postgres psql -l

# Se connecter à une database
sudo -u postgres psql -d myepibooking

# Voir les tables (une fois connecté)
\dt

# Voir les utilisateurs et leurs permissions
\du

# Voir les privilèges sur la database
\l+ myepibooking

# Supprimer la database (pour recommencer)
sudo -u postgres psql -c "DROP DATABASE IF EXISTS myepibooking;"

# Supprimer l'utilisateur
sudo -u postgres psql -c "DROP USER IF EXISTS myepibooking;"
```

## Configuration recommandée pour développement

### Credentials suggérées

```bash
Database: myepibooking
User: myepibooking
Password: myepibooking_dev_2025
Host: localhost
Port: 5432
```

### Connection String complète

```
postgresql://myepibooking:myepibooking_dev_2025@localhost:5432/myepibooking?schema=public
```

## Troubleshooting

### Erreur : "role does not exist"

```bash
# Recréer l'utilisateur
sudo -u postgres psql -c "CREATE USER myepibooking WITH PASSWORD 'your_password';"
```

### Erreur : "database does not exist"

```bash
# Recréer la database
sudo -u postgres psql -c "CREATE DATABASE myepibooking;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE myepibooking TO myepibooking;"
```

### Erreur : "password authentication failed"

1. Vérifier le mot de passe dans `.env`
2. Vérifier `pg_hba.conf` (doit être `md5` pas `peer`)
3. Redémarrer PostgreSQL

### Erreur : "could not connect to server"

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Si pas actif, le démarrer
sudo systemctl start postgresql
```

### Permission denied sur schema

```sql
-- Se reconnecter en tant que postgres
sudo -u postgres psql -d myepibooking

-- Redonner les permissions
GRANT ALL ON SCHEMA public TO myepibooking;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO myepibooking;
```

## Sécurité en Production

**ATTENTION** : Ces configurations sont pour le **développement local uniquement**.

En production, utilisez :
- Mots de passe forts et uniques
- Connexions SSL/TLS
- Firewall configuré
- Base de données managée (Neon, Supabase, AWS RDS)
- Variables d'environnement sécurisées

## Ressources

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Prisma + PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [pg_hba.conf expliqué](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)

---

**Prochaine étape** : Une fois la database configurée, retournez au README principal pour initialiser Prisma et lancer l'API !
