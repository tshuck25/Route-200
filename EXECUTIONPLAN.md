Phase 1: The Logic Core (API & Search)
Monday, April 20: The "Search & Filter" Logic
Goal: Connect the search bar to your Django backend.

Tasks:

Implement the DestinationSearchView in Django.

Build the frontend handleSearch function in React.

Milestone: When you type "Paris" and hit Enter, your "Filter Sidebar" (from Page 4 of the PDF) should slide in with real data.

Tuesday, April 21: Live Data Integration (Weather & Flights)
Goal: Make the app feel "Live" using external APIs.

Tasks:

Integrate OpenWeather API to show current temps for searched destinations.

Set up a mock or live integration for the Amadeus API to display flight price estimates.

Milestone: The "Search Result" cards should now display the current weather and a "Starting from $XXX" price.

Phase 2: User Features (Trips & Expenses)
Thursday, April 23: The Trip Builder
Goal: Enable users to "Save" a trip and define dates.

Tasks:

Create the "Add to Trip" button on search results.

Build the Date Picker logic to update the start_date and end_date in your Postgres database.

Milestone: A user can successfully create a new Trip object in the database from the UI.

Saturday, April 25: Expense Tracker & Progress Bars
Goal: Implement the "Budget Management" features from Page 6 of the PDF.

Tasks:

Build an "Expense List" component.

Create a "Budget Progress Bar" that turns red if expenses exceed the trip's budget field.

Milestone: Adding a $50 "Dinner" expense should instantly update the remaining budget bar.

Phase 3: Refinement & Polish
Monday, April 27 - Tuesday, April 28: UI/UX & CSS Cleanup
Goal: Make the app look identical to your high-fidelity wireframes.

Tasks:

Apply final CSS styling (Shadows, Border-Radius, and the "Route 200" color palette).

Ensure the Collapsible Sidebar is smooth and responsive on different screen sizes.

Milestone: The app should be "Demo Ready"—no broken layouts or placeholder colors.

Phase 4: Final Stretch (The Home Stretch)
Thursday, April 30 - Saturday, May 2: Bug Squashing & Testing
Goal: Ensure the app doesn't crash during the final presentation.

Tasks:

Test the Docker deployment on EC2 one last time.

Fix any "edge case" bugs (e.g., what happens if a user searches for a city that doesn't exist?).

Finalize the README with a "Demo Video" link or screenshots.

May 4 - May 18: Final Presentation Prep & Buffer
Goal: Polish the narrative of your project.

Tasks:

Prepare your talking points using the "Inception Story" we created.

Use these last classes for any "Stretch Goals" (like adding a Google Map integration or a social sharing feature).