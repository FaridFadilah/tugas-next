# Activity Tracker App

A comprehensive personal activity tracking application built with Next.js 15 and TypeScript. Track your daily activities, create journal entries, generate summaries, and manage reminders all in one place.

## Features

### 📝 Journal
- Create daily journal entries with rich content
- Add mood tracking and weather information
- Categorize entries with tags and activities
- Search and filter through your entries
- View detailed entry pages with full content

### 📊 Summary
- Weekly, monthly, quarterly, and yearly activity summaries
- Visual charts and statistics of your productivity
- Mood distribution analysis
- Top activities tracking
- Export functionality for reports

### ⏰ Reminder
- Create and manage reminders with flexible scheduling
- Set priority levels (High, Medium, Low)
- Recurring reminders (Daily, Weekly, Monthly, Yearly)
- Multiple notification types (Browser, Email, Sound)
- Advanced notice settings

### 🏠 Dashboard
- Overview of all your activities
- Quick action buttons for common tasks
- Recent activity feed
- Key statistics at a glance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Font**: Geist Sans & Geist Mono

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
app/
├── components/          # Reusable components
│   └── Sidebar.tsx     # Navigation sidebar
├── journal/            # Journal feature pages
│   ├── [id]/          # Dynamic journal entry pages
│   ├── new/           # Create new journal entry
│   └── page.tsx       # Journal listing page
├── reminder/           # Reminder feature pages
│   ├── new/           # Create new reminder
│   └── page.tsx       # Reminder listing page
├── summary/            # Summary and analytics pages
│   └── page.tsx       # Summary dashboard
├── globals.css        # Global styles
├── layout.tsx         # Root layout with sidebar
├── page.tsx          # Dashboard/home page
├── loading.tsx       # Global loading component
├── error.tsx         # Global error boundary
└── not-found.tsx     # 404 page
```

## Features Overview

### Dashboard
- Statistics cards showing key metrics
- Quick action buttons for creating new content
- Recent activity overview
- Clean, modern interface

### Journal Management
- Create rich journal entries with title, content, and metadata
- Mood tracking with visual indicators
- Weather and location information
- Tag system for organization
- Search and filter capabilities

### Summary Analytics
- Time-based filtering (week, month, quarter, year)
- Activity breakdowns and statistics
- Mood distribution charts
- Export functionality

### Reminder System
- Flexible scheduling options
- Priority levels with visual indicators
- Recurring reminder support
- Multiple notification methods
- Category organization

## Customization

The app uses Tailwind CSS for styling, making it easy to customize the appearance. Key areas for customization:

- Color scheme in `tailwind.config.js`
- Layout and spacing in component files
- Icon choices from Lucide React library

## Development

To add new features:

1. Create new pages in the appropriate directories
2. Add navigation items to `Sidebar.tsx`
3. Implement data management (currently using mock data)
4. Add appropriate TypeScript types
5. Style with Tailwind CSS classes

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
