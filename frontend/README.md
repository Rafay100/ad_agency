# CampaignPro - SaaS Analytics Dashboard

A modern, production-ready campaign management dashboard built with React 18, Tailwind CSS, and Recharts.

## Features

- **KPI Cards**: Impressions, Clicks, CTR, Conversions, Spend, ROAS with trend indicators
- **Interactive Charts**: Line chart for performance trends, bar chart for channel comparison
- **Campaign Table**: Sortable columns, filter by platform/status, search, pagination
- **Dark Mode**: Toggle with localStorage persistence
- **Fully Responsive**: Optimized for 1440px, 1024px, 768px, and mobile

## Tech Stack

- React 18 + Vite
- Tailwind CSS (dark mode with `class` strategy)
- Recharts for data visualization
- React Router for navigation
- TanStack Query for data fetching
- Mock data from JSON

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/src/
├── components/
│   ├── charts/
│   │   ├── PerformanceChart.jsx    # Line chart with metric toggling
│   │   └── ChannelChart.jsx        # Bar chart for spend vs revenue
│   ├── dashboard/
│   │   ├── StatCard.jsx            # KPI card with trend indicator
│   │   └── CampaignTable.jsx       # Sortable, filterable table
│   ├── icons/
│   │   └── index.jsx               # Icon exports
│   ├── layout/
│   │   ├── DashboardLayout.jsx     # Main layout wrapper
│   │   ├── Sidebar.jsx             # Responsive sidebar nav
│   │   └── Header.jsx              # Top bar with search + dark toggle
│   └── ui/
│       ├── Card.jsx                # Card primitives
│       ├── DateRangePicker.jsx     # Date range dropdown
│       └── StatusBadge.jsx         # Status badge with dot
├── context/
│   └── DarkModeContext.jsx         # Dark mode state + localStorage
├── data/
│   └── mockData.json               # Mock campaign data
├── lib/
│   └── utils.js                    # Formatting utilities
├── pages/
│   ├── Dashboard.jsx               # Main dashboard view
│   ├── Campaigns.jsx               # Campaigns list page
│   ├── Analytics.jsx               # Analytics deep-dive
│   ├── Settings.jsx                # Settings placeholder
│   └── NotFound.jsx                # 404 page
├── App.jsx
├── main.jsx
└── index.css                       # Tailwind + dark mode variables
```

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `sm` (640px) | Mobile landscape |
| `md` (768px) | Tablets |
| `lg` (1024px) | Small laptops |
| `xl` (1280px) | Desktops |
| `2xl` (1536px) | Large monitors |

## Dark Mode

Toggle via header button. Preference stored in `localStorage` as `darkMode`. Respects `prefers-color-scheme` on first visit.

## Mock Data

All data comes from `src/data/mockData.json` with 30 days of daily performance, 5 channels, and 12 campaigns across multiple platforms and statuses.
