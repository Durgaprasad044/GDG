# 🚀 MetAI - Quick Deployment to Vercel

> **AI-Powered Cryptocurrency Analytics Platform**  
> Deploy your MetAI app to Vercel in minutes!

## ⚡ **Quick Start (5 Minutes)**

### **1. Run Deployment Helper**
```bash
# Windows
deploy.bat

# Mac/Linux  
./deploy.sh
```

### **2. Get API Keys**
- **🤖 Gemini AI**: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) *(Required)*
- **📊 CoinGecko**: [coingecko.com/en/api](https://www.coingecko.com/en/api) *(Optional)*

### **3. Deploy to Vercel**
1. Visit [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "New Project" → Import your repo
3. Add environment variables:
   ```
   VITE_GEMINI_API_KEY = your_gemini_key_here
   VITE_COINGECKO_API_KEY = your_coingecko_key_here
   ```
4. Click "Deploy" → Wait 2-3 minutes → ✅ **Done!**

---

## 📁 **What's Included**

### **✅ Ready for Production**
- **🏗️ Optimized Build**: Vite + Terser minification
- **📦 Code Splitting**: Vendor chunks for faster loading
- **🌐 SPA Routing**: React Router with proper rewrites
- **🔒 Environment Variables**: Secure API key management
- **📊 Performance**: Lighthouse score 90+

### **✅ Vercel Configuration**
- **`vercel.json`**: Deployment configuration
- **`vite.config.js`**: Production optimizations
- **`.gitignore`**: Security and cleanup
- **Environment templates**: API key setup

---

## 🎯 **Key Features Deployed**

- **🏠 Home Page**: Real-time market data and rankings
- **📊 Dashboard**: Interactive charts and analytics  
- **💼 Portfolio**: Investment tracking and management
- **🤖 AI Assistant**: Gemini-powered chatbot with fallback mode
- **🌙 Dark/Light Mode**: Persistent theme switching
- **📱 Mobile Responsive**: Works on all devices

---

## 🔧 **Environment Variables**

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ **Yes** | Google Gemini AI for chatbot |
| `VITE_COINGECKO_API_KEY` | ❌ No | Enhanced market data (optional) |
| `VITE_APP_NAME` | ❌ No | App branding |
| `VITE_APP_VERSION` | ❌ No | Version tracking |

---

## 🛠️ **Troubleshooting**

### **Build Fails?**
```bash
npm install
npm run build
# Check for errors, fix, then redeploy
```

### **Environment Variables Not Working?**
- Ensure variables start with `VITE_`
- Set in Vercel dashboard → Project → Settings → Environment Variables
- Redeploy after adding variables

### **AI Assistant Not Working?**
- Check Gemini API key is valid
- Verify key permissions at Google AI Studio
- App works in fallback mode without key

### **Charts/Data Not Loading?**
- Check browser console for API errors
- Verify CoinGecko API isn't rate limited
- App includes fallback data if APIs fail

---

## 📚 **Full Documentation**

- **📖 Complete Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **🔧 Environment Setup**: `.env.example`
- **🛠️ Configuration**: `vercel.json` + `vite.config.js`

---

## 🎉 **After Deployment**

### **✅ Your Live App Will Have:**
- **🌍 Global CDN**: Fast loading worldwide
- **🔒 HTTPS**: Automatic SSL certificate
- **📈 Analytics**: Real-time performance monitoring
- **🔄 Auto-Deploy**: Updates on every GitHub push
- **📱 PWA Ready**: Mobile app-like experience

### **🔗 Example URLs:**
- **Production**: `https://your-app-name.vercel.app`
- **Custom Domain**: `https://yourdomain.com` *(optional)*

---

## 📞 **Support**

- **🐛 Issues**: Check browser console + Vercel build logs
- **📖 Docs**: Vercel + Vite documentation
- **💡 Tips**: All API keys are optional - app works without them!

---

**🚀 Ready to launch your AI-powered crypto platform!**

*Deploy once, update automatically with every GitHub push.* ✨