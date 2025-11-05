# AccessShop - Voice-First Accessible E-Commerce Platform

AccessShop is a fully accessible, voice-first e-commerce storefront designed for everyone, with a particular focus on blind and visually impaired users. The platform demonstrates best practices in web accessibility, voice navigation, and inclusive design.

## Features

### Core Functionality
- **Complete E-Commerce Flow**: Browse products, search, add to cart, checkout, and view orders
- **24 Product Catalog**: Multiple categories with realistic product data
- **Shopping Cart**: Full cart management with quantity controls
- **Order Management**: Order history and confirmation pages
- **User Authentication**: Login/logout functionality

### Accessibility Features
- **Voice-First Navigation**: Control the entire app using voice commands
- **Global Voice Activation**: Press `Ctrl+V` anywhere to toggle voice input
- **Screen Reader Optimized**: Comprehensive ARIA labels and semantic HTML
- **Keyboard Navigation**: Complete keyboard operability throughout
- **Live Announcements**: Real-time updates for screen reader users
- **Customizable Display**: Adjust text size, contrast, and voice verbosity

### Voice Commands
- Navigation: "Go home", "Open cart", "Show orders", "Open account"
- Search: "Search for wireless headphones", "Find phone cases"
- Product Actions: "Add to cart", "Buy now", "Read product"
- Page Reading: "Read page", "Summarize", "What can I say?"
- Checkout: "Proceed to checkout", "Confirm order"
- Preferences: "Turn on high contrast", "Increase text size"

### Keyboard Shortcuts
- `Ctrl+V` - Toggle voice input (except in text fields)
- `Ctrl+Shift+V` - Force toggle voice input
- `/` - Focus search bar
- `g h` - Go to home
- `g c` - Go to cart
- `g o` - Go to orders
- `?` - Show help dialog

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Radix UI
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Deployment**: Docker + Nginx

## Getting Started

### Local Development

#### Prerequisites
- Node.js 18+ and npm

#### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Docker Deployment

#### Prerequisites
- Docker and Docker Compose

#### Run with Docker
```bash
# Build and start the container
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

The app will be available at `http://localhost:8080`

#### Stop the container
```bash
docker compose down
```

## Demo Credentials

For testing authentication:
- Email: `user@demo.com`
- Password: `password123`

## License

This project is for educational purposes.
