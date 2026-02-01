# Complete Setup and Testing Guide - Skill Connect Platform

## Table of Contents
1. Project Structure
2. Local Testing Setup
3. Database Verification
4. Testing Signup & Login
5. Running All Services
6. Production Setup
7. Troubleshooting

---

## 1. Project Structure

```
advanced_skill_connect_app_stunning/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration & auto-init
│   ├── routes/
│   │   ├── auth.js               # Signup/Login routes
│   │   ├── users.js              # User profile routes
│   │   ├── messages.js           # Messaging routes
│   │   ├── subscriptions.js       # Subscription management
│   │   ├── donations.js          # Donation routes
│   │   └── admin.js              # Admin dashboard routes
│   ├── server.js                 # Main Express server
│   ├── package.json              # Dependencies
│   └── Dockerfile                # Docker build config
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Signup.js         # User signup form
│   │   │   ├── Login.js          # User login form
│   │   │   ├── UserDashboard.js  # User dashboard
│   │   │   ├── AdminDashboard.js # Admin dashboard
│   │   │   ├── AdminLogin.js     # Admin login
│   │   │   └── ...               # Other pages
│   │   ├── components/
│   │   │   ├── PaymentModal.js   # Payment subscription modal
│   │   │   └── AdminSubscriptions.js
│   │   ├── styles/
│   │   │   └── *.css             # All stylesheets
│   │   └── App.js                # Main app component
│   ├── public/                   # Static files
│   ├── package.json              # Dependencies
│   └── Dockerfile                # Docker build config
│
├── docker-compose.yml            # Local testing setup
├── docker-compose.prod.yml       # Production setup
├── .env.example                  # Environment variables template
├── DOCKER_LOCAL_SETUP.md         # Docker setup guide
├── DOCKER_SINGLE_COMMANDS.txt    # Single-line Docker commands
└── README.md                     # Project documentation

```

---

## 2. Local Testing Setup

### Step 1: Create .env File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**For Local Testing (.env content):**
```
NODE_ENV=development
DB_NAME=skill_connect_db
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=postgres
DB_PORT=5432
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_BUCKET=skill-connect-bucket
MAILPIT_HOST=mailpit
MAILPIT_PORT=1025
ADMIN_EMAIL=admin@skillconnect.com
ADMIN_PASSWORD=admin123
REACT_APP_API_URL=http://localhost:5000
```

### Step 2: Start Services with Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (5432)
- MinIO (9000, 9001)
- Mailpit (1025, 8025)

### Step 3: Start Backend

```bash
cd backend
npm install
npm start
```

Backend runs on: **http://localhost:5000**

### Step 4: Start Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 3. Database Verification

### Check PostgreSQL is Running

```bash
docker logs postgres
```

Should show: "database system is ready to accept connections"

### Access PostgreSQL Shell

```bash
docker exec -it postgres psql -U admin -d skill_connect_db
```

### Verify Tables Exist

```sql
-- List all tables
\dt

-- Check users table structure
\d users

-- Count users
SELECT COUNT(*) FROM users;

-- View users
SELECT id, email, fullname, status, created_at FROM users LIMIT 5;

-- Exit
\q
```

### Verify Database Initialization

The backend should automatically create all tables on first run. Check the logs:

```bash
# For Docker container
docker logs skill_connect_backend | grep "\[v0\] Users table created"

# For local Node.js
npm start | grep "\[v0\] Users table created"
```

You should see these messages:
```
[v0] UUID extension created
[v0] Users table created/verified
[v0] Messages table created/verified
[v0] Resumes table created/verified
[v0] User subscriptions table created/verified
... and more
```

---

## 4. Testing Signup & Login

### Test 1: Signup via Frontend

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - **Step 1 (Basic Info):**
     - Email: test@example.com
     - Full Name: Test User
     - Password: Test123456
   - **Step 2 (Details):**
     - Status: Employed
     - Date of Birth: 1995-05-15
     - City: New York
     - State: NY
     - Country: USA
     - Phone: +1234567890
     - Company: Test Corp
     - Qualification: B.Tech
     - Branch: Computer Science
     - Passout Year: 2020

4. Click "Sign Up"

**Expected Result:**
- Success message: "Signup successful! Please login."
- Redirected to login page

**Verify in Database:**
```sql
SELECT id, email, fullname, company, status FROM users WHERE email = 'test@example.com';
```

### Test 2: Login via Frontend

1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: test@example.com
   - Password: Test123456
