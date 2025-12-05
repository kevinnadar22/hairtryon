# HairTryOn Frontend Architecture

## 📐 Architecture Overview

The HairTryOn frontend is a modern Single Page Application (SPA) built with React and TypeScript, following a **component-based architecture** with **unidirectional data flow**. The application leverages Redux for global state management, React Query for server state, and Context API for component-level state sharing.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   React Application                    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │  │  Components  │  │   Layout    │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │         │                 │                 │          │  │
│  │         └─────────────────┴─────────────────┘          │  │
│  │                         │                               │  │
│  │         ┌───────────────┴───────────────┐              │  │
│  │         │                               │              │  │
│  │    ┌────▼─────┐                  ┌─────▼──────┐       │  │
│  │    │ Contexts │                  │   Hooks    │       │  │
│  │    └────┬─────┘                  └─────┬──────┘       │  │
│  │         │                               │              │  │
│  │    ┌────▼──────────────────────────────▼──────┐       │  │
│  │    │         State Management Layer           │       │  │
│  │    │  ┌──────────┐        ┌──────────────┐   │       │  │
│  │    │  │  Redux   │        │ React Query  │   │       │  │
│  │    │  │  Store   │        │   Client     │   │       │  │
│  │    │  └──────────┘        └──────────────┘   │       │  │
│  │    └──────────────────┬───────────────────────┘       │  │
│  │                       │                               │  │
│  │              ┌────────▼────────┐                      │  │
│  │              │   API Client    │                      │  │
│  │              │  (OpenAPI Qraft)│                      │  │
│  │              └────────┬────────┘                      │  │
│  └───────────────────────┼───────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Backend API   │
                    │  (FastAPI/REST) │
                    └─────────────────┘
```

## 🎯 Core Architectural Patterns

### 1. **Component-Based Architecture**
- **Atomic Design Principles**: Components are organized from smallest (atoms) to largest (pages)
- **Reusability**: Shared components in `src/components/ui` (Shadcn UI)
- **Feature-Based Organization**: Domain-specific components grouped by feature

### 2. **State Management Strategy**

#### **Global State (Redux)**
- **Purpose**: Application-wide state that persists across routes
- **Managed By**: Redux Toolkit
- **Slices**:
  - `auth`: User authentication state (user info, tokens, login status)
  - `imageSlide`: Main hairstyle image carousel state
  - `sideImageSlide`: Side view image carousel state

#### **Server State (React Query)**
- **Purpose**: Remote data fetching, caching, and synchronization
- **Managed By**: TanStack Query (React Query)
- **Features**:
  - Automatic background refetching
  - Optimistic updates
  - Cache invalidation
  - Request deduplication

#### **Component State (React Context)**
- **Purpose**: Shared state within component trees
- **Contexts**:
  - `AuthContext`: Authentication flow management
  - `UploadContext`: Photo upload state and progress

#### **Local State (useState/useReducer)**
- **Purpose**: Component-specific UI state
- **Examples**: Form inputs, modal visibility, loading states

### 3. **Type-Safe API Integration**
- **OpenAPI-First Approach**: API client auto-generated from OpenAPI schema
- **Type Safety**: Full TypeScript types for requests/responses
- **Request/Response Interceptors**: Custom request function for auth headers

## 📂 Directory Structure & Responsibilities

### `/src/api` - API Layer
```
api/
├── services/          # Auto-generated API service methods
├── client.ts          # Configured API client instance
├── create-api-client.ts # API client factory (auto-generated)
├── request-fn.ts      # Custom request interceptor
├── schema.ts          # OpenAPI TypeScript types
└── index.ts           # Public API exports
```

**Responsibilities**:
- Type-safe API communication
- Request/response transformation
- Authentication header injection
- Error handling

### `/src/app` - Application Core
```
app/
├── config.ts          # Environment configuration
└── store.ts           # Redux store setup
```

**Responsibilities**:
- Global configuration management
- Redux store initialization
- Middleware configuration

### `/src/components` - UI Components
```
components/
├── ui/                # Shadcn UI primitives (37 components)
├── Auth/              # Authentication forms & flows
├── Footer/            # Footer navigation
├── Header/            # Navigation bar
├── History/           # History display components
├── Landing/           # Landing page sections
├── Misc/              # Utility components (ErrorBoundary, etc.)
├── OutputSection/     # Hairstyle output display
├── Payments/          # Payment forms & checkout
├── Styles/            # Hairstyle selection UI
└── UploadPhoto/       # Photo upload interface
```

**Responsibilities**:
- Presentational logic
- User interaction handling
- Component composition
- Accessibility (ARIA attributes)

### `/src/contexts` - React Contexts
```
contexts/
├── Auth/              # Authentication context provider
├── Upload/            # Upload state context
└── index.ts
```

**Responsibilities**:
- Cross-component state sharing
- Context provider composition
- State initialization

### `/src/features` - Redux Slices
```
features/
├── auth/              # Authentication slice
│   ├── authSlice.ts
│   └── index.ts
├── imageSlide/        # Main image carousel slice
│   ├── imageSlideSlice.ts
│   └── index.ts
└── sideImageSlide/    # Side view carousel slice
    ├── sideImageSlideSlice.ts
    └── index.ts
