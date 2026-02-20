# Synesthetica - Synesthesia-Inspired Drawing Application

A creative web application that transforms colors and brush strokes into sound, creating a unique synesthetic experience where visual art becomes auditory art.

## 🎨 Features

### Core Functionality
- **Drawing Canvas** - Interactive canvas with multiple brush types and sizes
- **Sound Synthesis** - Real-time audio generation based on color and position
- **Color Palettes** - 8 professionally designed color palettes
- **Brush System** - 6 different brush types with customizable sizes
- **Multi-language Support** - 6 languages (English, Azerbaijani, Russian, Turkish, Arabic, Chinese)
- **Theme Switching** - Dark and light mode support
- **Responsive Design** - Mobile and desktop optimized interface

### Technical Stack
- **Frontend**: React 19 with React Router 7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **TypeScript**: Full type safety
- **Deployment**: Azure Web App with GitHub Actions
- **Authentication**: Auth.js integration
- **State Management**: Zustand stores

### Audio Features
- **Color-to-Frequency Mapping** - RGB values converted to audio frequencies
- **Position-based Modulation** - X-axis position affects sound characteristics
- **Multiple Instruments** - Piano, Guitar, Strings, Bell, and waveforms
- **Volume Control** - Adjustable master volume with mute functionality
- **Real-time Processing** - Immediate audio feedback while drawing

### User Interface
- **Collapsible Sidebar** - Organized tool panels
- **Professional Toolbars** - Color, brush, sound, and tool panels
- **Draggable Panels** - Customizable workspace layout
- **Canvas Controls** - Zoom, pan, and history management
- **Touch Support** - Full mobile/tablet compatibility

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/Ayka11/Synesany.git
cd Synesany/Desktop/Synesthetica/SSanything/apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
npm run dev          # Start development server (localhost:4001)
npm run build        # Create production build
npm run start        # Serve production build
npm run typecheck    # Run TypeScript type checking
```

## 🌐 Deployment

### Live Application
- **URL**: https://synestica.azurewebsites.net
- **Platform**: Azure Web App
- **CI/CD**: GitHub Actions automatic deployment
- **Environment**: Production optimized

### Environment Variables
Required environment variables for deployment:
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://synestica.azurewebsites.net`
- `AZURE_STORAGE_CONNECTION_STRING`
- `DATABASE_URL`
- `AUTH_SECRET`

## 📁 Project Structure

```
src/
├── app/                    # React Router app structure
│   ├── api/               # API routes
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── constants/         # Application constants
│   ├── hooks/             # Custom hooks
│   ├── stores/            # State management
│   └── utils/             # Utility functions
├── components/              # UI components
│   ├── Canvas/            # Canvas-related components
│   ├── ProfessionalToolbar/ # Advanced tool panels
│   ├── Workspace/         # Main workspace
│   └── ui/                # Base UI components
└── public/                 # Static assets
```

## 🎯 Key Features Explained

### Synesthesia Engine
The application maps visual input to auditory output through:
- **Color Analysis**: RGB values extracted from selected colors
- **Frequency Generation**: Mathematical conversion to audio frequencies (200Hz-800Hz range)
- **Spatial Audio**: X-axis position modulates sound characteristics
- **Envelope Control**: ADSR envelopes for natural sound decay

### Professional Tools
- **Color Management**: Advanced color picker with palette support
- **Brush System**: Multiple brush types (round, square, spray, etc.)
- **Audio Instruments**: Piano, strings, bells, and synthesizer waveforms
- **Workspace Layout**: Drag-and-drop panel system

## 🛠️ Development

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow React hooks patterns
- Maintain consistent naming conventions
- Write responsive, accessible code

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Support

For questions, support, or feature requests:
- **GitHub Issues**: https://github.com/Ayka11/Synesany/issues
- **Live Application**: https://synestica.azurewebsites.net

---

**Transform your creativity into sound with Synesthetica!** 🎨🎵
