import fs from "fs";
import path from "path";
import dbConnect from "../../../lib/db";
import MenuItem from "../../../modals/menulist";

export async function POST(req) {
    try {
        await dbConnect();

        // FormData parse
        const data = await req.formData();

        console.log('menuadd data', data)

        // ----- TEXT FIELDS -----
        const name = data.get("name");
        const slug = data.get("slug");
        const description = data.get("description");
        const price = Number(data.get("price"));
        const discountPrice = Number(data.get("discountPrice") || 0);
        const category = data.get("category");
        const isVeg = data.get("isVeg") === "true";
        const restaurant = data.get("restaurant");

        if (!name || !slug || !price || !category || !restaurant) {
            return new Response(
                JSON.stringify({ success: false, message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const files = data.getAll("images"); // array of File
        const imagePaths = [];

        if (files && files.length > 0) {
            const uploadDir = path.join(process.cwd(), "public/uploads/menu");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            for (const file of files) {
                const fileName = `${Date.now()}-${file.name || "file"}`;
                const buffer = Buffer.from(await file.arrayBuffer());
                const filePath = path.join(uploadDir, fileName);

                fs.writeFileSync(filePath, buffer);
                imagePaths.push(`/uploads/menu/${fileName}`);
            }
        }

        // ----- SAVE TO DB -----
        const menuItem = await MenuItem.create({
            name,
            slug,
            description,
            price,
            discountPrice,
            category,
            isVeg,
            images: imagePaths,
            restaurant,
        });

        return new Response(
            JSON.stringify({ success: true, item: menuItem }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Menu API Error:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}
