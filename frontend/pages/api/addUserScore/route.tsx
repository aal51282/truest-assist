import type { NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/UserScore'; // Your Item model (used for user scores)
import { authenticate, AuthenticatedRequest } from '../../../middleware/auth';

export default async function addUserScore(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  // Connect to the database
  await dbConnect();

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed.` });
  }

  // Use your authentication middleware to ensure the user is logged in.
  // This example assumes that `authenticate` calls the callback after validating.
  authenticate(req, res, async () => {
    try {
      // Destructure the values from the request body.
      // The required field is modulesDone; leaderboardScore is optional.
      const { modulesDone, leaderboardScore } = req.body;

      // Validate that modulesDone is provided
      if (!modulesDone) {
        return res.status(400).json({
          success: false,
          message: 'Modules done is required.',
        });
      }

      // Ensure that the authenticated user's ID is available
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated.',
        });
      }

      // Create a new record using the Item model
      const newScore = new Item({
        modulesDone,
        leaderboardScore, // Optional field
        owner: req.user.userId, // Set the owner as the authenticated user
      });

      // Save the new score record to the database
      await newScore.save();

      // Respond with the created record
      return res.status(201).json({
        success: true,
        data: {
          id: newScore._id,
          modulesDone: newScore.modulesDone,
          leaderboardScore: newScore.leaderboardScore,
          owner: newScore.owner,
          createdAt: newScore.createdAt,
          updatedAt: newScore.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error adding user score:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  });
}
