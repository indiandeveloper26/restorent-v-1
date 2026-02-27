import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/db";
import Restaurant from "../../../modals/user";

const JWT_SECRET = process.env.JWT_SECRET || "qwsdrt123456";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, phoneNumber } = body;

        console.log("Signup Request:", body);

        // 1. Basic Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        await dbConnect();

        // 2. Check if user already exists
        const existingUser = await Restaurant.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 409 }
            );
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create new user
        const newUser = await Restaurant.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber || undefined,
        });

        // Password ko response se hatane ke liye (Security)
        const userResponse = newUser.toObject();
        delete userResponse.password;

        // 5. Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Create Response (Login jaisa structure)
        const response = NextResponse.json({
            login: "true", // Taaki frontend turant login maan le
            message: "User created and logged in successfully",
            user: userResponse // Pura user object
        }, { status: 201 });

        // 7. Set Cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Email or Phone already exists." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}