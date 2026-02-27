import { NextResponse } from "next/server";

import dbConnect from "../../../../../lib/db";
import Restaurant from "../../../../../modals/user";


export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        // let id = '69973a6fd7f2aeefc96217e1'

        console.log('iddd', id)

        if (!id) {
            return NextResponse.json(
                { message: "userId required" },
                { status: 400 }
            );
        }

        const user = await Restaurant.findById(id)
            .populate("cart.product");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            cart: user.cart,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
