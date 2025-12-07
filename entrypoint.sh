#!/bin/sh
set -e

# Sync database schema (using db push since no migrations exist)
echo "Syncing database schema..."
prisma db push --skip-generate

# Seed the database
echo "Seeding database..."
prisma db seed

# Start the application
echo "Starting the application..."
exec "$@"
