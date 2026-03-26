# Local Service Provider Platform 🌍🔨

This platform enables clients to book local service specialists (plumbers, mechanics, electricians) cleanly via robust role-based authentication layers.

## Live Deployments
* **Frontend React Client (Vercel)**: `https://[your-app-domain].vercel.app`
* **Backend Spring Application (Render)**: `https://[your-api-domain].onrender.com`
* **MySQL Database**: PlanetScale / Railway Managed Instances

## Screenshots
> Note: Add specific captured integration visualizers here.

## 1. Backend Application Deployment (Render)
The application architecture is explicitly configured to support dynamic deployments without code adjustment.

**Required Environment Variables (Add these in Render Dashboard):**
* `DB_URL`: JDBC mapped URL structure (e.g. `jdbc:postgresql://containers-us-west.railway.app:5432/railway`)
* `DB_USERNAME`: Database username.
* `DB_PASSWORD`: Database password string.
* `JWT_SECRET`: Random 256-bit hash for protecting auth.
* `FRONTEND_URL`: Absolute URL of the Vercel app (e.g. `https://my-app.vercel.app`)

**Deployment Instructions:**
1. Log into [Render.com](https://render.com).
2. Create **New Web Service** -> Connect your GitHub.
3. Build Command: `mvn clean install`
4. Start Command: `java -jar target/*.jar`
5. Inject the associated Environment Variables explicitly mapped to your Railway/Supabase PostgreSQL instances. The database tables automatically deploy sequentially via `hibernate.ddl-auto=update` context mappings.

## 2. Frontend Application Deployment (Vercel)
The UI bridges strictly via Cross-Origin requests binding securely to relative mappings.

**Required Environment Variables:**
* `VITE_API_URL`: The precise API boundary of your Render deployment (e.g. `https://my-service.onrender.com/api`)

**Deployment Instructions:**
1. Log into [Vercel.com](https://vercel.com) and pull your repository.
2. Select the **`frontend`** directory manually or assign Vercel directory bounds exactly.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add `VITE_API_URL` under Environment variables before pressing Deploy.

## 3. Database Management (Railway/Neon)
Leverage robust hosting paradigms to guarantee scaling database uptimes:
1. Log into [Railway.app](https://railway.app) and "Provision PostgreSQL" container.
2. Under "Connect" variables tab, copy your mapped parameters explicitly dynamically mapping to the Render `DB_URL` constants mapped above. Ensure URL maps correctly (prepend: `jdbc:postgresql://`).
