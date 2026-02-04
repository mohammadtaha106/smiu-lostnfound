# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- `.env` file with all required environment variables

## Building the Docker Image

```bash
docker build -t smiu-lostnfound .
```

## Running with Docker

### Option 1: Using Docker Run
```bash
docker run -d \
  --name smiu-lostnfound-app \
  -p 3000:3000 \
  --env-file .env \
  smiu-lostnfound
```

### Option 2: Using Docker Compose (Recommended)
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Accessing the Application
Once the container is running, access the application at:
- **Local**: http://localhost:3000

## Useful Commands

### View running containers
```bash
docker ps
```

### View container logs
```bash
docker logs smiu-lostnfound-app
docker logs -f smiu-lostnfound-app  # Follow logs
```

### Stop and remove container
```bash
docker stop smiu-lostnfound-app
docker rm smiu-lostnfound-app
```

### Rebuild after code changes
```bash
docker build -t smiu-lostnfound .
docker-compose up -d --build
```

## Troubleshooting

### TLS Handshake Timeout Error
If you encounter `TLS handshake timeout` when pulling base images:
1. Check your internet connection
2. Restart Docker Desktop
3. Try using a different DNS (e.g., Google DNS: 8.8.8.8)
4. If behind a corporate firewall, configure proxy settings

### Build Failures
- Ensure all environment variables are properly set in `.env`
- Make sure Prisma schema is valid
- Check that all TypeScript errors are resolved

### Container Won't Start
- Check logs: `docker logs smiu-lostnfound-app`
- Verify environment variables are correctly passed
- Ensure MongoDB connection string is accessible from Docker

## Environment Variables
Make sure your `.env` file includes:
- `MONGO_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `BETTER_AUTH_SECRET` - Authentication secret
- `BETTER_AUTH_URL` - Application URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` & `CLOUDINARY_API_SECRET` - Cloudinary credentials
- `GEMINI_API_KEY` - Google's Gemini API key
- `RESEND_API_KEY` - Email service API key
- `NEXT_PUBLIC_APP_URL` - Public application URL
