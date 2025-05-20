// Import the main app router that combines all API routes
import { appRouter } from './root';
// Import the fetch adapter for tRPC to handle HTTP requests
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Define the request handler for API requests
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc', // The API endpoint for tRPC
    req,                   // The incoming HTTP request
    router: appRouter,     // The main tRPC router
    createContext: () => ({}), // Function to create context (empty here)
  });
};

// Export the handler for both GET and POST HTTP methods
export { handler as GET, handler as POST };