# Systems Architecture & Documentation

## Overview
MoodBoard AI utilizes a full-stack Next.js architecture leveraging the App Router. The ecosystem fundamentally connects frontend React components with server-rendered logic that securely communicates with third-party generative AI models, image databases, and persistent data storage layers.

## 🏗️ Architecture

### 1. The Presentation Layer (Frontend)
The frontend is built on **React** combined with **Next.js 14**. It predominantly utilizes Client Components for interactive states (e.g., loading animations, prompt states) while heavily relying on Server Components where advantageous.
- **Styling Strategy**: Tailwind CSS acts as the atomic styling utility, avoiding the overhead of external CSS frameworks while enabling complex layout implementations and fluid native Dark Mode scaling.
- **State Management**: Context-based UI overrides (Providers) are utilized globally for user session monitoring (NextAuth) and theme observation. Form state and API lifecycle handlers are deeply localized within their specific functional domains.

### 2. The Application Layer (Backend / API)
The backend leverages Next.js API Routes operating on a Node.js edge-like runtime logic. 
- **Endpoint Structure**: Routes like `/api/generate` and `/api/boards` handle synchronous and asynchronous requests respectively.
- **Parallel Processing**: Upon receiving a generative prompt, the application performs a dual-layered execution:
  1. It asynchronously queries the **OpenAI API** for semantic outputs (JSON structuring covering color hex-codes, font pairings, and thematic tags).
  2. Simultaneously queries **Unsplash API** using conceptual tagging to fetch environmental representations.
- Both data pipelines are awaited, merged, and structurally validated before yielding the consolidated object to the frontend state hook. 

### 3. The Data Persistence Layer
We store all user relationships and board metadata functionally within a **MongoDB cluster** utilizing `mongoose` as the ODM.
- **User Schema**: Validates standard NextAuth OAuth token returns.
- **Board Schema**: Manages deeply nested data arrays (colors, fonts, keywords, and un-hotlinked reference URLs) assigned to respective `User` records through referenced ObjectIds.

## 🔐 Authentication & Flow
We integrated **NextAuth.js** using `GoogleProvider`. 
1. **Initiation**: The application fires OAuth consent workflows managed natively by Google.
2. **Execution**: Callbacks intercept user details to instantiate session cookies with a unique `jwe` (JSON Web Encryption).
3. **Persistance**: NextAuth communicates directly to MongoDB to execute Upsert operations for logging newly identified users versus existing ones. Session context blocks unauthenticated POST requests organically at the Route Handler levels.

## 📁 Core Directory Structure

- **/app**: Contains main page structures `/app/page.jsx`, public board pages `/app/board/[id]/page.jsx`, user dashboard `/app/dashboard/page.jsx`, layouts, global styles, and Next.js backend API routes.
- **/components**: Segregation for stateless UI (ColorSwatch, FontPreview, BoardCard) and complex stateful composites (MoodBoard, Navbar, SplashScreens).
- **/lib**: Functional logic decoupling. Mongoose entity configurations `models/Board.js` & `models/User.js`, database initialization workflows, and singleton instances avoiding HMR duplicates.
- **/public**: Maintains static asset declarations and user-facing screenshots.

## ⚙️ Development Workflows
All commits should ensure environment keys exist and schemas are mutually compatible with the Mongoose ODM expectations. Vercel automatically ingests the main branch for Continuous Deployment (CI/CD) pipelines with strict environment variable injections acting post-compilation.
