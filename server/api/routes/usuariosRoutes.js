const express = require("express")
const router = express.Router()
const passport = require('passport')
const controllers = require("../controllers/usuariosControllers")

router.get("/signin",passport.authenticate('jwt', { session: false }), controllers.signin_get)

router.get("/user", controllers.get_user)

router.get("/find/:userId", controllers.find_user)

router.get("/auth", controllers.auth)

router.get("/signout", controllers.sign_out)

router.post("/signup", controllers.signup_post)

router.post("/signin", controllers.signin_post)

router.post("/update", controllers.update_profile)

router.post("/if-banned", controllers.if_banned)

module.exports = router