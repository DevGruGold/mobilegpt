# 🚀 MobileGPT Setup Guide

## Prerequisites

### System Requirements
- **Node.js 18+** and npm 8+
- **Chrome 128+** (for built-in AI support)
- **22GB+ free storage** (for AI model downloads)
- **8GB+ RAM** recommended for optimal performance

### For Mobile Development
- **Android Studio** (for Android deployment)
- **Xcode** (for iOS deployment on macOS)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/DevGruGold/mobilegpt.git
cd mobilegpt

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Enable Chrome Built-in AI (Recommended)

#### For Chrome 128+ Users:

1. **Enable Gemini Nano in Chrome:**
   - Open Chrome and go to `chrome://flags/`
   - Search for "Optimization Guide On Device Model"
   - Set to "Enabled BypassPerfRequirement"
   - Search for "Prompt API for Gemini Nano"
   - Set to "Enabled"
   - Restart Chrome

2. **Verify Model Download:**
   - Go to `chrome://on-device-internals/`
   - Check if Gemini Nano is available and downloaded
   - If not downloaded, trigger download by using the app

3. **Hardware Requirements Check:**
   - Ensure you have 22GB+ free space
   - Check that your device meets GPU/CPU requirements
   - Model will auto-download on first use

### 3. Alternative AI Engines Setup

#### Option A: Transformers.js (Universal Fallback)
- ✅ **Auto-configured** - No additional setup required
- Downloads lightweight models (~500MB) on first use
- Works in any modern browser with WebAssembly support

#### Option B: WebLLM (Advanced Performance)
```bash
# WebLLM is included but requires first-time model download
# Models are cached locally after first download
# Recommended for devices with 8GB+ RAM
```

#### Option C: Ollama (Local Server)
```bash
# Install Ollama locally
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a lightweight model
ollama pull llama3.2:1b

# Start Ollama server
ollama serve

# The app will auto-detect running Ollama instance
```

## Mobile Deployment

### Android Deployment

```bash
# Build for Android
npm run android

# Or manually:
npm run build
npx cap sync android
npx cap open android
```

### iOS Deployment (macOS only)

```bash
# Build for iOS
npm run ios

# Or manually:
npm run build
npx cap sync ios
npx cap open ios
```

## Configuration Options

### Environment Variables (.env)

```env
# Optional: Supabase for cloud sync (can be disabled)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Ollama server URL (default: localhost:11434)
VITE_OLLAMA_URL=http://localhost:11434

# Optional: Preferred AI engine
VITE_PREFERRED_ENGINE=chrome-builtin
```

### Model Storage Locations

- **Chrome AI Models:** Managed by Chrome browser
- **Transformers.js Models:** `~/.cache/huggingface/` or browser cache
- **WebLLM Models:** Browser IndexedDB storage
- **Ollama Models:** `~/.ollama/models/`

## Troubleshooting

### Chrome Built-in AI Issues

**Problem:** "Model unavailable" error
```bash
# Solutions:
1. Check chrome://on-device-internals/
2. Ensure 22GB+ free space
3. Restart Chrome after enabling flags
4. Try incognito mode to clear cache
```

**Problem:** "Hardware requirements not met"
```bash
# Requirements:
- Windows 10/11, macOS 13+, or Linux
- 4GB+ VRAM (GPU) OR 16GB+ RAM (CPU)
- Not supported on mobile Chrome yet
```

### General AI Issues

**Problem:** Model download fails
```bash
# Check internet connection
# Clear browser cache/storage
# Try different AI engine:
localStorage.setItem('mobilegpt-preferred-engine', 'transformers');
```

**Problem:** Slow performance
```bash
# Use lighter models:
- Chrome AI: Automatic optimization
- Transformers.js: Already using lightweight model
- WebLLM: Switch to smaller model variant
```

### Mobile Build Issues

**Problem:** Android build fails
```bash
# Update Android SDK and build tools
# Check Android Studio setup
# Ensure Java 17+ is installed
npx cap doctor android
```

**Problem:** iOS build fails (macOS only)
```bash
# Update Xcode to latest version
# Check iOS deployment target
npx cap doctor ios
```

## Development Tips

### Testing AI Functionality
1. Start with Chrome built-in AI for best experience
2. Test fallback engines in different browsers
3. Monitor model download progress in DevTools
4. Use React DevTools to debug state issues

### Performance Optimization
1. Models are cached after first download
2. Use streaming responses for better UX
3. Implement proper error boundaries
4. Test on target mobile devices

### Adding Custom Models
```typescript
// Extend the AI engine system
// Add new engine in enhanced-useOfflineAI.ts
// Follow existing pattern for consistency
```

## Next Steps

1. **Test the Application:** Try different AI engines and features
2. **Customize Models:** Experiment with different model sizes/types  
3. **Deploy to Mobile:** Build and test on actual devices
4. **Extend Features:** Add more AI capabilities as needed

## Support

- **GitHub Issues:** Report bugs and feature requests
- **Documentation:** Check the updated README.md
- **Community:** Join discussions in the repository

Happy coding! 🤖✨