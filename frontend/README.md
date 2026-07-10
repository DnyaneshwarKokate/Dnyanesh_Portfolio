# Next.js Frontend (Developer Showcase & Admin Console)

A state-of-the-art developer portfolio and content management dashboard built using **Next.js (App Router)**, **TypeScript**, and **CSS Modules**.

---

## 🎨 Design & Features

1. **Rich Glassmorphic Aesthetics**: Sleek dark and off-white interfaces, micro-animations, color-coded badges, and responsive layouts.
2. **Dynamic Data Binding**: Dynamically fetches and renders projects, skills, and experience items directly from the Go backend.
3. **Secure Administrative Workspace**:
   - **Hydration Security Check**: Intercepts mount lifecycle states to prevent unauthorized access or rendering of page code unless validation criteria are checked.
   - **JWT Expired Interceptor**: Redirects users to the login screen and wipes local storage variables when any backend query returns a `401 Unauthorized` response.
   - **Five-Tab Navigation Panel**: Handles inquiries review, project editing, skill configurations, experience entries, and **Co-Admin Registration** in dedicated screens.
   - **Forgot Password OTP Flow**: Integrates secure OTP verification code request and password resets directly on the login screen.
4. **Dynamic API Configuration**: Resolves the backend base URL dynamically from environment variables (`NEXT_PUBLIC_API_URL`) with a fallback for local development.

---

## 🏗️ Directory Structure

```
frontend/
├── public/         # Static assets and assets icons
└── src/
    ├── app/        # App Router pages and page logic
    │   ├── about/       # Experience timeline and technical skills chart
    │   ├── contact/     # Public inquiry form
    │   ├── dashboard/   # Secure administrative control panel
    │   ├── login/       # Admin credentials screen
    │   ├── projects/    # Project filter and github showcase grid
    │   └── layout.tsx   # Base html layout and page configuration
    ├── components/ # Shared global components (Header, Footer, Icons)
    └── config.ts   # Dynamic backend endpoint exports
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed.

### Setup and Running Locally:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your local environment variable (optional, default fallback is `http://localhost:8081`):
   ```bash
   export NEXT_PUBLIC_API_URL=http://localhost:8081
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

### Build for Production:
```bash
npm run build
```
