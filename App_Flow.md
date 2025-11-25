# KSA Journey Mapper - Application Flow

## 1. Overview
The KSA Journey Mapper is a React-based single-page application (SPA) that visualizes the end-to-end experience of a tourist visiting Saudi Arabia. It uses **Google Gemini 2.5 Flash** to dynamically generate unique personas, narratives, and sentiment data based on a selected traveler type.

## 2. Architecture & Data Flow

### A. Initialization
1.  **Entry Point**: `index.tsx` mounts the `App` component.
2.  **Initial Load**: `App.tsx` triggers a `useEffect` hook to call `fetchData` with a default persona ("Luxury").
3.  **Loading State**: While fetching, a full-screen loading skeleton is displayed to the user.

### B. Data Generation (Service Layer)
1.  **Service**: `services/gemini.ts` handles the API communication.
2.  **Request**: It sends a structured prompt to the Gemini API (`gemini-2.5-flash`).
    *   **Input**: Persona Type (e.g., "Adventure", "Religious").
    *   **Constraints**: JSON output, concise narrative (max 25 words), 5 specific journey stages.
3.  **Response Parsing**: The raw JSON text from Gemini is parsed into a TypeScript interface (`JourneyData`) containing:
    *   `persona`: Details about the traveler.
    *   `stages`: An array of 5 steps (Pre-trip to Departure).
    *   `sentimentScore`: A numerical value (0-100) for each stage.

### C. UI Rendering & Interaction
The UI is split into two main sections (responsive):

1.  **Left Panel (Desktop) / Top Section (Mobile)**:
    *   **Persona Card**: Displays the generated user profile (Name, Origin, Style).
    *   **Sentiment Chart**: Uses `recharts` to render an Area Chart visualizing the `sentimentScore` across the 5 stages. This gives a quick visual indication of the trip's emotional highs and lows.

2.  **Right Panel (Desktop) / Bottom Section (Mobile)**:
    *   **Experience Timeline**: A scrollable list of `StageCard` components.
    *   **Active State**: Clicking a card expands it (accordion style) to reveal the narrative and 3 specific "Experience Points" (Positive/Neutral/Negative moments).
    *   **Background**: The background image updates dynamically based on the `imageUrl` keyword of the currently active stage.

### D. Persona Switching
1.  **User Action**: User selects a new type from the dropdown in the header.
2.  **Optimized Loading**: 360M
    *   The `loading` state is set to `true`.
    *   **Crucially**, the *old data is not removed*. The UI stays populated but dims (`opacity-60`), and a spinner appears in the header.
    *   This "stale-while-revalidate" pattern prevents layout shifts and makes the app feel faster.
3.  **Update**: Once Gemini returns new data, the state updates, the opacity returns to normal, and the new journey is displayed.

## 3. Tech Stack
*   **Framework**: React 18+ (Vite)
*   **Styling**: Tailwind CSS (Custom KSA theme colors: Deep Blue, Gold, Sand).
*   **AI Integration**: `@google/genai` SDK.
*   **Visualization**: `recharts` for data graphing.
*   **Icons**: `lucide-react` with dynamic mapping.
*   **Typography**: 'Playfair Display' (Headings) & 'Inter' (Body).

## 4. Key Features
*   **Cinematic Visuals**: Full-screen background blending and glassmorphism UI.
*   **Responsive Design**: Optimized for both mobile vertical scrolling and desktop split-screen.
*   **Generative Content**: Every journey is unique, created in real-time by AI.
