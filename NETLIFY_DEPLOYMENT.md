# Netlify Deployment Fix

## Issue
Netlify build was failing with error:
```
sh: 1: vite: not found
Command failed with exit code 127: npm run build
```

## Root Cause
- **Vite was in `devDependencies`** instead of `dependencies`
- Netlify installs packages in production mode by default, which **skips `devDependencies`**
- Result: Vite wasn't available during build, causing the "not found" error

## Changes Made

### 1. [package.json](file:///c:/Users/kkffz/FS25_web_dev_final_project/package.json)
Moved build-essential packages from `devDependencies` to `dependencies`:
- ✅ `vite` (^5.0.8)
- ✅ `@vitejs/plugin-react` (^4.2.1)

**Why**: These are required to build the frontend, so they must be in regular dependencies for production builds.

### 2. [netlify.toml](file:///c:/Users/kkffz/FS25_web_dev_final_project/netlify.toml) **(NEW)**
Created Netlify configuration file with:
- **Node version**: Set to Node 18 for compatibility
- **Build command**: `npm run build`
- **Publish directory**: `dist` (Vite output)
- **SPA redirects**: All routes redirect to `index.html` for React Router
- **Optimizations**: CSS/JS bundling and minification enabled

### 3. [.npmrc](file:///c:/Users/kkffz/FS25_web_dev_final_project/.npmrc) **(NEW)**
Added npm configuration for consistent dependency installation.

## Verification

✅ **Local build successful**:
```
vite build
✓ built in 3.92s
```

## Next Steps for Deployment

### Commit and Push Changes
```bash
git add package.json netlify.toml .npmrc
git commit -m "Fix Netlify build: Move Vite to dependencies and add config"
git push origin main
```

### Netlify Environment Variables
Ensure these are set in Netlify Dashboard → Site Settings → Environment Variables:

**Required for Frontend:**
- `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.com/api`)

**Required for Backend (if deploying separately):**
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret key
- `NODE_ENV` = `production`
- `FRONTEND_URL` = Your Netlify frontend URL

### Build Configuration in Netlify
Since we added `netlify.toml`, the configuration is already set. But verify in the Netlify UI:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 (set in netlify.toml)

## Expected Build Output

After pushing changes, Netlify should:
1. ✅ Detect `netlify.toml` configuration
2. ✅ Install all dependencies (including Vite now)
3. ✅ Run `npm run build` successfully
4. ✅ Deploy `dist/` folder
5. ✅ Set up SPA redirects for React Router

## Troubleshooting

**If build still fails:**
1. Clear Netlify build cache: Deploy Settings → Clear cache and retry deploy
2. Check Node version: Ensure it's using Node 18
3. Verify environment variables are set correctly
4. Check build logs for specific errors

**Common issues:**
- **API calls failing**: Set `VITE_API_URL` environment variable
- **404 on page refresh**: Already handled by redirect in netlify.toml
- **Build succeeds but app broken**: Check browser console for environment variable issues
