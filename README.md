# Vibe Coach App

Vibe Coach is a personal financial assistant application built with React Native and Expo. It helps users track their finances, manage goals, and receive personalized financial advice through an AI-powered chat interface.

## Tech Stack

- **Framework**: React Native (Expo)
- **Routing**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management / Data Fetching**: TanStack Query (React Query)
- **Language**: TypeScript
- **Markdown Rendering**: react-native-markdown-display

## Project Structure

- `src/app`: Contains the application screens and routing logic.
  - `(tabs)`: Main tab navigation (Chat, Dashboard, Profile, Settings).
  - `login.tsx`: Authentication screen.
  - `_layout.tsx`: Root layout configuration.
- `src/services`: API integration services.
  - `api.ts`: Axios configuration and endpoints.
- `src/contexts`: React Context definitions (e.g., AuthContext).
- `src/types`: TypeScript interface definitions.
- `src/hooks`: Custom React hooks.

## Setup and Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Application**
   - For Android:
     ```bash
     npm run android
     ```
   - For iOS:
     ```bash
     npm run ios
     ```
   - For Web:
     ```bash
     npm run web
     ```

## API Configuration

The application communicates with a backend API running locally.
- **Base URL**: Configured in `src/services/api.ts` (Default: `http://192.168.0.11:5010`)
- **Timeout**: 60 seconds (to accommodate AI processing time).

### Endpoints

- **Users**: `/users` (POST, GET, PATCH)
- **Transactions**: `/transactions` (POST, GET, PATCH, DELETE)
- **Goals**: `/goals` (POST, GET)
- **Chat**: `/chat` (POST) - Sends user message with context to the AI.

## Features

- **AI Chat**: Context-aware financial advice. The app injects user profile and transaction history into messages to provide personalized responses. Supports Markdown formatting.
- **Dashboard**: Visual overview of finances (implied).
- **Profile**: User information display.
- **Settings**: App configuration and logout.
- **Authentication**: Simple user login flow.
