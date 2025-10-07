# BRS - University Student Management System

A comprehensive student management system built with Next.js 15, designed to streamline academic operations for universities and educational institutions.

## 🎓 Features

### Core Academic Modules
- **Dashboard** - Academic overview with grades, courses, and announcements
- **Courses** - Course enrollment, materials, and schedule management
- **Calendar** - Academic calendar with class schedules and important dates
- **Grades** - Grade tracking, GPA monitoring, and transcript access
- **Assignments** - Assignment submission, deadlines, and feedback
- **Attendance** - Class attendance tracking and records
- **Library** - Digital library resource access

### Advanced Features
- **AI-Powered Chat** - Intelligent assistant for student inquiries
- **Multi-University Support** - Manage multiple institutions
- **Role-Based Access Control** - Different permissions for students, faculty, and administrators
- **Real-time Notifications** - Stay updated with announcements and deadlines
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

### Backend & Database
- **PostgreSQL** - Primary database
- **Prisma** - Database ORM and toolkit
- **Better Auth** - Authentication and authorization
- **AI SDK** - AI integration for chat functionality

### Development Tools
- **Biome** - Linting and formatting
- **Turbopack** - Fast bundler for development
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brs
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/brs"

# Authentication
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_COMPANY_NAME="Your University"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
META_CLIENT_ID="your-meta-client-id"
META_CLIENT_SECRET="your-meta-client-secret"

# AI Configuration
OPENAI_API_KEY="your-openai-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"
CHAT_MODEL="gpt-4"
```

4. Set up the database:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. Create a superadmin user:
```bash
pnpm user:create-superadmin
```

6. Seed demo data (optional):
```bash
pnpm demo:seed
```

7. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
brs/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   ├── demo-data.ts       # Demo data seeding
│   └── user-cli.ts        # User management CLI
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── (app)/         # Protected app routes
│   │   ├── (legal)/       # Legal pages
│   │   ├── api/           # API routes
│   │   └── auth/          # Authentication pages
│   ├── components/        # Reusable components
│   │   ├── ai-elements/   # AI chat components
│   │   ├── course-*/      # Course-related components
│   │   ├── ui/            # Base UI components
│   │   └── weather/       # Weather widget components
│   ├── features/          # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript type definitions
├── biome.json             # Biome configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Available Scripts

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

### User Management
- `pnpm user` - Interactive user management CLI
- `pnpm user:create-superadmin` - Create superadmin user
- `pnpm user:create` - Create regular user
- `pnpm user:list` - List all users
- `pnpm user:roles` - Manage user roles

### Demo Data
- `pnpm demo` - Interactive demo data management
- `pnpm demo:seed` - Seed demo data
- `pnpm demo:seed-force` - Force reseed demo data
- `pnpm demo:clear` - Clear all demo data

## 👥 User Roles & Permissions

The system supports multiple user roles with different permissions:

### University Roles
- **Super Admin** - Full system access
- **Registrar** - University management and user creation
- **Dean** - Faculty and department management
- **Professor** - Course management and grading
- **Student** - Course enrollment and academic records

### Course Roles
- **Course Instructor** - Manage specific courses
- **Teaching Assistant** - Assist with course management
- **Student** - Enroll and participate in courses

## 🏗️ Architecture

### Authentication System
- Built with Better Auth for secure authentication
- Supports email/password and OAuth (Google, Apple, Facebook)
- Role-based access control with university-specific permissions
- Session management with secure cookies

### Database Design
- PostgreSQL with Prisma ORM
- Multi-tenant architecture supporting multiple universities
- Optimized for academic data structures
- Migration-based schema management

### AI Integration
- AI-powered chat assistant for student support
- Custom tools for course information and calendar data
- Configurable AI providers and models
- Streaming responses for better UX

## 🌱 Development

### Code Style
- Uses Biome for consistent code formatting
- TypeScript for type safety
- Component-based architecture with reusable UI components
- Following Next.js 15 App Router conventions

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name <migration-name>`
3. Update generated client: `pnpm prisma generate`

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Update types in `src/types/`
4. Add API routes in `src/app/api/`

## 📱 Modules Overview

Based on the planned modules in [APPS.md](./APPS.md):

### Currently Implemented
- Dashboard with academic overview
- Course management system
- Calendar integration
- Grade tracking
- Assignment submission
- Attendance tracking
- Library access
- AI chat assistant

### Planned Modules
- Events management
- Club organizations
- Course registration
- Financial management
- Profile management
- Support system
- Messaging
- Announcements
- Directory services
- Resource management
- Transportation
- Housing management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Authentication by [Better Auth](https://better-auth.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
