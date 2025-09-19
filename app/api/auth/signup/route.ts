import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  // Establish a connection to the database
  await dbConnect();

  try {
    // Parse the incoming request body
    const { firstName, email, phone, password } = await req.json();

    // Basic validation to ensure all required fields are present
    if (!firstName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    // Check if a user with the given email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email or phone already exists.",
        },
        { status: 409 }
      ); // 409 Conflict status
    }

    // Generate a unique ME Number (placeholder logic)
    const meNumber = `ME${Date.now()}`;

    // Create a new user instance. The password will be automatically hashed
    // by the pre-save hook defined in the User model.
    const user = await User.create({
      firstName,
      email,
      phone,
      password,
      meNumber,
    });

    // Create a user object to return, excluding the password for security
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      meNumber: user.meNumber,
      roles: user.roles,
    };

    // Return a success response with the new user's data
    return NextResponse.json(
      {
        success: true,
        data: userResponse,
      },
      { status: 201 }
    ); // 201 Created status
  } catch (error: any) {
    // Log the error for debugging and return a generic server error message
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
