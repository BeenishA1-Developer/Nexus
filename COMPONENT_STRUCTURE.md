# Nexus Platform Component Structure Documentation

## Overview
The Nexus platform is a React + TypeScript application built with Vite, using Tailwind CSS for styling. It facilitates collaboration between entrepreneurs and investors.

## Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx    # Main layout with navbar and sidebar
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   └── Sidebar.tsx            # Side navigation menu
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── chat/
│   ├── collaboration/
│   ├── entrepreneur/
│   ├── investor/
│   └── MeetingCalendar.tsx        # Calendar component for meetings
│   └── MeetingRequests.tsx        # Component for meeting requests
├── pages/                         # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── meetings/                  # Meetings page
│   └── ...
├── context/
│   └── AuthContext.tsx            # Authentication context
├── data/                          # Mock data
├── types/                         # TypeScript type definitions
└── ...
```

## UI Theme
The application uses a consistent design system with Tailwind CSS:

### Color Palette
- **Primary**: Blue tones (#EFF6FF to #172554)
- **Secondary**: Teal tones (#F0FDFA to #042F2E)
- **Accent**: Yellow tones (#FFFBEB to #451A03)
- **Success**: Green (#F0FDF4, #22C55E)

### Typography
- Headings: font-bold
- Body text: text-gray-600/900
- Consistent spacing and sizing

### Components
- Responsive grid layouts
- Card-based design
- Consistent button styles
- Icon integration with Lucide React

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Hidden sidebar on mobile
- Flexible layouts

## Routing
- React Router with nested routes
- Dashboard layout wraps authenticated pages
- Role-based navigation (entrepreneur vs investor)

## State Management
- React Context for authentication
- Local component state for UI
- Mock data for development

## New Features Added
- **Meeting Scheduling**: Calendar integration with react-calendar
- **Meeting Requests**: Accept/decline functionality
- **Navigation**: Added meetings to sidebar for both user types