```

**Responsibilities**:
- Redux state slices
- Action creators
- Reducers
- Selectors

### `/src/hooks` - Custom Hooks
```
hooks/
├── useAuth.ts         # Authentication hook
├── useUpload.ts       # Upload management hook
└── ...
```

**Responsibilities**:
- Reusable stateful logic
- Side effect encapsulation
- Custom hook composition

### `/src/layout` - Layout Components
```
layout/
└── MainLayout.tsx     # Main application shell
```

**Responsibilities**:
- Page layout structure
- Header/Footer placement
- Route outlet rendering

### `/src/pages` - Page Components
```
pages/
├── LandingPage.tsx    # Home page
├── PhotoEditorPage.tsx # Main hairstyle editor
├── HistoryPage.tsx    # User history
├── Profile.tsx        # User profile
├── Login.tsx          # Login page
├── PricingPage.tsx    # Subscription plans
└── ...
```

**Responsibilities**:
- Route-level components
- Page-specific logic
- Data fetching orchestration

### `/src/utils` - Utility Functions
```
utils/
├── cn.ts              # Class name utility
├── validators.ts      # Form validation
└── ...
```

**Responsibilities**:
- Pure utility functions
- Helper methods
- Constants

## 🔄 Data Flow Architecture

### 1. **User Interaction Flow**
```
User Action
    │
    ▼
Component Event Handler
    │
    ├─→ Local State Update (useState)
    │
    ├─→ Context Update (useContext)
    │
    ├─→ Redux Dispatch (useDispatch)
    │
    └─→ API Call (React Query)
            │
            ▼
        API Client (OpenAPI Qraft)
            │
            ▼
        Backend API
            │
            ▼
        Response Processing
            │
            ├─→ React Query Cache Update
            │
            └─→ Redux State Update
                    │
                    ▼
                Component Re-render
```

### 2. **Authentication Flow**
```
1. User submits login form
    │
    ▼
2. Login component calls auth API
    │
    ▼
3. API returns JWT token + user data
    │
    ▼
4. AuthContext stores token in memory
    │
    ▼
5. Redux auth slice stores user data
    │
    ▼
6. Token added to all subsequent API requests
    │
    ▼
7. Protected routes become accessible
```

### 3. **Hairstyle Try-On Flow**
```
1. User uploads photo (UploadContext)
    │
    ▼
2. Photo sent to backend API
    │
    ▼
3. Backend processes image (AI model)
    │
    ▼
4. Poll for processing status (React Query)
    │
    ▼
5. Receive processed images with hairstyles
    │
    ▼
6. Update imageSlide Redux state
    │
    ▼
7. Display results in carousel
    │
    ▼
8. User can save to history (API call)
```

## 🎨 Styling Architecture

### **Tailwind CSS + CSS Variables**
```
index.css (Global Styles)
    │
    ├─→ Tailwind Directives (@import "tailwindcss")
    │
    ├─→ CSS Custom Properties (--color-*, --radius-*)
    │   ├─→ Light theme (:root)
    │   └─→ Dark theme (.dark)
    │
    ├─→ Custom Animations (@keyframes)
    │   ├─→ shimmer-slide
    │   ├─→ spin-around
    │   ├─→ pulse
    │   ├─→ meteor
    │   └─→ fade-in-up
    │
    └─→ Global Styles (@layer base)
