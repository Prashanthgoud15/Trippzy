const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateItinerary = async ({ destination, days, budget, tripType, notes, travelers }) => {
  try {
    const prompt = `
You are an elite travel planner AI. Generate a COMPREHENSIVE and UNIQUE travel plan as a structured JSON object for:

Destination: ${destination}
Duration: ${days} days
Budget: ${budget}
Travelers: ${travelers || 'Not specified'}
Interests/Type: ${tripType ? tripType.join(', ') : 'General'}
Additional Notes: ${notes || 'None'}

Return ONLY valid JSON. Your response MUST be an object containing ALL of these keys:

1. "itinerary": array of day objects. Each day has:
   - "day": integer
   - "theme": string (creative theme, e.g., "Royal Heritage & Sunset Vibes")
   - "activities": array of objects, each with:
     - "time": string ("Morning", "Afternoon", or "Evening")
     - "title": string
     - "description": string (2-3 vivid sentences making the reader excited)
     - "locationName": string (real, specific place with city, e.g., "Lalbagh Botanical Garden, Bengaluru")
     - "estimatedCost": string (in Indian Rupees, e.g., "₹500" or "Free")
     - "googleMapsUrl": string (format: "https://www.google.com/maps/search/?api=1&query=PLACE+NAME+CITY" with proper URL encoding)

2. "hotelRecommendations": array of 4 hotel objects that STRICTLY match the "${budget}" budget tier:
   - If budget is "Low": recommend budget hotels/hostels priced ₹800-₹3,000 per night
   - If budget is "Medium": recommend mid-range hotels priced ₹3,000-₹8,000 per night
   - If budget is "High": recommend premium/luxury hotels priced ₹8,000-₹25,000+ per night
   Each hotel object has:
   - "name": string
   - "address": string (full address)
   - "priceRange": string (in ₹ per night, matching the budget tier above)
   - "rating": number (e.g., 4.5)
   - "googleMapsUrl": string (Google Maps search URL for the hotel)

3. "localCuisineMustTry": array of 4-5 objects, each with:
   - "dish": string
   - "description": string (1-2 sentences about the dish)
   - "whereToFind": string (specific restaurant or area name)
   - "estimatedCost": string (in ₹)

4. "packingChecklist": array of 8-10 string items relevant to the destination, weather, and activities

5. "localPhrases": array of 5-6 objects, each with:
   - "phrase": string (in local language)
   - "meaning": string (English translation)
   - "pronunciation": string (phonetic guide)

6. "budgetBreakdown": object with estimated costs that MATCH the "${budget}" budget tier for ${travelers || '2'} travelers over ${days} days. All string values in ₹:
   - "accommodation": string (total for all nights, e.g., "₹12,000-₹18,000")
   - "food": string (total for all days)
   - "transport": string (total for all days)
   - "activities": string (total for all days)
   - "total": string (grand total for the entire trip, should be realistic for the budget tier)

7. "bestTimeToVisit": string (1-2 sentences)

8. "weatherInfo": string (current season weather description, 1-2 sentences)

IMPORTANT RULES:
- ALL costs MUST be in Indian Rupees (₹). Never use dollars.
- Make ALL places REAL and accurate to ${destination}.
- Hotel recommendations must be REAL hotels.
- Local cuisine must be AUTHENTIC to the region.
- Packing list should consider the destination's climate and planned activities.
- Local phrases should be in the actual local language of ${destination}.
- Do NOT wrap in markdown. Output raw JSON only.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI that only outputs valid JSON. Never include markdown formatting. All monetary values must be in Indian Rupees (₹).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 1,
      response_format: { type: 'json_object' }
    });

    const result = chatCompletion.choices[0]?.message?.content;
    const parsed = JSON.parse(result);
    return parsed;

  } catch (error) {
    console.error('Groq API Error Details:', error.error?.error?.message || error.message);
    console.error('Full Error:', error);
    
    const msg = error.error?.error?.message || error.message || 'Failed to generate AI itinerary';
    throw new Error(`AI Error: ${msg}`);
  }
};

module.exports = { generateItinerary };
