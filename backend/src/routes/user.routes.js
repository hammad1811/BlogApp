import {Router} from "express"
import {registerUser, loginUser, logoutUser, changePassword, getUserProfile, refreshAccessToken} from "../controllers/user.controller.js"
import {verifyJwt} from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJwt,logoutUser)
router.route("/change-password").post(verifyJwt,changePassword)
router.route("/profile").get(verifyJwt,getUserProfile)
router.route("/refresh-token").post(refreshAccessToken)

export default router