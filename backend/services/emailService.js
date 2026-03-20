const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────── WELCOME EMAIL ───────────────
const sendWelcomeEmail = async (name, email) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f7ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:32px;letter-spacing:-0.5px;">✈️ Trippzy</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">AI-Powered Travel Planner</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:40px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <h2 style="color:#1e293b;margin:0 0 8px;font-size:24px;">Welcome aboard, ${name}! 🎉</h2>
      <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your account has been created successfully. You're now ready to explore the world with AI-powered travel planning.
      </p>

      <!-- Features -->
      <div style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:24px;">
        <h3 style="color:#334155;margin:0 0 16px;font-size:16px;">Here's what you can do:</h3>
        <table style="width:100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;color:#475569;font-size:14px;">🗺️ Generate AI-powered itineraries for any destination</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#475569;font-size:14px;">🏨 Get personalized hotel recommendations</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#475569;font-size:14px;">🍛 Discover local cuisine must-tries</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#475569;font-size:14px;">💰 Get detailed budget breakdowns in ₹</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#475569;font-size:14px;">📄 Download & share your trips as PDF</td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/planner" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;text-decoration:none;padding:14px 40px;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 4px 16px rgba(59,130,246,0.3);">
          Plan Your First Trip →
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
        You're receiving this because you signed up on Trippzy.<br>
        © ${new Date().getFullYear()} Trippzy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: '"Trippzy ✈️" <support.trippzy@gmail.com>',
      to: email,
      subject: `Welcome to Trippzy, ${name}! 🎉 Start planning your dream trips`,
      html,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

