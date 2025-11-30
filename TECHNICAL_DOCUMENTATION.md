# AccessShop - Technical Documentation

## Executive Summary

AccessShop is a voice-first, accessibility-focused e-commerce platform designed specifically for blind and visually impaired users. The application enables complete hands-free shopping experiences through advanced voice recognition, natural AI conversations, and comprehensive keyboard navigation.

---

## 1. Product Overview

### 1.1 Purpose
AccessShop addresses the critical accessibility gap in e-commerce by providing a shopping platform where blind users can:
- Browse and search products using voice commands
- Engage in natural conversations with AI shopping assistant
- Complete entire purchase workflows hands-free
- Navigate efficiently using keyboard shortcuts
- Receive real-time audio feedback for all actions

### 1.2 Target Users
- Primary: Blind and visually impaired individuals (285 million worldwide)
- Secondary: Users with motor disabilities, elderly users, multitasking shoppers

### 1.3 Key Differentiators
- **Voice-First Design**: Everything accessible via voice
- **Dual Voice Systems**: Command-based + conversational AI
- **Real-Time Updates**: Live order tracking and notifications
- **WCAG 2.1 AAA Compliant**: Industry-leading accessibility standards
- **PIN-Based Authentication**: Simplified login for blind users

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER (Browser)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React SPA (TypeScript + Vite)                 │  │
│  │  - Voice Recognition (Web Speech API)                 │  │
│  │  - Real-time WebSocket connections                    │  │
│  │  - State Management (Zustand)                         │  │
│  │  - UI Components (Shadcn + Tailwind)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION TIER (Backend)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Spring Boot REST API Server                │  │
│  │  - RESTful endpoints for CRUD operations              │  │
│  │  - WebSocket server for real-time updates             │  │
│  │  - JWT authentication middleware                      │  │
│  │  - Business logic and validation                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AI Integration Services                       │  │
│  │  - OpenAI Realtime API (GPT-4 Voice)                  │  │
│  │  - Voice command processing                           │  │
│  │  - Natural language understanding                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA TIER (PostgreSQL)                    │
│  - User profiles and authentication                          │
│  - Product catalog (50 items across 6 categories)           │
│  - Shopping cart and wishlist                               │
│  - Orders and order history                                 │
│  - Product reviews and ratings                              │
│  - Activity logs and analytics                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool and dev server |
| Tailwind CSS | 3.x | Styling framework |
| Zustand | 5.0.8 | State management |
| React Router | 6.30.1 | Client-side routing |
| Shadcn UI | Latest | Accessible component library |
| React Query | 5.83.0 | Server state management |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.x | Application framework |
| Spring Data JPA | 3.x | Database ORM |
| Spring Security | 3.x | Authentication/Authorization |
| Spring WebSocket | 3.x | Real-time communication |
| PostgreSQL | 15.x | Relational database |
| Docker | Latest | Containerization |
| Nginx | Latest | Reverse proxy & static files |

#### External APIs
- **OpenAI Realtime API**: Natural voice conversations (GPT-4o Realtime)
- **Web Speech API**: Browser-based speech recognition and synthesis

---

## 3. Core Features

### 3.1 Voice Command System (Ctrl+V)
**Continuous listening mode** for quick actions:

| Command | Action |
|---------|--------|
| "Search for [product]" | Search and navigate to results |
| "Add to cart" | Add current product to cart |
| "Go to cart" / "Go to checkout" | Navigate to pages |
| "Show me deals" | Display discounted products |
| "What's popular?" | Show trending items |
| "Sign out" | Logout |
| "Stop listening" | End voice recognition |

**Implementation**: 
- Uses Web Speech API for continuous recognition
- Voice commands parsed and mapped to application actions
- Audio feedback for all operations
- Accent-friendly synonym matching

### 3.2 Natural AI Chat
**OpenAI Realtime API integration** for conversational shopping:

**Capabilities**:
- Natural voice dialogue about products
- Context-aware product information
- Function calling for transactions:
  - `add_to_cart(quantity)`
  - `navigate(page)`
  - `get_product_info()`
  - `update_shipping_address(address, city, zipCode)`
  - `place_order()`

**User Flow**:
1. Click floating microphone button
2. Start speaking naturally
3. AI responds with voice + performs actions
4. Click button or say "stop listening" to end

### 3.3 Authentication System
- **Email/Password**: Standard signup and login
- **PIN Login**: 6-digit PIN for blind users (voice-activated)
- **Auto-confirmation**: No email verification required (demo mode)
- **Session Management**: JWT tokens with secure storage

### 3.4 Product Catalog
- **50 curated products** across 6 categories:
  - Electronics
  - Computing
  - Gaming
  - Home & Kitchen
  - Fashion & Wearables
  - Health & Sports
