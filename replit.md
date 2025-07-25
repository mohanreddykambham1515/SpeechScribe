# Speech-to-Text Web Application

## Overview

This is a modern dual-purpose web application built with React and Express, featuring both speech-to-text transcription and voice-controlled web navigation. The application allows users to record speech, convert it to text using the Web Speech API, and execute voice commands to open websites and navigate the web. The frontend uses shadcn/ui components for a polished user interface, while the backend provides RESTful API endpoints for data persistence and command processing.

**Recent Update (July 16, 2025)**: 
- Added Voice Web Agent feature with voice-controlled website navigation
- Enhanced browser compatibility with improved fallback support
- Implemented command processing engine with support for 40+ popular websites
- Added command history tracking and statistics
- Created navigation between Speech-to-Text and Voice Agent modes
- **NEW**: Enhanced with complex action automation supporting multi-step commands:
  - "open YouTube and play Telugu music" → Opens YouTube + provides search steps
  - "search Google for best restaurants" → Opens Google + provides search automation
  - "find on Amazon wireless headphones" → Opens Amazon + provides product search steps
  - "compose email in Gmail" → Opens Gmail + provides compose instructions
  - Added step-by-step instruction display for complex web interactions
- **LATEST**: Comprehensive AI-powered information system for world knowledge:
  - "What is artificial intelligence?" → Detailed explanations with context
  - "Tell me about India" → Geography, culture, and current facts
  - "How does machine learning work?" → Technical concepts made simple
  - "JavaScript" → Programming language details and applications
  - "Bitcoin" → Cryptocurrency explanation with key concepts
  - "Programming" → Overview of coding languages and concepts
  - Intelligent topic recognition with 40+ topic categories
  - Conversational queries like "show me", "tell me", "find out about"
  - Quick action buttons for deeper research and current information
- **ENHANCED**: Massively expanded website recognition system:
  - Added 100+ popular websites including Sports Direct, Nike, Adidas, Netflix, Spotify
  - Intelligent fuzzy matching for partial website names
  - Support for aliases and common variations (e.g., "sport" → Sports Direct)
  - Automatic fallback to construct URLs for unknown sites
  - Enhanced recognition patterns for better user experience
- **MULTITASKING**: Advanced sequential command processing for complex workflows:
  - "1. open youtube 2. search google for news 3. go to gmail" → Executes all 3 tasks in sequence
  - "1. tell me about javascript 2. open github 3. visit stack overflow" → Information + website opening
  - Intelligent numbered list parsing with task result tracking
  - MultitaskDisplay component showing individual task status and results
  - Automatic execution of successful tasks (website opening, information display)
  - Support for mixed task types (information requests, website navigation, complex actions)
  - Task completion statistics and error handling
- **COMPOUND COMMANDS**: Natural language compound command processing:
  - "open youtube and search for cooking tutorials" → Opens YouTube + Google search with automation
  - "tell me about javascript and open github" → Provides JS information + opens GitHub
  - "search for recipes and open pinterest" → Google search + Pinterest opening
  - Intelligent "and" connector parsing for seamless multi-action commands
  - Follow-up suggestions based on completed tasks for enhanced productivity
  - Smart command prioritization (search actions before information requests)
  - Contextual suggestions like "Search YouTube for specific content" after opening YouTube
- **ENHANCED GENERIC SEARCH**: Improved search command processing:
  - "search for cooking tutorials" → Google search with step-by-step automation
  - "search about artificial intelligence" → Comprehensive Google search process
  - "look for wireless headphones" → Automated search with navigation steps
  - Intelligent search query extraction from natural language commands
  - Complete automation instructions for executing searches effectively

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components based on Radix UI
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API**: RESTful endpoints for transcription session management
- **Validation**: Zod for request/response validation
- **Session Storage**: In-memory storage with interface for easy database integration

## Key Components

### Frontend Components
- **SpeechRecorder**: Core recording interface with start/stop/pause functionality
- **TranscriptionDisplay**: Real-time text display with editing capabilities
- **SettingsPanel**: Language and recognition settings configuration
- **ActionsPanel**: Export, save, and file management features
- **StatisticsPanel**: Usage analytics and session tracking
- **Modal Components**: Permission handling and browser compatibility checks

### Backend Components
- **Storage Interface**: Abstracted storage layer supporting both memory and database backends
- **API Routes**: CRUD endpoints for transcription sessions
- **Schema Definition**: Drizzle schema for users and transcription sessions
- **Validation**: Zod schemas for type-safe API operations

### Core Features
- **Real-time Speech Recognition**: Uses Web Speech API for live transcription
- **Multi-language Support**: Configurable language settings for recognition
- **Session Management**: Full CRUD operations for transcription sessions
- **Export Functionality**: Download transcriptions as text files
- **Statistics Tracking**: Word count, duration, and session analytics
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

1. **Speech Input**: User speaks into microphone through Web Speech API
2. **Real-time Processing**: Speech is converted to text with interim results
3. **Session Management**: Transcriptions are saved to database through API
4. **State Management**: TanStack Query manages client-server state synchronization
5. **Local Storage**: Settings and temporary data persisted locally
6. **Export Pipeline**: Transcriptions can be downloaded as text files

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database driver
- **zod**: TypeScript-first schema validation
- **express**: Web framework
- **connect-pg-simple**: PostgreSQL session store

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution engine
- **esbuild**: Fast JavaScript bundler
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database with connection pooling
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Static assets built with Vite, served from `/dist/public`
- **Backend**: Node.js server with Express, bundled with esbuild
- **Database**: PostgreSQL with Drizzle migrations
- **Deployment**: Single-server deployment with static file serving

### Database Schema
- **Users Table**: User authentication and management
- **Transcription Sessions Table**: Session data with metadata (duration, word count, language)
- **Migration System**: Drizzle-kit for schema migrations

The application follows a clean architecture pattern with clear separation between presentation, business logic, and data persistence layers. The modular design allows for easy extension and maintenance while providing a smooth user experience for speech-to-text operations.