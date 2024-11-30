import prisma from "../config/db.js";

export const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await prisma.user.findMany({ include: { posts: true } });
        return users;
      } catch (error) {
        console.error("Error fetching users: ", error);
        throw new Error("Could not fetch users");
      }
    },
    user: async (parent, { id }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: { posts: true },
        });
        return user;
      } catch (error) {
        console.error("Error fetching user: ", error);
        throw new Error("Could not fetch user");
      }
    },
  },

  Mutation: {
    createUser: async (parent, { name, email }) => {
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });
        return user;
      } catch (error) {
        console.error("Error Creating user: ", error);
        throw new Error("Could not Creating user");
      }
    },

    createPost: async (
      parent,
      { title, content, published = true, authorId }
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(authorId) },
        });
        if (!user) {
          throw new Error("Author does not exist");
        }
        const post = await prisma.post.create({
          data: {
            title,
            content,
            published,
            author: {
              connect: { id: parseInt(authorId) },
            },
          },
          include: {
            author: true,
          },
        });
        return post;
      } catch (error) {
        console.error("Error Creating post: ", error);
        throw new Error("Could not Creating post");
      }
    },
    updatePost: async (parent, { id, title, content, published }) => {
      try {
        const post = await prisma.post.update({
          where: { id: parseInt(id) },
          data: {
            title,
            content,
            published,
          },
          include: {
            author: true,
          },
        });
        return post;
      } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Could not update post");
      }
    },
    deletePost: async (parent, {id}) => {
      try {
        const post = await prisma.post.delete({
          where: { id: parseInt(id) },
          include: {
            author: true,
          },
        });
        return post;
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Could not delete post");
      }
    }
  },
};
