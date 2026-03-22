# ✈️ Trippzy - AI Travel Planner

**AI-powered travel itinerary planner based on a real-world problem.**

---

## 🌎 The Problem

One day, while traveling to Tamil Nadu, I realized how broken travel planning is. I didn't know the best places to visit, the local food to try, the budget required, or even basic local phrases to interact with people. 

Every time I needed an answer, I had to search Google, open multiple blogs, check map reviews, and use different tools for hotels and flights. It was frustrating and time-consuming.

I wanted a single solution that understood my needs and gave me a complete, personalized plan instantly. When I couldn't find one, **I built Trippzy.**

---

## 🎯 The Solution

Trippzy is a complete AI travel companion. You simply enter where you want to go, who you're traveling with, and your budget. 

In seconds, the AI generates a highly detailed, personalized itinerary:
* **Day-by-Day Plan** – Exactly what to do and when to do it.
* **Smart Budgeting** – Hotel and activity recommendations that actually fit your wallet.
* **Local Cuisine** – Authentic food suggestions, avoiding tourist traps.
* **Interactive Maps** – Built-in Google Maps links for every single activity.
* **Packing Checklist** – Customized based on your specific destination.
* **PDF Export** – Download your entire trip as a beautifully formatted PDF.

---

## 🔥 Why Trippzy is Unique

Most travel planners just give you generic "Top 10" lists. Trippzy is different:

1. **Context-Aware:** It considers your budget tier (Low/Medium/Luxury) and travel group (Solo/Couple/Family) before making any recommendation.
2. **Actionable:** Instead of just naming a place, it provides the timing, a description, and a direct map link.
3. **All-in-One Dashboard:** Save your trips, track your travel stats, and earn badges based on your exploration history.
4. **Instant Sharing:** Download a professional PDF of your itinerary to share with your travel group instantly.

---

## 💻 Tech Stack

Trippzy is built as a modern, secure, and fast full-stack application.

* **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express.js, REST APIs
* **Database:** MongoDB Atlas with Mongoose
* **AI Engine:** Groq LLM API (for ultra-fast AI inference)
* **Security:** JWT Authentication, bcrypt, Helmet, Rate Limiting, Input Sanitization
* **Integrations:** Nodemailer (Email), html2pdf.js (PDF generation), Google Maps

---

## 🚀 Getting Started

Want to run the project locally?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prashanthgoud15/Trippzy.git
   cd Trippzy
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI, JWT_SECRET, GROQ_API_KEY
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with your backend API URL
   npm run dev
   ```

---

<p align="center">
  Built to solve real travel pain points by <strong>Prashanth Goud</strong>.<br>
  <a href="https://www.linkedin.com/in/prashanthgoud15">LinkedIn</a> • <a href="https://github.com/Prashanthgoud15">GitHub</a>
</p>
