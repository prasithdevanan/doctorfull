import razorpay from "razorpay";
import Razorpay from "razorpay";
import crypto from "crypto";


export const order = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const option = req.body;
        const response = await razorpay.orders.create(option);
        res.status(200).json({ success: true, order: response });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const verify = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

        if (sha !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment failed" });
        }

        if (sha == razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment verified successfully", order: { payementID:razorpay_payment_id, orderId:razorpay_order_id } }); 
        }



    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }


}
