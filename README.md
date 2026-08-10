# Mohit Arora Portfolio

A data-driven portfolio built with Next.js, React, Tailwind CSS, Framer Motion, and Material UI icons.

Instead of a traditional portfolio layout, this project presents the same portfolio data through familiar daily-use app interfaces. The home page acts like an animated Chrome new tab page, and each clone turns Firebase portfolio data into a different product-style experience.

## Concept

The goal of this portfolio is to showcase frontend skill through recognizable UI systems:

- Chrome-style home page as the main launchpad
- YouTube-style project and experience browsing
- WhatsApp-style portfolio conversations
- Spotify-style skill playlists and project albums
- LinkedIn-style professional feed
- Google Meet-style portfolio presentation room

All of these views are powered by the same structured Firebase portfolio data.

## Routes

| Route | Experience |
| --- | --- |
| `/` | Animated Chrome-inspired home page with app shortcuts |
| `/youtube` | Portfolio videos, synced filters, channel header, search |
| `/whatsapp` | Chat-based portfolio sections with clickable links |
| `/spotify` | Projects, experience, and skills as playlists/albums |
| `/linkedin` | Professional feed with filters and expandable details |
| `/gmeet` | Portfolio presentation room with people, chat, and details panels |

## Data Source

The portfolio content lives in Firebase Realtime Database and is loaded by:

```txt
src/services/firebasePortfolio.ts
```

It contains:

- Profile metadata
- Social links
- Skills grouped by category
- Experience
- Projects
- Open source contributions
- Education
- Achievements

The shared data cache and helper API live in:

```txt
src/services/portfolioData.ts
```

Firebase data is mandatory. If the Firebase request fails or returns empty data, the app fails loudly instead of falling back to local content.

## Project Structure

```txt
src/
  app/
    page.tsx
    youtube/
    whatsapp/
    spotify/
    linkedin/
    gmeet/
    components/
      youtube/
      whatsapp/
      spotify/
      linkedin/
      gmeet/
  services/
    firebasePortfolio.ts
    portfolioData.ts
```

Each clone has its own mapper/component layer so the same Firebase payload can be reshaped into the UI language of that app.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Material UI Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Customizing Portfolio Data

Update the Firebase Realtime Database portfolio payload to change the portfolio content.

Examples:

- Add a new project in `projects`
- Add a new role in `experience`
- Add skills under `skills`
- Update social links in `meta.links`
- Add achievements in `achievements`

The app clones will automatically render updated data through their own UI patterns.

## Data Flow

```txt
Firebase Realtime Database -> fetchPortfolioDataFromFirebase() -> portfolioDataService.get()
```

The UI components should continue consuming service helpers instead of importing data directly.

## Purpose

This project is meant to demonstrate:

- Component composition
- State-driven UI
- Responsive layouts
- Data mapping
- Complex cloned interfaces
- Interactive search/filter systems
- Motion and polished frontend details

It is both a portfolio and a proof of frontend implementation ability.
