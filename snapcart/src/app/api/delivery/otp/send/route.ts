import connectDb from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {orderId}=await req.json()
          if (!orderId) {                        
      return NextResponse.json(
        { message: "orderId required" },
        { status: 400 }
      );
    }
        const order=await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }
        const otp=Math.floor(1000+Math.random()*9000).toString()
        order.deliveryOtp=otp
        await order.save()

        await sendMail(order.user.email,
            "Your Deivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`
         )
          return NextResponse.json(
                {message:"OTP send successfully"},
                {status:200}
            )
    } catch (error) {
         return NextResponse.json(
                {message:`send otp error ${error}`},
                {status:500}
            )
    }
}

// import connectDb from "@/lib/db";
// import { sendMail } from "@/lib/mailer";
// import Order from "@/models/order.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     console.log("STEP 1: API HIT");

//     await connectDb();
//     console.log("STEP 2: DB CONNECTED");

//     const body = await req.json();
//     console.log("STEP 3: BODY =", body);

//     const { orderId } = body;

//     if (!orderId) {
//       return NextResponse.json({ message: "orderId missing" }, { status: 400 });
//     }

//     const order = await Order.findById(orderId).populate("user");
//     console.log("STEP 4: ORDER =", order);

//     if (!order) {
//       return NextResponse.json({ message: "order not found" }, { status: 404 });
//     }

//     console.log("STEP 5: USER =", order.user);

//     const otp = "1234"; // hardcode for now
//     order.deliveryOtp = otp;
//     await order.save();
//     console.log("STEP 6: OTP SAVED");

//     console.log("STEP 7: SENDING MAIL TO", order.user.email);

//     await sendMail(
//       order.user.email,
//       "OTP TEST",
//       `<h2>OTP ${otp}</h2>`
//     );

//     console.log("STEP 8: MAIL SENT");

//     return NextResponse.json({ message: "OTP sent" }, { status: 200 });

//   } catch (error) {
//     console.error("🔥 API CRASHED HERE:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }