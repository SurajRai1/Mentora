# Mentora Educational Platform

A modern educational platform built with React, Vite, and Firebase, featuring AI-powered learning assistance and progress tracking.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd mentora-educational-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_FIREBASE_DATABASE_URL=your_database_url
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🛠️ Built With

- React 18
- Vite
- Firebase
- OpenAI API
- TailwindCSS
- React Router
- Chart.js
- And more...

## 📝 Features

- AI-Powered Learning Assistance
- Progress Tracking
- Interactive Learning Dashboard
- PDF Rendering
- Real-time Database Integration
- Authentication System
- Responsive Design

## 🌐 Deployment

This project is configured for deployment on Netlify. Simply connect your GitHub repository to Netlify and:

1. Set build command as `npm run build`
2. Set publish directory as `dist`
3. Configure environment variables in Netlify dashboard
4. Deploy! 