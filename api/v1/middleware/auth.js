import jwt from "jsonwebtoken";

export const authUser = async (req,res,next) => { 
    const token = req.headers.authorization?.split(" ")[1];


    if(!token) {
        return res.json({
            success: false,
            message: "Access denied. No token",
        })
    }
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET); // jwt.verify is used to decrypt token 
        req.user = {user: {_id: decoded_token.userId}}
        next();
    } catch (err) {
        const isExpired = err.name === "TokenExpiredError";
        res.status(401).json({
            error:true,
            code: isExpired ? "TOKEN_EXPIRED" :"INVALID_TOKEN",
            message: isExpired ? "Token has expired, please log in again" : "invalid token",
        })
    }
 }