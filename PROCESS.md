Phase 1: The "Napkin" Moment (Inception)
It started with a simple problem: travel planning is often scattered across spreadsheets, weather apps, and budget trackers. The goal was to consolidate this into a single "Dashboard of Discovery."

The Blueprint: We began by sketching out high-fidelity wireframes in a PDF. These weren't just layouts; they defined the user journey—from a high-energy home page featuring "Suggested Destinations" to a granular "Expense Tracker" that kept users from overspending.

The Tech Stack Choice: To handle complex data relationships (like Trips vs. Expenses) while maintaining a lightning-fast UI, we chose the "Power Trio": Django for a secure, relational backend, React for a responsive frontend, and PostgreSQL to house the travel data.

Phase 2: Building the Foundation (The Local Build)
Before the app could live in the cloud, the "plumbing" had to be installed locally on our machines.

Containerization: Instead of installing dozens of tools directly, we used Docker. This ensured that "it works on my machine" would actually mean "it works on any machine."

The Schema: We defined the logic. We built the Destination model with is_featured flags and a Trip model that could calculate budgets in real-time. This turned static ideas into a living database.

Phase 3: Taking Flight (The EC2 Migration)
This is where the project moved from a local experiment to a live application.

The Cloud Shift: You provisioned an AWS EC2 instance, creating a virtual home for Route 200.

The Identity Crisis: We worked through the complexities of SSH keys and .pem files, ensuring your MacBook could "talk" to the server securely via VS Code.

The Synchronization: You established a professional Git workflow. By using the Tony-Updates branch, you created a loop where you could write code in VS Code and "Push" it to the server, seeing your changes go live instantly.

Phase 4: Refining the Vision (The User Experience)
With the server stable, we focused on the "soul" of the application—the UI from your wireframes.

The Sidebar: You implemented a collapsible navigation system that maximized screen real estate, allowing the travel maps and budgets to take center stage.

The Brain (Search): We built the Search & Filter logic. When a user looks for "Paris," the Django backend now sifts through the database and serves up matching destinations, while the React frontend slides out a "Filter Bar" to refine the trip by budget and dates.

Phase 5: The "Finished" Horizon (Final Polish)
The final steps of the journey involved turning Route 200 into a production-ready tool.

Organizational Growth: You moved the project into a GitHub Organization, transforming it from a solo repo into a collaborative workspace.

API Intelligence: The final version integrates live Weather and Flight data, so the "Search Results" aren't just names on a screen—they are real-time travel opportunities.

The Handover: You documented the entire process in a comprehensive README, ensuring that the next developer (or your future self) can spin up the entire environment with a single docker-compose up command.