3. Click "Login"

**Expected Result:**
- User dashboard loads
- User profile displayed
- Navigation menu visible

### Test 3: Admin Login

1. Go to http://localhost:3000/admin-login
2. Enter credentials:
   - Email: admin@skillconnect.com
   - Password: admin123
3. Click "Login"

**Expected Result:**
- Admin dashboard loads
- Analytics visible
- User management available

### Test 4: API Endpoints via cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Signup via API:**
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"api-test@example.com",
    "fullName":"API Test User",
    "password":"Test123456",
    "status":"employed"
  }'
```

**Login via API:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"api-test@example.com",
    "password":"Test123456"
  }'
```

---

## 5. Running All Services

### Option A: Docker Compose (All-in-One)

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Option B: Individual Services

**Terminal 1 - PostgreSQL:**
```bash
docker run -d --name postgres -p 5432:5432 \
  -e POSTGRES_DB=skill_connect_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  postgres:15
```

**Terminal 2 - MinIO:**
```bash
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  minio/minio:latest server /data --console-address ":9001"
```

**Terminal 3 - Mailpit:**
```bash
docker run -d --name mailpit -p 1025:1025 -p 8025:8025 \
  axllent/mailpit:latest
```

**Terminal 4 - Backend (from backend folder):**
```bash
npm install
npm start
```

**Terminal 5 - Frontend (from frontend folder):**
```bash
npm install
npm start
```

---

## 6. Production Setup

### Create Production Environment File

Create `.env.production`:

```
NODE_ENV=production
DB_NAME=skill_connect_db_prod
DB_USER=prod_admin
DB_PASSWORD=YourSecurePassword123!@#
DB_HOST=postgres-prod
DB_PORT=5432

MINIO_USER=prod_admin
MINIO_PASSWORD=YourSecurePassword123!@#
MINIO_ENDPOINT=minio-prod
MINIO_BUCKET=skill-connect-prod

SENDPULSE_USER=your-email@example.com
SENDPULSE_PASS=your-sendpulse-password

ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourSecureAdminPass123!@#

REACT_APP_API_URL=https://api.yourcompany.com
```

### Deploy with Production Docker Compose

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### Verify Production Deployment

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 7. Troubleshooting

### Issue: "column 'company' does not exist"

**Solution:**
The database schema uses `company` but some code references other names. Verify:

```bash
# Check database connection
docker logs postgres

# Check if tables were created
docker exec -it postgres psql -U admin -d skill_connect_db -c "\dt"

# Restart backend to reinitialize
docker restart skill_connect_backend
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port
lsof -i :5000
lsof -i :3000
lsof -i :5432

# Kill process (macOS/Linux)
kill -9 <PID>

# Windows - Find and kill
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Frontend Cannot Connect to Backend

**Solution:**
1. Check REACT_APP_API_URL is set correctly
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check browser console for CORS errors
4. Restart frontend: `npm start`

### Issue: PostgreSQL Connection Error

**Solution:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs postgres

# Verify connection parameters in .env
# Restart PostgreSQL
docker restart postgres
```

### Issue: MinIO Bucket Not Created

**Solution:**
```bash
# Create bucket manually
docker exec minio mc mb minio/skill-connect-bucket

# Verify bucket
docker exec minio mc ls minio
```

### Clean Everything (Fresh Start)

```bash
# Stop all containers
docker-compose down -v

# Remove all volumes
docker volume prune -a

# Restart
docker-compose up -d
```

---

## Testing Checklist

- [ ] Containers running: `docker-compose ps`
- [ ] PostgreSQL accessible: `psql -h localhost -U admin -d skill_connect_db`
- [ ] Frontend loads: http://localhost:3000
- [ ] Backend health: http://localhost:5000/api/health
- [ ] MinIO console: http://localhost:9001
- [ ] Mailpit: http://localhost:8025
- [ ] Signup form works
- [ ] Login successful
- [ ] User dashboard displays
- [ ] Admin dashboard accessible
- [ ] Database has users table
- [ ] New user data saved correctly

---

## Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access database
docker exec -it postgres psql -U admin -d skill_connect_db

# Stop everything
docker-compose down

# Clean restart
docker-compose down -v && docker-compose up -d
```

---

## Support

For issues, check:
1. Backend logs: `docker-compose logs backend`
2. Frontend logs: Browser console (F12)
3. Database: `docker exec -it postgres psql ...`
4. See DOCKER_LOCAL_SETUP.md for detailed Docker guide

