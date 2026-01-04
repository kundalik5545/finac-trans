import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash password first
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    // Access user model directly like other models (category, transaction, etc.)
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          name: name || null,
          email,
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        {
          message: "User created successfully",
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        { status: 201 }
      );
    } catch (prismaError: any) {
      // Handle Prisma-specific errors
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
      
      // If user model doesn't exist, provide helpful error
      if (prismaError.message?.includes("user") || !prisma.user) {
        console.error("Prisma user model error:", prismaError);
        return NextResponse.json(
          { error: "Database configuration error. Please ensure Prisma client is regenerated and server is restarted." },
          { status: 500 }
        );
      }
      
      throw prismaError;
    }

  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle specific Prisma errors
    if (error.message?.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Check if it's a Prisma unique constraint error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}
