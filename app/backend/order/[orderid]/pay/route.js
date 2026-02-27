import crypto from "crypto";
import dbConnect from "../../../../lib/db";
import Order from "../../../../modals/order";
import Restaurant from "../../../../modals/user";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {
        const { orderid } = await params; // Yeh aapke Order document ki ID hai
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userid } = await req.json();

        // 1. Check for missing IDs (Fix: Pehle yahan galti thi)
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userid) {
            return NextResponse.json({ message: "Required payment IDs or UserID missing" }, { status: 400 });
        }

        // 2. Verify signature
        // Note: Secret key ko env file mein rakhein (process.env.RAZORPAY_SECRET)
        const generated_signature = crypto
            .createHmac("sha256", "UfpXFSrIeX0cmHGXJoDHurhI")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ message: "Payment verification failed! Fake signature." }, { status: 400 });
        }

        await dbConnect();

        // 3. Update the Order Status
        const order = await Order.findById(orderid);
        if (!order) {
            return NextResponse.json({ message: "Order not found in database" }, { status: 404 });
        }

        order.status = "Paid";
        order.paymentId = razorpay_payment_id;
        order.paymentStatus = "Success"; // Extra safety check
        order.paymentDate = new Date();
        await order.save();

        // 4. 🔥 Save Order reference to User Model and CLEAR CART
        const updatedUser = await Restaurant.findByIdAndUpdate(
            userid,
            {
                $push: { orders: order._id }, // User ke orders array mein add karega
                $set: { cart: [] }           // Order hone ke baad cart khali kar dega
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found to update order history" }, { status: 404 });
        }

        console.log('Order saved to user profile and cart cleared');

        return NextResponse.json({
            success: true,
            message: "Payment verified, Order updated and saved to user profile",
            order
        }, { status: 200 });

    } catch (err) {
        console.error("Verification Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}