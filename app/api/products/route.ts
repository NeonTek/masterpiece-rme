import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// GET: Fetch all products (Public)
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new product (Admin/Staff only)
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    // 1. Verify Authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Verify Authorization (Role Check)
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const roles = (payload as { roles: string[] }).roles;

    if (!roles.includes("admin") && !roles.includes("staff")) {
      return NextResponse.json(
        { message: "Authorization failed: Access denied." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (
      error?.name === "JsonWebTokenError" ||
      error?.name === "TokenExpiredError"
    ) {
      return NextResponse.json(
        { message: "Authentication failed." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: error?.message },
      { status: 400 }
    );
  }
}
