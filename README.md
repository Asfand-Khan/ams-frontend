# Jubilee General Retail Frontend

A modern retail management system built with Next.js and React, designed for managing users, branches, orders, and other retail operations.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) - React framework with App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - Beautiful and accessible UI components
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Data Tables**: [TanStack Table](https://tanstack.com/table) - Headless table library
- **Form Handling**: [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) validation
- **Select Components**: [React Select](https://react-select.com) - Flexible select input control
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Animations**: [Framer Motion](https://framer.com/motion) - Production-ready motion library
- **HTTP Client**: [Axios](https://axios-http.com) - Promise-based HTTP client
- **Runtime**: [Node.js](https://nodejs.org) - JavaScript runtime

## Features

- 🔐 **Authentication System** - Secure login with OTP verification
- 👥 **User Management** - Complete CRUD operations for users
- 🏢 **Branch Management** - Manage retail branches with advanced forms and data tables
- 📊 **Data Tables** - Advanced tables with sorting, filtering, and export functionality
- 📱 **Responsive Design** - Mobile-first responsive interface
- 🎨 **Dark/Light Mode** - Theme switching capability
- 🔄 **Real-time Updates** - Optimistic UI updates with TanStack Query
- 📋 **Forms** - Type-safe forms with validation and react-select integration
- 🎯 **TypeScript** - Full type safety throughout the application

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── (public)/          # Public routes
├── components/            # Reusable UI components
│   ├── ui/
│   │   ├── auth/         # Authentication components
│   │   ├── branches/     # Branch management components
│   │   ├── datatable/    # Data table components
│   │   ├── shadcn/       # shadcn/ui components
│   │   ├── sidebar/      # Sidebar components
│   │   └── users/        # User-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── providers/             # React context providers
├── schemas/               # Zod validation schemas
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Authentication
- Email/phone-based login
- OTP verification system
- Secure session management

### User Management
- User listing with advanced data table
- Add, edit, and manage users
- Role-based access control

### Branch Management
- Branch listing with sortable and filterable data table
- Add new branches with comprehensive form validation
- Edit existing branch information
- Manager assignment with react-select dropdown
- Auto-fill manager names based on username selection

### Data Tables
- Sorting and filtering
- Column visibility controls
- Export functionality (Excel/CSV)
- Pagination
- Global search

### UI/UX
- Modern, clean interface
- Consistent design system
- Responsive layouts
- Loading states and error handling

## Development Guidelines

### Code Structure
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries
- Use React Hook Form for forms
- Validate data with Zod schemas

### Styling
- Use Tailwind CSS utilities
- Follow shadcn/ui design patterns
- Maintain consistent spacing and colors
- Ensure responsive design

### State Management
- Use TanStack Query for server state
- Use React state for local UI state
- Implement optimistic updates where appropriate

## Contributing

1. Follow the existing code style
2. Write type-safe code
3. Include proper error handling
4. Test your changes thoroughly
5. Update documentation as needed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The application can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [AWS](https://aws.amazon.com)
- [Google Cloud](https://cloud.google.com)

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).