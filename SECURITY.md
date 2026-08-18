# Security

GYMORA uses Supabase Row Level Security (RLS) to isolate user data and HTTPS in production.

## Repository safety

- Do not commit Supabase `service_role` keys.
- Do not commit webhook signing secrets or private API keys.
- Browser code should use only Supabase Publishable Keys.
- Rotate any credential immediately if it is accidentally exposed.

Security issues should be reported privately to the project owner rather than posted publicly.
