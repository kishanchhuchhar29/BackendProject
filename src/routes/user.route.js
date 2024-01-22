import { Router } from "express";
import { loginuser, logoutuser, registeruser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
console.log("user route")
router.route("/register").post(upload.fields([{
    name:"avatar",
    maxCount:1
},
{
    name:"coverImage",
    maxCount:1
}
]
),registeruser);
router.route("/login").post(loginuser)
//secure route
router.route("/logout").post(verifyJWT, logoutuser);

export default router;