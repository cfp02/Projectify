# Projectify

## Project Overview
Projectify is a comprehensive project management and portfolio platform designed to help developers track, document, and showcase their projects. It features voice input capabilities, AI-powered project analysis, and seamless project state tracking to help developers easily resume work on projects after breaks. The platform centers around project READMEs as living documents, whether from GitHub repositories or stored locally, while maintaining flexibility in format and structure.

## 🚨 Progress Tracking Instructions
<details>
<summary>Click to expand progress tracking guidelines</summary>

**IMPORTANT**: This README serves as a living document of project progress. To maintain its effectiveness:
1. Update this document with EVERY meaningful change or work session
2. Add entries in the Progress Log section below with:
   - Date
   - Phase/Component worked on
   - Brief description of changes
   - Any notable challenges or decisions
3. Mark completed items in the project phases with ✅
4. Update the "Current Focus" section
5. Add any new requirements or ideas to the "Future Considerations" section

### README Template Structure
Each project README should maintain this structure to ensure Cursor compatibility and consistent project management:

```markdown
# Project Name

## 🚨 Project Management Instructions
<details>
<summary>Click to expand project management guidelines</summary>

**IMPORTANT**: This README is a living document managed by Projectify and Cursor.
To maintain compatibility and effectiveness:
1. Do not modify the structure of special sections (marked with 🚨)
2. Keep all Cursor-specific metadata intact
3. Update the Progress Log with every significant change
4. Use the provided section templates for new content
5. Maintain the established heading hierarchy
</details>

## Current Focus
- [ ] Current phase/milestone
- [ ] Active tasks/features
- [ ] Immediate next steps

## Progress Log
<details>
<summary>View complete progress history</summary>

### YYYY-MM-DD (Latest)
- Phase: [Current Phase]
- Work completed:
  - [List of completed items]
- Next steps:
  - [List of next steps]
- Notes/Challenges:
  - [Any notable points]
</details>

[... Rest of project-specific content ...]
```

This structure ensures:
- Cursor can properly parse and manage the document
- Project history is consistently tracked
- Progress is visible and well-documented
- Templates can be automatically generated
- GitHub integration remains smooth
</details>

## Current Focus
- [✅] Phase 1: Core Web Application Foundation
  - [✅] Initial project setup
  - [✅] Basic database schema design
  - [✅] Authentication system
  - [✅] GitHub README integration
  - [ ] Project section management (Next)

## Progress Log
<details>
<summary>View complete progress history</summary>

### 2024-03-19 (Latest)
- Phase: Phase 1 - Core Web Application Foundation
- Work completed:
  - Implemented GitHub README integration:
    - Added support for fetching READMEs from GitHub repositories
    - Implemented base64 decoding for GitHub content
    - Added multiple README filename support (README.md, Readme.md, etc.)
    - Enhanced error logging and debugging
  - Fixed README display issues:
    - Added detailed logging in README fetch endpoint
    - Improved error handling and response formatting
    - Fixed content type handling for GitHub responses
  - Enhanced database integration:
    - Successfully saving GitHub READMEs to database
    - Proper version tracking implementation
    - Activity logging for README updates
- Next steps:
  - Implement project section management
  - Add resource upload capabilities
  - Enhance version comparison features
- Notes/Challenges:
  - Successfully resolved GitHub README fetching and display
  - Improved error logging for better debugging
  - Added support for multiple README filename formats
  - Fixed content encoding/decoding issues

### 2025-01-29 (Latest)
- Phase: Phase 1 - Core Web Application Foundation
- Work completed:
  - Enhanced README management system:
    - Added structured README template with project management guidelines
    - Implemented version history with commit messages
    - Added special markers (🚨) for Cursor-critical sections
    - Created detailed progress tracking format
    - Fixed version restore functionality
  - Improved error handling in README API endpoints
  - Standardized API response formats
  - Fixed build issues related to README versioning
- Next steps:
  - Implement project section management
  - Add resource upload capabilities
  - Enhance version comparison features
- Notes/Challenges:
  - Successfully implemented database transactions for version restoration
  - Added activity tracking for version-related actions
  - Improved error handling and response consistency
  - Fixed TypeScript issues with README version model

