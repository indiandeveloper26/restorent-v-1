import { NextResponse } from "next/server";
import dbConnect from "../lib/db";
import Restaurant from "../modals/user";
import MenuItem from "../modals/menulist";

export async function GET() {


    await dbConnect()

    let data = await Restaurant.findById('69973a6fd7f2aeefc96217e1')
    return NextResponse.json({ "dta": data })
}