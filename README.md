# ShopEase — Ecommerce Starter App

A full-stack ecommerce web application built with **React + TypeScript** (frontend) and **Java Spring Boot** (backend).

## Project Structure

```
├── backend/     Spring Boot REST API
└── frontend/    React + TypeScript SPA (Vite)
```

---

## Backend (Spring Boot)

### Prerequisites
- Java 17+
- Maven 3.8+

### Stack
| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.2 |
| REST | Spring Web (MVC) |
| Database | H2 (in-memory, dev) |
| ORM | Spring Data JPA / Hibernate |
| Auth | Spring Security + JWT |
| Build | Maven |

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & receive JWT |
| GET | `/api/products` | Public | List products (filter by `category` or `search`) |
| GET | `/api/products/{id}` | Public | Get product details |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |
| GET | `/api/cart` | User | Get current user's cart |
| POST | `/api/cart/items` | User | Add item to cart |
| PUT | `/api/cart/items/{id}` | User | Update item quantity |
| DELETE | `/api/cart/items/{id}` | User | Remove item from cart |
| DELETE | `/api/cart` | User | Clear cart |
| GET | `/api/orders` | User | List user's orders |
| GET | `/api/orders/{id}` | User | Get order details |
| POST | `/api/orders` | User | Place order from cart |

### Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

H2 console available at **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:ecommercedb`
- Username: `sa` | Password: _(blank)_

Sample products are loaded automatically from `src/main/resources/data.sql`.

### Running Tests

```bash
cd backend
mvn test
```

---

## Frontend (React + TypeScript)

### Prerequisites
- Node.js 18+
- npm 9+

### Stack
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| State | React Context API |
| Styling | Plain CSS |

### Pages

| Route | Page |
|---|---|
| `/` | Home — product listing with search & category filter |
| `/products/:id` | Product detail with quantity selector |
| `/cart` | Shopping cart with item management |
| `/checkout` | Order checkout with shipping address |
| `/orders` | Order history |
| `/login` | Sign in |
| `/register` | Create account |

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on **http://localhost:5173**.

> Make sure the backend is running first at `http://localhost:8080`.

### Building for Production

```bash
cd frontend
npm run build
```

---

## Quick Start

```bash
# Terminal 1 — start the backend
cd backend && mvn spring-boot:run

# Terminal 2 — start the frontend
cd frontend && npm install && npm run dev
```

Then open **http://localhost:5173** in your browser.

