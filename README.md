## Epic Next.js 16 Tutorial

### 🏗️ Project Architecture Overview
This is a modern full-stack application with a clear separation of concerns:

### Project Structure

epic-next-course/
├── frontend/          # Next.js 15 application
│   ├── src/
│   │   ├── app/           # App Router with route groups
│   │   │   ├── (auth)/    # Authentication routes
│   │   │   ├── (protected)/ # Protected dashboard routes
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── custom/    # Project-specific components
│   │   │   ├── forms/     # Form components with validation
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── data/
│   │   │   ├── actions/   # Server actions
│   │   │   ├── services/  # API service functions
│   │   │   └── validation/ # Zod schemas
│   │   └── types/         # TypeScript definitions
│   └── package.json
└── backend/           # Strapi CMS
    ├── src/
    │   ├── api/           # Custom API routes
    │   ├── components/    # Reusable content components
    │   └── content-types/ # Data models
    └── package.json

### 🛠️ Complete Tech Stack
#### Frontend Technologies

- Framework: Next.js 15.4.6 with App Router
- Language: TypeScript (strict mode enabled)
- Styling: Tailwind CSS v4 with modern utilities
- UI Components: shadcn/ui built on Radix UI primitives
- Icons: Lucide React for consistent iconography
- Notifications: Sonner for elegant toast messages
- Forms: Server Actions with Zod validation
- AI Integration: Vercel AI SDK for seamless AI functionality


#### Backend Technologies
- CMS: Strapi v5 headless content management
- Database: SQLite (better-sqlite3) for development
- Authentication: JWT-based authentication system
- API: REST API with custom controllers and middleware