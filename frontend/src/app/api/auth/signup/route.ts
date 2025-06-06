import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Item from '@/models/Item';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the request body
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input fields
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields: username, email, and password',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return NextResponse.json(
        {
          success: false,
          message: `${field} is already in use`,
        },
        { status: 400 }
      );
    }

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Save the user within the transaction
      await user.save({ session });

      // Create initial item/progress record for the user
      const item = new Item({
        modulesDone: 0,
        leaderboardScore: 0,
        owner: user._id
      });

      // Save the item within the transaction
      await item.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      // Create the response
      const response = NextResponse.json(
        {
          success: true,
          data: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            progress: {
              modulesDone: item.modulesDone,
              leaderboardScore: item.leaderboardScore
            }
          },
        },
        { status: 201 }
      );

      // Set the JWT cookie
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 hour
        sameSite: 'strict',
        path: '/',
      });

      return response;
    } catch (error) {
      // If there's an error, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
} 