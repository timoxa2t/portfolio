#!/bin/bash

# Simple deployment script for tymoshov.net.ua portfolio
# Run this script from the docker/prod directory

echo "🚀 Starting deployment..."

# Check if we're in the right directory
if [[ ! -f "compose.yml" ]]; then
    echo "❌ Error: compose.yml not found. Please run this script from docker/prod directory"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
cd ../../
git pull

# Go back to docker directory
cd docker/prod

# Build and start containers
echo "🐳 Building and starting containers..."
docker compose up -d --build

# Check if containers are running
echo "✅ Checking container status..."
docker compose ps

echo "🎉 Deployment complete!"
echo "📋 Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Stop services: docker compose down"
echo "  - Restart services: docker compose restart"

