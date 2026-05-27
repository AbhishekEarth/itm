# Changelog - abhishek Branch Optimizations & Polishes

This changelog summarizes all visual, performance, accessibility, and repository cleanliness changes completed on the `abhishek` branch in a concise, one-line format.

## Repository & Dependency Cleanups
- **node_modules Untracking:** Ignored and completely removed the massive committed `node_modules/` folder from Git tracking (reducing repo size while preserving local builds).
- **backend/.venv Untracking:** Excluded the heavy Python virtual environment `.venv/` directory from Git tracking to ensure lightweight commits.
- **Duplicate Assets Deletion:** Deleted duplicate loose files `30 years.png` and `WhatsApp Image 2026-05-21 at 12.39.59 PM.jpeg` from the repository root.

## Performance & Image Optimizations
- **LazyImage Helper:** Created a high-performance, intersection-observer-driven `<LazyImage />` component with custom shimmer skeleton placeholders.
- **Branding Logos Migration:** Transformed `Header.jsx` branding graphics to local optimized WebP logos (`ITMGOILogo.webp`, `NAACLogo.webp`).
- **Partner Logos Transition:** Migrated over 70 partner marquee recruiter logos in `RecruiterMarquee.jsx` and `TapPage.jsx` to lightweight `.webp` formats.
- **Visual Page Assets Polish:** Upgraded image source assets in `PACPage.jsx` and `CentralLibrary.jsx` to load optimized local WebP assets.
- **Static Assets Refactoring:** Excluded binary images from Git pushes to bypass remote RPC curls while preserving local asset loading.

## Layout & Dropdown Alignment Fixes
- **Stack Layering Bug:** Increased the header wrapper layer index to `z-[200]` to guarantee dropdown panels float above the floating sidebar widgets.
- **Dropdown Bounds Realignment:** Added responsive alignment rules (`left-0` for left links, `right-0` for right links) to stop dropdowns from clipping.
- **Spacing Grid Harmonization:** Standardized padding wrappers (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) consistently across all 13 sections.

## WCAG Accessibility & Premium Detailing
- **Dark Mode Gradient Contrast:** Added Glowing Golden-Rose gradients (`dark:from-rose-400 dark:to-amber-200`) to low-contrast headings.
- **Stats Gradient Polish:** Polished the outcomes heading in `Stats.jsx` with highly visible glowing typography in dark mode.
- **Director Message Contrast:** Upgraded the director vision heading in `DirectorVision.jsx` to be WCAG-compliant in dark mode.
- **Academic Specialties Contrast:** Redesigned heading typography inside `Departments.jsx` to support high-contrast glowing elements.
- **Pillars Timeline Contrast:** Enhanced heading contrast ratios in `Distinctiveness.jsx` to maintain perfect dark mode visibility.
- **Alumni Network Contrast:** Polished header and numeric success counter gradients in `HomeExtras.jsx` (Alumni Section).
- **Student Life Contrast:** Redesigned student life heading span gradient inside `ClubsCells.jsx` for readability.
- **Carousel success Contrast:** Upgraded headings in `Testimonials.jsx` to be accessible and glowing in dark mode.
- **Bento Experience Contrast:** Enhanced text span gradients inside `CampusLife.jsx` to adapt to dark background modes.
- **Upcoming Events Contrast:** Polished the event header text gradient inside `HomeExtras.jsx` (Events Section).
- **Category Labels Contrast:** Upgraded category tags (e.g. "Lifestyle", "Student Life", "Alumni Success") to use soft readable rose-300 in dark mode.

## Micro-Animations & Depth Transitions
- **Theme Snapping Smoothness:** Applied 500ms ease transition fades to eliminate snapping during theme switches.
- **Cards Bezier Scaling:** Polished hover scales on grid cards with smooth cubic bezier curves (`hover:-translate-y-2 hover:scale-[1.01]`).
- **Cards Glow Shadows:** Integrated ambient color-glowing drop shadows (`dark:hover:shadow-rose-950/20`) on card hover states.
- **Sidebar Action Feedback:** Implemented premium interactive scales (`active:scale-95`) on floating action sidebar widgets.
