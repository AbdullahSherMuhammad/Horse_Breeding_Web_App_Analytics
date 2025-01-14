# Horse Breeding Web App Analytics

**Horse Breeding Web App Analytics** is an advanced web application designed to provide comprehensive insights and analytics into various metrics related to horse breeding. The project is built with modern technologies such as [Next.js](https://nextjs.org), **TypeScript**, **Shadcn UI**, and **Tailwind CSS** to ensure scalability, performance, and an exceptional user experience.

---

## Project Overview

This web application enables users to visualize and analyze key performance indicators in the horse breeding industry. It supports multiple functionalities, including comparative analysis, genetic trends, performance insights, and event tracking.

Key Features:
- Advanced analytics dashboards.
- Dynamic data visualization.
- Real-time updates and notifications.
- Customizable reports.

---

## Project Structure

The repository is organized as follows:

### Frontend Directory

The frontend is built using **Next.js** with **TypeScript** and integrates the **Shadcn UI library** for a cohesive and modern user interface. It also utilizes **Tailwind CSS** for styling.

#### Key Files and Folders:
- **`app/`**: Contains application pages and global styles.
  - `globals.css`: Global CSS styles using Tailwind CSS.
  - `layout.tsx`: Root layout component.
  - `page.tsx`: Main entry point for the application.
  - Subdirectories for different sections of the dashboard:
    - `Compare`
    - `Dashboard`
    - `Events`
    - `Genetics`
    - `Horses`
    - `Panels`
    - `Performance`

- **`components/`**: Modular and reusable UI components.
  - `Dashboard/`: Dashboard-specific components.
  - `ui/`: General-purpose UI components (e.g., `Button.tsx`, `Card.tsx`, `Modal.tsx`).

- **`lib/`**: Utility functions and shared logic.
  - `utils.ts`: Utility functions for the frontend.

- **`public/`**: Public assets such as images and icons.

- **Other Configuration Files**:
  - `tailwind.config.ts`: Tailwind CSS configuration.
  - `tsconfig.json`: TypeScript configuration.
  - `package.json`: Project dependencies and scripts.

### Backend Directory

The backend is developed to handle robust data processing and API integrations.

#### Key Files and Folders:
- **`src/`**: Contains core backend functionality.
  - `routes/`: API endpoint definitions.
  - `models/`: Database schemas and models.
  - `controllers/`: Business logic for handling requests.
  - `utils/`: Utility functions for server-side operations.

- **`config/`**: Configuration files for database connections and environment settings.

- **Other Files**:
  - `package.json`: Backend dependencies and scripts.
  - `.env`: Environment variables (e.g., database credentials).

---

## Technologies Used

### Frontend:
- **Next.js**
- **TypeScript**
- **Shadcn UI Library**
- **Tailwind CSS**
- **React Query**

### Backend:
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or later)
- **npm**, **yarn**, or **pnpm**
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/HorseBreedingWebApp.git
   cd HorseBreedingWebApp
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend/config/` directory and fill in the required values.

4. Run the application:
   ```bash
   # Start the backend server
   cd backend
   npm run dev

   # Start the frontend development server
   cd ../frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---
