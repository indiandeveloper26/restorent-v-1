import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";

import Restaurant from "../../../../modals/user";
import MenuItem from "../../../../modals/menulist";


export async function POST(req) {
    try {
        await dbConnect();

        const { userId, productId } = await req.json();


        console.log('userid', userId, 'prodcutid', productId)

        if (!userId || !productId) {
            return NextResponse.json(
                { message: "userId and productId required" },
                { status: 400 }
            );
        }

        // find user
        const user = await Restaurant.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // find product
        const product = await MenuItem.findById(productId);
        console.log(product)
        if (!product || !product.isAvailable) {
            return NextResponse.json(
                { message: "Product not available" },
                { status: 404 }
            );
        }

        // check if product already in cart
        const cartItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: 1,
            });
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Product added to cart",
            cart: user.cart,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
