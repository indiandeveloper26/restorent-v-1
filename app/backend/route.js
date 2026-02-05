import { NextResponse } from "next/server";
import dbConnect from "../lib/db";
import Restaurant from "../modals/user";
import MenuItem from "../modals/menulist";

export async function GET() {


    await dbConnect()

    let data = await Restaurant.findById('6983587291983028c646a586')
    return NextResponse.json({ "dta": data })
}