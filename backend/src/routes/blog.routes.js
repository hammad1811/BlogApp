import {Router} from "express"
import {createPost, getUserPosts, getAllPosts, getPostById, updatePost, deletePost, getPersonalPosts} from "../controllers/blog.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import {verifyJwt} from "../middleware/auth.middleware.js"

const router = Router()

router.route("/createPost").post(verifyJwt, upload.single("coverImage"), createPost)
router.route("/getUserPosts").get(verifyJwt, getUserPosts)
router.route("/getAllPosts").get(getAllPosts)
router.route("/getPersonalPosts").get(verifyJwt,getPersonalPosts)
router.route("/getPostById/:id").get(verifyJwt,getPostById)
router.route("/updatePost/:id").put(verifyJwt, upload.single("coverImage"), updatePost)
router.route("/deletePost/:id").delete(verifyJwt, deletePost)

export default router