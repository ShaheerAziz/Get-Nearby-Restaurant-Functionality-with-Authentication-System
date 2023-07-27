const express = require("express")
const router = express.Router()
const {
    register,
    login,
    forgotPassword,
    resetPassword

} = require("../controllers/user")

router.post("/register", register)
router.post("/login", login)
router.post('/forgot-password', forgotPassword)
router.post('/resetPassword', resetPassword)


module.exports = router