### 2025-01-28 (Evening)
- Phase: Phase 1 - Core Web Application Foundation
- Work completed:
  - Implemented Project creation form with theme-aware styling
  - Added form validation and error handling
  - Improved UI/UX with consistent theme colors
  - Fixed client-side navigation and auth checks
  - Enhanced form fields with proper contrast and accessibility
- Next steps:
  - Implement project editing
  - Add project deletion confirmation
  - Enhance error messaging
- Notes/Challenges:
  - Resolved theme inconsistency in form fields
  - Improved form field contrast for better readability
  - Successfully integrated client-side form validation

### 2025-01-28 (Morning)
- Phase: Phase 1 - Core Web Application Foundation
- Work completed:
  - Set up complete development environment with Docker
  - Implemented Next.js 14 with TypeScript and Tailwind
  - Created Prisma schema with all models
  - Set up authentication with NextAuth.js (GitHub & Google)
  - Added PostgreSQL database with Prisma
- Next steps:
  - Implement project CRUD operations
  - Create project dashboard
  - Add project detail views
- Notes/Challenges:
  - Authentication system is ready for testing with GitHub and Google
  - Database schema includes all core models: User, Project, Section, Resource, Tag, Activity
  - Docker environment is fully configured for development
</details>

## Development Guide
<details>
<summary>Quick Start Guide</summary>

### Dependencies
The project uses several key packages:

#### Core Dependencies
```json
{
  "@auth/prisma-adapter": "^2.7.4",
  "@octokit/rest": "^21.1.0",
  "@octokit/types": "^13.7.0",
  "@prisma/client": "^5.10.2",
  "@tailwindcss/forms": "^0.5.7",
  "@tailwindcss/typography": "^0.5.10",
  "next": "14.1.3",
  "next-auth": "^4.24.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-markdown": "^9.0.3"
}
```

#### Development Dependencies
```json
{
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^14.2.1",
  "@types/jest": "^29.5.12",
  "@types/node": "^20.11.25",
  "@types/react": "^18.2.64",
  "@types/react-dom": "^18.2.21",
  "autoprefixer": "^10.4.18",
  "eslint": "^8.57.0",
  "eslint-config-next": "14.1.3",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "postcss": "^8.4.35",
  "prisma": "^5.10.2",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.4.2"
}
```

#### Key Features Enabled by Dependencies
- **@octokit/rest & @octokit/types**: GitHub API integration for repository linking and README synchronization
- **@auth/prisma-adapter & next-auth**: Authentication system with GitHub and Google sign-in
- **@prisma/client & prisma**: Database ORM for PostgreSQL
- **@tailwindcss packages**: Styling and form handling
- **react-markdown**: README rendering and editing
- **Testing packages**: Complete testing setup with Jest and React Testing Library

### Quick Start (After Initial Setup)
If you've already set up the project and are returning to development:

1. Start the containers:
   ```bash
   docker compose up
   ```

