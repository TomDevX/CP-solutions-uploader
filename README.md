# CP Solutions Uploader

A full-stack dynamic website where competitive programming users can upload, store, view, edit, and react to solutions. Features public and private solutions, anonymous posts, LaTeX editorial editor, animated lively GUI, search with intelligent sorting, autosave drafts, social reactions, and admin controls.

## 🚀 Features

- **Responsive Animated UI** - Lively interface inspired by summer.hackclub.com
- **Public & Private Solutions** - Toggle between public and private views
- **Intelligent Search & Sorting** - Search by problem code, title, author with smart sorting
- **LaTeX Editor** - Rich text editor with integrated LaTeX support
- **Autosave System** - Client and server-side draft persistence
- **Social Reactions** - Like, helpful, and bookmark reactions
- **Anonymous Posting** - Post solutions anonymously
- **Admin Controls** - Comprehensive admin dashboard and moderation tools
- **Authentication** - Email/password and Google OAuth support

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens, bcrypt password hashing
- **Editor**: TipTap with LaTeX support
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (or use Docker)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd cp-solutions-uploader
cp env.example .env.local
```

### 2. Environment Configuration

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/cp_solutions"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-change-in-production"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# The application will be available at:
# - App: http://localhost:3000
# - Database: localhost:5432
# - pgAdmin: http://localhost:8080 (admin@example.com / admin)
```

### 4. Manual Setup (Alternative)

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed database with admin user
npm run db:seed

# Start development server
npm run dev
```

### ⚠️ SECURITY WARNING

**IMPORTANT**: These are development credentials. Before deploying to production:

1. Change the admin password immediately
2. Use environment variables for all secrets
3. Enable HTTPS
4. Set up proper rate limiting
5. Use a secure JWT secret

To change admin credentials:

```bash
# Option 1: Update seed script and re-run
npm run db:seed

# Option 2: Use Prisma Studio
npx prisma studio
```

## 📊 Database Schema

### Core Tables

- **users** - User accounts and authentication
- **solutions** - Problem solutions with content and metadata
- **reactions** - User reactions (like, helpful, bookmark)
- **drafts** - Autosave drafts for solutions
- **attachments** - File attachments for solutions

### Key Relationships

- Solutions belong to users (with optional anonymous posting)
- Reactions link users to solutions
- Drafts are user-specific and can be solution-specific

## 🔍 Search & Sorting Logic

### Problem Code Parsing

The system intelligently parses problem codes like:
- `148A` → number: 148, suffix: "A"
- `1000B` → number: 1000, suffix: "B"  
- `CF-148A` → prefix: "CF", number: 148, suffix: "A"

### Sorting Algorithm

1. **Prefix** (lexicographical) - "CF" comes before "AtCoder"
2. **Number** (numerical) - 148 comes before 1000
3. **Suffix** (lexicographical) - "A" comes before "B"

Example sorted order: `148A`, `148B`, `1000A`, `CF-148A`

## 💾 Autosave System

### How It Works

1. **Client-side**: Saves to localStorage every 5 seconds
2. **Server-side**: Saves to database every 30 seconds or on significant changes
3. **Recovery**: Merges localStorage and server drafts on page load

### Implementation Details

- Drafts are stored per user and optionally per solution
- Content is merged intelligently (server takes precedence)
- Users can restore drafts or continue editing
- Drafts are automatically cleaned up after solution publication

## 🎨 UI/UX Features

### Animations

- **Framer Motion** for smooth transitions
- **Hover effects** on cards and buttons
- **Loading states** with spinners
- **Micro-interactions** throughout the interface

### Color Scheme

Inspired by summer.hackclub.com:
- **Primary**: Blue gradient (#0ea5e9 to #3b82f6)
- **Secondary**: Purple gradient (#d946ef to #8b5cf6)  
- **Accent**: Orange gradient (#f97316 to #ef4444)

### Responsive Design

- Mobile-first approach
- Collapsible navigation
- Adaptive layouts for all screen sizes

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Docker
npm run docker:up       # Start all services
npm run docker:down     # Stop all services
npm run docker:build    # Build containers

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests
```

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Environment variables for production
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export NEXTAUTH_SECRET="your-production-secret"
export JWT_SECRET="your-production-jwt-secret"
```

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Backup

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql

# Automated backup (cron job)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup-$(date +%Y%m%d).sql
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Change default admin credentials
- [ ] Use strong, unique secrets for JWT and NextAuth
- [ ] Enable HTTPS everywhere
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Sanitize all user inputs
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database backup strategy

### Rate Limiting

The application includes rate limiting:
- 100 requests per 15 minutes per IP
- Stricter limits for authentication endpoints
- Configurable via environment variables

### Input Sanitization

- XSS prevention on all user inputs
- SQL injection protection via Prisma
- File upload validation
- Content type verification

## 🧪 Testing

### Unit Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test -- --coverage # With coverage
```

### End-to-End Tests

```bash
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Open Playwright UI
```

### Test Coverage

- API endpoint testing
- Component unit tests
- Authentication flow tests
- Search and sorting tests
- Autosave functionality tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Backend Persistence and Autosave (Explained Simply)

### How Autosave Works

1. **When you type**: Content saves to browser storage every 5 seconds
2. **When you pause**: Content saves to server every 30 seconds
3. **When you return**: Browser checks for saved content and asks if you want to restore it
4. **When you publish**: Draft is automatically deleted

### Database Setup

1. **Install PostgreSQL** (or use Docker)
2. **Run migrations**: `npm run db:migrate`
3. **Seed data**: `npm run db:seed`
4. **Connect**: Set `DATABASE_URL` in your environment

### Backup Strategy

1. **Daily backups**: Automatically save database every day
2. **Manual backups**: Run `pg_dump` when needed
3. **Restore**: Use `psql` to restore from backup files

### Production Deployment

1. **Set environment variables** for database and secrets
2. **Use Docker Compose** for easy deployment
3. **Enable HTTPS** for security
4. **Set up monitoring** to watch for issues
5. **Regular backups** to prevent data loss

---

**Remember**: Always change the default admin password before going live!  
**Made by [TomDevX](https://github.com/TomDevX) with love ❤️**
©2025 CP Solutions Uploader