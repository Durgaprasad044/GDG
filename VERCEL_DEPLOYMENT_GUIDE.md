# 🚀 MetAI - Complete Vercel Deployment Guide

## 📋 **Prerequisites**

### 1. **Required Accounts**
- ✅ **GitHub Account**: For code repository
- ✅ **Vercel Account**: Free account at [vercel.com](https://vercel.com)
- ✅ **Google AI Studio**: For Gemini API key ([makersuite.google.com](https://makersuite.google.com/app/apikey))
- 🔄 **Optional**: CoinGecko Pro API ([coingecko.com/en/api](https://www.coingecko.com/en/api))

### 2. **Local Requirements**
- ✅ **Node.js**: Version 18+ ([nodejs.org](https://nodejs.org))
- ✅ **Git**: For version control
- ✅ **Code Editor**: VS Code recommended

---

## 📁 **Pre-Deployment Setup**

### **Step 1: Install Dependencies**
```bash
cd "c:\Users\Durga\OneDrive\Desktop\DRA\GDG"
npm install
```

### **Step 2: Add Missing Dependencies**
```bash
npm install terser --save-dev
```

### **Step 3: Test Local Build**
```bash
npm run build
npm run preview
```
✅ **Expected**: App should build without errors and run on preview

---

## 🔐 **Environment Variables Setup**

### **Step 1: Create Local Environment File**
```bash
# Copy the example file
copy .env.example .env
```

### **Step 2: Get API Keys**

#### **🤖 Gemini API Key (Required for AI features)**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

#### **📊 CoinGecko API Key (Optional)**
1. Visit: https://www.coingecko.com/en/api
2. Sign up for free account
3. Go to Developer Dashboard
4. Copy your API key

### **Step 3: Update .env File**
```env
VITE_GEMINI_API_KEY=AIzaSyD...your_actual_key_here
VITE_COINGECKO_API_KEY=CG-...your_coingecko_key_here
VITE_APP_NAME=MetAI
VITE_APP_VERSION=1.0.0
```

---

## 📦 **GitHub Repository Setup**

### **Step 1: Initialize Git (if not done)**
```bash
cd "c:\Users\Durga\OneDrive\Desktop\DRA\GDG"
git init
git add .
git commit -m "Initial commit: MetAI cryptocurrency app"
```

### **Step 2: Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name: `metai-crypto-app` 
4. Description: `MetAI - AI-Powered Cryptocurrency Analytics Platform`
5. Set to **Public** (required for free Vercel)
6. Don't initialize with README (we have files)

### **Step 3: Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/metai-crypto-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 **Vercel Deployment Steps**

### **Step 1: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" → "Continue with GitHub"
3. Authorize Vercel to access your repositories

### **Step 2: Import Project**
1. Click "New Project"
2. Find your `metai-crypto-app` repository
3. Click "Import"

### **Step 3: Configure Project**
**Project Name**: `metai-crypto-app`
**Framework Preset**: `Vite` (should auto-detect)
**Root Directory**: `./` (default)
**Build Command**: `npm run build` (should auto-fill)
**Output Directory**: `dist` (should auto-fill)
**Install Command**: `npm install` (should auto-fill)

### **Step 4: Environment Variables**
In the Vercel import screen, add these environment variables:

```env
VITE_GEMINI_API_KEY = AIzaSyD...your_actual_key_here
VITE_COINGECKO_API_KEY = CG-...your_coingecko_key_here
VITE_APP_NAME = MetAI
VITE_APP_VERSION = 1.0.0
VITE_COINGECKO_BASE_URL = https://api.coingecko.com/api/v3
VITE_GEMINI_BASE_URL = https://generativelanguage.googleapis.com/v1beta
```

### **Step 5: Deploy**
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. 🎉 **Success**: You'll get a live URL like `https://metai-crypto-app.vercel.app`

---

## ⚙️ **Post-Deployment Configuration**

### **Step 1: Test Your Deployment**
1. **🏠 Visit Home Page**: Check market data loads
2. **📊 Test Dashboard**: Verify charts render properly
3. **💼 Check Portfolio**: Ensure forms work
4. **🤖 Test Assistant**: Verify chatbot responds (both AI and fallback)

### **Step 2: Custom Domain (Optional)**
1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### **Step 3: Performance Optimization**
Vercel automatically provides:
- ✅ **CDN**: Global content delivery
- ✅ **SSL**: HTTPS certificate
- ✅ **Gzip**: Automatic compression
- ✅ **Caching**: Optimal cache headers
- ✅ **Analytics**: Performance monitoring

---

## 🔄 **Continuous Deployment**

### **Automatic Updates**
Every time you push to GitHub `main` branch:
1. Vercel automatically detects changes
2. Builds and deploys new version
3. Live site updates within 1-2 minutes

### **Update Workflow**
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
# Vercel automatically deploys!
```

---

## 🛠️ **Troubleshooting**

### **Common Build Errors**

#### **1. "Module not found" Error**
```bash
# Install missing dependencies
npm install
npm run build
```

#### **2. "Environment variables not defined"**
- Check Vercel dashboard → Project → Settings → Environment Variables
- Ensure all `VITE_` prefixed variables are set
- Redeploy after adding variables

#### **3. "Build failed" Error**
```bash
# Test build locally first
npm run build
# If successful, check Vercel build logs
```

#### **4. "Routing not working" (404 on refresh)**
- Ensure `vercel.json` rewrites configuration is correct
- Check that SPA routing is properly configured

#### **5. "API calls failing"**
- Verify environment variables are set correctly
- Check browser console for CORS errors
- Ensure API keys are valid and have proper permissions

### **Debug Checklist**
- ✅ All dependencies installed (`npm install`)
- ✅ Local build works (`npm run build`)
- ✅ Environment variables set in Vercel
- ✅ GitHub repository is public
- ✅ API keys are valid and active
- ✅ `vercel.json` configuration is present

---

## 📊 **Performance Optimization**

### **Already Implemented**
- ✅ **Code Splitting**: Vendor chunks separated
- ✅ **Minification**: Terser optimization
- ✅ **Tree Shaking**: Unused code removed
- ✅ **Console Removal**: Production logs cleaned
- ✅ **Asset Optimization**: Images and fonts optimized

### **Vercel Features**
- ✅ **Edge CDN**: Global distribution
- ✅ **Image Optimization**: Automatic image processing
- ✅ **Function Optimization**: API route optimization
- ✅ **Real-time Analytics**: Performance monitoring

---

## 🔒 **Security Best Practices**

### **API Keys**
- ✅ **Never commit** `.env` files to git
- ✅ **Use environment variables** for all sensitive data
- ✅ **Rotate keys regularly** (every 3-6 months)
- ✅ **Monitor usage** to detect unauthorized access

### **CORS Configuration**
- ✅ **Proper headers** set in `vercel.json`
- ✅ **Domain restrictions** for production APIs
- ✅ **Request validation** for user inputs

---

## 📈 **Monitoring & Analytics**

### **Vercel Analytics** (Free)
- ✅ **Core Web Vitals**: Performance metrics
- ✅ **Real User Monitoring**: Actual user experience
- ✅ **Function Metrics**: API performance

### **Custom Analytics** (Optional)
- Google Analytics 4
- Mixpanel
- PostHog

---

## 🎯 **Final Checklist**

### **Before Deployment**
- [ ] ✅ All dependencies installed
- [ ] ✅ Local build successful
- [ ] ✅ Environment variables configured
- [ ] ✅ Code committed to GitHub
- [ ] ✅ Repository is public
- [ ] ✅ API keys obtained and tested

### **After Deployment**
- [ ] ✅ Home page loads correctly
- [ ] ✅ Navigation works on all pages
- [ ] ✅ Dark/light mode toggle functions
- [ ] ✅ Charts render properly
- [ ] ✅ Portfolio forms work
- [ ] ✅ AI assistant responds (with and without API key)
- [ ] ✅ Mobile responsive design
- [ ] ✅ Performance score > 90

---

## 🚀 **Deployment Commands Summary**

```bash
# 1. Install dependencies
npm install

# 2. Test build locally
npm run build
npm run preview

# 3. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 4. Deploy to Vercel (via web interface)
# Visit vercel.com and import your GitHub repo
```

---

## 🎉 **Success!**

Your MetAI cryptocurrency application is now live on Vercel with:

- ✅ **Lightning-fast performance** with global CDN
- ✅ **Automatic HTTPS** and security headers
- ✅ **Continuous deployment** from GitHub
- ✅ **Scalable infrastructure** that grows with your users
- ✅ **Professional domain** and custom branding
- ✅ **Real-time analytics** and monitoring

**🌟 Your app is production-ready and accessible worldwide!**

---

## 📞 **Need Help?**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **React Router**: [reactrouter.com](https://reactrouter.com)

**Happy deploying! 🚀**