import jwt from "jsonwebtoken";


export const validate = (req, res, next) => {
    const authHeader = req.headers["authorization"]?.split(" ")[1];
  
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Forbidden", error: err });
        }
        res.status(200).json({ success: true, user });
        next();
    })
    
}