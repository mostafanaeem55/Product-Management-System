# Product Management Application Setup Guide

This document provides detailed instructions for setting up and running the **Product Management Application**, which uses **.NET 8** for the backend and **Angular 18** for the frontend. This application manages products and includes features such as pagination, customer management, and search functionality.

## Installation Instructions
1. Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/Product-Management-System.git
cd Product-Management-System
```

2. Backend Setup (.NET 8)
Navigate to the backend folder:

```bash
cd Backend
```
Restore dependencies:
Use the .NET CLI to restore all NuGet packages:

```bash
dotnet restore
```

Configure the database connection:

Open the appsettings.json file in the backend project.

Update the ConnectionStrings section with your database credentials:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=your-server-name;Database=ProductManagementDB;User Id=your-username;Password=your-password;TrustServerCertificate=True;"
}
```

Run database migrations:
Ensure your database server (e.g., SQL Server) is running, then apply migrations to create the database:

```bash

dotnet ef database update
```

Run the backend:
Start the backend server:

```bash
dotnet run
```

The backend will run at:

https://localhost:7144

3. Frontend Setup (Angular 18)
Navigate to the frontend folder:

```bash
cd ../Frontend
```

Install dependencies:
Use npm to install all required packages:

```bash
npm install
```

Run the frontend:
Start the Angular development server:

```bash
ng serve
```
The frontend will run at:

http://localhost:4200

4. Verify the Setup
Open your browser and navigate to http://localhost:4200 to access the frontend.

Ensure the backend is running and the frontend can communicate with it by testing the API endpoints.

