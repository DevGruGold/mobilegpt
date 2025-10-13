# 🤖 MobileGPT - True Offline AI Assistant

<div align="center">

[![MobileGPT Logo](https://via.placeholder.com/128x128/000000/FFFFFF?text=🤖)](https://github.com/DevGruGold/mobilegpt)

**The first truly offline, multimodal AI assistant that runs entirely on your device**

[![Built with React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://typescriptlang.org/)
[![Powered by Capacitor](https://img.shields.io/badge/Capacitor-6.1-119eff?logo=capacitor)](https://capacitorjs.com/)
[![Chrome AI Ready](https://img.shields.io/badge/Chrome%20AI-Gemini%20Nano-4285f4?logo=googlechrome)](https://developer.chrome.com/docs/ai/built-in)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ What Makes MobileGPT Special

MobileGPT is the **first mobile-optimized AI assistant** that works completely offline with true multimodal capabilities. No internet required, no data sent to servers, no privacy concerns.

### 🎯 Key Features

- 🔒 **100% Offline & Private** - Your conversations never leave your device
- 🖼️ **True Multimodal AI** - Analyze images, understand context, generate responses
- 📱 **Mobile-First Design** - Optimized for phones and tablets with native feel
- 🚀 **Multiple AI Engines** - Chrome Built-in AI, WebLLM, Transformers.js, Ollama support
- ⚡ **Smart Engine Selection** - Automatically chooses the best available AI engine
- 🌙 **Adaptive Interface** - Dark/light modes with smooth animations
- 📦 **Progressive Web App** - Install as native app with offline capabilities
- 🔄 **Background Model Downloads** - Smart caching and progressive loading

## 🏗️ Architecture & AI Engines

### Multi-Engine AI System

MobileGPT supports **4 different AI engines**, automatically selecting the best one available:

#### 1. 🥇 **Chrome Built-in AI (Gemini Nano)** - *Primary*
- **Best Performance & Quality**
- Runs Google's Gemini Nano locally in Chrome 128+
- Full multimodal support (text + images)
- Hardware-accelerated inference
- ~4.2GB model size, auto-managed by Chrome

#### 2. 🔥 **WebLLM** - *High Performance*
- Advanced local LLMs in the browser
- Models: Llama 3.2, Qwen, Phi-3
- WebGPU acceleration when available
- Great for powerful devices (8GB+ RAM)

#### 3. 🌍 **Transformers.js** - *Universal Fallback*
- Works in any modern browser
- Lightweight models (~500MB)
- ONNX runtime with WebAssembly
- Broad device compatibility

#### 4. 🖥️ **Ollama** - *Developer Option*
- Local server integration
- Full control over models
- Perfect for development/testing
- Requires local Ollama installation

### 📱 Mobile-Native Stack

```
┌─────────────────────────┐
│     React 18 + TS       │  ← Modern UI framework
├─────────────────────────┤
│   Capacitor 6 Bridge    │  ← Native mobile APIs
├─────────────────────────┤
│    AI Engine Layer     │  ← Smart engine selection
├─────────────────────────┤
│  Local Model Storage   │  ← Offline model caching
├─────────────────────────┤
│   Device Hardware      │  ← CPU/GPU/NPU optimization
└─────────────────────────┘
```

## 🚀 Quick Start

### System Requirements

- **Chrome 128+** (for best experience with Gemini Nano)
- **22GB free space** (for AI model downloads)
- **8GB+ RAM** (recommended for optimal performance)
- **Modern mobile browser** with WebAssembly support

### One-Command Setup

```bash
# Clone and run
git clone https://github.com/DevGruGold/mobilegpt.git
cd mobilegpt
npm install
npm run dev
```

### Enable Chrome Built-in AI (Recommended)

1. **Chrome Setup:**
   ```
   chrome://flags/#optimization-guide-on-device-model
   → Set to "Enabled BypassPerfRequirement"
   
   chrome://flags/#prompt-api-for-gemini-nano  
   → Set to "Enabled"
   ```

2. **Restart Chrome** and visit your app
3. **First Launch** will trigger model download (automatic)
4. **Monitor Progress** at `chrome://on-device-internals/`

### Build for Mobile

```bash
# Android
npm run android

# iOS (macOS only)  
npm run ios

# Progressive Web App
npm run build
# Deploy dist/ to any static hosting
```

## 💡 Usage Examples

### Basic Chat
```typescript
// The app automatically selects the best AI engine
"Hello! How can I help you today?"
```

### Image Analysis
```typescript
// Take photo with camera or upload image
"What do you see in this image?"
// → AI analyzes image and provides detailed description
```

### Multimodal Conversations
```typescript
// Upload an image of a recipe
"Can you help me modify this recipe to be vegan?"
// → AI understands image content and provides suggestions
```

### Context Awareness
```typescript
"What was the main topic of our conversation?"
// → AI remembers conversation context locally
```

## 🛠️ Development

### Project Structure

```
mobilegpt/
├── src/
│   ├── components/
│   │   ├── chat/           # Chat interface components
│   │   ├── ui/             # Reusable UI components
│   │   └── onboarding/     # First-run experience
│   ├── hooks/
│   │   ├── useOfflineAI.ts # Main AI engine integration
│   │   └── use-toast.ts    # Toast notifications
│   ├── types/
│   │   └── chat.ts         # TypeScript definitions
│   └── pages/
│       └── Index.tsx       # Main app entry point
├── public/                 # Static assets
├── android/               # Native Android project
├── ios/                   # Native iOS project (if added)
└── dist/                  # Built app for deployment
```

### Key Implementation Files

#### Enhanced AI Hook (`useOfflineAI.ts`)
```typescript
// Multi-engine AI system with automatic fallback
export function useOfflineAI(): UseOfflineAIReturn {
  // Chrome AI, WebLLM, Transformers.js, Ollama support
  // Automatic engine detection and selection
  // Progress tracking for model downloads
  // Error handling and recovery
}
```

#### Mobile-Optimized Chat Interface
```typescript
// Real-time streaming responses
// Camera integration for image analysis  
// Touch-optimized UI with haptic feedback
// Offline-first architecture
```

### Adding New AI Engines

```typescript
// 1. Extend the AIEngine type
export type AIEngine = 'chrome-builtin' | 'transformers' | 'webllm' | 'ollama' | 'your-engine';

// 2. Add detection function
const checkYourEngine = useCallback((): boolean => {
  return /* your detection logic */;
}, []);

// 3. Add initialization function  
const initializeYourEngine = useCallback(async () => {
  // Your engine setup code
}, []);

// 4. Add generation function
const generateWithYourEngine = async (session: any, prompt: string) => {
  // Your inference code
};
```

## 🎨 Customization

### Themes & Styling
```css
/* CSS custom properties for easy theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
```

### Model Configuration
```typescript
// Switch between AI engines programmatically
await switchEngine('webllm');    // High performance
await switchEngine('transformers'); // Universal compatibility  
await switchEngine('ollama');       // Local development
```

### UI Components
Built on shadcn/ui with full customization support:
- Consistent design system
- Accessible components  
- Mobile-optimized interactions
- Smooth animations

## 📊 Performance & Benchmarks

### Model Comparison

| Engine | Model Size | Load Time | Quality | Device Support |
|--------|------------|-----------|---------|----------------|
| Chrome AI | ~4.2GB | 30-60s | ⭐⭐⭐⭐⭐ | Chrome 128+ |
| WebLLM | 1-4GB | 60-120s | ⭐⭐⭐⭐ | Modern browsers |
| Transformers.js | ~500MB | 15-30s | ⭐⭐⭐ | Universal |
| Ollama | Variable | 5-10s | ⭐⭐⭐⭐⭐ | Local server |

### Hardware Recommendations

- **Minimum:** 4GB RAM, 8GB storage
- **Recommended:** 8GB+ RAM, 32GB+ storage  
- **Optimal:** 16GB+ RAM, GPU acceleration

## 🔒 Privacy & Security

### Data Handling
- **Zero server communication** for AI inference
- **Local model storage** with browser/OS security
- **No telemetry** or usage tracking
- **End-to-end privacy** for all conversations

### Security Features
- CSP (Content Security Policy) headers
- Secure model loading and verification
- Memory management for sensitive data
- Automatic cleanup of cached conversations

## 🚢 Deployment Options

### Progressive Web App
```bash
npm run build
# Deploy dist/ to any static hosting service
# Automatic PWA registration and offline support
```

### Mobile App Stores
```bash
# Generate signed APK/AAB for Google Play
npm run build
npx cap build android --prod

# Generate iOS app for App Store (macOS + Xcode)
npm run build  
npx cap build ios --prod
```

### Self-Hosted
```bash
# Docker deployment
docker build -t mobilegpt .
docker run -p 3000:3000 mobilegpt

# Static hosting (Netlify, Vercel, GitHub Pages)
npm run build && npm run deploy
```

## 🛣️ Roadmap

### ✅ Current Features (v1.0)
- [x] Multi-engine AI support
- [x] Offline multimodal capabilities
- [x] Mobile-optimized interface
- [x] Progressive Web App
- [x] Camera integration
- [x] Smart engine selection

### 🔄 In Development (v1.1)
- [ ] Voice input/output support
- [ ] Advanced image editing
- [ ] Plugin system for extensions
- [ ] Model fine-tuning interface
- [ ] Conversation export/import

### 🚀 Future Plans (v2.0)
- [ ] Video analysis capabilities
- [ ] Real-time collaboration
- [ ] Advanced RAG (Retrieval Augmented Generation)
- [ ] Custom model training
- [ ] Multi-language interface

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Add tests for new features
- Update documentation
- Test on multiple devices/browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Chrome Team** - For Chrome Built-in AI APIs
- **Hugging Face** - For Transformers.js ecosystem
- **MLC LLM Team** - For WebLLM framework
- **Ollama Community** - For local LLM serving
- **Capacitor Team** - For mobile framework
- **shadcn/ui** - For beautiful UI components

## 📞 Support

### Getting Help
- 📖 **Documentation:** [Setup Guide](./SETUP.md)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/DevGruGold/mobilegpt/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/DevGruGold/mobilegpt/discussions)
- 📧 **Email:** support@mobilegpt.dev

### Community
- 🌟 **Star this repo** if you find it useful!
- 🔄 **Share** with others interested in offline AI
- 🤝 **Contribute** to make it even better

---

<div align="center">

**Built with ❤️ for privacy-conscious AI users**

[⭐ Star](https://github.com/DevGruGold/mobilegpt) • [🍴 Fork](https://github.com/DevGruGold/mobilegpt/fork) • [📝 Issues](https://github.com/DevGruGold/mobilegpt/issues) • [🚀 Deploy](https://github.com/DevGruGold/mobilegpt#deployment-options)

</div>