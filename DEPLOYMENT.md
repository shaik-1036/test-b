# Deployment Guide - Skill Connect

## Fixed Issues Summary

### 1. AdminDashboard.js Error - FIXED ✓
**Problem**: Missing `Send` import from lucide-react
**Solution**: Added `Send` to the lucide-react imports in AdminDashboard.js
**Status**: Resolved

### 2. Docker Build Error - FIXED ✓
**Problem**: `Dockerfile: no such file or directory`
**Cause**: Docker-compose was looking for Dockerfile in wrong location
**Solution**: 
- Updated docker-compose.yml to use correct paths
- Backend: `context: ./backend dockerfile: ../Dockerfile`
- Frontend: `context: ./frontend dockerfile: ../Dockerfile.frontend`
- Created both Dockerfiles in root directory
**Status**: Resolved

## Your Folder Structure

```
advanced_skill_connect_app_stunning/
├── backend/          (Node.js backend code)
├── frontend/         (React frontend code)
├── docker-compose.yml
├── Dockerfile        (Backend)
├── Dockerfile.frontend
├── .env.example
├── .dockerignore
├── start.sh         (Linux/Mac quick start)
├── start.bat        (Windows quick start)
├── health-check.sh  (Service health verification)
├── SETUP.md         (Detailed setup guide)
├── README.md        (Project documentation)
└── DEPLOYMENT.md    (This file)
```

## Quick Start Instructions

### For Windows Users:
1. **Double-click** `start.bat` in the project root
2. Select "y" to continue
3. Wait for setup to complete
4. Services will be ready in 30 seconds

### For Linux/Mac Users:
```bash
chmod +x start.sh
./start.sh
```

### Manual Docker (Any OS):
```bash
cp .env.example .env
docker-compose up -d
```

## Verify Everything Works

### Run Health Check:
**Linux/Mac:**
```bash
chmod +x health-check.sh
./health-check.sh
```

**Windows:**
```cmd
docker-compose ps
```

### Expected Output:
```
CONTAINER NAME          STATUS
skill_connect_postgres  Up (healthy)
skill_connect_minio     Up (healthy)
skill_connect_mailpit   Up
skill_connect_backend   Up
skill_connect_frontend  Up
```

## Access Your Application

Once everything is running:

| Service | URL | Login |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Sign up for account |
| **Admin** | http://localhost:3000/admin-login | admin@skillconnect.com / admin123 |
| **MinIO** | http://localhost:9001 | minioadmin / minioadmin123 |
| **Email Testing** | http://localhost:8025 | No login needed |
| **Backend API** | http://localhost:5000 | API endpoints |

## First Time Users

### Create Your First Account:
1. Go to http://localhost:3000
2. Click **Sign Up**
3. Fill in the form:
   - Email (required)
   - Full Name (required)
   - Password (minimum 6 characters)
   - Status (required) - Employee/Graduated/Pursuing
   - Company (optional)
   - Other details (optional)
4. Click **Create Account**
5. You'll be redirected to login
6. Login with your credentials
7. Access your dashboard

### Admin Login:
1. Go to http://localhost:3000/login
2. Click **Admin Login** link
3. Use: `admin@skillconnect.com` / `admin123`
4. Access admin dashboard

## Key Features to Test

### User Dashboard
- Edit profile
- Upload resume (PDF, DOCX)
- Search and add contacts
- Send real-time messages (5 conversations max free)
- View notifications

### Admin Dashboard
- View all users
- Filter by status/company
- Send bulk messages
- View analytics
- Track donations

### Donation Pages
- Browse orphan homes
- Browse old-age homes
- Make donations
- View donation history

### Email Testing
- Check Mailpit at http://localhost:8025
- All emails sent during testing appear here
- Use for development without spam risk

## Environment Variables Reference

Your `.env` file controls:

```env
# Database credentials
DB_USER=admin           # PostgreSQL user
DB_PASSWORD=admin123    # PostgreSQL password
DB_NAME=skill_connect_db

# MinIO file storage
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123

# Admin credentials
ADMIN_EMAIL=admin@skillconnect.com
ADMIN_PASSWORD=admin123

# Email (SendPulse for production)
SENDPULSE_USER=your_email@example.com
SENDPULSE_PASS=your_password

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## Common Tasks

### Stop All Services:
```bash
docker-compose down
```

### Restart Services:
```bash
docker-compose restart
```

### View Logs:
```bash
docker-compose logs -f
```

### Reset Database:
```bash
docker-compose down -v
docker-compose up -d
```

### Connect to Database:
```bash
docker-compose exec postgres psql -U admin -d skill_connect_db
```

### Upload File to MinIO:
Use MinIO Console at http://localhost:9001

## Troubleshooting

### Services Won't Start
```bash
# Check for errors
docker-compose logs

# Clean restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use
If ports are already taken:
1. Edit docker-compose.yml
2. Change port mappings (e.g., "3000:3000" to "3001:3000")
3. Restart: `docker-compose up -d`

### Frontend Can't Connect to Backend
1. Verify REACT_APP_API_URL in .env
2. Check backend logs: `docker-compose logs backend`
3. Test backend: `curl http://localhost:5000`

### Database Connection Failed
```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### MinIO Issues
1. Access console at http://localhost:9001
2. Check credentials in .env
3. Create bucket if needed (defaults to "skill-connect-bucket")

## Production Deployment

### Before Going Live:
1. Change all default passwords in `.env`
2. Add SendPulse credentials for real email
3. Set NODE_ENV=production
4. Enable SSL/HTTPS
5. Set up backups for PostgreSQL
6. Configure domain names

### Deploy to Cloud:
```bash
# Build images
docker-compose build

# Push to registry (e.g., Docker Hub)
docker tag skill_connect:latest username/skill_connect:latest
docker push username/skill_connect:latest

# On production server
docker pull username/skill_connect:latest
docker-compose up -d
```

## Performance Tips

### Optimize Docker Builds:
- Dockerignore large files
- Use multi-stage builds
- Cache dependencies

### Database Optimization:
- Regular backups
- Monitor query performance
- Index frequently searched fields

### Frontend:
- Enable gzip compression
- Minify CSS/JS
- Use CDN for assets

## Security Checklist

- [ ] Changed admin password
- [ ] Changed database password
- [ ] Added SendPulse credentials
- [ ] Enabled HTTPS
- [ ] Set strong MinIO credentials
- [ ] Configured firewall rules
- [ ] Set up database backups
- [ ] Enabled rate limiting
- [ ] Configured CORS properly

## Support Resources

### Documentation Files:
- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `DEPLOYMENT.md` - This file

### Useful Endpoints:
- Health check: `http://localhost:5000/health`
- API root: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`

### Command Reference:
```bash
# View all commands
docker-compose help

# Specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Execute commands in container
docker-compose exec backend npm list
docker-compose exec postgres psql -U admin
```

## Need Help?

1. Check the logs: `docker-compose logs -f`
2. Run health check: `./health-check.sh`
3. Review SETUP.md for detailed steps
4. Check README.md for features overview

## Next Steps

1. **Register a test account** and explore the UI
2. **Test messaging** between users
3. **Upload a resume** to test MinIO
4. **Try admin dashboard** to send messages
5. **Review the code** in frontend/backend folders
6. **Customize** colors, branding, and features
7. **Configure** SendPulse for production email
8. **Deploy** to your hosting platform

---

**Everything is ready to run! Start with:**
- Linux/Mac: `./start.sh`
- Windows: `start.bat`
- Or: `docker-compose up -d`

Happy coding! 🚀
