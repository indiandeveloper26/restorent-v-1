import { NextResponse } from "next/server";
import dbConnect from "../lib/db";
import Restaurant from "../modals/user";
import MenuItem from "../modals/menulist";

export async function GET() {


    await dbConnect()

    let data = await Restaurant.find()
    return NextResponse.json({ "dta": data })
}