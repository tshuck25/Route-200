Route 200: Budget Trip Planner
Route 200 is a full-stack travel management application designed to bridge the gap between inspiration and itemized planning. It allows users to discover destinations, track expenses, and manage itineraries within a strict budget.

🛠 Project Progress (Current Status)
=======
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

🎯 Final Project Vision (The "Finished" Version)
The intent for the completed version of Route 200 is to be a comprehensive "One-Stop-Shop" for the budget-conscious traveler. The final version will include:

1. Intelligent Search & Discovery
Dynamic Filtering: Users will be able to filter search results by specific categories (Beaches, Mountains, Nightlife) and see real-time price estimations.

Live API Integration: The app will pull real-time data from the Amadeus API (for flight prices) and OpenWeather API to help users choose the best travel dates.

2. Expense & Itinerary Management
Itemized Budgeting: Beyond a general "Trip Budget," users can add specific expenses (meals, tickets, transport) and see a visual "Remaining Funds" progress bar.

Saved Itineraries: A robust "Saved" section where users can drag and drop destinations to organize their daily schedule.

3. Social & Group Collaboration
Group Planning: Using the GitHub Organization structure we established, the app will eventually support collaborative trips where multiple users can contribute to a single budget.

Community Suggestions: A feature allowing users to "Feature" their own itineraries for others to discover.

4. High-Fidelity UI/UX
Smooth Transitions: Full implementation of the transitions and animations hinted at in the PDF wireframes.

Responsive Design: Optimized for both desktop and mobile use, ensuring the "Detail Bar" collapses gracefully on smaller screens.

--------------------------BREAK------------------------------------
🚀 Installation & SetupPrerequisitesBefore you begin, ensure you have the following installed on your local machine:Docker & Docker ComposeGitA Personal Access Token (PAT) for GitHub (if cloning via CLI)
1. Clone the Repository
git clone https://github.com/Your-Org-Name/Route-200.git
cd Route-200
git checkout Tony-Updates

2. Environment ConfigurationThe application relies on environment variables for security and API connectivity. Create a .env file in the root directory:Root .env file:PlaintextDEBUG=True
SECRET_KEY=your_django_secret_key
POSTGRES_DB=route200_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
VITE_API_URL=http://localhost:8000

3. Launching the ApplicationUse Docker Compose to build and start the containers. This will automatically set up the database, install Python dependencies, and compile the React frontend.Bashdocker-compose up -d --build
4. Database InitializationOnce the containers are healthy, run the initial migrations to set up the schema and create your admin account:Bash# Run Migrations
docker-compose exec backend python manage.py migrate

# Create Superuser (to access /admin)
docker-compose exec backend python manage.py createsuperuser
5. Accessing the AppFrontend: http://localhost:5173Backend API: http://localhost:8000/api/Django Admin: http://localhost:8000/admin/🛠 Troubleshooting & Common CommandsTaskCommandView Logsdocker-compose logs -fStop Appdocker-compose downRestart Backenddocker-compose restart backendEnter DB Shelldocker-compose exec db psql -U postgres🛡 Security NoteIMPORTANT: Never commit your .env file to GitHub. It is currently listed in the .gitignore to prevent leaking secret keys and database credentials.
=======

