**Tech Pulse Daily**

Tech Pulse Daily is a technology news briefing site that curates the biggest moves in AI, cloud, cybersecurity, and product innovation into a quick, readable digest — built for people who want the signal, not the noise.

**What it does**
Top updates — a rotating feed of the latest tech stories, each tagged by category (AI, Cloud, Security, and more) with a short summary, author, and publish date.
Trending topics & briefing notes — hand-picked highlights on what's shaping the industry right now, from enterprise AI adoption to zero-trust security and cloud cost optimization.
Newsletter — readers can subscribe with their email to get a concise weekly digest of the stories that matter most, delivered straight to their inbox.
How it's built

**The project has two parts:**

Frontend (index.html) — a single-page site with the hero, article grid, insights panels, and newsletter signup form. 
Backend (techpulse-backend/) — a Node.js/Express API backed by SQLite that serves articles and stores newsletter subscribers. Admin routes (protected by a bearer token) allow creating, updating, and deleting articles without redeploying the site.

**Status**

This is an early-stage build: real article content, styling, and subscriber tooling (e.g. export, unsubscribe, email delivery) are still to come. The current focus has been getting a working end-to-end pipeline — frontend, API, and database — in place.
