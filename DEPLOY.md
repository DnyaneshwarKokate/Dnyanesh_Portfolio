# Deployment Guide: Go Backend & Next.js Frontend

This guide outlines the steps to deploy your portfolio application online.

---

## 1. Deploy Frontend on Vercel

Vercel is the recommended and easiest hosting service for Next.js applications.

### Steps to Deploy:
1. Create a free account at [Vercel](https://vercel.com).
2. Connect your GitHub account and click **Add New** -> **Project**.
3. Select your `DnyaneshPortFolio` repository.
4. Set the following project configurations:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Expand the **Environment Variables** accordion and add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-go-backend-url.onrender.com` *(The URL you get after deploying your backend in Step 2)*
6. Click **Deploy**. Vercel will build the app and give you a public URL (e.g. `https://your-portfolio.vercel.app`).

---

## 2. Deploy Go Backend on Render

Render is a developer-friendly cloud hosting platform that supports Go Web Services.

### Steps to Deploy:
1. Create a free account at [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `portfolio-backend`
   - **Environment**: `Go`
   - **Root Directory**: `backend`
   - **Build Command**: `go build -o server main.go`
   - **Start Command**: `./server`
   - **Instance Type**: Web Service (Free tier)
5. Expand the **Advanced** section to add Environment Variables:
   - **Key**: `PORT`
   - **Value**: `8081` *(Matches the port registered in Go)*
   - **Key**: `JWT_SECRET`
   - **Value**: `your_custom_secure_jwt_token_secret`
   - **Key**: `SMTP_HOST` *(Optional, e.g. smtp.gmail.com)*
   - **Value**: `smtp.gmail.com`
   - **Key**: `SMTP_PORT` *(Optional, e.g. 587)*
   - **Value**: `587`
   - **Key**: `SMTP_USER` *(Optional, e.g. yourAddress@gmail.com)*
   - **Value**: `yourAddress@gmail.com`
   - **Key**: `SMTP_PASS` *(Optional, your App Password)*
   - **Value**: `yourGmailAppPassword`
6. Click **Create Web Service**.

### ⚠️ GORM SQLite Database Warning on Serverless hosting
The current backend setup utilizes SQLite (`portfolio.db`). Under free serverless platforms (like Render Free tier), the filesystem is **ephemeral** (read-only/reset on restarts). 
If you write/add new projects or skills in the dashboard, **they will be erased when the Render container sleeps or restarts.**

#### How to Solve:
To persist your dashboard changes permanently on Render:
1. **Render Disk (Paid Option)**: Attach a persistent Render Disk mount to store your `portfolio.db` database file.
2. **Cloud Database (Recommended & Free)**: Modify the backend connection config to connect to a free external cloud database (such as a free PostgreSQL instance on [neon.tech](https://neon.tech) or a MySQL database on [Aiven](https://aiven.io)).