```

### **Component Styling Strategy**
1. **Utility Classes**: Tailwind utilities for layout and spacing
2. **CSS Variables**: Theme colors via `bg-primary`, `text-foreground`, etc.
3. **Component Variants**: `class-variance-authority` for variant management
4. **Responsive Design**: Mobile-first with Tailwind breakpoints

## 🔐 Security Architecture

### **Authentication & Authorization**
- **JWT Tokens**: Stored in memory (AuthContext)
- **HTTP-Only Cookies**: Session management (backend-controlled)
- **Protected Routes**: Route guards check authentication state
- **Token Refresh**: Automatic token renewal before expiration

### **API Security**
- **CORS**: Configured on backend for allowed origins
- **HTTPS**: All production API calls over HTTPS
- **Input Validation**: Client-side validation before API calls
- **XSS Prevention**: React's built-in XSS protection + CSP headers

## 🚀 Performance Optimizations

### **Code Splitting**
- **Route-Based**: Each page is a separate chunk
- **Lazy Loading**: Components loaded on-demand
- **Dynamic Imports**: Heavy libraries loaded when needed

### **Caching Strategy**
- **React Query Cache**: Server data cached with stale-while-revalidate
- **Service Worker**: (Future) Offline support and asset caching
- **CDN**: Static assets served from CDN

### **Bundle Optimization**
- **Tree Shaking**: Unused code removed by Vite
- **Minification**: Production builds minified
- **Compression**: Gzip/Brotli compression on server

### **Image Optimization**
- **Lazy Loading**: Images loaded as they enter viewport
- **Responsive Images**: Multiple sizes for different devices
- **WebP Format**: Modern image format for smaller sizes

## 🧪 Testing Strategy (Future)

### **Unit Tests**
- **Framework**: Vitest
- **Coverage**: Utility functions, hooks, reducers
- **Mocking**: API calls mocked with MSW

### **Integration Tests**
- **Framework**: React Testing Library
- **Coverage**: Component interactions, form submissions
- **User-Centric**: Test from user perspective

### **E2E Tests**
- **Framework**: Playwright/Cypress
- **Coverage**: Critical user flows (login, upload, payment)
- **CI/CD**: Automated on every deployment

## 📊 Monitoring & Analytics (Future)

### **Error Tracking**
- **Sentry**: Real-time error monitoring
- **Error Boundaries**: Graceful error handling in React

### **Performance Monitoring**
- **Web Vitals**: Core Web Vitals tracking
- **Lighthouse CI**: Automated performance audits

### **User Analytics**
- **Google Analytics**: User behavior tracking
- **Hotjar**: Heatmaps and session recordings

## 🔄 Build & Deployment Pipeline

```
Developer Push to Git
    │
    ▼
GitHub Actions Trigger
    │
    ├─→ Install Dependencies (npm ci)
    │
    ├─→ Run Linter (npm run lint)
    │
    ├─→ Run Tests (npm test)
    │
    ├─→ Build Production Bundle (npm run build)
    │
    └─→ Deploy to Vercel
            │
            ├─→ Preview Deployment (PR branches)
            │
            └─→ Production Deployment (main branch)
                    │
                    ▼
                CDN Distribution (Global)
```

## 🔧 Development Workflow

### **Local Development**
1. Start backend API server
2. Run `npm run dev` for frontend
3. Hot Module Replacement (HMR) for instant updates
4. React Query DevTools for debugging

### **API Client Generation**
1. Backend updates OpenAPI schema
2. Run `npm run generate-api` to regenerate client
3. TypeScript types automatically updated
4. Compile-time safety for API calls

### **Component Development**
1. Create component in appropriate directory
2. Use Shadcn UI primitives when possible
3. Add to Storybook for documentation (future)
4. Write unit tests

## 📈 Scalability Considerations

### **Code Organization**
- **Feature-Based**: Easy to add new features without conflicts
- **Modular**: Components can be extracted to separate packages
- **Type-Safe**: TypeScript prevents runtime errors

### **State Management**
- **Redux Slices**: Easy to add new state slices
- **React Query**: Automatic request deduplication and caching
- **Context Isolation**: Prevents unnecessary re-renders

### **API Integration**
- **Auto-Generated Client**: Schema changes automatically reflected
- **Versioning**: API versioning support in URL structure
- **Backward Compatibility**: Graceful handling of API changes

## 🎯 Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **DRY (Don't Repeat Yourself)**: Reusable components and hooks
3. **SOLID Principles**: Single responsibility, open/closed, etc.
4. **Accessibility First**: WCAG 2.1 AA compliance
5. **Mobile First**: Responsive design from smallest screens up
6. **Progressive Enhancement**: Core functionality works without JS
7. **Type Safety**: TypeScript everywhere for compile-time safety

## 🔮 Future Enhancements

- **Progressive Web App (PWA)**: Offline support and installability
- **Server-Side Rendering (SSR)**: Next.js migration for SEO
- **Micro-Frontends**: Split into independent deployable modules
- **GraphQL**: Replace REST with GraphQL for flexible queries
- **Real-Time Updates**: WebSocket integration for live notifications
- **Internationalization (i18n)**: Multi-language support
- **A/B Testing**: Feature flag system for experimentation

---

**Architecture Version**: 1.0  
**Last Updated**: December 2025  
**Maintained By**: Development Team