// ─────────────── ITINERARY EMAIL ───────────────
const sendItineraryEmail = async (email, name, trip) => {
  const days = trip.itinerary?.length || 0;
  const startDate = new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Build itinerary rows
  let itineraryHtml = '';
  if (trip.itinerary) {
    trip.itinerary.forEach(day => {
      itineraryHtml += `
        <div style="margin-bottom:20px;">
          <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;padding:12px 16px;border-radius:10px 10px 0 0;font-weight:700;font-size:15px;">
            📍 Day ${day.day}: ${day.theme}
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0;border-top:none;">`;
      day.activities.forEach(act => {
        const timeIcon = act.time.toLowerCase().includes('morning') ? '🌅' : act.time.toLowerCase().includes('afternoon') ? '☀️' : '🌙';
        itineraryHtml += `
            <div style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <strong style="color:#1e293b;font-size:14px;">${timeIcon} ${act.title}</strong>
                <span style="color:#16a34a;font-size:13px;font-weight:600;">${act.estimatedCost}</span>
              </div>
              <p style="color:#64748b;font-size:13px;margin:4px 0;line-height:1.5;">${act.description}</p>
              <span style="color:#3b82f6;font-size:12px;">📍 ${act.locationName}</span>
            </div>`;
      });
      itineraryHtml += `</div></div>`;
    });
  }

  // Build hotel section
  let hotelsHtml = '';
  if (trip.hotelRecommendations?.length) {
    hotelsHtml = `
      <div style="margin:24px 0;">
        <h3 style="color:#1e293b;font-size:18px;margin:0 0 12px;">🏨 Hotel Recommendations</h3>
        <div style="display:grid;gap:12px;">`;
    trip.hotelRecommendations.forEach(h => {
      hotelsHtml += `
          <div style="background:#fff;padding:14px;border-radius:10px;border:1px solid #e2e8f0;">
            <strong style="color:#1e293b;font-size:14px;">${h.name}</strong>
            <p style="color:#64748b;font-size:12px;margin:4px 0;">${h.address}</p>
            <span style="color:#16a34a;font-size:13px;font-weight:600;">${h.priceRange}</span>
            <span style="color:#f59e0b;font-size:13px;margin-left:12px;">⭐ ${h.rating}</span>
          </div>`;
    });
    hotelsHtml += `</div></div>`;
  }

  // Budget breakdown
  let budgetHtml = '';
  if (trip.budgetBreakdown && Object.keys(trip.budgetBreakdown).length) {
    budgetHtml = `
      <div style="background:#ecfdf5;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #bbf7d0;">
        <h3 style="color:#166534;font-size:16px;margin:0 0 12px;">💰 Budget Breakdown</h3>
        <table style="width:100%;" cellpadding="0" cellspacing="0">
          ${trip.budgetBreakdown.accommodation ? `<tr><td style="padding:6px 0;color:#475569;font-size:13px;">🏨 Accommodation</td><td style="text-align:right;font-weight:600;color:#1e293b;font-size:13px;">${trip.budgetBreakdown.accommodation}</td></tr>` : ''}
          ${trip.budgetBreakdown.food ? `<tr><td style="padding:6px 0;color:#475569;font-size:13px;">🍽️ Food</td><td style="text-align:right;font-weight:600;color:#1e293b;font-size:13px;">${trip.budgetBreakdown.food}</td></tr>` : ''}
          ${trip.budgetBreakdown.transport ? `<tr><td style="padding:6px 0;color:#475569;font-size:13px;">🚗 Transport</td><td style="text-align:right;font-weight:600;color:#1e293b;font-size:13px;">${trip.budgetBreakdown.transport}</td></tr>` : ''}
          ${trip.budgetBreakdown.activities ? `<tr><td style="padding:6px 0;color:#475569;font-size:13px;">🎯 Activities</td><td style="text-align:right;font-weight:600;color:#1e293b;font-size:13px;">${trip.budgetBreakdown.activities}</td></tr>` : ''}
          ${trip.budgetBreakdown.total ? `<tr><td style="padding:10px 0 0;color:#166534;font-size:15px;font-weight:700;border-top:2px solid #86efac;">TOTAL</td><td style="text-align:right;font-weight:700;color:#166534;font-size:15px;padding-top:10px;border-top:2px solid #86efac;">${trip.budgetBreakdown.total}</td></tr>` : ''}
        </table>
      </div>`;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f7ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;">✈️ Your Trip is Ready!</h1>
      <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:22px;font-weight:700;">${trip.destination}</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:30px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      
      <p style="color:#64748b;font-size:15px;margin:0 0 20px;">
        Hi <strong>${name}</strong>! Your AI-generated itinerary for <strong>${trip.destination}</strong> is ready. Here's your complete travel plan:
      </p>

      <!-- Trip Summary -->
      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <span style="display:inline-block;margin:0 12px;color:#475569;font-size:14px;">📅 ${startDate} – ${endDate}</span>
        <span style="display:inline-block;margin:0 12px;color:#475569;font-size:14px;">🗓️ ${days} Days</span>
        <span style="display:inline-block;margin:0 12px;color:#475569;font-size:14px;">💰 ${trip.budget === 'Low' ? 'Budget' : trip.budget === 'Medium' ? 'Moderate' : 'Luxury'}</span>
        ${trip.travelers ? `<span style="display:inline-block;margin:0 12px;color:#475569;font-size:14px;">👥 ${trip.travelers}</span>` : ''}
      </div>

      <!-- Itinerary -->
      <h3 style="color:#1e293b;font-size:18px;margin:0 0 16px;">📅 Day-by-Day Itinerary</h3>
      ${itineraryHtml}

      ${hotelsHtml}
      ${budgetHtml}

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/trips/${trip._id}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;text-decoration:none;padding:14px 40px;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 4px 16px rgba(59,130,246,0.3);">
          View Full Itinerary →
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
        This itinerary was generated by Trippzy AI for ${email}.<br>
        © ${new Date().getFullYear()} Trippzy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: '"Trippzy ✈️" <support.trippzy@gmail.com>',
      to: email,
      subject: `Your ${days}-Day Trip to ${trip.destination} is Ready! 🗺️`,
      html,
    });
    console.log(`✅ Itinerary email sent to ${email}`);
  } catch (error) {
    console.error('❌ Itinerary email error:', error.message);
  }
};

module.exports = { sendWelcomeEmail, sendItineraryEmail };
