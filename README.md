# AgriVision AI

An advanced, cinematic AI-powered crop analysis application for modern farmers.

## 🚀 How to Deploy (Get a Live URL)

You can deploy this application for free using **Vercel**.

### Prerequisites
1. A [GitHub](https://github.com) account.
2. A [Vercel](https://vercel.com) account.
3. A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Steps

1.  **Push to GitHub**
    *   Initialize a git repository in this folder: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Initial commit"`
    *   Create a new repo on GitHub and push your code there.

2.  **Deploy on Vercel**
    *   Go to your Vercel Dashboard.
    *   Click **"Add New..."** > **"Project"**.
    *   Select your `AgriVision_Ai` repository.
    *   **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
    *   **Environment Variables**:
        *   Expand the "Environment Variables" section.
        *   Key: `API_KEY`
        *   Value: `YOUR_ACTUAL_GOOGLE_API_KEY_HERE`
    *   Click **Deploy**.

3.  **Done!**
    *   Vercel will build your project and give you a live URL (e.g., `https://agrivision.vercel.app`).

## 🛠️ Local Development

To run this project locally:

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env` file in the root directory:
    ```env
    API_KEY=your_api_key_here
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🔑 Admin Access
*   **Admin Key**: `admin123`
