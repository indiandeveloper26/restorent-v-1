import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },



        address: {
            type: String,

        },

        // restaurant ke products / menu
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        // restaurant ke orders
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        isOpen: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

// hot reload issue fix (Next.js)
const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);



export default Restaurant;
