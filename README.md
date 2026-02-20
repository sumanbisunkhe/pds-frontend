# AI-Powered Photo Distribution System - Frontend

A modern, high-performance web interface for the AI-powered Photo Distribution System. This frontend allows users to register their faces, view their matched photos in real-time, and stay updated with live event statistics.

## ✨ Features

- **Dynamic Photo Wall**: A real-time, animated gallery showing recent event photos using Server-Sent Events (SSE).
- **Face Registration**: Easy selfie upload for instant face recognition registration.
- **Personal Gallery**: A dedicated space for users to view and download all photos where they've been identified.
- **Premium UI/UX**:
  - **Modern Aesthetics**: Built with Shadcn/UI and dark mode support.
  - **Smooth Animations**: Powered by Framer Motion, GSAP, and Lenis smooth scrolling.
  - **Responsive Design**: Optimized for mobile and desktop viewing.
- **Telegram Integration**: Easy access to the Telegram bot for those who prefer messaging apps.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (recommended)

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd pds-frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

### Development

Run the development server:

```bash
pnpm dev
```

### Build

Create a production build:

```bash
pnpm build
```

## 📂 Project Structure

- `src/components`: Reusable UI components (Shadcn + Custom)
- `src/pages`: Main application views (Home, My Photos, Register)
- `src/lib`: API clients and utility functions
- `src/hooks`: Custom React hooks
- `src/assets`: Static assets like logos and images

## 📄 License

This project is part of the Photo Distribution System.
