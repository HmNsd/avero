# Avero

# 🌍 Avero

**Avero** is a modern travel planning and booking app designed for a global audience.  
It helps users discover destinations, plan trips, and book travel seamlessly — all in one place.

---

## ✨ What is Avero?

Avero is built to make travel **simple, smart, and stress-free**.  
From planning itineraries to booking stays and activities, Avero acts as your trusted travel companion.

The name **Avero** represents:
- Discovery
- Clarity
- Effortless exploration
  
  ## 📌 Project Status

🚧 **In Development**  
More features and documentation coming soon.

## 🤝 Contributing

Contributions, ideas, and suggestions are welcome.  
Feel free to open an issue or submit a pull request.

---

A modern Next.js authentication app with AI chat support featuring:
- User registration and login
- Email verification
- Password reset functionality
- Protected profile page
- AI-powered chat assistant
- Dark/Light theme toggle
- Responsive design with animations

## Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone git@github.com:HmNsd/brewncode-nextjs.git
   cd avero
   npm install
   ```

2. **Environment Variables:**

   Create a `.env` file with the following variables:
   ```
   MONGO_URL=your_mongodb_connection_string
   TOKEN_SECRET=your_jwt_secret
   domain=http://localhost:3000
   userMailtrap=your_mailtrap_user
   passwordMailtrap=your_mailtrap_password
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Features & Routes

- `/` — Landing page
- `/signup` — User registration
- `/login` — User login
- `/profile` — User profile (protected)
- `/ai_chat` — AI chat assistant (protected)
- `/verifyemail?token=...` — Email verification
- `/forgotpassword` — Password reset

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion & GSAP
- **Email:** Mailtrap for development
- **UI Components:** Radix UI primitives

## Development

- Responsive design with mobile-first approach
- Dark/Light theme support
- Modern animations and transitions
- AI chat with multiple Gemini models
- Secure authentication flow
- Email verification system
