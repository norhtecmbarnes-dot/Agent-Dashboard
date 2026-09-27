# Docker Setup Guide

## Overview

This guide explains how to deploy AI Dashboard in Docker. This is optional - the system works perfectly without Docker.

**Important:** The default installation stores all user data in the `data/` directory, which is NOT committed to Git. This ensures no personal information or customizations are shared when the project is uploaded to GitHub.

## Quick Start with Docker

### Using Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ai-dashboard:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/app/data/assistant.db
    restart: unless-stopped

  # Optional: Ollama for local AI models
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  ollama_data:
```

### Build and Run

```bash
# Build the image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/assistant.db

# Start
CMD ["npm", "start"]
```

## Data Persistence

### What's Stored in the Database

All user data and customizations are stored in SQLite:

```
data/
├── assistant.db          # SQLite database
│   ├── documents         # All user documents
│   ├── tasks             # Scheduled tasks
│   ├── user_preferences  # User settings
│   ├── contacts          # Contacts
│   └── notes             # Notes
├── telegram_config.json  # Telegram bot config
├── self-reflection-reports.json  # AI self-improvement logs
├── metrics.json          # System metrics
└── book_progress.json    # Book writing progress
```

### What's NOT in Git

The following are excluded from Git:

```gitignore
# User data - NOT committed
data/
*.db
*.json

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log

# Personal configuration
MEMORY.md
SOUL.md
```

### Environment Variables

Create `.env` for your personal configuration:

```env
# Authentication (personal)
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_USER_PASSWORD=your-user-password

# AI Models (personal API keys)
GLM_API_KEY=your_glm_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key

# Integrations (personal)
TELEGRAM_BOT_TOKEN=your_bot_token
SAM_API_KEY=your_sam_key

# Database
DATABASE_PATH=./data/assistant.db
```

## Task Scheduler in Database

All scheduled tasks are stored in the `scheduled_tasks` table:

```sql
CREATE TABLE scheduled_tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  schedule TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  last_run INTEGER,
  last_result TEXT,
  last_error TEXT,
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Default Tasks

| Task | Type | Schedule | Purpose |
|------|------|----------|---------|
| Intelligence Report | intelligence | daily | Scans news and reports |
| Security Scan | security | every:12:hours | Checks for vulnerabilities |
| Research | research | daily | AI improvements research |
| Self-Reflection | reflection | every:6:hours | System performance analysis |

### Personalization in Database

User preferences stored in `documents` table with category `user_preference`:

```json
{
  "userName": "Your Name",
  "assistantName": "AI Assistant",
  "hasCompletedSetup": true,
  "telegram": {
    "botToken": "your-bot-token",
    "enabled": true,
    "username": "your_bot"
  },
  "apiKeys": {
    "openrouter": "your-api-key"
  }
}
```

## Docker Commands Reference

### Basic Commands

```bash
# Build image
docker build -t ai-dashboard .

# Run container
docker run -d -p 3000:3000 -v ./data:/app/data ai-dashboard

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>
```

### With Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop and remove
docker-compose down

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d
```

## Health Checks

Add to `docker-compose.yml`:

```yaml
services:
  ai-dashboard:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/heartbeat"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Production Considerations

### Environment Variables

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_PATH=/app/data/assistant.db
  - ENABLE_AUTH=true
  - DEFAULT_ADMIN_PASSWORD=${DEFAULT_ADMIN_PASSWORD}
```

### Volumes

```yaml
volumes:
  - ./data:/app/data          # Persist all user data
  - ./logs:/app/logs          # Optional: persist logs
```

### Networking

```yaml
# Connect to Ollama running on host
extra_hosts:
  - "host.docker.internal:host-gateway"

environment:
  - OLLAMA_API_URL=http://host.docker.internal:11434/api
```

## ONLYOFFICE Integration (Optional)

If you want in-browser document editing:

```yaml
services:
  onlyoffice:
    image: onlyoffice/documentserver
    ports:
      - "8080:80"
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=your_jwt_secret_here
    volumes:
      - onlyoffice_data:/var/www/onlyoffice/Data
    restart: unless-stopped

volumes:
  onlyoffice_data:
```

Then set in `docker-compose.yml` for ai-dashboard:

```yaml
environment:
  - NEXT_PUBLIC_ONLYOFFICE_URL=http://localhost:8080
  - NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
  - ONLYOFFICE_JWT_SECRET=your_jwt_secret_here
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs ai-dashboard

# Common issues:
# 1. Port already in use - change port in docker-compose.yml
# 2. Volume permission issues - run: chmod -R 755 ./data
# 3. Node modules missing - add to Dockerfile: RUN npm ci --only=production
```

### Database issues

```bash
# Access database
docker exec -it ai-dashboard sh
sqlite3 /app/data/assistant.db

# Check tables
.tables

# Check tasks
SELECT * FROM scheduled_tasks;
```

### Network issues

```bash
# Check if Ollama is reachable from container
docker exec ai-dashboard curl http://host.docker.internal:11434/api/tags
```

## Backup and Restore

### Backup

```bash
# Stop container
docker-compose down

# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz ./data

# Start container
docker-compose up -d
```

### Restore

```bash
# Stop container
docker-compose down

# Restore data
tar -xzf backup-20260301.tar.gz

# Start container
docker-compose up -d
```

## Security Notes

1. **Never commit `data/` to Git** - All personal data stays local
2. **Use environment variables** for secrets in production
3. **Enable authentication** for production: `ENABLE_AUTH=true`
4. **Use strong passwords** - Minimum 12 characters
5. **Use HTTPS** in production with reverse proxy (nginx, Caddy)

## Updating

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Check health: `curl http://localhost:3000/api/heartbeat`
3. Check database: `sqlite3 data/assistant.db`
4. Check environment: `docker exec ai-dashboard env``