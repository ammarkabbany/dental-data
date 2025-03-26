# Dental Data (TBD)

## Routes

### `/`
- **Description:** Home page
- **Details:**
  - Served by Next.js (`_app/page.tsx`)
  - Development server runs on [http://localhost:3000](http://localhost:3000)

### `/team/settings`
- **Description:** Team settings page
- **Details:**
  - Protected by Clerk middleware (see [src/middleware.ts](./src/middleware.ts))
  - Authentication required for access
  - Team permission required for access

### `/dashboard(.*)`
- **Description:** Dashboard and related content
- **Details:**
  - Protected by Clerk middleware (see [src/middleware.ts](./src/middleware.ts))
  - Authentication required for access
- **Sub-routes:**
  - `/dashboard/cases`
    - **Description:** Cases management page
    - **Features:**
      - Displays cases data table
      - Contains related content
    - `/dashboard/cases/new`
      - **Description:** Create new cases
  - `/dashboard/doctors`
    - **Description:** Doctors management page
    - **Features:**
      - Displays doctors data table
      - Contains related content
  - `/dashboard/templates`
    - **Description:** Templates management page
    - **Features:**
      - Manages case form templates

<!-- ### `/auth`
- **Description:** Authentication pages
- **Details:**
  - Manages authentication flow via Clerk
  - Handles redirects based on session cookies -->

## Features
- **Case Management**: Manage dental cases with attributes such as patient details, date, shade, notes, material relationships, doctor assignments, invoicing status, and detailed teeth data.
- **Doctor Management**: View and manage doctor cases, and associated invoices.
- **Material Management**: Track materials, their usage in cases, and relationships with inventory.
- **Inventory Storage**: Monitor inventory with features like low stock indicators, search & filter options, sortable columns, and pricing details (not yet implemented).
- **Analytics Dashboard**: Track monthly statistics such as cases, doctors, and materials used (not yet implemented).
- **Real-Time Data Updates**: Incorporate real-time updates to ensure seamless data synchronization (not yet implemented).
- **Authentication and Teams**: Use Appwrite for managing users and teams linked to cases.

## Technologies Used

### Frontend

- **Framework**: Next.js 15
- **UI Libraries**: Tailwind CSS (with shadcn components)
- **State Management**: Zustand, Context API
- **Notifications**: Sonner (shadcn)

### Backend

- **Backend-as-a-Service**: Appwrite for authentication, database, and real-time features
- **APIs**: Next.js API routes for additional backend functionality

### Deployment

- **Hosting**: Vercel

### Additional Packages

- **React Query**: For efficient data fetching and caching
- **TanStack Table**: For advanced table handling and pagination