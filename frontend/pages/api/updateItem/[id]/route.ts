import type { NextApiResponse } from 'next';
import dbConnect from '../../../../utils/dbConnect';
import Item from '../../../../models/UserScore';
import { authenticate, AuthenticatedRequest } from '../../../../middleware/auth';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Authenticate the user and then fetch the score record
        await authenticate(req, res, async () => {
          const scoreRecord = await Item.findOne({ _id: id, owner: req.user?.userId });
          if (!scoreRecord) {
            return res
              .status(404)
              .json({ success: false, message: 'User score not found or unauthorized' });
          }
          res.status(200).json({ success: true, data: scoreRecord });
        });
      } catch (error) {
        console.error('Error fetching user score:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user score' });
      }
      break;

    case 'PUT':
      try {
        await authenticate(req, res, async () => {
          const { modulesDone, leaderboardScore } = req.body;

          // Validate required field: modulesDone is required
          if (modulesDone == null) {
            return res
              .status(400)
              .json({ success: false, message: 'Modules done is required.' });
          }

          // Find the user score record by ID and ensure the authenticated user is the owner
          const updatedScore = await Item.findOneAndUpdate(
            { _id: id, owner: req.user?.userId },
            { modulesDone, leaderboardScore },
            { new: true, runValidators: true } // Return the updated record and run schema validators
          );

          if (!updatedScore) {
            return res
              .status(404)
              .json({ success: false, message: 'User score not found or unauthorized' });
          }

          res.status(200).json({ success: true, data: updatedScore });
        });
      } catch (error) {
        console.error('Error updating user score:', error);
        res.status(500).json({ success: false, message: 'Failed to update user score' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({ success: false, message: `Method ${method} not allowed.` });
  }
}
