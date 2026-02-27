import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Order from "../../../modals/order";
import Restaurant from "../../../modals/user";


export async function POST(req) {
    try {
        await dbConnect();

        const {
            userId,
            product,
            quantity,
            totalPrice,
            address,
            paymentMethod,
        } = await req.json();


        console.log('userdata', userId,
            product,
            quantity,
            totalPrice,
            address,
            paymentMethod,)

        // ✅ create order
        const order = await Order.create({
            userId,
            product,
            quantity,
            totalPrice,
            address,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
            orderStatus: "Placed",
        });

        // 🔥 IMPORTANT — COD me turant user update
        if (paymentMethod === "COD") {
            await Restaurant.findByIdAndUpdate(
                userId,
                {
                    $push: { orders: order._id },
                    $set: { cart: [] },
                },
                { new: true }
            );
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (err) {
        console.error("ORDER ERROR:", err);
        return NextResponse.json(
            { message: "Order failed" },
            { status: 500 }
        );
    }
}