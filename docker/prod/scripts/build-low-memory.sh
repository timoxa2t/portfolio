#!/bin/bash

# Build script optimized for low memory systems (512MB RAM)
# This script adds swap space and builds with memory constraints

set -e

echo "🔧 Setting up low-memory build environment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This script needs to be run as root to configure swap space"
    echo "Please run: sudo $0"
    exit 1
fi

# Function to add swap space
add_swap() {
    local swap_size=${1:-1G}
    local swap_file="/swapfile"
    
    echo "📦 Adding ${swap_size} swap space..."
    
    # Check if swap already exists
    if swapon --show | grep -q "$swap_file"; then
        echo "✅ Swap file already exists"
        return 0
    fi
    
    # Create swap file
    fallocate -l $swap_size $swap_file || dd if=/dev/zero of=$swap_file bs=1024 count=$((1024*1024))
    chmod 600 $swap_file
    mkswap $swap_file
    swapon $swap_file
    
    # Make permanent
    if ! grep -q "$swap_file" /etc/fstab; then
        echo "$swap_file none swap sw 0 0" >> /etc/fstab
    fi
    
    echo "✅ Swap space added successfully"
    free -h
}

# Function to configure system for low memory
configure_system() {
    echo "⚙️  Configuring system for low memory..."
    
    # Set vm.swappiness to use swap more aggressively
    sysctl vm.swappiness=60
    
    # Reduce memory pressure
    sysctl vm.vfs_cache_pressure=50
    
    # Make settings permanent
    cat >> /etc/sysctl.conf << EOF

# Low memory optimizations
vm.swappiness=60
vm.vfs_cache_pressure=50
EOF
}

# Function to build with Docker constraints
build_with_constraints() {
    echo "🐳 Building Docker image with memory constraints..."
    
    cd "$(dirname "$0")/.."
    
    # Clean up Docker to free memory
    echo "🧹 Cleaning Docker cache..."
    docker system prune -f --volumes || true
    docker builder prune -f || true
    
    # Build with limited resources and Next.js optimizations
    echo "📦 Building with memory optimizations..."
    
    # Try normal memory limits first
    if DOCKER_BUILDKIT=1 docker build \
        --memory=450m \
        --memory-swap=1200m \
        --cpu-shares=512 \
        --build-arg NODE_OPTIONS="--max-old-space-size=256" \
        --build-arg LOW_MEMORY=false \
        -f ../../Dockerfile \
        -t portfolio-app:latest \
        ../..; then
        echo "✅ Docker build completed successfully"
    else
        echo "⚠️  First build attempt failed, trying with low-memory optimizations..."
        
        # Second attempt with low-memory mode enabled
        DOCKER_BUILDKIT=1 docker build \
            --memory=350m \
            --memory-swap=1500m \
            --cpu-shares=256 \
            --build-arg NODE_OPTIONS="--max-old-space-size=200" \
            --build-arg LOW_MEMORY=true \
            --no-cache \
            -f ../../Dockerfile \
            -t portfolio-app:latest \
            ../..
        
        if [ $? -eq 0 ]; then
            echo "✅ Docker build completed with low-memory optimizations"
        else
            echo "❌ Build failed even with low-memory optimizations"
            echo ""
            echo "🔄 Trying one final approach with absolute minimal resources..."
            
            # Final attempt: Build with absolute minimum resources
            DOCKER_BUILDKIT=0 docker build \
                --memory=300m \
                --memory-swap=2g \
                --cpu-shares=128 \
                --shm-size=64m \
                --build-arg NODE_OPTIONS="--max-old-space-size=150" \
                --build-arg LOW_MEMORY=true \
                --no-cache \
                -f ../../Dockerfile \
                -t portfolio-app:latest \
                ../..
            
            if [ $? -eq 0 ]; then
                echo "✅ Build succeeded with absolute minimal resources"
            else
                echo "❌ All build attempts failed"
                echo ""
                echo "💡 Possible solutions:"
                echo "   1. Upgrade to a droplet with more RAM (1GB+)"
                echo "   2. Build locally and push to Docker registry"
                echo "   3. Use a CI/CD service with more resources"
                echo "   4. Try building the project components separately"
                echo ""
                echo "🔍 Debug information:"
                echo "   - Check available memory: free -h"
                echo "   - Check swap space: swapon --show"
                echo "   - Monitor build: docker stats during build"
                exit 1
            fi
        fi
    fi
}

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up Docker system..."
    docker system prune -f
    docker builder prune -f
}

# Main execution
main() {
    echo "🚀 Starting low-memory build process..."
    
    # Add swap space (1GB should be enough)
    add_swap "1G"
    
    # Configure system
    configure_system
    
    # Clean up first to free space
    cleanup
    
    # Build with constraints
    build_with_constraints
    
    echo "✅ Build process completed successfully!"
    echo "You can now run: docker compose up -d"
}

# Help function
show_help() {
    cat << EOF
Usage: $0 [OPTION]

Low-memory Docker build script for 512MB RAM systems.

Options:
    --help      Show this help message
    --swap-only Only add swap space without building
    --build-only Only build (assumes swap is already configured)

Examples:
    sudo $0                    # Full process (recommended)
    sudo $0 --swap-only       # Only add swap space
    sudo $0 --build-only      # Only build Docker image

EOF
}

# Parse arguments
case "${1:-}" in
    --help)
        show_help
        exit 0
        ;;
    --swap-only)
        add_swap "1G"
        configure_system
        exit 0
        ;;
    --build-only)
        build_with_constraints
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac
