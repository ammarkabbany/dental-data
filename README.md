# DentaAuto

A comprehensive dental practice management system.

## Features

- 🦷 Patient management
- 👨‍⚕️ Doctor profiles and scheduling
- 📋 Case management with customizable templates
- 🧰 Dental materials inventory
- 📊 Reporting and analytics
- 🔄 Offline-first capabilities with data synchronization

## Tech Stack

- **Framework**: Next.js 15
- **UI Libraries**: Tailwind CSS with shadcn components
- **State Management**: Zustand, React Context API
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Clerk with Appwrite
- **Notifications**: Sonner (shadcn)
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

The project is organized into a feature-based structure:
```
src/
├── app/               # Next.js App Router pages and layouts
├── components/        # Reusable UI components
├── features/          # Feature-based modules
│   ├── auth/          # Authentication related components and hooks
│   ├── cases/         # Case management
│   ├── doctors/       # Doctor profiles
│   ├── materials/     # Materials inventory
│   └── templates/     # Case templates
├── helpers/           # Helper functions
├── hooks/             # Custom React hooks
├── lib/               # Library code, utilities
├── providers/         # React context providers
├── store/             # Zustand stores
└── types/             # TypeScript type definitions
```