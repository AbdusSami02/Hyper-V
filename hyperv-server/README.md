# hyperv-server

Backend for the HyperV storefront. Node.js + Express + MongoDB (via Mongoose).

## Setup

You need a MongoDB connection string. Easiest option: a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster —
create one, add a database user, allow network access from anywhere (or
your IP), and copy the connection string from "Connect → Drivers". It
looks like:

```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hyperv?retryWrites=true&w=majority
```

Alternatively, run MongoDB locally and use
`mongodb://localhost:27017/hyperv`.

```bash
npm install
cp .env.example .env   # set MONGODB_URI, ADMIN_PASSWORD
npm run dev             # http://localhost:4000, restarts on file changes
```

`npm start` runs it without the file watcher.

On boot, the server connects to MongoDB and seeds the `products`
collection (and re-syncs it on every boot) from `src/db/seedData.js`.
Edit that file to change products — no migration needed, it's an upsert.
`stock` is only set the first time a product is created; after that it's
admin-managed and survives restarts.

## API

| Method | Path                        | Description                                  |
| ------ | --------------------------- | --------------------------------------------- |
| GET    | `/api/health`               | Liveness check                                |
| GET    | `/api/products`             | List all products (includes stock)            |
| GET    | `/api/products/:id`         | Get one product                               |
| POST   | `/api/checkout`             | Create an order from cart items               |
| GET    | `/api/checkout/:orderNumber`| Look up an order by its confirmation number   |
| POST   | `/api/contact`              | Store a contact form submission               |
| POST   | `/api/admin/login`          | Log in with `{ password }`, returns a token   |
| POST   | `/api/admin/logout`         | Invalidate the current admin token            |
| GET    | `/api/admin/orders`         | List all orders (admin, requires token)       |
| PATCH  | `/api/admin/orders/:orderNumber` | Update order status (admin)              |
| GET    | `/api/admin/products`       | List products with stock (admin)              |
| PATCH  | `/api/admin/products/:id`   | Update stock and/or price (admin)             |

### POST /api/checkout

```json
{
  "items": [{ "id": "neon-rush", "quantity": 2 }],
  "customer": { "name": "Ada Lovelace", "email": "ada@example.com" }
}
```

Prices are always re-looked-up from the database server-side — the client
only sends product ids and quantities, never prices, so a tampered request
can't check out at a discount.

### POST /api/contact

```json
{ "name": "Grace Hopper", "email": "grace@example.com", "message": "Hi!" }
```

Messages are stored in the `contactmessages` collection. No email is sent
yet — wire up a provider (Resend, Postmark, SMTP via nodemailer, etc.) in
`src/routes/contact.js` if you want a real notification on submit.

### Admin auth

The admin API uses a simple password + bearer token scheme, not full user
accounts:

- Set `ADMIN_PASSWORD` in `.env` — there's no default, login fails without it.
- `POST /api/admin/login` checks the password and returns a random token.
- Send that token as `Authorization: Bearer <token>` on every admin request.
- Tokens live in memory only (a `Set`, not the database) and expire after 12
  hours or on server restart, whichever comes first. That's fine for a
  single internal admin tool; it wouldn't scale to multiple admins or a
  multi-process deployment without moving sessions into the database.

### Inventory & concurrency

`products.stock` is decremented with an atomic `findOneAndUpdate` filtered
on `stock >= quantity`, so a single flavor can never be oversold even
under concurrent checkouts. If an order has multiple items and a later
item fails (unknown product / out of stock), the stock already decremented
for earlier items in that same request is rolled back before the error is
returned — there's no multi-document transaction wrapping the whole order
(that needs MongoDB running as a replica set, which isn't guaranteed on
every deployment; MongoDB Atlas always is one, so if you're on Atlas this
is a place you could tighten further if you want true transactional
all-or-nothing behavior).

## Notes / next steps

- **Payments**: `/api/checkout` records the order as `status: "pending"` but
  doesn't charge a card. Wire in Stripe (or similar) before taking real
  orders — create a PaymentIntent, only mark the order `paid` after webhook
  confirmation. The admin dashboard can already move an order to `paid` /
  `shipped` / `cancelled` manually in the meantime.
- **Storefront stock display**: the shop page doesn't yet show live stock or
  disable sold-out flavors — see the note in the top-level README about the
  storefront still rendering from static frontend data.
- **Rate limiting**: none yet, including on `/api/admin/login`. Worth adding
  (e.g. `express-rate-limit`) before deploying publicly.