- Features: ratings, reviews, deals, stock tracking

### 3.5 Shopping Features
- **Cart Management**: Add, update, remove items
- **Wishlist**: Save products for later
- **Checkout**: Voice-enabled form filling
- **Order Tracking**: Real-time status updates
- **Product Reviews**: Read and write reviews

### 3.6 Real-Time Updates
- Live cart synchronization across devices
- Real-time order status changes
- Instant inventory updates
- WebSocket-based push notifications

### 3.7 Accessibility Features
- **Screen Reader Optimized**: ARIA labels on all elements
- **Keyboard Navigation**: Full site accessible via Tab/Enter
- **Keyboard Shortcuts**: Press `?` for shortcut menu
- **High Contrast Mode**: Toggle in preferences
- **Adjustable Text Sizes**: Multiple size options
- **Focus Indicators**: Clear visual focus states
- **Live Regions**: Announcements for dynamic content

---

## 4. Database Schema

### 4.1 Core Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  login_pin VARCHAR(6) UNIQUE,
  accessibility_preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100),
  image VARCHAR(500),
  rating DECIMAL(2,1),
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER,
  features TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  deal_expires_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `cart`
```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  address TEXT,
  city VARCHAR(100),
  zip VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `wishlist`
```sql
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `activity_log`
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type VARCHAR(100) NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS)
PostgreSQL RLS policies implemented for:
- User-specific cart access
- User-specific wishlist access
- User-specific order access
- Public product read access
- Authenticated review creation

---

## 5. REST API Endpoints

### 5.1 Authentication
```
POST   /api/auth/signup          - Create new account
POST   /api/auth/login           - Email/password login
POST   /api/auth/pin-login       - PIN-based login
POST   /api/auth/logout          - Terminate session
GET    /api/auth/session         - Get current session
```

### 5.2 Products
```
GET    /api/products             - List all products (with filters)
GET    /api/products/:id         - Get product details
GET    /api/products/search      - Search products
GET    /api/products/featured    - Get featured products
GET    /api/products/deals       - Get products on sale
```

### 5.3 Cart
```
GET    /api/cart                 - Get user's cart
POST   /api/cart                 - Add item to cart
PATCH  /api/cart/:id             - Update cart item quantity
DELETE /api/cart/:id             - Remove item from cart
DELETE /api/cart                 - Clear entire cart
```

### 5.4 Orders
```
GET    /api/orders               - List user's orders
GET    /api/orders/:id           - Get order details
POST   /api/orders               - Create new order
PATCH  /api/orders/:id/status    - Update order status (admin)
```

### 5.5 Wishlist
```
GET    /api/wishlist             - Get user's wishlist
POST   /api/wishlist             - Add product to wishlist
DELETE /api/wishlist/:id         - Remove from wishlist
```

### 5.6 Reviews
```
GET    /api/reviews              - Get reviews for product
POST   /api/reviews              - Create new review
PATCH  /api/reviews/:id          - Update review
DELETE /api/reviews/:id          - Delete review
```

### 5.7 Voice Assistant
```
POST   /api/voice/process        - Process voice query
POST   /api/voice/realtime-token - Generate OpenAI session token
```

### 5.8 WebSocket Events
```
WS     /ws/cart                  - Real-time cart updates
WS     /ws/orders                - Real-time order updates
WS     /ws/products              - Real-time product updates
```

---

## 6. User Flows

### 6.1 Voice Shopping Flow
```
1. User presses Ctrl+V
2. System starts continuous listening
3. User: "Search for headphones"
   → System searches and navigates to results
4. User: "Show me the first one"
   → System opens product details
5. User clicks "Natural AI Chat" button
6. User: "Tell me about this product"
   → AI provides detailed description
7. User: "Add 2 to my cart"
   → AI adds items and confirms
8. User: "Take me to checkout"
   → AI navigates to checkout
9. User: "My address is 123 Main Street"
   → AI updates address field
10. User: "City is New York"
    → AI updates city field
11. User: "Zip code is 10001"
    → AI updates zip field
12. User: "Place my order"
    → AI submits order
13. System confirms order and provides order number
```

### 6.2 Traditional Shopping Flow
```
1. User signs up/logs in
2. Browses homepage (Tab navigation)
3. Clicks product or uses search
4. Views product details (keyboard accessible)
5. Adds to cart (Enter key or voice)
6. Navigates to cart (Ctrl+Shift+C)
7. Proceeds to checkout
8. Fills shipping form (keyboard or voice)
9. Submits order
10. Receives confirmation page
11. Can track order in Orders page
```