2. Verify services are running:
   ```bash
   docker compose ps
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Try signing in with GitHub or Google

4. If you need to rebuild (after dependency changes or code updates):
   ```bash
   docker compose down
   docker compose up --build
   ```

### ⚠️ Important Development Workflow
**ALWAYS USE DOCKER FOR DEVELOPMENT**
1. The application is containerized and should ALWAYS be run using Docker Compose
2. Do NOT run `npm run dev` locally, as this may conflict with the Docker container
3. After making code changes:
   ```bash
   # Stop all containers
   docker compose down

   # Rebuild and start containers with new changes
   docker compose up --build
   ```
4. Common issues and solutions:
   - If you see "Port 3000 is in use": Make sure to stop any local development servers
   - If changes aren't appearing: Ensure you've rebuilt the containers with `docker compose up --build`
   - If database issues occur: Check if the database container is running with `docker compose ps`
</details>

## Project Status & Features
<details>
<summary>Current Status</summary>

### Project Status
- ✅ Development environment
- ✅ Database schema
- ✅ Authentication system
- ✅ Theme system with multiple themes
- ✅ CI/CD Pipeline
- ✅ Project creation form
- ✅ Project editing and deletion
- ✅ Layout system with TopBar and Sidebar
- ✅ User profile and preferences
- 🚧 Project section management (In Progress)
- 🚧 Resource management (In Progress)
</details>

<details>
<summary>Feature Details</summary>

### Features
1. **Authentication**
   - Google and GitHub sign-in
   - Secure session management
   - Protected routes

2. **Theme System**
   - Multiple built-in themes:
     - Tokyo Night (Cool blue/purple theme)
     - Cyberpunk (Vibrant pink/cyan theme)
     - Emerald Sea (Modern green/cyan theme)
   - Theme persistence across sessions
   - Easy theme switching via dropdown
   - Consistent styling across all pages
   - Gradient text and hover effects

3. **Project Management**
   - Create and edit projects with:
     - Title and subtitle
     - Detailed description
     - Dynamic tag management
     - Real-time form validation
     - Theme-aware styling
     - Responsive design
   - Project navigation:
     - Sidebar with recent projects list
     - Quick project switching
     - Back navigation
   - Activity tracking
   - Resource management
   - Section organization

4. **Layout System**
   - Persistent top navigation bar with:
     - Project logo and branding
     - Main navigation links
     - User profile access
     - Theme switching
   - Project sidebar featuring:
     - List of recent projects
     - Current project highlighted
     - Quick project switching
     - Responsive design
   - Proper spacing and positioning:
     - Fixed header
     - Scrollable content areas
     - Consistent padding and margins
     - Theme-aware borders and shadows

5. **User Profile**
   - Dedicated profile page with:
     - User information display
     - Avatar from auth provider
     - Centralized theme preference management
     - Account settings
   - Quick access from top bar
   - Protected routes with auth checks
   - Smooth navigation
   - Theme-aware styling

6. **Theme System**
   - Multiple built-in themes:
     - Tokyo Night (Cool blue/purple theme)
     - Cyberpunk (Vibrant pink/cyan theme)
     - Emerald Sea (Modern green/cyan theme)
   - Theme management:
     - Centralized in profile settings only
     - Real-time preview
     - Persistent across sessions
   - Consistent styling:
     - Component-level theming
     - Proper contrast ratios
     - Hover and active states
     - Status indicators

7. **Version Control System**
   - Project version tracking:
     - Create snapshots with descriptions
     - View version history
     - Restore previous versions
   - Activity tracking:
     - Version creation events
     - Version restoration events
   - Complete state preservation:
     - Project metadata
     - Sections and resources
     - Tags and status
   - User-friendly interface:
     - Version timeline view
     - Restore confirmation
     - Version descriptions

8. **Project section management**
   - Add functionality to manage project sections
   - Implement section creation, editing, and deletion
   - Ensure sections are linked to projects

9. **Resource management**
   - Add functionality to manage project resources
   - Implement resource upload, editing, and deletion
   - Ensure resources are linked to projects and sections

10. **README-Centric Project Management**
    - Core project documentation:
      - Dedicated README display and editing section
      - Support for both GitHub-synced and local READMEs
      - Format-agnostic approach for flexibility
      - Cursor-compatible structure
    - Standardized Template:
      - Required sections for Cursor compatibility
      - Project management metadata
      - Progress tracking structure
      - Special section markers
    - Integration features:
      - Two-way GitHub README sync
      - Repository creation with README template
      - Project import with README parsing
    - Auxiliary information:
      - Project tags and categorization
      - Subtitle and quick description
      - Status and progress tracking
      - Resource linking
    - Development workflow:
      - Cursor-compatible README editing
      - Local development support
      - GitHub integration optional but supported
      - Version control for README changes
</details>

## Technical Documentation
<details>
<summary>Testing Setup</summary>

### Test Dependencies
```json
{
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^14.2.1",
  "@types/jest": "^29.5.12",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

### Configuration Files
- `jest.config.mjs`: Configures Jest with Next.js
- `tsconfig.test.json`: TypeScript configuration for test files
- `jest.setup.js`: Sets up testing environment

### Running Tests
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests
Tests are co-located with their components using the `.test.tsx` extension. Example:
```typescript
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { YourComponent } from './YourComponent'

describe('YourComponent', () => {
  it('renders expected content', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```
</details>

<details>
<summary>CI/CD Pipeline</summary>

### Continuous Integration (CI)
On every push and pull request to `main`:
1. Installs dependencies
2. Runs TypeScript type checking
3. Runs ESLint
4. Executes Jest tests
5. Builds the application

### Continuous Deployment (CD)
On version tags (e.g., `v1.0.0`):
1. Runs all CI checks
2. Builds Docker container
3. Deploys to production (if all checks pass)

### Release Process
1. Create a new version tag:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

2. The CD pipeline will automatically:
   - Build and test the application
   - Deploy to production if all checks pass

Version format: `vMAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes
</details>

## Project Roadmap
<details>
<summary>View complete project phases</summary>

### Phase 1: Core Web Application Foundation
1. Basic Setup
   - [✅] React/Next.js frontend
   - [✅] Database setup (PostgreSQL)
   - [✅] User authentication system
   - [✅] Basic project CRUD operations

2. Project Data Structure Implementation
   - [✅] Project model with core fields
   - [✅] Project versioning system
   - [ ] README-centric project management:
     - Large, dedicated README section in project view
     - Support for both GitHub-synced and local READMEs
     - Format-agnostic README display and editing
     - Cursor-compatible README structure
     - Auxiliary project metadata (tags, subtitle, etc.)

3. Project-GitHub Integration
   - [ ] GitHub repository linking
   - [ ] Two-way README synchronization
   - [ ] Repository creation from Projectify
   - [ ] Project import from existing repositories
   - [ ] Maintain Cursor compatibility for READMEs

### Phase 2: Input Methods & Content Management
1. Text Input System
   - [ ] Rich text editor integration
   - [ ] Markdown support
   - [ ] Link management system
   - [ ] File upload system
   - [ ] Image handling and storage

2. Voice Input System
   - [ ] Browser-based voice recording
   - [ ] Speech-to-text integration
   - [ ] Voice note storage
   - [ ] Transcription processing
   - [ ] Voice command system

### Phase 3: AI Integration
1. Project Analysis Features
   - [ ] OpenAI/LLM API integration
   - [ ] Automatic summary generation
   - [ ] Project status analysis
   - [ ] "How to resume" recommendations
   - [ ] Progress tracking analysis

2. Content Enhancement
   - [ ] AI-generated titles and subtitles
   - [ ] Project phase suggestions
   - [ ] Next steps recommendations
   - [ ] Tag suggestions
   - [ ] SEO optimization suggestions

### Phase 4: Portfolio Generation
1. Public Portfolio Features
   - [ ] Public project page templates
   - [ ] Custom domain support
   - [ ] SEO optimization
   - [ ] Portfolio analytics
   - [ ] Project showcase features

2. Content Publishing System
   - [ ] Draft/Published state management
   - [ ] Public/Private toggle
   - [ ] Version control for public content
   - [ ] Custom styling options
   - [ ] Social sharing integration

### Phase 5: Browser Integration
1. Tab Management
   - [ ] Browser extension development
   - [ ] Tab state saving
   - [ ] Tab organization by project
   - [ ] Quick save functionality
   - [ ] Tab restoration system

### Phase 6: External Device Integration
1. Mobile App Development
   - [ ] React Native or Flutter app
   - [ ] Voice recording capability
   - [ ] Photo/video capture
   - [ ] Quick note taking
   - [ ] Project sync

2. Arduino Device Integration
   - [ ] Hardware design & prototyping
   - [ ] Firmware development
   - [ ] BLE communication protocol
   - [ ] Voice recording capability
   - [ ] Data sync protocol
   - [ ] Battery management

### Phase 7: Advanced Features
1. Analytics & Insights
   - [ ] Project time tracking
   - [ ] Progress visualization
   - [ ] Activity patterns
   - [ ] Productivity analytics
   - [ ] Resource usage tracking

2. Collaboration Features (Optional)
   - [ ] Shared projects
   - [ ] Comment system
   - [ ] Version control
   - [ ] Role management
   - [ ] Activity feed

### Phase 8: GitHub Integration & Project Templates
1. Repository Management
   - [ ] GitHub OAuth integration for repository access
   - [ ] Repository creation from Projectify
   - [ ] README.md template system
   - [ ] Two-way sync for project updates
   - [ ] Branch and commit management

2. Template System
   - [ ] Canonical README structure definition
   - [ ] Project phase templates
   - [ ] Progress tracking templates
   - [ ] Development workflow templates
   - [ ] Cursor-compatible documentation format

3. Automation Features
   - [ ] Automated repository setup
   - [ ] README generation with project structure
   - [ ] Development environment configuration
   - [ ] CI/CD template generation
   - [ ] Project board integration

4. Integration Features
   - [ ] GitHub issue tracking
   - [ ] Pull request management
   - [ ] Commit history visualization
   - [ ] Branch strategy templates
   - [ ] GitHub Actions integration
</details>

## Setup & Configuration
<details>
<summary>Complete setup instructions</summary>

### Prerequisites
- Docker and Docker Compose installed on your machine
- Git for version control
- Node.js and npm (for local development)
- A code editor (VS Code, Cursor, etc.)

### Initial Project Setup
1. Create and navigate to project directory
   ```bash
   mkdir projectify
   cd projectify
   ```

2. Initialize Git repository
   ```bash
   git init
   ```

3. Create the following configuration files:

   a. Create `package.json`:
   ```json
   {
     "name": "projectify",
     "version": "0.1.0",
     "private": true,
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "type-check": "tsc --noEmit"
     },
     "dependencies": {
       "next": "14.1.3",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "@prisma/client": "^5.10.2",
       "next-auth": "^4.24.7",
       "@tailwindcss/forms": "^0.5.7",
       "@tailwindcss/typography": "^0.5.10"
     },
     "devDependencies": {
       "@types/node": "^20.11.25",
       "@types/react": "^18.2.64",
       "@types/react-dom": "^18.2.21",
       "autoprefixer": "^10.4.18",
       "eslint": "^8.57.0",
       "eslint-config-next": "14.1.3",
       "postcss": "^8.4.35",
       "prisma": "^5.10.2",
       "tailwindcss": "^3.4.1",
       "typescript": "^5.4.2"
     }
   }
   ```

   b. Create `Dockerfile`:
   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   # Install dependencies for development
   RUN apk add --no-cache \
       python3 \
       make \
       g++ \
       git

   # Install dependencies only when needed
   COPY package*.json ./
   RUN npm install
   RUN npm install -D @types/node @types/react @types/react-dom

   # Copy the rest of the application
   COPY . .

   # Expose the port the app runs on
   EXPOSE 3000

   # Start the application
   CMD ["npm", "run", "dev"]
   ```

   c. Create `docker-compose.yml`:
   ```yaml
   version: '3.8'

   services:
     web:
       build: .
       ports:
         - "3000:3000"
       volumes:
         - .:/app
         - /app/node_modules
       environment:
         - NODE_ENV=development
       command: npm run dev
       depends_on:
         - db

     db:
       image: postgres:16-alpine
       ports:
         - "5432:5432"
       environment:
         POSTGRES_USER: projectify
         POSTGRES_PASSWORD: projectify_dev
         POSTGRES_DB: projectify_dev
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

   d. Create `.env`:
   ```env
   DATABASE_URL="postgresql://projectify:projectify_dev@db:5432/projectify_dev"
   NEXTAUTH_SECRET="development-secret-key-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Create Next.js app structure:
   ```bash
   mkdir -p src/app
   ```

5. Create the following files:

   a. `src/app/layout.tsx`:
   ```tsx
   import type { Metadata } from 'next';
   import { Inter } from 'next/font/google';
   import './globals.css';

   const inter = Inter({ subsets: ['latin'] });

   export const metadata: Metadata = {
     title: 'Projectify',
     description: 'Project Management and Portfolio Platform',
   };

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body className={inter.className}>{children}</body>
       </html>
     );
   }
   ```

   b. `src/app/page.tsx`:
   ```tsx
   import React from 'react';

   export default function Home() {
     return (
       <main className="flex min-h-screen flex-col items-center justify-between p-24">
         <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
           <h1 className="text-4xl font-bold mb-8">Welcome to Projectify</h1>
           <p className="text-xl mb-4">
             Your personal project management and portfolio platform
           </p>
         </div>
       </main>
     );
   }
   ```

   c. `src/app/globals.css`:
   ```