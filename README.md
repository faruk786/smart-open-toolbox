# Smart Open Tools

# Context & Vision

I am building the frontend platform shell for smartopentools.com, a clean, lightning-fast, 100% free multi-tool hub for software engineers (inspired by the minimal design systems of Vercel, Raycast, and Linear).

Monetization is strictly through Google AdSense. There is NO login, NO registration, NO user authentication, and NO subscription or payment tiers. Every tool must be publicly accessible instantly.

# Objective

Build ONLY the layout shell, modular routing, navigation tree, dynamic Light/Dark theme engine, SEO meta tags, and AdSense placeholder containers. Do not write tool business logic or connect external AI APIs in this prompt. Focus entirely on clean, understandable, production-grade architecture.

# 1. Architecture & Directory Structure

Organize the codebase following atomic React conventions:

- `src/components/layout/AppLayout.tsx`: Master layout containing Header, Sidebar, Ad boundaries, and `<Outlet />`.

- `src/components/layout/Header.tsx`: Top navigation with branding, tool search bar, theme toggle, and GitHub icon.

- `src/components/layout/Sidebar.tsx`: Persistent, collapsible left sidebar for tool discovery.

- `src/components/common/AdSlot.tsx`: Reusable ad wrapper with fixed layout boundaries to prevent layout shifts.

- `src/components/common/ThemeToggle.tsx`: Seamless switch between Light Mode and Dark Mode (defaulting to system preference).

- `src/components/common/SEOHead.tsx`: Dynamic document title and meta management via `react-helmet-async`.

- `src/pages/Home.tsx`: Tool discovery directory grid.

- `src/pages/MockData.tsx`: Lazy-loaded placeholder view for `/mock-data`.

# 2. Navigation & Layout Requirements

1. Header:

   - Left: Platform title "SmartOpenTools" with a clean terminal/code icon.

   - Middle: Search input to filter tools in the directory.

   - Right: "Directory" nav link, a Sun/Moon theme toggle button, and an external GitHub icon link.

   - Strictly omit user avatars, sign-in buttons, and pricing/upgrade links.

2. Persistent Left Sidebar:

   - Categorized tool directory:

     * "Generators" -> Active link: "AI Mock Data" (route: `/mock-data`).

     * "Formatters & Parsers" -> 2 placeholder badges (e.g., "JSON Validator", "SQL Beautifier").

     * "Converters" -> 2 placeholder badges (e.g., "CSV to JSON", "Base64").

     * "Security & Web" -> 2 placeholder badges (e.g., "Hash Generator", "JWT Decoder").

   - Bottom of Sidebar: A fixed, isolated Ad slot container (300x250 medium rectangle) styled with clean borders and subtle muted label: "Advertisement".

3. Main Viewport Area:

   - Top of Main Area: A horizontal leaderboard ad container (728x90 desktop, responsive 320x50 mobile) labeled "Advertisement".

   - Content Area: The dynamic viewport where pages render via `<Outlet />`.

   - Footer: Developer footer with copyright, links to "Terms", "Privacy Policy", and a badge reading "100% Free Developer Utilities".

# 3. Routing & Pages (With Lazy Loading)

- Use `React.lazy()` and `Suspense` with a minimal skeleton fallback for route-level code splitting:

  * Route `/`: Renders `Home.tsx` featuring:

    - Hero: "Free, Open Developer Utilities — Zero Signup, Instant Access".

    - Responsive card grid displaying "AI Mock Data Engine" (navigates to `/mock-data`) plus 3 "Coming Soon" tool cards.

  * Route `/mock-data`: Renders `MockData.tsx` with a clean page header: "AI Mock Data Engine" and an "Under Construction (Step 2)" placeholder container.

# 4. SEO & Head Meta Rules

- Install and configure `react-helmet-async`.

- Every page must declare unique meta tags:

  * `/` (Home): Title: "SmartOpenTools — Free, Open Developer Utilities", Description: "Instant access to developer tools with zero signup. Format, generate, and convert data directly in your browser."

  * `/mock-data`: Title: "Free AI Mock Data Generator — SmartOpenTools", Description: "Generate realistic SQL, JSON, and CSV mock data using natural language prompts without complex manual schemas."

- Use semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`). Ensure each route has exactly one `<h1>`.

# 5. Speed, CLS & Design Tokens

- Framework: React (Vite), Tailwind CSS, Lucide React icons, and Shadcn UI primitives.

- Theme: Full support for both Crisp Light Mode and Deep Slate/Zinc Dark Mode (`#09090b` / `#0f172a`).

- Font: Use clean system sans-serif font stack with `font-display: swap`.

- Cumulative Layout Shift (CLS = 0): Ensure `AdSlot.tsx` sets explicit `min-height` and `min-width` so incoming ads will never cause content jumps.

# Guardrails

- DO NOT set up Supabase tables, user accounts, or auth dependencies.

- DO NOT write the AI data generator logic yet. Keep it purely structural and modular.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-open-toolbox.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/abdc92b7-33da-48d6-b0b9-6f96a8ad49b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
