# Trippzy - AI Travel Planner

Plan complete trips in minutes, not hours.

## Real Problem I Faced
During a trip to Tamil Nadu, I faced a common traveler problem: planning was scattered across Google searches, blog posts, map reviews, food videos, and budget calculators.

I needed one place that could answer everything at once: where to go, what to eat, what to spend, and how to communicate with locals.

I built Trippzy as that solution.

## Product Snapshot
Trippzy is an AI-powered travel planning platform that turns a few inputs into an execution-ready itinerary.

Inputs:
1. Destination
2. Dates
3. Budget
4. Traveler type
5. Travel interests

Output:
1. Day-by-day itinerary with timing
2. Budget-aligned hotel recommendations
3. Local cuisine suggestions
4. Packing checklist and local phrases
5. Budget breakdown in INR
6. Google Maps links for locations
7. PDF export and trip sharing

## Why Trippzy Stands Out
1. Real-world context awareness: recommendations adapt to budget and traveler profile
2. Actionable planning: not just ideas, but a usable plan with time, location, and cost guidance
3. End-to-end experience: planning, saving, sharing, and revisiting in one product
4. Personalization at scale: every itinerary is generated for user intent, not copied templates

## Why Users Choose Trippzy
1. Faster decision-making before travel
2. Less planning stress during travel
3. Better local discovery beyond generic tourist lists
4. Clear budget visibility before booking

## Tech Stack
1. Frontend: React, Vite, Tailwind CSS, Framer Motion
2. Backend: Node.js, Express, REST APIs
3. Database: MongoDB with Mongoose
4. AI: llama LLM API
5. Security: JWT, bcrypt, Helmet, CORS, rate limiting, request sanitization
6. Integrations: Nodemailer, html2pdf.js, Unsplash, Google Maps

## Run Locally
1. Clone the repository

	git clone https://github.com/Prashanthgoud15/Trippzy.git
	cd Trippzy

2. Install dependencies

	npm run install-all

3. Add environment variables

	backend/.env
	JWT_SECRET=your_jwt_secret
	EMAIL_USER=your_email
	EMAIL_PASS=your_email_app_password
	FRONTEND_URL=http://localhost:5173

	frontend/.env
	VITE_API_URL=http://localhost:5000
	VITE_UNSPLASH_KEY=your_unsplash_key

4. Start development servers

	npm run dev

## Author
Built independently by Prashanth Goud.

LinkedIn: https://www.linkedin.com/in/prashanth-goud-372485294/
