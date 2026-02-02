


import dbConnect from "../../../lib/db";
import Order from "../../../modals/order";



// // app/api/order/[orderid]/route.js


// // Named export for GET request
export async function GET(req, { params }) {
    const { orderid } = await params; // ✅ this is how you get the dynamic route param
    console.log("orderid: aagyaa", orderid);

    await dbConnect();

    try {
        const order = await Order.findById(orderid).populate("products.product");
        console.log("orderdata:", order);

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ order }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
}
