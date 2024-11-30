import express from "express";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js"; // Note: `resolvers` should be plural to match convention
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

const PORT = process.env.PORT || 8080;

const app = express();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Middleware
app.use(express.json());
app.use(cors());

// Apollo Server startup and middleware
const startServer = async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
};

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the GraphQL Project" });
});

// Start server for local development
if (process.env.NODE_ENV !== "production") {
  startServer().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  });
}

// Export for Vercel
export default async function handler(req, res) {
  await startServer();
  const apolloHandler = expressMiddleware(server);

  // Special handling for Vercel serverless functions
  return new Promise((resolve) => {
    apolloHandler(req, res, () => {
      resolve();
    });
  });
}