# Speech-to-Text Web Application

## Overview

This is a modern speech-to-text web application built with React and Express. The application allows users to record speech, convert it to text using the Web Speech API, and manage transcription sessions with full CRUD operations. The frontend uses shadcn/ui components for a polished user interface, while the backend provides RESTful API endpoints for data persistence.

**Recent Update (July 16, 2025)**: Enhanced browser compatibility with improved fallback support for browsers that don't support Web Speech API, allowing the app to function as a text editor with full save/export functionality.

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