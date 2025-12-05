# HairTryOn Frontend

A modern, AI-powered virtual hairstyle try-on application built with React and TypeScript. This application allows users to experiment with different hairstyles using advanced AI technology.

## 🚀 Tech Stack

### Core Technologies
- **[React 19.2.0](https://react.dev/)** - UI library for building interactive user interfaces
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Type-safe JavaScript superset
- **[Vite 7.1.7](https://vitejs.dev/)** - Next-generation frontend build tool for fast development

### Routing & State Management
- **[React Router DOM 7.9.4](https://reactrouter.com/)** - Client-side routing and navigation
- **[Redux Toolkit 2.9.1](https://redux-toolkit.js.org/)** - Predictable state container with modern Redux patterns
- **[React Redux 9.2.0](https://react-redux.js.org/)** - Official React bindings for Redux

### API & Data Fetching
- **[TanStack Query 5.90.9](https://tanstack.com/query/)** - Powerful data synchronization and caching
- **[@openapi-qraft/react 2.12.0](https://github.com/OpenAPI-Qraft/openapi-qraft)** - Type-safe OpenAPI client generation

### UI Components & Styling
- **[Tailwind CSS 4.1.14](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Re-usable component library built with Radix UI



## 📋 Environment Variables

<details>
<summary><strong>Click to expand environment configuration</strong></summary>

| Environment Variable | Required | Default Value | Description |
|---------------------|----------|---------------|-------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000` | Backend API base URL for all API requests |

### How to Get Environment Values

#### `VITE_API_URL`
1. **Local Development**: Use `http://localhost:8000` if running the backend locally
2. **Production**: 
   - Deploy your backend API first
   - Copy the production API URL (e.g., `https://api.yourdomain.com`)
   - Set this value in your hosting platform's environment variables

**Example `.env` file:**
```env
VITE_API_URL=http://localhost:8000
```

**For production (Vercel/Netlify):**
```env
VITE_API_URL=https://api.yourdomain.com
```

</details>

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher (comes with Node.js)
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevinnadar22/hairtryon.git
   cd hairtryon/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   
   # Edit .env and add your configuration
   # VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 File Structure

```
frontend/
├── .agent/                      # Agent workflows and configurations
│   └── workflows/              # Workflow definitions
├── .github/                     # GitHub configurations
│   └── workflows/              # CI/CD workflows
├── dist/                        # Production build output (generated)
├── node_modules/               # Dependencies (generated)
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── banner.jpg
│   └── site.webmanifest
├── src/                         # Source code
│   ├── api/                    # API client and services
│   │   ├── services/           # Auto-generated API service methods
│   │   ├── client.ts           # API client configuration
│   │   ├── create-api-client.ts # API client factory
│   │   ├── request-fn.ts       # Custom request function
│   │   ├── schema.ts           # OpenAPI schema types
│   │   └── index.ts
│   ├── app/                    # Application core
│   │   ├── config.ts           # App configuration
│   │   └── store.ts            # Redux store configuration
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # React components
│   │   ├── ui/                 # Shadcn UI components (37 components)
│   │   ├── Auth/               # Authentication components
│   │   ├── Footer/             # Footer components
│   │   ├── Header/             # Header/navigation components
│   │   ├── History/            # History page components
│   │   ├── Landing/            # Landing page components
│   │   ├── Misc/               # Miscellaneous components
│   │   ├── OutputSection/      # Output display components
│   │   ├── Payments/           # Payment components
│   │   ├── Styles/             # Style selection components
│   │   ├── UploadPhoto/        # Photo upload components
│   │   └── index.ts
│   ├── contexts/               # React contexts
│   │   ├── Auth/               # Authentication context
│   │   ├── Upload/             # Upload state context
│   │   └── index.ts
│   ├── features/               # Redux slices
│   │   ├── auth/               # Authentication state
│   │   ├── imageSlide/         # Image carousel state
│   │   ├── sideImageSlide/     # Side view carousel state
│   │   └── index.ts
│   ├── hooks/                  # Custom React hooks
│   ├── layout/                 # Layout components
│   │   └── MainLayout.tsx      # Main application layout
│   ├── lib/                    # Utility libraries
│   ├── pages/                  # Page components (19 pages)
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── GoogleCallback.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── PaymentCallback.tsx
│   │   ├── PhotoEditorPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── Profile.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── TermsOfService.tsx
│   │   ├── Test.tsx
│   │   ├── VerifyLogin.tsx
│   │   ├── VerifySignup.tsx
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   ├── index.css               # Global styles and Tailwind configuration
│   ├── main.tsx                # Application entry point
│   └── openapi.d.ts            # OpenAPI TypeScript definitions
├── .env                         # Environment variables (create this)
├── .gitignore                  # Git ignore rules
├── components.json             # Shadcn UI configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── README.md                   # This file
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node-specific TypeScript config
├── vercel.json                 # Vercel deployment configuration
└── vite.config.ts              # Vite configuration
```

## 🎨 Design System

The application uses a custom design system built on top of Tailwind CSS with:
- **Color Palette**: OKLCH color space for perceptually uniform colors
- **Typography**: Outfit (sans-serif) and Playfair Display (serif)
- **Theme Support**: Light and dark mode with seamless switching
- **Custom Animations**: Shimmer, pulse, meteor, fade-in-up, and more
- **Component Library**: Shadcn UI with 37+ pre-built components

## 🔧 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Build for production (TypeScript + Vite) |
| `lint` | `npm run lint` | Run ESLint to check code quality |
| `preview` | `npm run preview` | Preview production build locally |

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📞 Support

For support, please contact [jesikamaraj@gmail.com](mailto:jesikamaraj@gmail.com)

