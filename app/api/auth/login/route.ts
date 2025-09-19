import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Missing credentials.' }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }, { meNumber: identifier }],
    }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // If credentials are correct, create a JWT
    const payload = {
      id: user._id,
      email: user.email,
      roles: user.roles,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}