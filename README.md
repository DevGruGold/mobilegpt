# MobileGPT - Offline AI Assistant

<div align="center">
  <img src="public/favicon.png" alt="MobileGPT Logo" width="120" height="120">
  
  **Your personal AI assistant that runs entirely offline**
  
  [![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
  [![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ecf8e)](https://supabase.com)
  [![React](https://img.shields.io/badge/React-18.3.1-61dafb)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)](https://typescriptlang.org)
</div>

## 🚀 Features

- **🧠 Offline AI Processing** - Powered by Gemini Nano, runs entirely on your device
- **🔒 Complete Privacy** - Your conversations never leave your device
- **📷 Image Analysis** - Analyze photos and images with AI vision capabilities
- **💬 Intelligent Chat** - Natural conversation with context awareness
- **📱 Mobile-First Design** - Optimized for mobile devices with native feel
- **🌙 Dark/Light Mode** - Adaptive theming for any environment
- **⚡ Fast Processing** - Local AI processing without internet dependency

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** with custom design system
- **shadcn/ui** for beautiful, accessible components
- **Capacitor** for native mobile capabilities

### AI & Mobile Integration
- **Gemini Nano** for on-device AI processing
- **ML Kit** for enhanced mobile AI features
- **CameraX** integration for image capture and analysis
- **Local storage** for chat history and preferences

### Backend Services
- **Supabase** for user authentication and data sync (optional)
- **Row Level Security** for data privacy
- **Real-time subscriptions** for live features

## 🎨 Design System

MobileGPT features a comprehensive design system built with:

- **Custom CSS variables** for consistent theming
- **HSL color space** for better color manipulation
- **Semantic tokens** for maintainable styling
- **Mobile-first responsive design**
- **Smooth animations** and micro-interactions

## 📱 Mobile Features

- **Native camera integration** via Capacitor
- **Offline-first architecture** for reliable performance
- **Progressive Web App** capabilities
- **Touch-optimized interface** with gesture support
- **Adaptive layouts** for different screen sizes

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- For mobile development: Android Studio (Android) or Xcode (iOS)

### Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd mobilegpt

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Mobile development
npm run android  # Run on Android
npm run ios      # Run on iOS
```

### Environment Setup

Create a `.env` file for Supabase integration (optional):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Configuration

### Capacitor Configuration

The app is configured for mobile deployment with Capacitor. Key configurations:

- **Android**: Minimum API level 24 (Android 7.0)
- **iOS**: Minimum iOS 13.0
- **Permissions**: Camera, storage, and local notifications

### AI Model Configuration

MobileGPT requires downloading AI models for offline operation:

- **Model Size**: ~4.2 GB
- **Storage Requirements**: Minimum 8 GB free space recommended
- **Performance**: Optimized for mobile devices with 4GB+ RAM

## 🚀 Deployment

### Web Deployment

Deploy to any static hosting service:

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Mobile App Store Deployment

1. Build for mobile platforms:
```bash
npm run android
npm run ios
```

2. Open the native projects in Android Studio/Xcode
3. Follow platform-specific deployment guides

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- Powered by [Supabase](https://supabase.com) - Open source Firebase alternative
- AI capabilities by Google's Gemini Nano
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

For support and questions:

- 📧 Email: support@mobilegpt.app
- 💬 Discord: Join our community
- 📖 Documentation: [docs.mobilegpt.app](https://docs.mobilegpt.app)

---

<div align="center">
  <strong>Made with ❤️ for privacy-conscious AI users</strong>
</div>