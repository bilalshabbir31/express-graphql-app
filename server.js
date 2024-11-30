import express from "express";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js"; // Note: `resolvers` should be plural to match convention
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

const PORT = process.env.PORT || 8080;

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.json()); // Body parser middleware
app.use(cors()); // Cross-Origin Resource Sharing middleware

// Start Apollo Server
server.start().then(() => {
// Attach Apollo middleware to Express
app.use("/graphql", expressMiddleware(server));
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the GraphQL Project" });
});
// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
});
