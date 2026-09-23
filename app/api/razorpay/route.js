import { NextResponse } from "next/server";
import Payment from "@/models/payment";
import User from "@/models/user";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import dbConnect from "@/db/connect";

export const POST = async (req) => {
    await dbConnect();
    const body = Object.fromEntries(await req.formData());

    // 1. payment record dhundo
    const payment = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!payment) {
        return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // 2. creator ka secret nikalo (username payment record se aata hai)
    const user = await User.findOne({ username: payment.to_user });
    const secret = user?.razorpaysecret;
    if (!secret) {
        return NextResponse.json({ error: "Creator has not set Razorpay secret" }, { status: 400 });
    }

    // 3. signature verify
    const isValid = validatePaymentVerification(
        { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
        body.razorpay_signature,
        secret
    );

    if (!isValid) {
        return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }

    await Payment.findOneAndUpdate(
        { oid: body.razorpay_order_id },
        { razorpayPaymentId: body.razorpay_payment_id, done: true }
    );

    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${payment.to_user}?paymentdone=true`,
        { status: 303 }
    );
};