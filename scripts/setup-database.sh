#!/bin/bash

echo "=== MySQL full setup for user 'myepibooking' ==="

# Run all SQL commands inside mysql as root
mysql -u root -p <<'EOF'
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS myepibooking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'myepibooking'@'localhost'
  IDENTIFIED BY 'myepibooking';

-- FULL ROOT-LEVEL PRIVILEGES
GRANT ALL PRIVILEGES ON *.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;

-- Explicit DB-level privileges
GRANT ALL PRIVILEGES ON myepibooking.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;

-- Explicit object-level privileges (tables, procs, functions)
GRANT ALL PRIVILEGES ON TABLE myepibooking.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON FUNCTION myepibooking.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON PROCEDURE myepibooking.* TO 'myepibooking'@'localhost' WITH GRANT OPTION;

-- Apply changes
FLUSH PRIVILEGES;
EOF

echo ""
echo "=== Setup complete ==="
echo "Your DATABASE_URL is:"
echo "mysql://myepibooking:myepibooking@localhost:3306/myepibooking"
echo ""
