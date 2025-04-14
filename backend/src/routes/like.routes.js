import {Router} from "express"
import {verifyJwt} from "../middleware/auth.middleware.js"
import {toggleLike, totalLikes,getLikeStatus} from "../controllers/like.controller.js"

const router = Router()

router.route("/toggleLike/:id").get(verifyJwt, toggleLike)
router.route("/totalLikes/:id").get(totalLikes)
router.route("/getLikeStatus/:id").get(verifyJwt, getLikeStatus)



export default router