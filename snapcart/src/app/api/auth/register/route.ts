
export const runtime = "nodejs";

import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
try {
    await connectDb();
    const {name,email,password}=await req.json()
    const existUser=await User.findOne({email})
    if(existUser){
        return NextResponse.json(
           {message:"email already exist!"},
           {status:400}
        )
    }
    if(password.length<6){
        return NextResponse.json(
           {message:"password must be atleast 6 character"},
           {status:400}
        )
    }
    const hahshedPassword=await bcrypt.hash(password,10)
    const user=await User.create({
        name,email,password:hahshedPassword
    })
    return NextResponse.json(
        user,
        {status:200}
    )
} catch (error) {
    return NextResponse.json(
           {message:`register error ${error}`},
           {status:500}
    )
}
}