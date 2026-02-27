import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/db";
import Restaurant from "../../../modals/user";



export async function POST(request) {

    let JWT_SECRET = 'qwsdrt123456'
    try {
        const body = await request.json();
        const { email, password } = body;


        console.log(body)

        // Validate input
        if (!email || !password) {
            return new NextResponse(
                JSON.stringify({ error: "Email and password are required." }),
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await dbConnect();

        // Find user by email
        const user = await Restaurant.findOne({ email });
        console.log('logindta', user)
        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid credentials." }),
                { status: 401 }
            );
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid credentials." }),
                { status: 401 }
            );
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        // Return success
        const response = new NextResponse(
            JSON.stringify({ login: "true", message: "Login successful", user }),
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            secure: false, // ❌ disable secure in dev
            sameSite: "lax",
        });


        return response;


    } catch (error) {
        console.error("Login error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}











