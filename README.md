# GraphQL Profile

A Single Page Application (SPA) built with **Vanilla JavaScript** that consumes a **GraphQL API** to display user profile information and statistics.

## Features

* 🔐 User authentication with JWT
* 👤 User profile information (firstName & LastName & Login & Cohort)
* ⚡ XP information
* 📊 Grades and project statistics
* 📈 Audit ratio
* 📉 Statistics displayed with SVG graphs
* 🧭 Client-side routing
* 📱 Responsive design
* 🚪 Logout functionality

## Technologies

* HTML5
* CSS
* JavaScript (ES Modules)
* GraphQL
* SVG
* JWT
* Fetch API
* Git / GitHub

## Project Structure

```text
GraphQL/
│
├── 
│   ├── index.html
│   │
│   ├── Js/
        |--components
│   │   
│   │      
│   │       ├── api.js
│   │       ├── login.js
│   │       ├── logout.js
│   │       └── ...
        |--api.js
        |--router.js
│   │
│   └── Css/
│   |  └── style.css
│   | ── README.md
  
```

## Authentication

The application uses JWT authentication.

The authentication flow is:

```text
User
  │
  │ username/email + password
  ▼
Authentication API
  │
  │ JWT
  ▼
Frontend
  │
  │ Authorization: Bearer <JWT>
  ▼
GraphQL API
  │
  ▼
User Data
```

The credentials are sent to the authentication API using **Basic Authentication**.

After successful authentication, the server returns a JWT.

The JWT is then used to authenticate GraphQL requests:

```http
Authorization: Bearer <JWT>
```

## GraphQL

The application uses GraphQL to retrieve the data required for the profile.

Example query:

```graphql
query {
  user {
    id
    login
    firstName
    lastName
    email
  }
}
```

GraphQL allows the application to request only the required fields instead of retrieving unnecessary data.

## Statistics

The profile contains several statistics generated from the data returned by the GraphQL API.

The project uses **SVG** to create the graphs without relying on external chart libraries.

Examples:

* XP progression
* XP distribution
* Audit ratio
* Project statistics


## SPA Routing

The application is a Single Page Application.

Navigation is handled on the client side:

```text
/
```

The page can change its displayed content without performing a complete browser reload.

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project directory:

```bash
cd GraphQL
```

## Run the Project

The frontend uses JavaScript modules, so it needs to be served through an HTTP server.

For example:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

You can also use another static HTTP server.

## Application Flow

```text
                    ┌─────────────┐
                    │    Login    │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Authentication  │
                  │      API        │
                  └────────┬────────┘
                           │
                           │ JWT
                           ▼
                  ┌─────────────────┐
                  │    Frontend     │
                  └────────┬────────┘
                           │
                           │ GraphQL Query
                           ▼
                  ┌─────────────────┐
                  │   GraphQL API   │
                  └────────┬────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ User / XP / Grades  │
                │ Audits              │
                └──────────┬──────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ SVG Statistics  │
                  └─────────────────┘
```


## Objectives

This project demonstrates the ability to:

* Consume a GraphQL API
* Write and understand GraphQL queries
* Implement JWT authentication
* Work with HTTP requests and headers
* Build a Single Page Application
* Implement client-side routing
* Process API data with JavaScript
* Create SVG data visualizations
* Build a responsive interface
* Use Git and GitHub

## Author

**Oumaima Talhaoui**

Full Stack Developer
Zone01 Oujda

## License

This project was developed for educational purposes.
