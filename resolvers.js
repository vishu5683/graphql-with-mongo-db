import bcrypt from "bcrypt";
import mongoose from "mongoose";

const User = mongoose.model("User"); // Make sure the model is imported properly

const resolvers = {
  Query: {
    users: () => User.find(),
    user: (_, args) => User.findById(args._id),
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { name, email, password } = input;
      
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists with that email");
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      await newUser.save();

      return newUser;
    },
  },
};

export default resolvers;
