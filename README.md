# LUXE — Premium Curations

![Luxe Evaluation](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)

> **Experience the pinnacle of luxury shopping.**
> 
> A visual-first, high-performance e-commerce frontend designed to redefine the digital shopping experience. Built with a focus on premium aesthetics, fluid animations, and robust functionality.

---

## 💎 Project Overview

**LUXE** is a modern e-commerce application frontend that prioritizes user experience and visual design. It leverages the power of **Next.js 16** and **Tailwind CSS v4** to deliver a lightning-fast, responsive, and immersive interface.

The application features a sophisticated dark-mode aesthetic, enhanced by **Framer Motion** for smooth transitions and complex micro-interactions, making every click and scroll feel premium.

## ✨ Key Features

- **🎨 Premium Aesthetic:** meticulously crafted UI with glassmorphism, gradient accents, and custom typography.
- **🛍️ Dynamic Shop:** Full-featured product catalog with advanced filtering (price, category), sorting, and server-side pagination.
- **🔐 Secure Authentication:** Integrated Google OAuth and custom JWT authentication flows.
- **👤 User Dashboard:** Comprehensive profile management including personal details and order history tracking.
- **🛒 State-Managed Cart:** robust shopping cart functionality powered by **Redux Toolkit**, supporting persistent sessions.
- **📱 Fully Responsive:** Optimized for all devices, featuring adaptive layouts and mobile-specific navigation (e.g., swipeable sidebars).
- **⚡ Performance First:** Built on Next.js App Router with optimized image loading and code splitting.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & React Context
- **Icons:** [Lucide React](https://lucide.dev/)
- **Networking:** [Axios](https://axios-http.com/)
- **Authentication:** @react-oauth/google & Custom JWT

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/piyush0049/Luxe_Next.js.git
    cd Luxe_Next.js
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add the necessary variables:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```bash
frontend/
├── app/                  # Next.js App Router pages & layouts
│   ├── layout.js         # Root layout with Providers
│   ├── page.js           # Home landing page
│   ├── shop/             # Product catalog page
│   ├── profile/          # User dashboard
│   └── ...
├── components/           # Reusable UI components
│   ├── Navbar.js         # Navigation bar
│   ├── Footer.js         # Application footer
│   ├── ProductCard.js    # Product display component
│   └── ...
├── store/                # Redux store configuration
│   ├── store.js          # Store setup
│   └── features/         # Slices (cartSlice, etc.)
├── lib/                  # Utilities & configurations
│   └── axios.js          # Axios instance interceptors
├── public/               # Static assets
└── styles/               # Global styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
