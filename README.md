# Nat Ford Planning & Design Website

A modern Next.js 15 website with marketing site and client portal for Nat Ford Planning & Design.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Maps:** Mapbox GL JS
- **Deployment:** Vercel-ready

## Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Public marketing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── about/          # About Nat Ford
│   │   ├── services/       # Service pages (Planning, GIS, Aerial, etc.)
│   │   ├── projects/       # Case studies
│   │   └── contact/        # Contact form
│   ├── (portal)/           # Authenticated client portal (TODO)
│   ├── (auth)/             # Login/signup pages (TODO)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── layout/             # Layout components (Header, Footer, Container, etc.)
│   ├── ui/                 # UI components (Button, Card, Input, etc.)
│   └── features/           # Feature-specific components (TODO)
├── lib/
│   ├── supabase/           # Supabase client utilities
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks (TODO)
└── types/                  # TypeScript types
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xezwjmclbpvklojbcmaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Mapbox (get from https://mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nat Ford Planning & Design
```

See `ENV_SETUP.md` for detailed instructions on getting your Mapbox token.

### 3. Database Setup

The database schema has been created in Supabase with the following tables:
- `tenants` - Organization/client accounts
- `profiles` - User profiles with tenant relationship
- `projects` - Project management
- `files` - File management with versioning
- `messages` - Project messaging
- `approvals` - Approval workflows
- `activity_log` - Audit trail

Row Level Security (RLS) policies are implemented for multi-tenant data isolation.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Features Implemented

### ✅ Phase 1: Foundation
- [x] Next.js 15 project setup with TypeScript and Tailwind CSS v4
- [x] Supabase integration with database schema and RLS policies
- [x] Environment configuration
- [x] Folder structure and routing groups

### ✅ Phase 2: Design System
- [x] Custom color palette (Forest Green, Goldenrod, Slate, Cloud, Sky)
- [x] Typography and layout components (Container, Section, Grid)
- [x] UI components (Button, Card, Input, Textarea)
- [x] Navigation (Header with mobile menu, Footer)
- [x] Accessibility features (skip links, focus indicators, WCAG 2.2 AA)

### ✅ Phase 3: Marketing Website
- [x] Homepage with hero, services, projects, trust signals
- [x] Services overview page
- [x] Urban & Transportation Planning service page (detailed)
- [x] About page with Nat's bio and credentials
- [x] Contact page with form
- [x] Projects overview page
- [x] Sierra County RTP case study (sample)
- [x] SEO metadata configuration

### 🚧 Phase 4-11: In Progress

The following phases are outlined in the plan but not yet implemented:
- Authentication system (login, signup, password reset)
- Client portal dashboard
- Project management features
- File upload and management
- Messaging and collaboration
- Approval workflows
- Map integration with Mapbox GL JS
- Content population for remaining service pages and case studies
- Advanced features (search, analytics, performance optimization)
- Testing and deployment

## Development Roadmap

### Next Steps (High Priority)

1. **Create remaining service pages:**
   - GIS & Spatial Analysis (`/services/gis`)
   - Aerial Mapping & Photogrammetry (`/services/aerial`)
   - Funding & Grant Services (`/services/grants`)
   - AI-Enabled Documentation (`/services/ai`)

2. **Create remaining case study pages:**
   - Del Norte County ATP
   - Tehama County VMT & CIP
   - Plumas Transit FTA 5339
   - Placer County MIAS
   - El Dorado Next Gen Mobility
   - Tehama County EVAC Routing

3. **Implement Authentication:**
   - Login/signup pages
   - Password reset flow
   - Protected routes middleware
   - Session management

4. **Build Client Portal:**
   - Dashboard with project overview
   - Projects list and detail views
   - File upload and management
   - Messaging system

5. **Map Integration:**
   - Mapbox GL JS setup
   - Interactive project map on homepage
   - Project-specific maps

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Forest Green** `#1F4E2E` - Primary brand color
- **Goldenrod** `#D4A63F` - Accent color
- **Slate** `#0F172A` - Text on light backgrounds
- **Cloud** `#F1F5F9` - Light background
- **Sky** `#4C84F7` - Interactive states

### Typography
- Headings: Bold sans-serif
- Body: 16px minimum for readability
- Line height: 1.6 for comfortable reading

### Accessibility
- WCAG 2.2 AA compliant
- Focus indicators with 2px border and 3:1 contrast
- Semantic HTML throughout
- Skip links for keyboard navigation
- Screen reader support

## Content

All content is based on Nat Ford's real professional experience:
- 8+ years in Northern California planning
- Former Senior Planner at Green DOT Transportation Solutions (2021-2025)
- Prior roles: gRide/Genentech Transportation Coordinator, SFCTA Planning Intern, Legislative Intern for Supervisor Jane Kim
- Expertise in RTPs, ATPs, VMT analysis, grant writing
- GIS specialist with PostGIS, Mapbox, and web mapping
- FAA Part 107 certified drone pilot for aerial mapping and photogrammetry
- AI-enabled documentation workflows

## Contact

**Nathaniel "Nat" Ford Redmond**
- Email: nfredmond@gmail.com
- LinkedIn: [linkedin.com/in/nfredmond](https://linkedin.com/in/nfredmond)
- Location: Sierra Foothills, near Grass Valley, CA

## License

Private - All rights reserved.
