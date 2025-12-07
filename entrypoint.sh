#!/bin/sh
set -e

# Apply database migrations
echo "Applying database migrations..."
prisma migrate deploy

# Start the application
echo "Starting the application..."
exec "$@"
