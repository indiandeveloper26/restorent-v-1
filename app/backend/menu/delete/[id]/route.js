
import dbConnect from "../../../../lib/db";
import MenuItem from "../../../../modals/menulist";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
   await dbConnect();


   const { id } = await params; // // Database connection zaroori hai
   console.log('iddd', id)
   // return NextResponse.json({ message: "ID is required" });

   try {
      // URL se ID nikalne ke liye


      if (!id) {
         return NextResponse.json({ message: "ID is required" }, { status: 400 });
      }

      // Database se item delete karna
      const deletedItem = await MenuItem.findByIdAndDelete(id);

      if (!deletedItem) {
         return NextResponse.json({ message: "Item nahi mila" }, { status: 404 });
      }

      return NextResponse.json({ message: "Item successfully delete ho gaya!", deletedItem }, { status: 200 });

   } catch (error) {
      return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
   }
}