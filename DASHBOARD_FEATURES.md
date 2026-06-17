# Supply Management Dashboard - Complete Features

## Overview

A professional enterprise-grade Supply Management Dashboard built with Next.js 16, React 19, shadcn/ui, Tailwind CSS, and Recharts. The dashboard features comprehensive KPIs, interactive charts, data tables, and management widgets with realistic dummy data.

## Key Performance Indicators (KPIs)

The dashboard displays 8 critical KPI cards at the top:

### 1. **Total Companies** - 28
   - Monitors the number of active supplier/buyer companies
   - Shows trend: +4.2% vs last month

### 2. **Total Products** - 1,243
   - Tracks total product catalog items
   - Growth indicator: +12.5% vs last month

### 3. **Total Supplies** - 8,932
   - Counts inventory items across all supplies
   - Trend: +18.3% vs last month

### 4. **Total Revenue** - $628,230
   - Year-to-date or cumulative revenue
   - Growth: +24.8% vs last month

### 5. **Monthly Revenue** - $89,000
   - Current month's revenue performance
   - Trend: +15.6% vs last month

### 6. **Total Collections** - $542,100
   - Cumulative amount collected from invoices
   - Growth: +19.2% vs last month

### 7. **Outstanding Due** - $86,130
   - Invoices awaiting payment
   - Change: +5.1% vs last month

### 8. **Overdue Amount** - $47,560
   - Past-due invoice amounts
   - Trend: +3.7% vs last month

**Features:**
- Color-coded trend indicators (Green for positive, Amber for negative)
- Icons for quick visual identification
- Responsive grid layout (1 col mobile, 2 cols tablet, 4 cols desktop)
- Hover effects for interactivity

## Charts Section

Three comprehensive data visualization charts using Recharts:

### 1. **Monthly Revenue Trend** (Line Chart)
- 12-month revenue history from Jan-Dec
- Displays actual revenue vs revenue targets
- Dual-line comparison for performance analysis
- Interactive tooltips with month-by-month breakdown
- Revenue ranges from $32,000 to $89,000

### 2. **Monthly Collection Trend** (Area Chart)
- 12-month collections and outstanding amounts
- Stacked area visualization
- Shows collections growth and outstanding debt trends
- Collections range: $28,000 to $80,000
- Outstanding range: $4,000 to $9,000

### 3. **Revenue vs Collection Comparison** (Bar Chart)
- Side-by-side comparison of revenue and collections
- 12-month historical data
- Identifies collection efficiency gaps
- Helps track payment collection ratio
- Visual analysis of revenue realization

**Chart Features:**
- Responsive and auto-scaling
- Theme-aware colors (uses design tokens)
- Customizable tooltips
- Legend displays for clarity
- Grid lines for easy reading

## Data Tables

### 1. **Recent Supplies Table**
| Column | Description |
|--------|-------------|
| ID | Supply order identifier (SUP001-SUP005) |
| Supplier | Supplier company name |
| Item | Item description/product name |
| Qty | Quantity ordered |
| Status | Current status with color-coded badges |
| Date | Order date |

**Status Badges:**
- Delivered (Green)
- In Transit (Blue)
- Pending (Amber)
- Processing (Purple)
- Cancelled (Red)

**Example Data:**
- Global Supplies Inc - Office Paper A4 (500 units) - Delivered
- Tech Components Ltd - Computer Monitors (45 units) - In Transit
- Furniture Pro - Office Chairs (120 units) - Pending

### 2. **Recent Invoices Table**
| Column | Description |
|--------|-------------|
| Invoice ID | Unique invoice identifier |
| Company | Customer company name |
| Amount | Invoice total amount |
| Status | Payment status indicator |
| Due Date | Payment due date |
| Issued | Invoice issue date |

**Invoice Statuses:**
- Paid (Green) - $12,450, $22,340
- Pending (Amber) - $8,920, $9,650
- Overdue (Red) - $15,780

### 3. **Recent Collections Table**
| Column | Description |
|--------|-------------|
| Collection ID | Collection transaction ID |
| Invoice | Related invoice number |
| Company | Payer company name |
| Amount | Amount collected |
| Method | Payment method (Bank Transfer, Credit Card, Cheque, Online) |
| Date | Collection date |

**Example Collections:**
- 5 recent successful collections totaling $72,600
- Includes Bank Transfer, Credit Card, Cheque, and Online Payment methods

**Table Features:**
- Hover effects for row highlighting
- Responsive horizontal scroll on mobile
- Color-coded status badges
- Professional typography and spacing
- Secondary row styling for visual hierarchy

## Management Widgets

### 1. **Top Revenue Companies**
- Displays 5 top-performing companies by revenue
- Shows company name and revenue amount
- Visual progress bars showing revenue percentage of total
- Trend indicators (↑ percentage) for each company

**Top Companies:**
1. Acme Corporation - $156,230 (24.8%) ↑ +12.5%
2. Tech Solutions Ltd - $98,450 (15.6%) ↑ +8.2%
3. Global Enterprises - $87,920 (13.9%) ↑ +5.1%
4. Industry Leaders Inc - $76,340 (12.1%) ↑ +3.7%
5. Market Dynamics - $62,810 (10.0%) ↑ +2.3%

### 2. **Upcoming Due Payments**
- Lists invoices due in the next 30 days
- Shows days remaining until due date
- Company and invoice information
- Amount and due date for planning

