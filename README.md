# SGA Website Internal CMS  Application
This is SGA's internal application tool to allow for SGA's Webmaster Team to easily manage and update SGA's website. We are developing new features for administrators to modify the application without the need for changes in the core code structure, allowing for quick content management and visual edits throughout the website. 

# Technologies
## Frontend:
- React.js: The core UI framework for developing reusable components for faster development, reducing redundancy, and building the infrastructure of the website.
- React Puck: The drag-and-drop editor logic for Webmasters to utilize for quick and visual content management and layout changes.
- TailwindCSS: Utility-first CSS that allows direct styling within individual lines through classes, insuring for consistent design through the website.
- Next.js: Allows for component rendering and server-side capabilities to improve performance and SEO while enabling seamless full-stack development

## Backend:
- Prisma: The ORM that simplifies database queries, migrations, and interaction through the database.
- PostgreSQL: Primary relational database that allows for efficient data storage.
- Next.js: Handles the API routing on the server side with robust backend endpoints directly in the framework.

## Deployment
- Vercel: Host deployment for the website with optimized performance.

## Authentication
- Supabase: Backend service that provides authentication services for different user permissions.

# Setup
## Cloning and Running the Project
We *highly* recommend the use of VSCode for this project. Please download the VSCode and clone the GitHub repository either using the command below or cloning the repo with the web URL.
```
git clone git@github.com:SGAOperations/website-development.git
```

After opening the project, open the terminal and navigate to the project directory:
```
cd website-development
```

Once you are in the directory, install all package dependencies by running:
```
npm install
```

Afterwards, you should be able to run the application using:
```
npm run dev
```

The applications expects a local database and will return an error without it. Look at DATABASE_SETUP.md for Prisma/Postgres setup instructions.

# Features for implementation
- Visual Drag-and-Drop Editor
- Database and Versioning
- Version Control or Pages
- Authentication & Login Services
- Navigation Within the Editor Interface
- TBD - Future Features

# Team Contributors
### Digital Innovation Website Team Leads:
Caitlin Lee, Willem Lenig 
### Digital Innovation Website Software Engineers:
Shlok Patel, Grace Silge, Matthew Shi