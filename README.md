# AYOKEMI2025 Wedding Website

A sophisticated Next.js wedding website for Elizabeth & Peter's special day (December 20, 2025). This full-featured platform combines public guest interactions with a secure admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38BDF8?style=flat-square&logo=tailwind-css)

## ✨ Features

### Guest Features
- **Home Page** - Elegant landing with new year celebration modal
- **Our Story** - Couple's personal narrative journey
- **Wedding Details** - Dates, venues, and locations with copy-to-clipboard
- **Photo Gallery** - Combined curated + guest photos with pagination
- **Photo Upload** - Guest photo submissions with event categorization
- **RSVP System** - Invitation code validation with guest count tracking
- **Wishes** - Guest messages and well-wishes collection
- **Announcements** - Wedding updates and news
- **Livestream** - Watch the event online
- **Surprise Message** - Special hidden message area

### Admin Features
- **Dashboard** - Stats: RSVPs, wishes, guest counts, attendance breakdown
- **Secure Login** - Email/password with OTP verification
- **Photo Management** - Approve/reject guest photos with detail panel
- **Analytics** - Page view and click tracking dashboard
- **Bulk Upload** - Import photos from Google Drive
- **Password Recovery** - OTP-based password reset

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4.1.9 |
| Components | shadcn/ui + Radix UI |
| Database | Supabase (PostgreSQL) |
| Authentication | JWT + OTP |
| Email | Nodemailer (Gmail SMTP) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

## 📁 Project Structure

```
ayokemi2025/
├── app/                    # Next.js App Router
│   ├── administrator/      # Admin dashboard pages
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── bulk-upload/    # Google Drive import
│   │   ├── login/          # Admin login
│   │   └── setup/          # Admin setup
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Custom React components
│   ├── ui/                 # shadcn/ui components (30+)
│   ├── photo-upload-form.tsx
│   ├── image-detail-panel.tsx
│   ├── language-switcher.tsx
│   ├── session-manager.tsx
│   └── ...
├── pages/                  # Legacy Pages Router
│   ├── index.tsx           # Home
│   ├── story.tsx           # Couple's story
│   ├── details.tsx         # Wedding details
│   ├── gallery.tsx         # Photo gallery
│   ├── rsvp.tsx            # RSVP form
│   ├── wishes.tsx          # Guest wishes
│   └── api/                # API endpoints
├── lib/                    # Utilities
│   ├── auth-utils.ts       # Authentication
│   ├── i18n.ts            # Internationalization
│   └── rate-limit-utils.ts
├── hooks/                  # Custom React hooks
├── scripts/                # Database migrations
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Supabase account

### Installation

```bash
# Clone the repository
cd ayokemi2025

# Install dependencies
pnpm install

# Set up environment variables (see .env.example)
```

### Environment Variables

Create a `.env.local` file with:

```env
# Admin Credentials
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET_KEY=your-jwt-secret

# Email (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Invitation Code
INVITATION_CODE=AYOKEMI25
NEXT_PUBLIC_INVITATION_CODE=AYOKEMI25

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

Run the SQL migrations in `/scripts/`:

1. `01_create_photos_table.sql` - Creates photos table
2. `02_add_display_column.sql` - Adds display column

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🌐 Internationalization

Supports 4 languages:
- 🇺🇸 English (EN)
- 🇪🇸 Spanish (ES)
- 🇫🇷 French (FR)
- 🇳🇬 Yorùbá (YO)

Language preference persists via localStorage.

## 🔐 Security Features

- JWT tokens with 1-hour expiration
- OTP verification (5-minute window)
- Rate limiting (client + server side)
- Input validation & HTML sanitization
- Supabase Row-Level Security (RLS)
- Security headers (CSP, X-Frame-Options, etc.)
- Session management with auto-logout

## 📄 API Endpoints

### Public (Rate Limited)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/send-rsvp` | POST | Submit RSVP (3/hour) |
| `/api/send-wishes` | POST | Submit wish (5/hour) |
| `/api/photos/upload` | POST | Upload photo |
| `/api/admin/login` | POST | Request OTP |

### Admin (JWT Protected)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/verify-otp` | POST | Complete login |
| `/api/admin/photos` | GET/PUT/DELETE | Manage photos |
| `/api/admin/analytics` | POST | Log events |
| `/api/admin/submissions` | POST | Fetch data |

## 🎨 Design System

- **Color Space**: OKLCH for modern, accessible colors
- **Theme**: Light/dark mode support
- **Typography**: Geist fonts (sans & mono)
- **Components**: shadcn/ui with Radix UI primitives

## 📝 License

This project is for demonstration purposes.

---

Built with ❤️ for Elizabeth & Peter