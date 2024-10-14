# Images' Searcher

Search for any image you want!

## Tech Stack

- **REACT**
- **CSS**
- **TypeScript**

## Libraries (No component libraries)

- **REAQT QUERY**: Used for managing and caching server state.
- **REACT ROUTER**: Enables navigation and routing within the application.
- **AXIOS**: A promise-based HTTP client for making requests to the server.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/NikaPanchulidze/Sweeft
2. **Navigate to the Project Directory:**
   ```
   cd Sweeft
3. **Download necessary libraries:**
   ```
   npm i
3. **Start project in a Web Browser:**
   ```
   npm run dev
## Project Structure

- **`public/`**: Contains all SVGs.
- **`src/`**
  - **`context`**: Contains context slice for data handling (context API).
  - **`hooks`**: Contains custom hooks.
  - **`pages`**: Contains page layouts.
  - **`services`**: Manages to fatch data.
  - **`ui`**: Contains general components for UI.
- **`App.tsx`**: Merges Routes together.
- **`index.css`**: Contains all styles.
- **`vite-env.d.ts`**: Contains general information about types.


## Usage:

Users can search dynamically within the application.

Users can open photos to view additional details.

The application employs infinite scrolling to fetch more photos.

## ⚠️ **ATTENTION:** 
If a typed query returns no results (photos are not displayed because they do not exist), that query will not be saved in the cache and history.
