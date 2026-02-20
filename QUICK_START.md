# 🚀 Quick Start - Deployment Steps

## Step 1: Update Environment Files (10 min)

### For Render Backend:
1. Go to [render.com](https://render.com)
2. Create Web Service → Connect GitHub → Select this repo
3. **Environment Variables:**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://jeswinp:Jes232@cluster0.js9yeap.mongodb.net/3Dmodel=Cluster0
   ALLOWED_ORIGINS=http://localhost:3000,https://YOUR-VERCEL-DOMAIN.vercel.app
   NODE_ENV=production
   ```
4. Build Command: `npm install`
5. Start Command: `npm start`
6. **Save your Render URL** (e.g., `https://3d-model-backend.onrender.com`)

### For Vercel Frontend:
1. Go to [vercel.com](https://vercel.com)
2. Import Project → Select this repo
3. **Root Directory:** `3D-frontend`
4. **Build:** `npm run build`
5. **Environment Variable:**
   ```
   REACT_APP_API_URL=YOUR-RENDER-URL-HERE
   ```
6. Deploy!

---

## Step 2: Update Backend CORS (2 min)

After Vercel deploys and gives you a URL:
1. Go back to Render
2. Settings → Environment
3. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:3000,https://YOUR-VERCEL-DOMAIN.vercel.app
   ```
4. Save (auto-redeploys)

---

## Step 3: Test APIs (5 min)

**Test Backend:**
```bash
curl https://YOUR-RENDER-URL/getAllModels
```
Should return: `[]` or `[{...}, {...}]`

**Test Frontend:**
1. Visit your Vercel domain
2. Try uploading a .glb file
3. Press F12 → Console
4. Check for errors

---

## 📋 What I Fixed:

✅ API configuration with smart fallbacks  
✅ CORS setup for production  
✅ Environment file templates  
✅ Better error logging in console  
✅ FormData upload handling  
✅ Deployment configurations  

---

## 🆘 Still Having Issues?

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Look for error messages with full URL and status**
4. **Check server logs in Render dashboard**
5. **Verify environment variables are set correctly**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting!
