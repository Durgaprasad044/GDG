# ⚡ Quick Deploy Card - MetAI to Vercel

## 🚨 **IMPORTANT FIX**
**Error: "No Output Directory named 'build' found"**  
**✅ SOLUTION: Set Output Directory to `dist` (not `build`)**

---

## 🚀 **3-Step Deploy**

### **1. 📁 GitHub**
```bash
git add .
git commit -m "Deploy MetAI"
git push origin main
```

### **2. ⚙️ Vercel Settings**
| Setting | Value |
|---------|-------|
| Framework | **Vite** |
| Build Command | `npm run build` |
| **Output Directory** | **`dist`** ⚠️ |
| Install Command | `npm install` |

### **3. 🔐 Environment Variables**
```env
VITE_GEMINI_API_KEY = your_api_key_here
```
*(Optional - app works without it)*

---

## ✅ **Verification**

**✅ Build Success:**
```
✓ built in 30s
dist/index.html  1.23 KB
dist/assets/...  (JS & CSS files)
```

**✅ Live App Features:**
- 🏠 Home: Market data ✅
- 📊 Dashboard: Charts ✅  
- 💼 Portfolio: Tools ✅
- 🤖 AI Assistant: Chatbot ✅
- 📱 Mobile: Responsive ✅

---

## 🔧 **If Issues:**

**❌ "build" directory error:**
→ Set Output Directory to `dist`

**❌ Page doesn't load:**
→ Check `vercel.json` exists with rewrites

**❌ API features don't work:**
→ Add `VITE_GEMINI_API_KEY` in Vercel env vars

---

## 🎯 **Expected URL:**
`https://your-project-name.vercel.app`

**🎉 Deploy time: ~2-3 minutes total**

---

**Your MetAI crypto app is ready for deployment! 🚀**