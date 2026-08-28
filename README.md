<div align="center">

<<<<<<< HEAD
HyperV is a complete storefront built end-to-end: a React marketing/shop site backed by a real Express + SQLite API — not a static mockup. It handles actual cart checkout, server-side stock validation, order tracking, and has a password-protected admin dashboard for managing orders and inventory.

Features
🛒 Cart & checkout — add flavors to cart, check out with a real order created server-side. Prices and stock are re-validated against the database on every order, never trusted from the client.
📦 Live inventory — stock is decremented atomically on checkout, so the app can't oversell a flavor even under concurrent orders.
🔍 Order tracking — customers can look up any order by its confirmation number (/track-order) and see its current status.
🔐 Admin dashboard (/admin) — password-protected view of all orders and inventory, with the ability to update order status (pending → paid → shipped → cancelled) and edit stock levels.
✉️ Contact form — submissions are stored in the database, not just faked client-side.
🎨 Animated, motion-heavy storefront (Framer Motion + GSAP) with a distinct neon/energy-drink visual identity.
Tech stack

Frontend — React 19, Vite, React Router, Tailwind CSS 4, Framer Motion, GSAP, lucide-react icons.

Backend — Node.js, Express 5, SQLite via Node's built-in node:sqlite module (no native compilation required — works out of the box on any OS).
=======
# ⚡ HYPER V

**A full-stack e-commerce storefront for a fictional energy drink brand.**

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[**Live Demo**](https://hyper-v.vercel.app) · [Deployment Guide](./DEPLOY.md)

</div>

---

## Overview

HyperV is a complete storefront built end-to-end: a React marketing/shop
site backed by a real Express + MongoDB API — not a static mockup. It
handles actual cart checkout, server-side stock validation, order
tracking, and has a password-protected admin dashboard for managing
orders and inventory.

## Features

- 🛒 **Cart & checkout** — add flavors to cart, check out with a real
  order created server-side. Prices and stock are re-validated against
  the database on every order, never trusted from the client.
- 📦 **Live inventory** — stock is decremented atomically on checkout, so
  the app can't oversell a flavor even under concurrent orders.
- 🔍 **Order tracking** — customers can look up any order by its
  confirmation number (`/track-order`) and see its current status.
- 🔐 **Admin dashboard** (`/admin`) — password-protected view of all
  orders and inventory, with the ability to update order status
  (pending → paid → shipped → cancelled) and edit stock levels.
- ✉️ **Contact form** — submissions are stored in the database, not just
  faked client-side.
- 🎨 Animated, motion-heavy storefront (Framer Motion + GSAP) with a
  distinct neon/energy-drink visual identity.

## Tech stack

**Frontend** — React 19, Vite, React Router, Tailwind CSS 4, Framer
Motion, GSAP, lucide-react icons.

**Backend** — Node.js, Express 5, MongoDB via
[Mongoose](https://mongoosejs.com).

## Project structure

```
hyperv-web/
├── hyperv-web-js/     # React + Vite frontend
│   └── src/
│       ├── components/  # Hero, Shop, Cart, Contact, Admin, TrackOrder...
│       ├── data/        # Static flavor/marketing content
│       └── lib/api.js   # Backend API client
└── hyperv-server/     # Express + MongoDB backend
    └── src/
        ├── db/          # Schema, seed data, migrations
        ├── routes/      # products, checkout, contact, admin
        └── middleware/  # Admin auth
```

## Getting started

**Requirements:** Node.js ≥ 18, and a MongoDB connection string (a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster is
the easiest option — see [`DEPLOY.md`](./DEPLOY.md) for setup, or run
MongoDB locally).

```bash
git clone https://github.com/<you>/Hyper-V.git
cd Hyper-V
```

**Backend:**

```bash
cd hyperv-server
npm install
cp .env.example .env      # set MONGODB_URI and ADMIN_PASSWORD here
npm run dev                # → http://localhost:4000
```

**Frontend** (in a second terminal):

```bash
cd hyperv-web-js
npm install
npm run dev                 # → http://localhost:5173
```

Open `http://localhost:5173` — the Vite dev server proxies `/api/*` to
the backend automatically, so no extra config is needed locally.

## API reference

| Method | Path                          | Description                       |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/products`               | List all products                  |
| GET    | `/api/products/:id`           | Get one product                    |
| POST   | `/api/checkout`                | Create an order from cart items    |
| GET    | `/api/checkout/:orderNumber`   | Look up an order's status          |
| POST   | `/api/contact`                 | Submit a contact form message      |
| POST   | `/api/admin/login`             | Admin login, returns a token       |
| GET    | `/api/admin/orders`            | List all orders *(auth required)*  |
| PATCH  | `/api/admin/orders/:orderNumber` | Update order status *(auth)*     |
| GET    | `/api/admin/products`          | List products w/ stock *(auth)*    |
| PATCH  | `/api/admin/products/:id`      | Update stock/price *(auth)*        |

Full request/response details are in
[`hyperv-server/README.md`](./hyperv-server/README.md).

## Environment variables

| Variable         | Where              | Description                                  |
| ---------------- | ------------------ | --------------------------------------------- |
| `PORT`            | backend            | Port the API listens on (default `4000`)      |
| `CORS_ORIGIN`      | backend            | Frontend origin allowed to call the API       |
| `MONGODB_URI`      | backend            | MongoDB connection string                     |
| `ADMIN_PASSWORD`   | backend            | Password for `/admin` — no default, required  |
| `VITE_API_URL`     | frontend           | Backend URL (only needed for production builds; local dev uses the Vite proxy) |

## Deployment

Deployed here using **Railway** for the backend and **Vercel** for the
static frontend build, with **MongoDB Atlas** as the database. Full
walkthrough with exact settings and troubleshooting:
[`DEPLOY.md`](./DEPLOY.md).

## Known limitations

- **No payment processing** — checkout creates an order as `pending` but
  doesn't charge a card. Orders are moved to `paid`/`shipped` manually
  from the admin dashboard.
- **No multi-document transactions** — stock decrements are atomic per
  product, with manual rollback if a later item in a multi-item order
  fails, rather than a single all-or-nothing MongoDB transaction (those
  need a replica set, which isn't guaranteed on every deployment target).
  See `hyperv-server/README.md` for details.
- **Admin sessions are in-memory** — fine for a single admin, but they
  reset on a backend restart and won't scale to multiple admins or
  multiple server instances without moving sessions into the database.
- **No rate limiting** yet on public endpoints like `/api/contact` or
  `/api/admin/login`.
>>>>>>> 1d099c4 (Connect backend)
