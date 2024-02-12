import { Router } from "express";
import { loginuser,UpdateAccountDtail, logoutuser, registeruser,refreshAccessToken,ChangeCurrenctPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
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
router.route("/refresh-Token").post(refreshAccessToken);
router.route("/changepassword").post(verifyJWT,ChangeCurrenctPassword);
router.route("/Upadate-name").post(UpdateAccountDtail);
export default router;