# CRM_Backend

API Endpoints
Health Check

GET / → Returns "Mini CRM API is running...".

Authentication

GET /auth/google → Start Google OAuth login.

GET /auth/google/callback → Google OAuth callback, redirects to frontend /landing.

AI

POST /api/ai/messages → Generate AI-powered messages.
(Requires: apiKeyAuth, ensureAuth)

Campaigns

POST /api/campaigns/ → Create a new campaign.

GET /api/campaigns/ → Get all campaigns.

GET /api/campaigns/:campaignId/logs → Get logs for a specific campaign.
(Requires: apiKeyAuth, ensureAuth)

Customers

POST /api/customers/ → Add a customer.

GET /api/customers/ → Get all customers.
(Requires: apiKeyAuth, ensureAuth)

Orders

POST /api/orders/ → Add an order.

GET /api/orders/ → Get all orders.
(Requires: apiKeyAuth, ensureAuth)

Segments

POST /api/segments/preview → Preview a segment.

POST /api/segments/ → Save a segment.

GET /api/segments/ → Get all segments.

POST /api/segments/members → Get members of a segment.
(Requires: apiKeyAuth, ensureAuth)

Delivery

POST /delivery-receipt → Update delivery status.
