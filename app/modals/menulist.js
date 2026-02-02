import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },

        discountPrice: {
            type: Number,
        },

        category: {
            type: String, // Veg / Non-Veg / Drinks
            required: true,
        },

        isVeg: {
            type: Boolean,
            default: true,
        },
        isActive: { type: Boolean, default: true },

        images: [
            {
                type: String,
            },
        ],

        isAvailable: {
            type: Boolean,
            default: true,
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
    },
    { timestamps: true }
);

const MenuItem =
    mongoose.models.MenuItem ||
    mongoose.model("MenuItem", MenuItemSchema);

export default MenuItem;
