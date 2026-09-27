# ONLYOFFICE Document Server with AI Dashboard

## Quick Start

### 1. Run ONLYOFFICE in Docker
```bash
docker run -i -t -d -p 8080:80 --restart=always --name onlyoffice onlyoffice/documentserver
```

### 2. Wait for startup (2-3 minutes)
Check status at: http://localhost:8080/welcome

### 3. Configure AI Dashboard as AI Provider

Create a custom configuration file:

```bash
# Create config directory
docker exec -it onlyoffice mkdir -p /etc/onlyoffice/documentserver/local.json.d

# Create AI provider config
docker exec -it onlyoffice bash -c 'cat > /etc/onlyoffice/documentserver/local.json << "EOF"
{
  "services": {
    "CoAuthoring": {
      "sql": {
        "type": "postgres",
        "dbHost": "localhost",
        "dbPort": "5432",
        "dbName": "onlyoffice",
        "dbUser": "onlyoffice",
        "dbPass": "onlyoffice"
      }
    }
  }
}
EOF'
```

## Full Docker Compose Setup

For a complete setup with PostgreSQL and Redis:

```yaml
version: '3.8'
services:
  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    ports:
      - "8080:80"
    environment:
      - JWT_ENABLED=false
    volumes:
      - ./onlyoffice/data:/var/www/onlyoffice/Data
      - ./onlyoffice/logs:/var/log/onlyoffice
      - ./onlyoffice/fonts:/usr/share/fonts/truetype/custom
    restart: always

  # Optional: PostgreSQL for production
  postgres:
    image: postgres:15
    container_name: onlyoffice-postgres
    environment:
      - POSTGRES_DB=onlyoffice
      - POSTGRES_USER=onlyoffice
      - POSTGRES_PASSWORD=onlyoffice
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
    restart: always
```

Save as `docker-compose.yml` and run:
```bash
docker-compose up -d
```

## Connecting AI Dashboard

After ONLYOFFICE is running:

1. Open ONLYOFFICE at http://localhost:8080
2. Open any document
3. Go to Plugins → Plugin Manager
4. Install the AI plugin
5. Configure it to use:

**URL:** `http://host.docker.internal:3000/api/onlyoffice/ai`

Note: Use `host.docker.internal` to access your host machine from Docker.

## Alternative: Use OnlyOffice Docs without Docker

If Docker isn't an option, you can:

1. **Use the web interface directly** at `http://localhost:3000/office/ai`
2. Copy/paste content between your desktop ONLYOFFICE and the web tools

## Testing the Connection

Test that AI Dashboard is accessible from Docker:
```bash
docker exec -it onlyoffice curl http://host.docker.internal:3000/api/models
```

Should return a list of available models.

## Document Server URLs

Once running:
- Welcome page: http://localhost:8080/welcome
- Health check: http://localhost:8080/healthcheck
- Editor example: http://localhost:8080/example