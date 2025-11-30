# AccessShop Docker Deployment Guide

## 📦 Docker Hub Publishing Instructions

This guide will help you build, test, and publish your AccessShop application to Docker Hub.

---

## Prerequisites

1. **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
2. **Docker Hub account** ([Sign up](https://hub.docker.com/signup))
3. **Git** (to clone the repository)

---

## Step 1: Prepare Your Environment

### 1.1 Create Environment File

Copy the example environment file:
```bash
cp .env.example .env
```

The `.env` file contains your backend configuration (already filled with production values):
```bash
VITE_SUPABASE_URL=https://btrmthycrvfiumtsgavv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=btrmthycrvfiumtsgavv
```

---

## Step 2: Build the Docker Image

### 2.1 Build Locally

Build the Docker image with your Docker Hub username:

```bash
# Replace 'yourusername' with your Docker Hub username
docker build -t yourusername/accessshop:latest \
  --build-arg VITE_SUPABASE_URL=https://btrmthycrvfiumtsgavv.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cm10aHljcnZmaXVtdHNnYXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjE5MjksImV4cCI6MjA3NzkzNzkyOX0.2LflC7Kr7OX-GDaBpsfc9lijc__xZbmxjDcf2CPhksE \
  --build-arg VITE_SUPABASE_PROJECT_ID=btrmthycrvfiumtsgavv \
  .
```

**Or use the shorter version with env file:**
```bash
docker build -t yourusername/accessshop:latest \
  --build-arg VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
  --build-arg VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
  --build-arg VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID} \
  .
```

**Build time:** Approximately 5-10 minutes depending on your internet speed.

### 2.2 Alternative: Use Docker Compose

```bash
docker-compose build
```

---

## Step 3: Test Locally

### 3.1 Run the Container

```bash
docker run -d -p 8080:80 --name accessshop yourusername/accessshop:latest
```

### 3.2 Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

You should see the AccessShop homepage!

### 3.3 Test Key Features

1. **Voice Commands**: Press `Ctrl+V` and say "show me deals"
2. **Navigation**: Use Tab key to navigate
3. **Login**: Create an account and test the PIN login
4. **Shopping**: Add items to cart and proceed to checkout
5. **AI Chat**: Click the floating microphone for natural conversations

### 3.4 Check Container Health

```bash
# View container logs
docker logs accessshop

# Check container status
docker ps

# Verify healthcheck
docker inspect --format='{{.State.Health.Status}}' accessshop
```

### 3.5 Stop and Remove Test Container

```bash
docker stop accessshop
docker rm accessshop
```

---

## Step 4: Publish to Docker Hub

### 4.1 Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### 4.2 Tag Your Image (if needed)

If you didn't build with your username, tag it now:
```bash
docker tag accessshop:latest yourusername/accessshop:latest
```

### 4.3 Push to Docker Hub

```bash
docker push yourusername/accessshop:latest
```

**Upload time:** 5-15 minutes depending on your internet upload speed.

### 4.4 Push Additional Tags (Optional)

It's good practice to also tag with a version number:
```bash
docker tag yourusername/accessshop:latest yourusername/accessshop:v1.0
docker push yourusername/accessshop:v1.0

# Add date tag
docker tag yourusername/accessshop:latest yourusername/accessshop:2025-01-15
docker push yourusername/accessshop:2025-01-15
```

---

## Step 5: Verify on Docker Hub

1. Go to [Docker Hub](https://hub.docker.com)
2. Login to your account
3. Navigate to your repositories
4. You should see `yourusername/accessshop`
5. Click on it to view details, tags, and download statistics

---

## Step 6: Pull and Run from Docker Hub

Anyone can now pull and run your image:

```bash
# Pull the image
docker pull yourusername/accessshop:latest

# Run the container
docker run -d -p 8080:80 --name accessshop yourusername/accessshop:latest
```

---

## Docker Compose Deployment

For easier deployment, use docker-compose:

### 1. Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  accessshop:
    image: yourusername/accessshop:latest
    container_name: accessshop-production
    ports:
      - "80:80"
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### 2. Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Automated Build Script

Create a file called `build-and-push.sh`:

```bash
#!/bin/bash

# Configuration
DOCKER_USERNAME="yourusername"
IMAGE_NAME="accessshop"
VERSION="1.0"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building AccessShop Docker Image...${NC}"

# Build the image
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
  --build-arg VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
  --build-arg VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
  --build-arg VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID} \
  .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    
    # Tag with version
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}
    
    echo -e "${BLUE}Pushing to Docker Hub...${NC}"
    
    # Push images
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully pushed to Docker Hub!${NC}"
        echo -e "${GREEN}Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:latest${NC}"
        echo -e "${GREEN}Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}${NC}"
    else
        echo "❌ Failed to push to Docker Hub"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
```

Make it executable and run:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

---

## Common Commands Reference

### Image Management
```bash
# List all images
docker images

# Remove an image
docker rmi yourusername/accessshop:latest

# Remove dangling images
docker image prune

# View image details
docker inspect yourusername/accessshop:latest
```

### Container Management
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop accessshop

# Start a container
docker start accessshop

# Remove a container
docker rm accessshop

# View container logs
docker logs -f accessshop

# Execute command in container
docker exec -it accessshop sh
```

### Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

---

## Troubleshooting

### Build Issues

**Problem**: Build fails with "network timeout"
```bash
# Solution: Increase timeout
export DOCKER_BUILDKIT=1
docker build --network=host -t yourusername/accessshop:latest .
```

**Problem**: "COPY failed" error
```bash
# Solution: Check .dockerignore and ensure required files aren't excluded
cat .dockerignore
```

### Runtime Issues

**Problem**: Container starts but site doesn't load
```bash
# Check container logs
docker logs accessshop

# Check if port is bound correctly
docker port accessshop

# Check container is healthy
docker inspect --format='{{.State.Health.Status}}' accessshop
```

**Problem**: "Connection refused" errors
```bash
# Verify backend environment variables are set
docker exec accessshop env | grep VITE_SUPABASE
```

---

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Image built successfully
- [ ] Local testing completed
- [ ] All features working (voice, AI, checkout)
- [ ] Container health checks passing
- [ ] Image pushed to Docker Hub
- [ ] Verified image can be pulled from Docker Hub
- [ ] Production deployment tested
- [ ] SSL/HTTPS configured (if needed)
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

## Professor Demo Instructions

### Quick Start for Demonstration

1. **Pull the image:**
   ```bash
   docker pull yourusername/accessshop:latest
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 80:80 --name accessshop-demo yourusername/accessshop:latest
   ```

3. **Access the application:**
   ```
   http://localhost
   ```

4. **Show the demo:**
   - Follow the `QUICK_DEMO_FLOW.md` guide
   - Demonstrate voice commands
   - Show AI assistant
   - Complete a purchase workflow

5. **View container details:**
   ```bash
   docker logs accessshop-demo
   docker stats accessshop-demo
   ```

6. **Clean up:**
   ```bash
   docker stop accessshop-demo
   docker rm accessshop-demo
   ```

---

## Multi-Platform Build (Advanced)

To build for multiple platforms (e.g., ARM Mac, Intel, Linux):

```bash
# Create builder
docker buildx create --name multiplatform --use

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 \
  -t yourusername/accessshop:latest \
  --build-arg VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
  --build-arg VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
  --build-arg VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID} \
  --push \
  .
```

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## Support

For issues or questions:
1. Check container logs: `docker logs accessshop`
2. Review the technical documentation: `TECHNICAL_DOCUMENTATION.md`
3. Test locally before pushing to production

---

**Last Updated**: January 2025  
**Docker Version**: 24.x  
**Image Size**: ~50MB (compressed)