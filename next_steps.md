# Next Steps: Database, Deployment, and GitHub

Here is a roadmap to take "Salubris" from a local prototype to a production-ready application.

## 1. Linking to a Database
Currently, the app uses `localStorage` which is limited to the user's specific browser and device. To sync data across devices, you need a cloud database.

### Recommended Option: Firebase (Google) or Supabase
Both are excellent "Backend-as-a-Service" platforms perfect for React apps.

**Option A: Firebase (Firestore)**
1.  **Create Project**: Go to [firebase.google.com](https://firebase.google.com/) and create a new project.
2.  **Install SDK**: `npm install firebase`
3.  **Configuration**: Create `src/services/firebase.js` and initialize with keys from the Firebase console.
4.  **Authentication**: Enable "Authentication" (Email/Google Sign-in) in Console.
5.  **Database**: Enable "Firestore Database".
6.  **Refactor**: Update `userStore`, `poopStore`, etc., to read/write from Firestore instead of localStorage.

**Option B: Supabase (PostgreSQL)**
1.  **Create Project**: Go to [supabase.com](https://supabase.com/).
2.  **Install SDK**: `npm install @supabase/supabase-js`
3.  **Refactor**: Similar to Firebase, replace localStorage calls with Supabase clients.

## 2. Pushing to GitHub
Version control safely stores your code.

1.  **Initialize Git** (if not done):
    ```bash
    git init
    ```
2.  **Create .gitignore**: Ensure `node_modules`, `.env`, and `dist` are ignored (already done in this project).
3.  **Stage and Commit**:
    ```bash
    git add .
    git commit -m "Initial commit of Salubris app"
    ```
4.  **Create Repo on GitHub**:
    - Go to github.com -> New Repository.
    - Do not initialize with README/license (you have local code).
5.  **Link and Push**:
    - Copy the commands shown by GitHub (under "…or push an existing repository from the command line"):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/salubris.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploying the App
For React/Vite apps, **Vercel** or **Netlify** are the industry standards. They offer free tiers and automatic deployments from GitHub.

### Using Vercel (Recommended)
1.  **Push to GitHub** first (see step 2).
2.  **Sign up/Login** to [vercel.com](https://vercel.com/) (continue with GitHub).
3.  **Add New Project**: Click "Add New..." -> "Project".
4.  **Import Repository**: Select your `salubris` repo.
5.  **Configure Build**: Vercel usually auto-detects Vite.
    - Framework Preset: `Vite`
    - Build Command: `npm run build`
    - Output Directory: `dist`
6.  **Environment Variables**:
    - **CRITICAL**: You must add your `VITE_GEMINI_API_KEY` in the Vercel dashboard under "Environment Variables".
    - Paste the value you have in your local `.env`.
7.  **Deploy**: Click "Deploy".

Your app will be live at `https://salubris.vercel.app` (or similar) in minutes!