**Example Payments:**
- INV002: Tech Solutions Ltd - $8,920 (Due in 5 days)
- INV005: Professional Services - $9,650 (Due in 8 days)
- INV006: Creative Agency - $7,340 (Due in 12 days)
- INV008: Digital Solutions - $14,200 (Due in 15 days)

### 3. **Overdue Invoices Alert**
- Highlighted warning widget with red styling
- Shows critical overdue invoices
- Displays number of overdue items
- Days overdue for each invoice
- Requires immediate attention

**Overdue Invoices:**
- INV003: Global Enterprises - $15,780 (11 days overdue)
- INV009: Enterprise Group - $19,450 (7 days overdue)
- INV012: Strategic Partners - $12,340 (3 days overdue)
- Total Overdue: $47,570

**Widget Features:**
- Progress bars for visual representation
- Color-coded alerts
- Quick action links (View all)
- List-based layouts for readability
- Trend indicators and status badges

## Design System

### Color Palette
- **Primary**: Blue (Professional brand color)
- **Accent**: Green (Success/positive actions)
- **Warning**: Amber (Pending/caution)
- **Danger**: Red (Overdue/critical)
- **Neutrals**: Grays for text and borders

### Typography
- **Headings**: Bold, 1.125rem - 2rem sizes
- **Body**: Regular weight, 0.875rem - 1rem sizes
- **Labels**: Uppercase, 0.75rem, tracking-wide
- **Data**: Monospace-friendly numbers

### Layout & Spacing
- 8px base spacing unit (Tailwind's scale)
- Gap-based spacing for grids
- Responsive breakpoints: mobile, tablet, desktop
- Max-width containers for content

### Components Used
- shadcn/ui Card, Badge, Button, Table
- Lucide React Icons (24+)
- Recharts for visualizations
- Custom dashboard components
- Fully accessible and semantic HTML

## Features & Functionality

### Navigation
- **Sidebar Navigation**: Collapsible menu with 15+ sections
- **Top Navigation Bar**: Search, notifications, user profile
- **Breadcrumb Navigation**: Context-aware page trails
- **Mobile Drawer**: Hidden sidebar for smaller screens
- **Quick Links**: Dashboard, Companies, Products, Supplies, Invoices, Collections

### Responsiveness
- **Desktop (1920x1080)**: Full 4-column grid layout
- **Tablet (768px)**: 2-column grid layout
- **Mobile (375px)**: Stacked single-column layout
- **Hamburger Menu**: Sidebar drawer on mobile
- **Touch-Friendly**: Larger tap targets for mobile

### Interactivity
- **Hover Effects**: Card shadows and row highlighting
- **Dropdown Menus**: User profile and navigation dropdowns
- **Tooltips**: Chart hover tooltips
- **Status Badges**: Color-coded status indicators
- **Progress Bars**: Visual revenue distribution
- **Links**: "View all" navigation links

### Data Visualization
- **Line Charts**: Revenue trends with dual metrics
- **Area Charts**: Collection trends with stacking
- **Bar Charts**: Revenue vs Collections comparison
- **Progress Bars**: Top company revenue distribution
- **Tables**: Sortable data with badges

## File Structure

```
components/
├── dashboard-layout.tsx          # Main layout wrapper
├── sidebar.tsx                   # Navigation sidebar
├── top-nav.tsx                   # Top navigation bar
├── breadcrumb-nav.tsx           # Breadcrumb trail
├── charts/
│   ├── revenue-trend.tsx        # Monthly revenue chart
│   ├── collection-trend.tsx     # Collection trend chart
│   └── revenue-collection-comparison.tsx  # Comparison chart
├── tables/
│   ├── recent-supplies.tsx      # Supply orders table
│   ├── recent-invoices.tsx      # Invoices table
│   └── recent-collections.tsx   # Collections table
└── widgets/
    ├── top-revenue-companies.tsx    # Top companies widget
    ├── upcoming-due-payments.tsx    # Upcoming dues widget
    └── overdue-invoices.tsx         # Overdue alerts widget

app/
├── dashboard/page.tsx           # Main dashboard page
├── companies/page.tsx           # Companies management
├── products/page.tsx            # Products listing
├── supplies/page.tsx            # Supplies inventory
└── layout.tsx                   # Root layout
```

## Performance & Accessibility

- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Labels**: Screen reader support
- **Color Contrast**: WCAG AA compliant
- **Keyboard Navigation**: Full keyboard support
- **Responsive Images**: Icon optimization
- **Bundle Size**: Optimized with Next.js

## Customization

### Adding New KPI Cards
1. Update the `kpiStats` array in `/app/dashboard/page.tsx`
2. Add icon from lucide-react
3. Define value, label, change, and positive flag

### Updating Chart Data
1. Modify the `data` array in chart component
2. Update dataKey properties if structure changes
3. Adjust Y-axis range as needed

### Adding Table Rows
1. Extend the data array in table component
2. Add new row structure matching existing format
3. Update status colors if needed

### Creating New Pages
1. Use DashboardLayout wrapper
2. Follow component structure pattern
3. Add sidebar navigation item
4. Update breadcrumb trail

## Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with design tokens
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Responsive**: Mobile-first design
- **Deployment**: Vercel-ready

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Future Enhancements

Potential features to add:
- Data export (PDF, CSV)
- Advanced filtering and search
- Custom date range selection
- Real-time data updates with WebSocket
- User preferences and dashboard customization
- Email alerts for overdue invoices
- Dashboard printing support
- Dark mode toggle
- Multi-language support
- Role-based dashboard views

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: Supply Management Team
