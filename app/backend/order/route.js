// // /app/api/order/route.js
// import dbConnect from "../../lib/db";
// import Order from "../../modals/order";
// import Restaurant from "../../modals/user";


// export async function POST(req) {
//     try {
//         await dbConnect();

//         const { userId, product, quantity, totalPrice, address, paymentMethod } = await req.json();

//         console.log('alldata', userId, product, quantity, totalPrice, address, paymentMethod)

//         console.log("API Call -> userId:", userId, "product:", product);

//         // ✅ Validation
//         if (!userId || !product || !totalPrice || !address) {
//             return new Response(
//                 JSON.stringify({ message: "Missing required fields" }),
//                 { status: 400, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         // ✅ Optional: Check if user exists
//         const user = await Restaurant.findById(userId);
//         if (!user) {
//             return new Response(
//                 JSON.stringify({ message: "User not found" }),
//                 { status: 404, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         // ✅ Optional: Check if product exists (if you have Product collection)
//         // const productExists = await Product.findById(product._id);
//         // if (!productExists) return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });

//         // ✅ Create order
//         const order = await Order.create({
//             userId,
//             products: [
//                 {
//                     product: product._id,
//                     quantity: quantity || 1,
//                     price: product.price,
//                 },
//             ],
//             totalPrice,
//             address,
//             paymentMethod: paymentMethod || "Online",
//             status: "Pending",
//         });

//         return new Response(
//             JSON.stringify({ success: true, message: "Order created successfully", order }),
//             { status: 201, headers: { "Content-Type": "application/json" } }
//         );
//     } catch (err) {
//         console.error("Order API Error:", err);
//         return new Response(
//             JSON.stringify({ message: "Server error", error: err.message }),
//             { status: 500, headers: { "Content-Type": "application/json" } }
//         );
//     }
// }






// /app/api/order/route.js
import dbConnect from "../../lib/db";
import Order from "../../modals/order";
import Restaurant from "../../modals/user";

export async function POST(req) {
    try {
        await dbConnect();

        const {
            userId,
            product,
            quantity,
            totalPrice,
            address,
            paymentMethod
        } = await req.json();

        console.log("API Call ->", { userId, product, paymentMethod });

        // ✅ Validation
        if (!userId || !product || !totalPrice || !address) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        // ✅ Check user
        const user = await Restaurant.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // ✅ Create order
        const order = await Order.create({
            userId,
            products: [
                {
                    product: product._id,
                    quantity: quantity || 1,
                    price: product.price,
                },
            ],
            totalPrice,
            address,
            paymentMethod: paymentMethod || "Online",
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
            status: "Placed",
        });

        // 🔥🔥🔥 MAIN MAGIC — COD pe direct user update
        if (paymentMethod === "COD") {
            await Restaurant.findByIdAndUpdate(userId, {
                $push: { orders: order._id },
                $set: { cart: [] }, // optional
            });

            console.log("✅ COD order saved to user profile");
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Order created successfully",
                order,
            }),
            { status: 201 }
        );
    } catch (err) {
        console.error("Order API Error:", err);
        return new Response(
            JSON.stringify({ message: "Server error", error: err.message }),
            { status: 500 }
        );
    }
}