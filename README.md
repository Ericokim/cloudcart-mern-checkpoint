# CloudCart MERN Checkpoint

**CloudCart** is a full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a modern, responsive shopping experience with product browsing, filtering, and order management capabilities.

## 🚀 Live Demo

**Deployed Application:** [https://cloudcart-h5dnebegeba4gehp.southafricanorth-01.azurewebsites.net/](https://cloudcart-h5dnebegeba4gehp.southafricanorth-01.azurewebsites.net/)

Hosted on Azure App Service with continuous deployment via GitHub Actions.

![CloudCart Azure Deployment](assets/cloudcart-deployed.png)

## Tech Stack

- **Database:** MongoDB Atlas for scalable data storage
- **Backend:** Node.js, Express.js with Mongoose ODM
- **Frontend:** React with Vite for fast development and optimized builds
- **Styling:** Tailwind CSS with a warm, card-based UI theme
- **HTTP Client:** Axios for seamless API communication
- **Deployment:** Azure App Service with CI/CD via GitHub Actions

## Project Structure

```txt
cloudcart-mern-checkpoint/
  frontend/ React storefront
    src/components/
    src/hooks/
    src/lib/api/
    src/pages/
    src/styles/
  backend/  Express API, controllers, routes, middleware, models, seeders
  .env      Local backend configuration
```

## Features

- Product listing from MongoDB.
- Controller and route based Express API.
- Order validation and centralized error middleware.
- Starter product seeding on first server run.
- Manual seed scripts for resetting products and orders.
- Cart management in React.
- Search, stock filter, and product sorting.
- Axios API client under `frontend/src/lib/api`.
- Tailwind CSS styling with a warm card-based theme.
- Simple order submission.
- Recent order API for deployment verification.
- Production static serving from `backend/public`.
- One-command local development with `concurrently`.
- Environment-variable based configuration.

## Local Setup

### 1. Configure MongoDB

Create `.env` from the example at the project root:

```bash
cp .env.example .env
```

Add your MongoDB Atlas connection string:

```env
MONGO_URI=<your-mongodb-atlas-connection-string>
PORT=5001
NODE_ENV=development
CLIENT_URL=<your-local-client-url>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRY=24h
```

Do not commit the real `.env` file.

For quick local review, CloudCart can run without `MONGO_URI`. In that case, the backend uses in-memory demo data. For real deployment, configure MongoDB Atlas with `MONGO_URI`.

### 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

### 3. Run the Full App

From the project root:

```bash
npm run dev
```

This runs:

- Express API with `nodemon`
- React frontend with Vite

The default local API port is `5001`, and the Vite dev server proxies `/api` requests to it.

### Optional: Run Each App Separately

Backend:

```bash
npm run server
```

The backend exposes (among others):

- `GET /api/health`
- `GET /api/products` and `GET /api/products/:id`
- `POST /api/auth/register`, `POST /api/auth/login`
- `POST /api/orders`, `GET /api/orders`

### Optional: Reset Seed Data

Import starter products and clear existing orders/products:

```bash
npm run data:import
```

Destroy products and orders:

```bash
npm run data:destroy
```

Frontend:

In a second terminal:

```bash
cd frontend
npm run dev
```

The Vite dev server proxies `/api` requests to the local Express server.

If you deploy the frontend separately from the backend, create `frontend/.env`:

```env
VITE_API_BASE=<server-url>
```

## Production Build

From the project root, build the frontend and copy its output into the folder Express serves in production (`backend/public`):

```bash
npm run build
```

This single command installs root + frontend dependencies, runs the Vite build, and copies `frontend/dist` into `backend/public`.

Start the production server:

```bash
NODE_ENV=production npm start
```

In production (`NODE_ENV=production`) Express serves the static build from `backend/public` and falls back to `index.html` for any non-`/api` route, so client-side deep links such as `/products/:id`, `/login`, `/admin/products`, and `/account/orders` work on direct load and refresh. `/api/*` routes continue to return JSON. The server listens on `process.env.PORT` (Azure provides this automatically) and falls back to `5001` locally.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure Network Access.
5. Copy the connection string.
6. Set the connection string as `MONGO_URI`.

## Azure Deployment

CloudCart deploys to **Azure App Service** via GitHub Actions (`.github/workflows/main_cloudcart.yml`). On every push to `main` the workflow:

1. Installs dependencies (`npm install`).
2. Runs `npm run build`, which builds the frontend and copies it into `backend/public`.
3. Runs `npm run check` (syntax check) and verifies `backend/public/index.html` exists.
4. Deploys the whole repo to the `cloudcart` App Service.

Azure runs `npm start` (the `main` field is `backend/server.js`) and supplies `PORT` automatically.

### Required Azure App Service configuration

Set these as Application Settings (environment variables) in the Azure portal. Do **not** commit real secrets.

```txt
NODE_ENV=production
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRY=24h
```

`CLIENT_URL` is only needed for local cross-origin development; production is same-origin and does not require it. If `MONGO_URI` is omitted the app runs in in-memory demo mode.

## Deployment Test Checklist

- Homepage loads.
- Product cards display from MongoDB.
- Cart add/remove/quantity actions work.
- Order submission works.
- `GET /api/health` returns `status: ok`.
- No real secrets are committed.

## Notes

This project includes JWT-based authentication (with bcrypt password hashing) and client-side routing via `react-router-dom`, but intentionally avoids real payments. The checkpoint goal is to prove that a MERN app can be prepared, configured, deployed, and tested.
