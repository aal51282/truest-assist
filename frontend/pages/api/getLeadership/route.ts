import type { NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/UserScore';
import { authenticate, AuthenticatedRequest } from '../../../middleware/auth';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  // Authenticate the user
  authenticate(req, res, async () => {
    switch (method) {
      case 'GET':
        try {
          // Fetch score records belonging to the authenticated user.
          // Use populate to include the username from the User model.
          const items = await Item.find({ owner: req.user?.userId })
            .populate('owner', 'username') // populate the owner field with only the username
            .select('modulesDone leaderboardScore createdAt updatedAt'); // select the score fields and timestamps

          res.status(200).json({ success: true, items });
        } catch (error) {
          console.error('Error fetching items:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch items' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
          success: false,
          message: `Method ${method} not allowed.`,
        });
    }
  });
}
