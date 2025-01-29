# Projectify

## Project Overview
Projectify is a comprehensive project management and portfolio platform designed to help developers track, document, and showcase their projects. It features voice input capabilities, AI-powered project analysis, and seamless project state tracking to help developers easily resume work on projects after breaks.

## 🚨 Progress Tracking Instructions
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

## Current Focus
- [✅] Phase 1: Core Web Application Foundation
  - [✅] Initial project setup
  - [✅] Basic database schema design
  - [✅] Authentication system
  - [ ] Project CRUD operations (Next)

## Progress Log
### 2024-03-26 (Latest)
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

### Project Status
- ✅ Development environment
- ✅ Database schema
- ✅ Authentication system
- ✅ Theme system with multiple themes
- ✅ CI/CD Pipeline
- 🚧 Project management features (In Progress)

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
   - Create and edit projects
   - Tag system
   - Activity tracking
   - Resource management
   - Section organization

### CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

1. **Continuous Integration (CI)**
   - Runs on every push and pull request to `main`
   - Automated checks:
     - TypeScript type checking
     - ESLint code linting
     - Database migrations
     - (Future) Unit and integration tests

2. **Continuous Deployment (CD)**
   - Triggers on version tags (e.g., v1.0.0)
   - Automated process:
     - Builds the application
     - Runs all tests
     - Deploys to production
     - Manages environment variables

3. **Release Process**
   Each project phase corresponds to a major version:
   - Phase 1 (v1.x.x): Core Web Application
   - Phase 2 (v2.x.x): Input Methods & Content
   - Phase 3 (v3.x.x): AI Integration
   - Phase 4 (v4.x.x): Portfolio Generation
   - Phase 5 (v5.x.x): Browser Integration
   - Phase 6 (v6.x.x): External Device Integration
   - Phase 7 (v7.x.x): Advanced Features

   Version format: `vMAJOR.MINOR.PATCH`
   - MAJOR: Breaking changes (new phases)
   - MINOR: New features
   - PATCH: Bug fixes and small improvements

4. **Creating a Release**
   ```bash
   # Tag a new version
   git tag -a v1.0.0 -m "Phase 1: Core Web Application"
   
   # Push the tag to trigger deployment
   git push origin v1.0.0
   ```

## Project Phases

### Phase 1: Core Web Application Foundation
1. Basic Setup
   - [ ] React/Next.js frontend
   - [ ] Backend (Node.js/Express or FastAPI)
   - [ ] Database setup (PostgreSQL for structured data, MongoDB for unstructured data)
   - [ ] User authentication system
   - [ ] Basic project CRUD operations

2. Project Data Structure Implementation
   - [ ] Project model with core fields
   - [ ] Project versioning system
   - [ ] Project state tracking

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

## Getting Started

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
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   d. `tailwind.config.ts`:
   ```typescript
   import type { Config } from 'tailwindcss';

   const config: Config = {
     content: [
       './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
       './src/components/**/*.{js,ts,jsx,tsx,mdx}',
       './src/app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [
       require('@tailwindcss/typography'),
       require('@tailwindcss/forms'),
     ],
   };

   export default config;
   ```

   e. `postcss.config.js`:
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

   f. `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [
         {
           "name": "next"
         }
       ],
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

6. Install dependencies locally (for IDE support):
   ```bash
   npm install
   ```

7. Create Git ignore files:

   a. `.gitignore`:
   ```
   # dependencies
   /node_modules
   /.pnp
   .pnp.js

   # testing
   /coverage

   # next.js
   /.next/
   /out/

   # production
   /build

   # misc
   .DS_Store
   *.pem

   # debug
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   # local env files
   .env*.local
   .env

   # vercel
   .vercel

   # typescript
   *.tsbuildinfo
   next-env.d.ts

   # IDE
   .idea
   .vscode
   ```

   b. `.dockerignore`:
   ```
   .git
   .gitignore
   node_modules
   npm-debug.log
   README.md
   .next
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

### Running the Application

1. Start the application:
   ```bash
   docker-compose up
   ```

2. The application will be available at:
   - Frontend: http://localhost:3000
   - Database: localhost:5432

3. Verify everything is working:
   ```bash
   # Check TypeScript
   npm run type-check

   # Check Docker containers
   docker-compose ps

   # Check database connection
   docker-compose exec db psql -U projectify -d projectify_dev -c "\l"
   ```

4. To stop the application:
   ```bash
   docker-compose down
   ```

### Development Workflow

1. Make changes to files in `src/` directory
2. Changes will automatically reload in the browser
3. Check for TypeScript errors: `npm run type-check`
4. If you modify dependencies:
   ```bash
   npm install <package-name>
   docker-compose up --build
   ```

## Future Considerations
- Integration with additional AI models
- Enhanced mobile capabilities
- Additional hardware companion devices
- Extended portfolio features

## Contributing
This is currently a personal project, but structured to maintain high code quality and documentation standards.

## License
[License details to be determined] 