### 6.3 PIN Login Flow (Blind Users)
```
1. User creates account (with sighted friend)
2. System generates unique 6-digit PIN
3. System displays and announces PIN
4. User memorizes PIN
5. Future logins:
   - User presses Ctrl+V
   - Says: "PIN login"
   - System prompts for PIN
   - User speaks PIN digits
   - System authenticates and logs in
```

---

## 7. Deployment Architecture

### 7.1 Docker Containerization

**Multi-container setup**:

```yaml
version: '3.8'
services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: accessshop
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  # Spring Boot Backend
  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/accessshop
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
    ports:
      - "8080:8080"
  
  # React Frontend + Nginx
  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

volumes:
  postgres_data:
```

### 7.2 Environment Variables
```bash
# Database
DB_PASSWORD=<secure_password>
POSTGRES_DB=accessshop

# Backend
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# External APIs
OPENAI_API_KEY=<openai_key>

# Frontend
VITE_API_URL=http://backend:8080/api
```

---

## 8. Security Considerations

### 8.1 Authentication & Authorization
- JWT tokens with 7-day expiration
- Secure password hashing (bcrypt)
- Row Level Security (RLS) on database
- Protected routes requiring authentication

### 8.2 Data Protection
- HTTPS/TLS encryption in production
- Secure WebSocket connections (WSS)
- SQL injection prevention (parameterized queries)
- XSS protection (React escaping)
- CSRF tokens on state-changing operations

### 8.3 API Security
- Rate limiting on endpoints
- Input validation and sanitization
- API key rotation for external services
- Secrets management (environment variables)

---

## 9. Performance Optimizations

### 9.1 Frontend
- Code splitting and lazy loading
- Image optimization and lazy loading
- React Query caching
- Debounced search inputs
- Virtual scrolling for large lists

### 9.2 Backend
- Database connection pooling
- Query optimization with indexes
- Caching frequently accessed data
- Batch operations for bulk updates

### 9.3 Database
- Indexes on foreign keys and search columns
- Materialized views for complex queries
- Connection pooling
- Query plan optimization

---

## 10. Monitoring & Analytics

### 10.1 Application Metrics
- Voice command usage frequency
- Keyboard shortcut adoption rates
- Average session duration
- Conversion funnel analytics
- Error rates and types

### 10.2 Accessibility Metrics Dashboard
Located at `/metrics`, tracks:
- Voice command success rates
- Keyboard navigation patterns
- Screen reader usage
- Common user flows
- Feature adoption by user segment

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Service layer business logic
- Utility functions
- State management stores
- API endpoint handlers

### 11.2 Integration Tests
- Database operations
- API endpoint flows
- Authentication workflows
- WebSocket connections

### 11.3 Accessibility Testing
- Screen reader compatibility (JAWS, NVDA)
- Keyboard navigation coverage
- ARIA label correctness
- Color contrast ratios
- Focus management

### 11.4 User Testing
- Blind user testing sessions
- Voice command accuracy
- Workflow completion rates
- Pain point identification

---

## 12. Future Enhancements

### 12.1 Planned Features
- Multi-language support
- Voice-based product comparisons
- Personalized recommendations
- Social sharing capabilities
- Order tracking via SMS/Voice calls

### 12.2 Technical Improvements
- Progressive Web App (PWA)
- Offline functionality
- Advanced caching strategies
- GraphQL API migration
- Microservices architecture

---

## 13. Conclusion

AccessShop represents a paradigm shift in accessible e-commerce. By designing for blind users first, we've created a platform that:

1. **Empowers Independence**: Blind users can shop without assistance
2. **Leverages Modern AI**: Natural conversations replace complex interfaces
3. **Scales Efficiently**: Docker + PostgreSQL handle growth
4. **Maintains Security**: Enterprise-grade authentication and data protection
5. **Demonstrates Innovation**: Dual voice systems provide flexibility

The platform proves that accessibility and cutting-edge technology are not mutually exclusive—they're complementary forces that drive innovation.

---

## Appendix A: Quick Reference

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+V` | Toggle voice commands |
| `Ctrl+Shift+C` | Go to cart |
| `Ctrl+Shift+O` | Go to orders |
| `Ctrl+Shift+W` | Go to wishlist |
| `Ctrl+Shift+H` | Go to home |
| `?` | Show keyboard shortcuts |
| `Escape` | Close modals/panels |

### Project Structure
```
accessshop/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API and business logic
│   │   ├── stores/          # Zustand state stores
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── Dockerfile
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── model/           # Entity models
│   │   └── config/          # Configuration
│   └── Dockerfile
├── postgres/                # Database initialization
│   └── init.sql
├── docker-compose.yml       # Container orchestration
└── nginx.conf              # Web server configuration
```

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: AccessShop Development Team