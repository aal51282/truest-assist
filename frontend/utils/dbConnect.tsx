import mongoose from "mongoose"; 
// Import the Mongoose library to handle MongoDB connections and data modeling.

const connectMongoDB = async (): Promise<void> => {
  // Define an asynchronous function to connect to MongoDB. 
  // Returns a Promise<void> since it performs async operations without a return value.

  const uri = process.env.MONGODB_URI; 
  // Fetch the MongoDB connection string from environment variables. 
 
  // This ensures sensitive information like the URI isn't hardcoded.

  if (!uri) {
    console.error("MONGODB_URI is not defined.");
    // Log an error to the console if the environment variable is not set.
    return; 
    // Exit the function early to prevent attempting a connection without a valid URI.
  }

  try {
    await mongoose.connect(uri); 
    // Asynchronously connect to MongoDB using the provided URI.
    // mongoose.connect() is a built-in method from the Mongoose library.

    console.log("Connected to MongoDB.");
    // Log a success message to indicate the connection was successful.
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Log any errors that occur during the connection process.
    // This helps with debugging and monitoring connection issues.
  }
};

export default connectMongoDB; 
// Export the `connectMongoDB` function as the default export of this module.
// This allows other files to import and use this function.
