#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
#  PostgreSQL Initialization Script
#  Automatically runs on the FIRST start of the postgres-db container.
#  Creates all application databases for the HotelHub microservices.
# ══════════════════════════════════════════════════════════════════════
set -e

echo ">>> [init-db] Creating HotelHub application databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE DATABASE room_db;
    CREATE DATABASE guest_db;
    CREATE DATABASE reservation_db;
EOSQL

echo ">>> [init-db] Done. Created: auth_db, room_db, guest_db, reservation_db"
