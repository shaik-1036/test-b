# Skill Connect - Professional Networking Platform

A modern, feature-rich professional networking platform built with React, Node.js, PostgreSQL, and MinIO. Connect with professionals, share skills, manage donations, and grow your network.

## Features

### User Features
- **Professional Profiles**: Create and manage your professional profile with company affiliation
- **Real-Time Messaging**: Chat with up to 5 users (free tier), unlimited with premium
- **Resume Management**: Upload and store resumes/documents securely in MinIO
- **User Search**: Find and connect with professionals by name or company
- **Admin Notifications**: Receive important updates and announcements
- **Dashboard**: Comprehensive user dashboard with profile, messages, and notifications

### Admin Features
- **User Management**: View and filter users by status, company, or search terms
- **Bulk Messaging**: Send messages to all users in a specific category
- **Analytics Dashboard**: Track users, messages, donations, and email statistics
- **Donation Management**: Oversee donations to orphans and old-age homes
- **Email Statistics**: Monitor email delivery and rate limiting compliance

### Donation Features
- **Orphan Support**: Contribute to orphan homes with donation tracking
- **Senior Care**: Support old-age homes and senior care facilities
- **QR Codes**: Easy payment scanning with QR codes
- **Donation History**: Track all donations and recipients

### Technical Features
- **Secure File Storage**: MinIO S3-compatible object storage
- **Email Service**: SendPulse (production) + Mailpit (local testing)
- **Database**: PostgreSQL with auto-initialization
- **Real-Time Updates**: Polling-based messaging system
- **Responsive Design**: Mobile-friendly interface
- **Docker Containerization**: Easy deployment with Docker Compose

## Tech Stack

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **Recharts**: Analytics charts
- **CSS3**: Styling with responsive design

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **MinIO**: Object storage
- **SendPulse**: Email service
- **Mailpit**: Local email testing

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## Quick Start

### Option 1: Docker (Recommended)

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
start.bat
```

**Manual Docker:**
```bash
cp .env.example .env
docker-compose up -d
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | User signup |
| Admin Dashboard | http://localhost:3000/admin-login | admin@skillconnect.com / admin123 |
| Backend API | http://localhost:5000 | N/A |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| Mailpit | http://localhost:8025 | N/A |

## First Steps

1. **Register a User Account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in all required fields
   - Company field is optional

2. **Access User Dashboard**
   - Login with your credentials
   - View and edit profile
   - Upload resume
   - Search and message other users
   - Check notifications

3. **Admin Access**
   - Click "Admin Login" on login page
   - Use: admin@skillconnect.com / admin123
   - Send bulk messages to users
   - View analytics and statistics

## Project Structure

```
advanced_skill_connect_app_stunning/
├── backend/
│   ├── server.js                 # Main server entry
│   ├── package.json              # Dependencies
│   ├── config/
│   │   └── db.js                 # Database config & initialization
│   ├── routes/
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── users.js              # User management
│   │   ├── messages.js           # Messaging system
│   │   ├── admin.js              # Admin operations
│   │   └── donations.js          # Donation management
│   ├── utils/
│   │   ├── minio.js              # MinIO file storage
│   │   └── emailService.js       # Email sending service
│   └── scripts/
│       └── init-db.sql           # Database schema
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── UserDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminLogin.js
│   │   │   ├── Orphans.js
│   │   │   └── OldAgeHomes.js
│   │   └── styles/
│   │       ├── login.css
│   │       ├── signup.css
│   │       ├── user-dashboard.css
│   │       ├── admin-dashboard.css
│   │       └── donations.css
│   └── public/
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.frontend
├── .env.example
├── .dockerignore
├── start.sh                      # Linux/Mac quick start
├── start.bat                     # Windows quick start
├── SETUP.md                      # Detailed setup guide
└── README.md

```

## API Documentation

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
- `GET /api/admin/users` - List all users
- `POST /api/admin/send-bulk-message` - Send bulk message
- `GET /api/admin/analytics` - Dashboard analytics
- `GET /api/admin/donations` - List donations

### Donations
- `GET /api/donations/orphans` - List orphan homes
- `GET /api/donations/old-age-homes` - List old-age homes
- `POST /api/donations/create` - Create donation

