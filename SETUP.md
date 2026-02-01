# Skill Connect - Professional Networking Platform Setup Guide

## Project Structure
```
advanced_skill_connect_app_stunning/
├── docker-compose.yml
├── Dockerfile (backend)
├── Dockerfile.frontend
├── .env.example
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   ├── admin.js
│   │   └── donations.js
│   ├── utils/
│   │   ├── minio.js
│   │   └── emailService.js
│   └── scripts/
│       └── init-db.sql
└── frontend/
    ├── package.json
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── UserDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminLogin.js
    │   │   ├── Orphans.js
    │   │   └── OldAgeHomes.js
    │   └── styles/
    │       ├── login.css
    │       ├── signup.css
    │       ├── user-dashboard.css
    │       ├── admin-dashboard.css
    │       ├── admin-login.css
    │       └── donations.css
    └── public/
```

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)
- PostgreSQL 15+ (for local development)
- Git

## Quick Start with Docker

### 1. Clone the Repository
```bash
cd advanced_skill_connect_app_stunning
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- SendPulse credentials (for email service)
- Admin credentials (optional, defaults provided)
- Database credentials (optional, defaults provided)

### 3. Build and Run Docker Containers
```bash
docker-compose up -d
```

This will:
- Build backend and frontend images
- Create PostgreSQL database container
- Create MinIO object storage container
- Create Mailpit email testing container
- Start all services

### 4. Verify Services Are Running

Check if all containers are healthy:
```bash
docker-compose ps
```

Expected output:
```
STATUS: Up (healthy)
```

### 5. Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | User credentials |
| Backend API | http://localhost:5000 | N/A |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| Mailpit (Email) | http://localhost:8025 | N/A |
| PostgreSQL | localhost:5432 | admin / admin123 |

### 6. First Time Setup

#### Access the Application
1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create a user account
3. Fill in the form with required fields
4. Company field is optional
5. Click "Create Account"

#### Admin Login
1. Click "Admin Login" link on the login page
2. Use default credentials: admin@skillconnect.com / admin123
3. Change credentials in `.env` file and restart containers for production

### 7. Test Email Functionality

1. Go to Mailpit: http://localhost:8025
2. Send test email from admin dashboard
3. Check received emails in Mailpit web interface

## Local Development Setup (Without Docker)

### Backend Setup
```bash
cd backend
npm install

# Create PostgreSQL database manually
createdb -U admin -h localhost skill_connect_db

# Start backend server
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install

# Start React development server
npm start
```

## Key Features

### User Authentication
- Signup with company field (optional)
- Email validation
- Password strength requirements
- Secure password reset

### User Dashboard
- Profile management
- Resume upload/download (stored in MinIO)
- Real-time messaging (5 free conversations)
- Search and connect with people
- Admin notifications

### Admin Dashboard
- User management with filters
- Send bulk messages to user categories
- Analytics and statistics
- Donation tracking
- Email delivery statistics

### Donation Pages
- Orphans support donations
- Old-age homes support donations
- QR codes for payments
- Donation tracking and receipts

### File Storage
- MinIO S3-compatible storage
- Automatic file URL generation
- Secure file access with presigned URLs
- Support for: PDF, DOCX, images, etc.

### Email Service
- SendPulse integration (production)
- Mailpilt fallback support
- Mailpit local testing
- Rate limiting (300 users, 12,000 emails/month)
- Bulk message sending

## Database Schema

### Core Tables
- **users**: User accounts with profiles
- **resumes**: User resume files stored in MinIO
- **messages**: Admin broadcast messages
- **message_recipients**: Delivery tracking
- **user_messages**: Direct user-to-user messages
- **user_conversations**: Conversation tracking
- **donations**: Donation records
- **orphans**: Orphan home information
- **old_age_homes**: Senior care facility information
- **email_logs**: Email delivery tracking
- **email_statistics**: Monthly email usage stats

## Environment Variables Explained

```env
# Database
DB_NAME=skill_connect_db          # PostgreSQL database name
DB_USER=admin                      # PostgreSQL username
DB_PASSWORD=admin123               # PostgreSQL password

# MinIO
MINIO_ENDPOINT=minio               # MinIO server address
MINIO_PORT=9000                    # MinIO API port
MINIO_USER=minioadmin              # MinIO access key
MINIO_PASSWORD=minioadmin123       # MinIO secret key
MINIO_BUCKET=skill-connect-bucket  # Default bucket name

# Email - SendPulse (Production)
SENDPULSE_USER=your_email          # Your SendPulse email
SENDPULSE_PASS=your_password       # Your SendPulse password

# Email - Mailpit (Local)
MAILPIT_HOST=mailpit               # Local Mailpit host
MAILPIT_PORT=1025                  # Local Mailpit SMTP port

# Admin
ADMIN_EMAIL=admin@skillconnect.com # Admin login email
ADMIN_PASSWORD=admin123            # Admin login password
```

## API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `POST /api/forgot-password` - Password reset
- `GET /api/user/:email` - Get user profile
- `PUT /api/user/:email` - Update user profile

### Messages
- `POST /api/send-message` - Send direct message
- `GET /api/messages/:senderId/:receiverId` - Get message history
- `GET /api/conversations/:userId` - Get conversations list

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users with filters
- `POST /api/admin/send-bulk-message` - Send bulk message
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/donations` - Get donation records

### Donations
- `GET /api/donations/orphans` - List orphan homes
- `GET /api/donations/old-age-homes` - List old-age homes
- `POST /api/donations/create` - Create donation record

## Troubleshooting

### Docker Containers Won't Start
```bash
# Check logs
docker-compose logs -f

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Error
```bash
# Verify database is healthy
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### MinIO Issues
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Access MinIO console at http://localhost:9001
# Default credentials: minioadmin / minioadmin123
```

### Email Not Sending
1. Check Mailpit at http://localhost:8025
2. Verify SendPulse credentials in .env
3. Check email logs in database: `SELECT * FROM email_logs`

### Frontend Can't Connect to Backend
1. Verify backend is running: `curl http://localhost:5000`
2. Check REACT_APP_API_URL in frontend .env
3. Ensure CORS is enabled in backend

## Production Deployment

### Before Deployment
1. Change admin credentials in `.env`
2. Add SendPulse credentials
3. Update database credentials
4. Set `NODE_ENV=production`
5. Enable HTTPS/SSL
6. Set strong database passwords

### Deploy to Production
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Push to registry
docker-compose push

# Deploy on server
docker-compose up -d
```

## Support & Documentation

- Database Schema: Check `scripts/init-db.sql`
- Email Config: Check `utils/emailService.js`
- File Storage: Check `utils/minio.js`
- API Routes: Check `routes/` directory

## License

Copyright (c) 2025 Skill Connect. All rights reserved.
