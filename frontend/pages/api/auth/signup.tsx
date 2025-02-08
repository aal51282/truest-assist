import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User'; // Adjust the import path as needed
import dbConnect from '../../../utils/dbConnect';
import * as cookie from 'cookie';

interface SignupRequest extends NextApiRequest {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

interface SignupResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default async function handler(
  req: SignupRequest,
  res: NextApiResponse<SignupResponse>
) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case 'POST': {
      try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
          return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: username, email, and password',
          });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
          });
        }

        // Password length validation
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long',
          });
        }

        // Check if the user already exists by email or username
        const existingUser = await User.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          const field = existingUser.email === email ? 'Email' : 'Username';
          return res.status(400).json({
            success: false,
            message: `${field} is already in use`,
          });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
          username,
          email: email.toLowerCase(), // Ensure email is stored in lowercase
          password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Type assertion for '_id' to explicitly state that it is a string
        const userId = user._id.toString();

        // Generate JWT token
        const token = jwt.sign(
          {
            userId: userId,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '1h' }
        );

        // Set the JWT token as an HTTP-only cookie
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookie only in production
            maxAge: 3600, // 1 hour expiration time
            sameSite: 'strict', // CSRF protection
            path: '/',
          })
        );

        // Return the newly created user details (without password)
        return res.status(201).json({
          success: true,
          data: {
            id: userId,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal server error. Please try again later.',
        });
      }
    }

    // Handle unsupported HTTP methods
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`,
      });
  }
}