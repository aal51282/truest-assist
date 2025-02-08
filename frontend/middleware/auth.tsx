import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';


export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
  };
 
  
}

// Middleware to authenticate the user by checking for a JWT token in the request cookies
export const authenticate = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const token = req.cookies?.token;

  // Check if token exists
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    // Verify the token and attach the decoded user to the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };
    req.user = { userId: decoded.userId };
    next(); // Proceed to the next middleware or request handler
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};