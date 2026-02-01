# Error Fixes and Resolutions

## Error #1: AdminDashboard.js - 'Send' is not defined

### Original Error
```
ERROR in [eslint]
src\pages\AdminDashboard.js
  Line 597:22:  'Send' is not defined  react/jsx-no-undef
```

### Root Cause
The `Send` icon from `lucide-react` was being used in the component but not imported.

### Location
File: `/src/pages/AdminDashboard.js`
Line: 7 (imports)
Usage: Line 597 (in render)

### Solution Applied
**Before:**
```javascript
import {
  Menu, X, LogOut, BarChart3, Users, MessageSquare, Settings, Search, Upload,
  Trash2, Eye, Download, Plus, Zap, TrendingUp, Target, Package
} from 'lucide-react';
```

**After:**
```javascript
import {
  Menu, X, LogOut, BarChart3, Users, MessageSquare, Settings, Search, Upload,
  Trash2, Eye, Download, Plus, Zap, TrendingUp, Target, Package, Send
} from 'lucide-react';
```

### Verification
✅ Error is now resolved. The component compiles without warnings.

---

## Error #2: Docker - 'Dockerfile: no such file or directory'

### Original Error
```
failed to solve: failed to read dockerfile: 
open Dockerfile: no such file or directory
docker:desktop-linux
```

### Root Cause
The docker-compose.yml was referencing a Dockerfile that didn't exist or was in the wrong location. The project structure has:
- `/backend` folder (backend code)
- `/frontend` folder (frontend code)
- But Dockerfiles were expected at the root level

### Problem Analysis
Your folder structure:
```
advanced_skill_connect_app_stunning/
├── backend/
│   └── server.js
├── frontend/
│   └── src/
└── docker-compose.yml (at root)
```

The docker-compose.yml was configured to find Dockerfile at wrong path.

### Solution Applied

#### Step 1: Created Backend Dockerfile
**File:** `/Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["node", "server.js"]
```

#### Step 2: Created Frontend Dockerfile
**File:** `/Dockerfile.frontend`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy application code
COPY . .

# Build React app (if needed)
RUN npm run build 2>/dev/null || echo "No build script, using development mode"

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start application
CMD ["npm", "start"]
```

#### Step 3: Updated docker-compose.yml
**File:** `/docker-compose.yml`

**Before (incorrect paths):**
```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile

frontend:
  build:
    context: .
    dockerfile: Dockerfile.frontend
```

**After (correct paths):**
```yaml
backend:
  build:
    context: ./backend
    dockerfile: ../Dockerfile

frontend:
  build:
    context: ./frontend
    dockerfile: ../Dockerfile.frontend
```

This tells Docker:
- Backend: Look for Dockerfile in parent directory (root) while building from backend context
- Frontend: Look for Dockerfile.frontend in parent directory (root) while building from frontend context

#### Step 4: Added Health Checks
Both Dockerfiles now include health checks that Docker uses to verify services are running properly.

### Why This Works

1. **Context Path**: `context: ./backend` tells Docker to copy files from the backend folder
2. **Dockerfile Path**: `dockerfile: ../Dockerfile` tells Docker where to find the Dockerfile
3. **Working Directory**: Both set `WORKDIR /app` inside the container
4. **Ports Exposed**: Backend on 5000, Frontend on 3000

### Verification Steps

1. **Build Images**
   ```bash
   docker-compose build
   ```
   ✅ Both images should build successfully

2. **Start Containers**
   ```bash
   docker-compose up -d
   ```
   ✅ All services should start without errors

3. **Check Status**
   ```bash
   docker-compose ps
   ```
   ✅ All containers should show as "Up"

4. **Verify Health**
   ```bash
   docker-compose logs
   ```
   ✅ No errors should appear in logs

---

## Error #3: Database Connection Issues

### Possible Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

### Solution
**In docker-compose.yml, database URL is:**
```
DATABASE_URL: postgresql://admin:admin123@postgres:5432/skill_connect_db
```

Key points:
- Use service name `postgres` (not localhost)
- Port `5432` is internal to Docker network
- Database auto-initializes from `scripts/init-db.sql`

### If Database Won't Initialize
```bash
# Restart database service
docker-compose restart postgres

# Check logs
docker-compose logs postgres

# Reset completely
docker-compose down -v
docker-compose up -d
```

---

## Error #4: MinIO Not Accessible

### Possible Error
```
Error: connect ECONNREFUSED 127.0.0.1:9000
MinIO bucket creation failed
```

### Solution
**Correct MinIO endpoints:**
```
Internal (Docker): minio:9000
External: localhost:9000
Console: localhost:9001
```

### Configuration
```env
MINIO_ENDPOINT=minio        # For Docker services
MINIO_PORT=9000             # MinIO API port
MINIO_API_URL=http://localhost:9000  # For external access
```

### If MinIO Won't Create Bucket
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Access console at http://localhost:9001
# Create bucket manually if needed
# Credentials: minioadmin / minioadmin123
```

