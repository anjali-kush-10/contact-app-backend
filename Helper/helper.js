import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const jwtAuthMiddleware = async (req, res, next) => {
    try {
        if (!req?.headers?.authorization) {
            return res.status(401).json({ status: false, message: "unauthorized" });
        }
        //console.log(req.headers);
        const token = req.headers.authorization.split(' ')[1];
        //console.log(token);
        if (!token)
            return res.status(401).json({ status: false, message: "unauthorized" });

        const decoded = jwt.verify(token, process.env.KEY_PAYLOAD);

        const findUser = await User.findOne({
            where: {
                id: decoded.user_id
            }
        })

        // console.log("***********************", findUser);
        req.user = findUser;
        req.user_id = decoded.user_id;
        req.role_id = findUser.role_id;
        next();
    }
    catch (err) {
        //console.log(err);
        return res.status(401).json({ status: false, message: "unauthorized", error: err.message });
    }
}
//export default jwtAuthMiddleware;

export const customError = (req, res, err) => {
    var status = err.status || 500
    var message = err.message || "error in backend"
    var additionalinfo = res.additioninfo || "Something wrong in it ,try again"
    return res.status(status).json({ message: message, additionalinfo: additionalinfo });
}
//export default customError;



