Route 200: Budget Trip Planner
Route 200 is a full-stack travel management application designed to bridge the gap between inspiration and itemized planning. It allows users to discover destinations, track expenses, and manage itineraries within a strict budget.

:hammer_and_wrench: Project Progress (Current Status)
1. Architecture & Infrastructure
Dockerized Environment: Successfully containerized the application using Docker Compose, separating the Django (REST Framework) backend, React (Vite) frontend, and PostgreSQL database.

AWS Deployment: Hosted on an EC2 instance with a secure SSH-based remote development workflow.

Git Workflow: Established a synchronized branch system (Tony-Updates) between the local VS Code environment and the live production server.

2. Backend (Django)
User Authentication: Implemented JWT-based authentication for secure login and signup.

Database Schema: * Trip Model: Supports budget tracking, start/end dates, and user ownership.

Destination Model: Includes flags for is_featured and is_suggested to drive UI discovery.

Search API: Developed a filtered search endpoint allowing users to query destinations by name and price.

3. Frontend (React)
Collapsible Navigation: Implemented a dynamic sidebar that toggles between full labels and icons to maximize workspace (matches PDF wireframes).

Dashboard Layout: Built a "Home" view featuring a large hero section for featured locations and a grid for suggested destinations.

Search & Filter Panel: Created a dual-view system where searching triggers a right-side "Detail Bar" for refining trip parameters like budget and dates.