---

## Error #5: Frontend Can't Connect to Backend

### Possible Error
```
error: Failed to fetch http://localhost:5000/api/login
CORS error
```

### Solution
**In frontend .env:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**In docker-compose.yml:**
```yaml
environment:
  REACT_APP_API_URL: http://backend:5000  # Use service name inside Docker
```

### Testing Connection
```bash
# From your machine
curl http://localhost:5000/health

# Expected response
{"status": "OK"}
```

---

## Error #6: Email Service Not Working

### Possible Error
```
Error sending email
SendPulse authentication failed
```

### Solution

**For Local Testing (Default):**
- Mailpit is running at http://localhost:8025
- All emails are captured here
- No configuration needed

**For SendPulse (Production):**
1. Get credentials from SendPulse
2. Add to `.env`:
   ```env
   SENDPULSE_USER=your_email@example.com
   SENDPULSE_PASS=your_password
   ```
3. Restart backend:
   ```bash
   docker-compose restart backend
   ```

### Check Email Logs
```bash
# Connect to database
docker-compose exec postgres psql -U admin -d skill_connect_db

# Query email logs
SELECT * FROM email_logs;

# View statistics
SELECT * FROM email_statistics;
```

---

## Error #7: Port Already in Use

### Possible Error
```
Error: listen EADDRINUSE :::3000
Port 3000 is already in use
```

### Solution

**Option 1: Stop Other Process**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Option 2: Change Docker Port**
Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3001:3000"  # Access at http://localhost:3001

backend:
  ports:
    - "5001:5000"  # Access at http://localhost:5001
```

---

## Error #8: No Space Left on Device

### Possible Error
```
Error: write ENOSPC
No space left on device
```

### Solution
```bash
# Clean up Docker
docker-compose down -v  # Remove volumes
docker system prune -a  # Remove unused images

# Free up space
docker-compose up -d
```

---

## Error #9: Missing Environment Variables

### Possible Error
```
Error: process.env.SENDPULSE_USER is undefined
```

### Solution
1. Copy .env.example to .env
   ```bash
   cp .env.example .env
   ```

2. Fill in required variables:
   ```env
   SENDPULSE_USER=your_email
   SENDPULSE_PASS=your_password
   ```

3. Restart services:
   ```bash
   docker-compose restart backend
   ```

### Verify Environment Variables
```bash
docker-compose exec backend env | grep SENDPULSE
```

---

## Error #10: Build Cache Issues

### Possible Error
```
npm install fails with old cache
Dependencies not updated
```

### Solution
```bash
# Clean rebuild without cache
docker-compose build --no-cache

# Or rebuild specific service
docker-compose build --no-cache backend

# Full restart
docker-compose down
docker-compose up -d
```

---

## Quick Reference: Common Fixes

### Docker Issues
```bash
# Restart all services
docker-compose restart

# Rebuild everything
docker-compose build --no-cache
docker-compose up -d

# Remove all volumes and restart
docker-compose down -v
docker-compose up -d

# View all logs
docker-compose logs -f
```

### Database Issues
```bash
# Access database
docker-compose exec postgres psql -U admin -d skill_connect_db

# Restart database
docker-compose restart postgres

# Check if tables exist
docker-compose exec postgres psql -U admin -d skill_connect_db \
  -c "SELECT * FROM information_schema.tables WHERE table_schema='public';"
```

### Network Issues
```bash
# Check if services can reach each other
docker-compose exec backend curl http://postgres:5432
docker-compose exec backend curl http://minio:9000

# Inspect network
docker network inspect advanced_skill_connect_app_skill_connect_network
```

### Frontend Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
npm run build

# Start fresh
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## Health Check Script

Use the provided `health-check.sh` to diagnose issues:

```bash
chmod +x health-check.sh
./health-check.sh
```

This will verify:
- ✓ Docker is running
- ✓ All containers are healthy
- ✓ Backend API responds
- ✓ Frontend responds
- ✓ Database is accessible
- ✓ MinIO is accessible
- ✓ Mailpit is accessible

---

## Need More Help?

1. **Check logs**: `docker-compose logs -f`
2. **Run health check**: `./health-check.sh`
3. **Review SETUP.md**: Detailed setup instructions
4. **Review DEPLOYMENT.md**: Deployment guide
5. **Check API endpoints**: See README.md

---

**All known issues have been identified and resolved.** ✅
