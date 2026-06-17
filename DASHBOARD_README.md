# Supply Management Dashboard

A modern enterprise-grade Supply Management Dashboard built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### Layout Components

- **Collapsible Sidebar Navigation** - Full-featured navigation with expandable sections for different management areas
- **Top Navigation Bar** - Search functionality, notification bell, and user profile dropdown
- **Breadcrumb Navigation** - Context-aware breadcrumb trails for easy navigation
- **Responsive Design** - Mobile-optimized with automatic drawer on smaller screens
- **Dark Mode Support** - Complete light and dark theme support

### Navigation Structure

The sidebar includes comprehensive navigation for:

- **Dashboard** - Overview and quick stats
- **Company Management** - Manage company profiles
- **Product Management** - Categories and products inventory
- **Supply Management** - Supplies and new supply tracking
- **Invoice Management** - Invoice records and tracking
- **Collection Management** - Collection data
- **Due Management** - Due and overdue lists
- **Reports** - Revenue, collection, and due reports
- **User Management** - Users and roles administration
- **Settings** - Application settings

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page (redirects to /dashboard)
│   ├── globals.css             # Global styles and design tokens
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard with stats
│   ├── companies/
│   │   └── page.tsx            # Companies management
│   ├── products/
│   │   └── page.tsx            # Products listing
│   ├── supplies/
│   │   └── page.tsx            # Supply inventory
│   └── ...                     # Other pages (route placeholders)
├── components/
│   ├── sidebar.tsx             # Sidebar navigation component
│   ├── top-nav.tsx             # Top navigation bar
│   ├── breadcrumb-nav.tsx      # Breadcrumb component
│   ├── dashboard-layout.tsx    # Wrapper layout for all dashboard pages
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       └── ...
└── lib/
    └── utils.ts                # Utility functions
```

## Key Components

### DashboardLayout

Wraps all dashboard pages with consistent layout structure.

```tsx
<DashboardLayout 
  title="Page Title"
  breadcrumbs={[
    { label: 'Section', href: '/section' },
    { label: 'Current Page', active: true }
  ]}
>
  {/* Page content */}
</DashboardLayout>
```

### Sidebar

Features:
- Collapsible sections with expand/collapse icons
- Icon-based navigation items
- Badge support (e.g., "New" badge)
- Mobile drawer support
- Responsive behavior

### Top Navigation

Features:
- Search input field
- Notification bell with indicator
- User profile dropdown with logout option
- Responsive layout

## Design System

### Color Palette

- **Primary**: Blue (`oklch(0.45 0.2 264)`) - Main brand color
- **Success**: Green (`oklch(0.5 0.18 112)`) - Positive actions
- **Warning**: Amber/Orange - Warnings and alerts
- **Danger**: Red (`oklch(0.6 0.25 27)`) - Destructive actions
- **Neutral**: Grays for backgrounds and text

### Typography

- **Font Family**: Geist (default), with Geist Mono for code
- **Heading Weight**: 600-700 (semibold to bold)
- **Body Weight**: 400-500 (normal to medium)
- **Line Height**: 1.4-1.6 for readability

### Spacing & Border Radius

- Uses Tailwind's spacing scale (4px increments)
- Border radius: `0.625rem` (10px) default

## Usage

### Adding a New Page

1. Create a new folder in `/app/{section}/`
2. Add `page.tsx` with your page component
3. Wrap content with `DashboardLayout`:

```tsx
import { DashboardLayout } from '@/components/dashboard-layout'

export default function MyPage() {
  return (
    <DashboardLayout title="My Page">
      <div className="p-6">
        {/* Your content */}
      </div>
    </DashboardLayout>
  )
}
```

### Adding Navigation Items

Edit the `navSections` array in `/components/sidebar.tsx`:

```tsx
const navSections: NavSection[] = [
  {
    title: 'YOUR SECTION',
    items: [
      {
        icon: <YourIcon className="size-5" />,
        label: 'Item Label',
        href: '/route',
        badge: 'Optional Badge'
      }
    ]
  }
]
```

## Responsive Breakpoints

- **Mobile**: < 768px (drawer navigation)
- **Tablet**: 768px - 1024px (sidebar visible)
- **Desktop**: > 1024px (full layout)

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Lucide Icons** - Icon system
- **React Server Components** - Performance optimization

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Customization

### Changing Colors

Edit `/app/globals.css` to modify the color scheme:

```css
:root {
  --primary: oklch(0.45 0.2 264);
  /* ... other colors */
}
```

### Sidebar Styling

Modify the sidebar appearance in `/components/sidebar.tsx`:
- Logo section
- Navigation item styling
- Hover states
- Mobile drawer styles

### Top Navigation

Customize in `/components/top-nav.tsx`:
- Search functionality
- Notification badge
- User dropdown menu items
- Logo placement

## Features to Implement

The following routes are set up as placeholders:
- `/categories` - Product categories
- `/invoices` - Invoice management
- `/collections` - Collections
- `/due-list` - Due items
- `/overdue-list` - Overdue items
- `/reports/*` - Various reports
- `/users` - User management
- `/roles` - Role management
- `/settings` - Settings page

Each can be implemented by creating the corresponding page with the `DashboardLayout` wrapper.

## Performance Considerations

- Sidebar navigation is client-side for smooth interactions
- Dashboard uses responsive grid layouts
- Icons use Lucide for optimal SVG delivery
- Design tokens use CSS variables for efficient theming

## Support

For issues or customization requests, refer to:
- [Next.js Documentation](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
