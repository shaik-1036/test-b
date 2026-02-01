# Complete Docker Setup Guide - Local Testing & Production

## Prerequisites
- Docker installed and running
- Docker Compose installed
- Git (optional)

---

## PART 1: LOCAL TESTING (Development Environment)

### Option A: Using Docker Compose (Recommended)

**Step 1: Navigate to project directory**
```bash
cd /path/to/advanced_skill_connect_app_stunning
```

**Step 2: Create .env file**
```bash
# Create file named .env
DB_NAME=skill_connect_db
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=postgres
DB_PORT=5432
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
MINIO_BUCKET=skill-connect-bucket
MAILPIT_HOST=mailpit
MAILPIT_PORT=1025
ADMIN_EMAIL=admin@skillconnect.com
ADMIN_PASSWORD=admin123
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=development
```

**Step 3: Start all services**
```bash
docker-compose up -d
```

**Step 4: Verify containers are running**
```bash
docker-compose ps
```

All services should show "healthy" or "running".

**Step 5: Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MinIO Console: http://localhost:9001 (minioadmin / minioadmin123)
- Mailpit: http://localhost:8025 (no login needed)
- PostgreSQL: localhost:5432 (admin / admin123)

---

### Option B: Individual Docker Commands (For Testing Each Service)

Use these commands if you want to test services individually:

#### **1. Start PostgreSQL (Terminal 1)**
```bash
docker run -d \
  --name postgres_skill_connect \
  -p 5432:5432 \
  -e POSTGRES_DB=skill_connect_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

**Verify connection:**
```bash
docker logs postgres_skill_connect
```

#### **2. Start MinIO (Terminal 2)**
```bash
docker run -d \
  --name minio_skill_connect \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  -v minio_data:/data \
  minio/minio:latest server /data --console-address ":9001"
```

**Access MinIO:**
- Web Console: http://localhost:9001
- Credentials: minioadmin / minioadmin123

#### **3. Start Mailpit (Terminal 3)**
```bash
docker run -d \
  --name mailpit_skill_connect \
  -p 1025:1025 \
  -p 8025:8025 \
  axllent/mailpit:latest
```

**Access Mailpit:**
- Web UI: http://localhost:8025

#### **4. Create Docker Network**
```bash
docker network create skill_connect_net
```

#### **5. Connect Services to Network**
```bash
docker network connect skill_connect_net postgres_skill_connect
docker network connect skill_connect_net minio_skill_connect
docker network connect skill_connect_net mailpit_skill_connect
```

#### **6. Start Backend (Terminal 4)**
```bash
cd /path/to/backend
npm install

DB_HOST=localhost \
DB_PORT=5432 \
DB_NAME=skill_connect_db \
DB_USER=admin \
DB_PASSWORD=admin123 \
MINIO_ENDPOINT=localhost \
MINIO_PORT=9000 \
MINIO_USER=minioadmin \
MINIO_PASSWORD=minioadmin123 \
MAILPIT_HOST=localhost \
MAILPIT_PORT=1025 \
ADMIN_EMAIL=admin@skillconnect.com \
ADMIN_PASSWORD=admin123 \
NODE_ENV=development \
npm start
```

#### **7. Start Frontend (Terminal 5)**
```bash
cd /path/to/frontend
npm install

