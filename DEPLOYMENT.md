# Deployment Guide: Render & Vercel

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Render
1. Ensure `server.js` has the correct port configuration
2. The backend uses GridFS with MongoDB Atlas - no changes needed

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `3d-model-backend` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`

5. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://jeswinp:Jes232@cluster0.js9yeap.mongodb.net/3Dmodel=Cluster0
   ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-frontend.vercel.app
   NODE_ENV=production
   ```

6. Click **Create Web Service**
7. Wait for deployment to complete
8. Copy your Render backend URL (e.g., `https://3d-model-backend.onrender.com`)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Environment File
1. Go to `3D-frontend/.env.production`
2. Replace the placeholder with your actual backend URL from Render:
   ```
   REACT_APP_API_URL=https://3d-model-backend.onrender.com
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure:
   - **Framework:** React
   - **Root Directory:** `3D-frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://3d-model-backend.onrender.com
   ```

6. Click **Deploy**
7. Wait for build and deployment to complete
8. Copy your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🔗 Update Backend CORS

After getting your Vercel URL, update the Render backend:

1. Go to Render Dashboard → Your backend service
2. Click **Environment**
3. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:3000,http://localhost:5173,https://your-app.vercel.app
   ```
4. Click **Save Changes** (triggers redeploy)

---

## ✅ Verification Steps

### Test Backend
```bash
curl https://your-render-backend.onrender.com/getAllModels
```
Should return JSON (empty array or models list)

### Test Frontend
1. Visit your Vercel URL
2. Try uploading a `.glb` file
3. Check browser console (F12) for API errors
4. Verify models appear in the viewer

---

## 🐛 Common Issues & Fixes

### Issue: "CORS error" or requests failing
**Solution:**
- Ensure backend `ALLOWED_ORIGINS` includes your Vercel domain
- Check that `REACT_APP_API_URL` matches your Render backend URL
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Failed to fetch models" on Vercel
**Solution:**
- Verify `REACT_APP_API_URL` environment variable is set in Vercel
- Check server logs on Render dashboard
- Ensure MongoDB connection is working (test on Render logs)

### Issue: Upload fails with "400 Bad Request"
**Solution:**
- Ensure multer middleware is properly configured
- Check file size limits
- Verify FormData "model" field name matches backend

### Issue: "Service unavailable" on Render
**Solution:**
- Render free tier may spin down after inactivity
- Upgrade to paid plan for persistent service
- Or use alternative service (Railway, Fly.io)

---

## 📝 Environment Variables Summary

### Render Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://jeswinp:Jes232@cluster0.js9yeap.mongodb.net/3Dmodel=Cluster0
ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
NODE_ENV=production
```

### Vercel Frontend (.env.production)
```
REACT_APP_API_URL=https://your-render-backend.onrender.com
```

---

## 🔄 Redeployment

**If you make changes:**
- Push to GitHub
- Render and Vercel will auto-deploy on push
- Or manually trigger redeploy from their dashboards

---

## 📞 Need Help?
Check browser console (F12) and Render logs for error messages!
