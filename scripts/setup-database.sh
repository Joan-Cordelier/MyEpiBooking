#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="myepibooking"
DB_USER="myepibooking"
DB_PASSWORD="myepibooking_dev_2025"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${BLUE}MyEpiBooking - Configuration PostgreSQL${NC}"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL n'est pas installé${NC}"
    echo ""
    echo "Installation sur Fedora:"
    echo "  sudo dnf install postgresql postgresql-server postgresql-contrib"
    echo "  sudo postgresql-setup --initdb"
    echo "  sudo systemctl start postgresql"
    exit 1
fi

# Vérifier si PostgreSQL est démarré
if ! sudo systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}PostgreSQL n'est pas démarré. Démarrage...${NC}"
    sudo systemctl start postgresql
    sleep 2
fi

echo -e "${GREEN}PostgreSQL est actif${NC}"
echo ""

# Créer l'utilisateur et la database
echo -e "${BLUE}Création de l'utilisateur et de la base de données...${NC}"

sudo -u postgres psql << EOF
-- Supprimer si existe déjà (pour réinitialiser)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Créer l'utilisateur
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Créer la base de données
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Se connecter à la base
\c $DB_NAME

-- Donner tous les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Configurer les privilèges par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

-- Afficher les infos
\du $DB_USER
\l $DB_NAME
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Base de données configurée avec succès !${NC}"
    echo ""
    echo -e "${BLUE}Informations de connexion :${NC}"
    echo -e "   Database: ${GREEN}$DB_NAME${NC}"
    echo -e "   User:     ${GREEN}$DB_USER${NC}"
    echo -e "   Password: ${GREEN}$DB_PASSWORD${NC}"
    echo -e "   Host:     ${GREEN}$DB_HOST${NC}"
    echo -e "   Port:     ${GREEN}$DB_PORT${NC}"
    echo ""
    echo -e "${BLUE}Connection String pour Prisma :${NC}"
    echo -e "${GREEN}DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public\"${NC}"
    echo ""
    echo -e "${YELLOW}Copiez cette ligne dans votre fichier apps/api/.env${NC}"
    echo ""
    
    # Tester la connexion
    echo -e "${BLUE}Test de connexion...${NC}"
    if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h $DB_HOST -c "SELECT version();" > /dev/null 2>&1; then
        echo -e "${GREEN}Connexion réussie !${NC}"
    else
        echo -e "${RED}Erreur de connexion${NC}"
        echo -e "${YELLOW}Vérifiez le fichier /var/lib/pgsql/data/pg_hba.conf${NC}"
        echo "Ajoutez cette ligne :"
        echo "  host    $DB_NAME    $DB_USER    127.0.0.1/32    md5"
        echo "Puis redémarrez PostgreSQL : sudo systemctl restart postgresql"
    fi
    
else
    echo ""
    echo -e "${RED}Erreur lors de la configuration${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Prochaines étapes :${NC}"
echo "  1. cd apps/api"
echo "  2. cp .env.example .env"
echo "  3. Éditer .env et coller la DATABASE_URL"
echo "  4. pnpm install"
echo "  5. pnpm prisma:generate"
echo "  6. pnpm prisma:migrate"
echo ""
