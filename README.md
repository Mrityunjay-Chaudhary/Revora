# REVORA

**Automotive Intelligence Platform**

REVORA helps people find the right vehicle based on real ownership experience, lifestyle fit, and practical insights — not just raw specifications.

---

## Overview

Most automotive platforms show you horsepower figures and feature lists. REVORA approaches the problem differently: it surfaces what ownership actually feels like, what the long-term costs look like, and whether a vehicle genuinely fits your life before you make a six-figure decision.

The platform is built as a premium web application with a focus on clean architecture, reusable components, and a UI that takes design seriously.

This project is actively developed as a portfolio demonstration of frontend engineering at a production-quality standard.

---

## Features

**Discovery**
- Smart vehicle search with real-time filtering
- Filter by category, fuel type, transmission, price range, and seating capacity
- Sorted and paginated car listings

**Vehicle Detail**
- Comprehensive detail pages with specifications, ownership insights, and driving feel
- Pros and cons written from a real ownership perspective
- Safety ratings, maintenance cost analysis, and resale value estimates
- Recommendation scores across six lifestyle use cases
- Who should buy — and who should avoid — each vehicle

**Comparison**
- Side-by-side vehicle comparison across all major attributes
- Visual rating bars for each metric
- Category-by-category winner indicators

**Recommendations**
- Rule-based recommendation engine driven by user lifestyle inputs
- Outputs ranked matches with reasoning per use case

**Saved Vehicles**
- Client-side wishlist with add and remove support
- Persisted within the session via React Context

**General**
- Responsive layout optimised for mobile, tablet, and desktop
- Glassmorphism UI with accent colours per vehicle
- Smooth page and section transitions via Framer Motion
- Sticky section navigation on detail pages
- Dynamic routing with clean URL structure

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Language | JavaScript (ES6+) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| State Management | React Context API |

---

## Screenshots

> Screenshots and preview images will be added once the initial deployment is live.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/revora.git
cd revora
npm install
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
revora/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/                  # Reusable design system components
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── SecondaryButton.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── PriceSlider.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── RatingBar.jsx
│   │   │   └── index.js
│   │   ├── navigation/
│   │   │   └── Navbar.jsx
│   │   └── ScrollToTop.jsx
│   ├── contexts/
│   │   └── AppContext.jsx        # Global state — saved cars, comparison, filters
│   ├── data/
│   │   └── Cars.js              # Vehicle dataset and helper utilities
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Discover.jsx
│   │   ├── CarDetails.jsx
│   │   ├── Comparison.jsx
│   │   ├── Recommendations.jsx
│   │   └── SavedCars.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full development roadmap.

**Currently in progress:** CarDetails page, Comparison page, Recommendation engine.

**Coming next:** Authentication, Firebase integration, ownership cost calculator.

---

## Development Status

This project is under active development. The frontend architecture, design system, and core pages are complete. Backend integration and user account features are planned for the next phase.

The current build runs entirely on client-side mock data. The architecture is structured to make backend integration straightforward.

---

## Contributing

This is a personal project and is not currently open for external contributions. If you have feedback or suggestions, feel free to open an issue.

---

## License

All rights reserved. See [LICENSE](./LICENSE) for terms.

This project is publicly available for portfolio, educational, and demonstration purposes only. Commercial use, redistribution, or derivative works require explicit written permission from the author.

---

## Author

**Mrityunjay Chaudhary**

---

## Acknowledgements

Built with React, Vite, Tailwind CSS, and Framer Motion.

Design influenced by the work of teams at Linear, Vercel, Rivian, and Apple.