### Files
- `POST /api/upload-resume` - Upload resume
- `GET /api/resumes/:email` - Get user resumes
- `DELETE /api/delete-resume` - Delete resume

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DB_NAME=skill_connect_db
DB_USER=admin
DB_PASSWORD=admin123

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
MINIO_BUCKET=skill-connect-bucket

# Email - SendPulse
SENDPULSE_USER=your_email@example.com
SENDPULSE_PASS=your_password

# Email - Mailpit (Local)
MAILPIT_HOST=mailpit
MAILPIT_PORT=1025

# Admin
ADMIN_EMAIL=admin@skillconnect.com
ADMIN_PASSWORD=admin123

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## Database Schema

### Core Tables
- **users**: User accounts and profiles
- **resumes**: Resume files metadata
- **messages**: Admin broadcast messages
- **message_recipients**: Message delivery tracking
- **user_messages**: Direct user-to-user messages
- **user_conversations**: Active conversations
- **donations**: Donation records
- **orphans**: Orphan home information
- **old_age_homes**: Senior care facilities
- **email_logs**: Email sending logs
- **email_statistics**: Monthly email statistics

## Email Configuration

### Local Testing (Default)
- Uses Mailpit: http://localhost:8025
- No configuration needed
- Perfect for development

### Production (SendPulse)
1. Get SendPulse credentials
2. Add to `.env`:
   ```env
   SENDPULSE_USER=your_email@example.com
   SENDPULSE_PASS=your_api_password
   ```
3. Rate limits: 300 users/month, 12,000 emails/month

## File Storage (MinIO)

### MinIO Console
- URL: http://localhost:9001
- Username: minioadmin
- Password: minioadmin123

### Features
- S3-compatible API
- Automatic bucket creation
- Public file access
- Presigned URLs for temporary access

## Troubleshooting

### Docker Won't Start
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Error
```bash
docker-compose restart postgres
docker-compose logs postgres
```

### Frontend Can't Connect to Backend
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify backend is running: `curl http://localhost:5000`
- Check Docker network: `docker network ls`

### Email Not Sending
- Check Mailpit: http://localhost:8025
- Verify SendPulse credentials in `.env`
- Check email logs: `SELECT * FROM email_logs`

### MinIO Issues
- Access console: http://localhost:9001
- Check logs: `docker-compose logs minio`
- Restart: `docker-compose restart minio`

## Development Tips

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Queries
```bash
# Connect to database
docker-compose exec postgres psql -U admin -d skill_connect_db

# Useful queries
SELECT * FROM users;
SELECT * FROM email_logs;
SELECT * FROM donations;
```

### Rebuild Frontend
```bash
docker-compose rebuild frontend
docker-compose up -d frontend
```

## Performance Optimization

### For Production
1. Set `NODE_ENV=production`
2. Enable HTTPS/SSL
3. Use strong database passwords
4. Configure proper backup strategy
5. Set up monitoring and alerts

### Caching Strategy
- User profile caching: 5 minutes
- Message polling: 3 seconds
- Analytics refresh: 1 minute

## Security Best Practices

1. **Never commit `.env` to git**
2. **Change default admin password**
3. **Use strong database passwords**
4. **Enable HTTPS in production**
5. **Validate all user inputs**
6. **Use parameterized queries**
7. **Keep dependencies updated**

## Deployment

### To AWS, Heroku, or VPS
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use managed PostgreSQL service
4. Use AWS S3 or similar for files
5. Set up CI/CD pipeline

### Docker Hub
```bash
docker build -t username/skill-connect .
docker push username/skill-connect
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Copyright © 2025 Skill Connect. All rights reserved.

## Support

For issues and questions:
1. Check the SETUP.md guide
2. Review API documentation
3. Check logs: `docker-compose logs -f`
4. Create an issue on GitHub

## Changelog

### v1.0.0 (2025)
- Initial release
- User authentication and profiles
- Real-time messaging
- Admin dashboard
- Donation management
- Resume/file management
- Email service integration
- MinIO file storage
- Docker containerization

---

**Built with ❤️ for Professional Networking**
