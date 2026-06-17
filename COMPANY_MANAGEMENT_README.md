# Company Management Page

## Overview
The Company Management page provides a comprehensive interface for managing all companies in the Supply Management System. It includes advanced search, filtering, pagination, and action capabilities.

## Features

### Header Section
- **Page Title**: Clear page header with description showing total company count
- **Add Company Button**: Primary button to add new companies to the system
- Breadcrumb navigation for context awareness

### Filter Panel
The filter panel provides multiple ways to find and organize companies:

#### Search Functionality
- **Full-Text Search**: Search by company name, contact person, or email address
- Real-time filtering as you type
- Search query indicator showing active search

#### Status Filter
- Filter companies by status: Active, Inactive, or Pending
- Dropdown selector for easy filtering
- "All Status" option to show all companies regardless of status

#### Clear Filters
- Quick button to reset all filters and search queries
- Helpful for starting fresh searches
- Automatically resets pagination to page 1

### Company Data Table

#### Column Headers
The table displays the following columns for each company:

1. **Company Name**
   - Company logo/icon indicator
   - Company name with visual identification

2. **Contact Person**
   - Primary contact name for the company
   - Full name display

3. **Phone**
   - Contact phone number
   - International format supported

4. **Email**
   - Company email address
   - Formatted for clarity

5. **Total Revenue**
   - Right-aligned currency value
   - Bold font for emphasis
   - Formatted with currency symbol and thousands separator

6. **Total Due**
   - Outstanding amount owed by company
   - Color-coded: Amber (red) if due, Green if fully paid
   - Currency formatted

7. **Status Badge**
   - Visual status indicator
   - Color variants:
     - **Active** (Blue) - Company is active
     - **Inactive** (Gray) - Company is inactive
     - **Pending** (Outline) - Company status pending

8. **Actions**
   - Dropdown menu with three options:
     - **View Details** - View full company profile
     - **Edit Company** - Edit company information
     - **Delete Company** - Remove company from system

### Pagination

#### Features
- Display current page and total items
- Page numbers with current page highlighted
- Previous/Next navigation buttons
- Disabled state on first/last page buttons
- Shows which items are currently displayed (e.g., "Showing 1-5 of 10")

#### Default Settings
- 5 companies per page
- Automatic page reset when filters change
- Full navigation controls for easy browsing

### Empty States

#### No Results State
Displays when:
- No companies match the current filter criteria
- Search returns no results
- No companies exist in the system

Features:
- Large icon indicating empty state
- Clear message explaining why no results
- "Clear filters" button to reset search
- "Add Company" button suggestion if system is empty

### Loading State

#### Shown When
- Initial page data is loading
- Filters are being applied
- Data is being refreshed

Features:
- Animated loading spinner
- Loading message
- Centered display
- Full-height container

## Data Model

```typescript
interface Company {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  totalRevenue: number
  totalDue: number
  status: 'Active' | 'Inactive' | 'Pending'
  createdAt: string
}
```

## Usage Examples

### Searching for a Company
1. Enter company name, contact name, or email in the search box
2. Results filter automatically as you type
3. Click "Clear" to reset search

### Filtering by Status
1. Click the Status dropdown
2. Select desired status (Active, Inactive, or Pending)
3. Table updates to show only matching companies

### Pagination
1. Use numbered page buttons to jump to specific page
2. Use Previous/Next arrows for sequential browsing
3. Current page is highlighted in blue

### Company Actions
1. Click the three-dot menu in the Actions column
2. Choose desired action:
   - View Details - Opens company profile
   - Edit Company - Opens edit form
   - Delete Company - Confirms deletion

## Design Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on small screens
- Stacked layout for mobile devices
- Full table view on desktop

### Visual Hierarchy
- Clear header with large typography
- Distinct filter card
- Data table with alternating row hover effects
- Action menu for organization

### Color Coding
- Green for positive values (no due amount)
- Amber/Orange for amounts due
- Blue for active status
- Gray for inactive status

### Accessibility
- Semantic HTML with proper table markup
- Keyboard navigation support
- ARIA labels for interactive elements
- High contrast text for readability
- Screen reader friendly

## Performance

### Optimization Features
- Client-side filtering for instant results
- Efficient pagination
- Memoized filter calculations
- No unnecessary re-renders

### Data Handling
- Mock data (10 companies) for demonstration
- Can be replaced with API integration
- Supports real-time data updates
- Ready for database integration

## Integration Points

### Potential Integrations
1. **API Endpoint**: Replace mock data with API calls
   ```
   GET /api/companies
   GET /api/companies?search=...&status=...&page=...
   ```

2. **Database**: Connect to real company data
   - Supabase
   - PostgreSQL
   - MongoDB

3. **Authentication**: Add user-specific company views
   - User permissions
   - Company access control

4. **Export**: Add data export capabilities
   - CSV export
   - PDF reports
   - Excel integration

## Future Enhancements

- [ ] Inline editing for quick updates
- [ ] Bulk actions (select multiple companies)
- [ ] Advanced date range filtering
- [ ] Company performance charts
- [ ] Custom column selection
- [ ] Sort by any column
- [ ] Save filter presets
- [ ] CSV/PDF export
- [ ] Real-time data sync
- [ ] Drag-and-drop column reordering

## File Structure

```
app/companies/
├── page.tsx              # Main page component
└── related components
```

## Key Technologies

- **React**: For UI components and state management
- **shadcn/ui**: For pre-built, accessible components
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Lucide Icons**: For consistent iconography

## Testing Checklist

- [x] Search filters companies correctly
- [x] Status filter works properly
- [x] Pagination displays correct data
- [x] Action menu opens on click
- [x] Clear filters resets all selections
- [x] Mobile responsive design works
- [x] Empty state displays when needed
- [x] Loading state appears on load
- [x] Currency formatting displays correctly
- [x] Status badges show correct colors
