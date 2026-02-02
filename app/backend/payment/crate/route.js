
import Razorpay from "razorpay";



const razorpay = new Razorpay({
    key_id: "rzp_test_RqlfH5s7HXQ2nY",
    key_secret: "UfpXFSrIeX0cmHGXJoDHurhI",
});

export async function POST(req) {

    // return NextResponse.json({ 'dafdsaf': "dataayayaya" })
    try {
        const { orderId, amount } = await req.json(); // amount in paise

        console.log('data', orderId, amount)
        console.log(orderId)

        const options = {
            amount,
            currency: "INR",
            receipt: orderId,
        };

        const paymentOrder = await razorpay.orders.create(options);

        return new Response(JSON.stringify(paymentOrder), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
}
