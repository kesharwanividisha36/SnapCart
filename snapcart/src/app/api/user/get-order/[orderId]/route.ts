// import connectDb from "@/lib/db";
// import Order from "@/models/order.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest,{params}:{params:{orderId:string}}){
//    console.log("🔥 GET ORDER API HIT", params)
//     try {
//         await connectDb()
//         const orderId=await params
//         console.log("👉 orderId:", orderId)
//         const order=await Order.findById(orderId).populate("assignedDeliveryBoy")
//         console.log("👉 order from DB:", order)
//         if(!order){
//             return NextResponse.json(
//                 {message:"order not found"},
//                 {status:400}
//             )
//         }
//   return NextResponse.json(
//                 order,
//                 {status:200}
//             )

//     } catch (error) {
//          return NextResponse.json(
//                 {message:`get order by id error ${error}`},
//                 {status:500}
//             )
//     }
// }


import connectDb from "@/lib/db"
import Order from "@/models/order.model"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDb()

    // ✅ THIS LINE IS THE FIX
    const { orderId } = await context.params

    console.log("✅ FINAL orderId STRING:", orderId)

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid order id" },
        { status: 400 }
      )
    }

    const order = await Order.findById(orderId)
      .populate("assignedDeliveryBoy")

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })

  } catch (err) {
    console.error("❌ GET ORDER FAILED:", err)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}