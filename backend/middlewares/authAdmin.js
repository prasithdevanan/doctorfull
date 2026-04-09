import jwt from 'jsonwebtoken'


const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;

        if (!atoken) {
            return res.json({ success: false, message: "In vaild to login Admin-----------" });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {

            return (
                res.json({ success: false, message: "In vaild to login Admin" })
            )
        }

        next()


    } catch (error) {
        res.json({ success: false, message: error.response.data });
        console.log(error);
    }
}

export default authAdmin;