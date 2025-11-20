#!/bin/bash

echo "=== MySQL full setup for user 'myepibooking' ==="

# Determine how to run mysql as root:
# 1) try without credentials (socket auth),
# 2) try with sudo, or
# 3) prompt for root password.

MYSQL_CMD=""

echo "Checking local MySQL root access..."
if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
  MYSQL_CMD="mysql -u root"
  echo "-> can connect as root without password"
elif sudo mysql -e "SELECT 1;" >/dev/null 2>&1; then
  MYSQL_CMD="sudo mysql"
  echo "-> can connect as root via sudo"
else
  read -s -p "Enter MySQL root password: " ROOT_PWD
  echo
  if mysql -u root -p"$ROOT_PWD" -e "SELECT 1;" >/dev/null 2>&1; then
    MYSQL_CMD="mysql -u root -p$ROOT_PWD"
    echo "-> password accepted"
  else
    echo "ERROR: cannot connect to MySQL as root."
    echo "Try running this script with sudo or verify the root password." >&2
    exit 1
  fi
fi

# Run all SQL commands inside mysql as root (using chosen command)
$MYSQL_CMD <<'SQL'
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS myepibooking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Temporarily disable password validation to allow simple dev password
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 4;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'myepibooking'@'localhost'
  IDENTIFIED BY 'MyEpiB00king!';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON myepibooking.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;

-- Apply changes
FLUSH PRIVILEGES;
SQL

echo ""
echo "=== Setup complete ==="
echo "Your DATABASE_URL is:"
echo "mysql://myepibooking:MyEpiB00king!@localhost:3306/myepibooking"
echo ""
