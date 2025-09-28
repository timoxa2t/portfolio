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

# Check system memory and recommend swap if needed
echo "💾 Checking system memory..."
total_mem=$(free -m | awk 'NR==2{printf "%.0f", $2}')
swap_mem=$(free -m | awk 'NR==3{printf "%.0f", $2}')

echo "Total RAM: ${total_mem}MB"
echo "Swap space: ${swap_mem}MB"

if [ "$total_mem" -lt 1024 ] && [ "$swap_mem" -lt 512 ]; then
    echo "⚠️  WARNING: Low memory system detected!"
    echo "🔧 Consider running the low-memory build script first:"
    echo "   sudo ./scripts/build-low-memory.sh"
    echo ""
    read -p "Continue with regular build? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled. Use low-memory build script instead."
        exit 1
    fi
fi

# Build and start containers with memory awareness
echo "🐳 Building and starting containers..."
if [ "$total_mem" -lt 1024 ]; then
    echo "📦 Using memory-optimized build..."
    # Set build args for low memory systems
    export DOCKER_BUILDKIT=1
    docker compose build --build-arg LOW_MEMORY=true --build-arg NODE_OPTIONS="--max-old-space-size=256"
    docker compose up -d
else
    docker compose up -d --build
fi

# Check if containers are running
echo "✅ Checking container status..."
docker compose ps

echo "🎉 Deployment complete!"
echo "📋 Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Stop services: docker compose down"
echo "  - Restart services: docker compose restart"