REACT_APP_API_URL=http://localhost:5000 \
npm start
```

---

## PART 2: Production Environment Setup

### Production Docker Compose File

**Create file: docker-compose.prod.yml**

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    container_name: skill_connect_postgres_prod
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata_prod:/var/lib/postgresql/data
    networks:
      - skill_connect_prod
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: skill_connect_minio_prod
    command: server /data --console-address ":9001"
    restart: always
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data_prod:/data
    networks:
      - skill_connect_prod
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: skill_connect_backend_prod
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_USER: ${MINIO_USER}
      MINIO_PASSWORD: ${MINIO_PASSWORD}
      MINIO_BUCKET: ${MINIO_BUCKET}
      SENDPULSE_SMTP_HOST: ${SENDPULSE_HOST}
      SENDPULSE_SMTP_PORT: ${SENDPULSE_PORT}
      SENDPULSE_USER: ${SENDPULSE_USER}
      SENDPULSE_PASS: ${SENDPULSE_PASS}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
    ports:
      - "5000:5000"
    networks:
      - skill_connect_prod
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: skill_connect_frontend_prod
    restart: always
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: ${REACT_APP_API_URL}
      NODE_ENV: production
    ports:
      - "3000:3000"
    networks:
      - skill_connect_prod
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: skill_connect_nginx_prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - skill_connect_prod

volumes:
  pgdata_prod:
  minio_data_prod:

networks:
  skill_connect_prod:
    driver: bridge
```

### Production .env File

**Create file: .env.production**

```
# Production Database
DB_NAME=skill_connect_db_prod
DB_USER=prod_admin
DB_PASSWORD=YourSecurePassword123!@#
DB_HOST=postgres

# MinIO
MINIO_USER=prod_minio_admin
MINIO_PASSWORD=YourSecureMinIOPass123!@#
MINIO_BUCKET=skill-connect-prod-bucket

# Email Service (SendPulse)
SENDPULSE_HOST=smtp.sendpulse.com
SENDPULSE_PORT=587
SENDPULSE_USER=your_sendpulse_email@example.com
SENDPULSE_PASS=your_sendpulse_password

# Admin
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourSecureAdminPass123!@#

# Frontend
REACT_APP_API_URL=https://api.yourcompany.com

# Node Environment
NODE_ENV=production
```

### Production Deployment Commands

**Step 1: Build images**
```bash
docker-compose -f docker-compose.prod.yml build
```

**Step 2: Push to Docker Registry (Optional)**
```bash
docker tag skill_connect_backend:latest your-registry/skill_connect_backend:latest
docker push your-registry/skill_connect_backend:latest

docker tag skill_connect_frontend:latest your-registry/skill_connect_frontend:latest
docker push your-registry/skill_connect_frontend:latest
```

**Step 3: Deploy to production server**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Step 4: Verify deployment**
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

---

## PART 3: Useful Docker Commands

### Monitor Running Containers
```bash
# View all running containers
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# View resource usage
docker stats
```

### Database Management

**Access PostgreSQL Shell:**
```bash
docker exec -it skill_connect_postgres psql -U admin -d skill_connect_db
```

**Common PostgreSQL Commands:**
```sql
-- List all tables
\dt

-- View users table
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM users;

-- Exit
\q
```

### MinIO Management

**Create bucket via CLI:**
```bash
docker exec skill_connect_minio mc mb minio/skill-connect-bucket
```

**List buckets:**
```bash
docker exec skill_connect_minio mc ls minio
```

### Stop All Services
```bash
docker-compose down
```

### Remove Volumes (Clears Data)
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

---

## PART 4: Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000
lsof -i :3000
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Container Health Issues
```bash
# Restart containers
docker-compose restart

# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose up -d --build
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Verify network connectivity
docker exec skill_connect_backend ping postgres
docker exec skill_connect_backend ping minio
```

### Clear Everything (Fresh Start)
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

---

## PART 5: Testing Checklist

- [ ] Containers are running: `docker-compose ps`
- [ ] Frontend loads: http://localhost:3000
- [ ] Backend API responds: http://localhost:5000/api/health
- [ ] Database is accessible: PostgreSQL client can connect
- [ ] MinIO console works: http://localhost:9001
- [ ] Mailpit works: http://localhost:8025
- [ ] Signup form submits successfully
- [ ] Login works correctly
- [ ] User dashboard loads
- [ ] Admin dashboard accessible

---

## Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Test connectivity: `docker exec <container> curl http://service:port`
4. Check Docker daemon: `docker ps`

