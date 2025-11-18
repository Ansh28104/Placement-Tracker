# MongoDB Setup Guide

Your Placement Tracker is now fully integrated with MongoDB. Here's how to get started:

## Environment Variables

Make sure these are set in your Vercel project settings:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key (for token signing)
- `PORT`: Optional port configuration (defaults to 3000)

## Database Collections

The app uses these MongoDB collections:
- **users** - User accounts with email, password (hashed), points, level, streak
- **coding-problems** - Coding problems with difficulty, platform, status, notes
- **applications** - Job applications with company, position, status
- **interviews** - Interview schedules with company, round, date, time
- **goals** - Goals with title, description, progress, due date
- **resources** - Learning resources with URL, category, saved status
- **aptitude-tests** - Test scores with test name, score, category, date

## Initialize the Database

Run this command to create collections and indexes:
\`\`\`bash
npm run db:init
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Coding Problems
- `GET /api/coding` - Get all problems
- `POST /api/coding` - Create problem
- `PUT /api/coding/[id]` - Update problem
- `DELETE /api/coding/[id]` - Delete problem

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Interviews
- `GET /api/interviews` - Get all interviews
- `POST /api/interviews` - Create interview
- `PUT /api/interviews/[id]` - Update interview
- `DELETE /api/interviews/[id]` - Delete interview

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

## Using Data in Components

All API calls use JWT authentication via HTTP-only cookies. The `useApi` hook handles GET requests:

\`\`\`tsx
import { useApi } from "@/hooks/use-api"

function MyComponent() {
  const { data, loading, error } = useApi("/api/coding")
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && data.map(item => <div key={item._id}>{item.title}</div>)}
    </div>
  )
}
\`\`\`

For mutations (POST, PUT, DELETE), use `apiCall`:

\`\`\`tsx
import { apiCall } from "@/hooks/use-api"

async function addProblem(problem: CodingProblem) {
  const result = await apiCall("/api/coding", "POST", problem)
}
\`\`\`

## Security Features

- Passwords are hashed with bcryptjs
- JWT tokens stored in HTTP-only cookies (not accessible from JavaScript)
- All API routes require valid JWT token for authentication
- MongoDB indexes prevent duplicate emails
- User data is isolated by userId

## Next Steps

1. Update all pages to fetch real data from MongoDB instead of mock data
2. Hook up form submissions to create/update/delete endpoints
3. Deploy to Vercel and test with your real MongoDB database
4. Monitor MongoDB Atlas dashboard for performance and backups
`
