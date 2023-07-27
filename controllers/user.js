const User = require("../models/users")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const randomstring = require("randomstring")

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).json({ message: "User already exists" })
    } else {
        const saltRounds = 10
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, password) {
                // Store hash in your password DB.

                const user = new User({
                    username,
                    email,
                    password,
                })

                // first storing the user data in database and then also performing the login functionality as a rule
                user.save()
                    .then((user) => {
                        res.json({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            // Generate the JWT access token with a 60-minute expiration
                            accessToken: jwt.sign({ userId: user.id }, process.env.SECRETKEY, { expiresIn: '1h' }),
                            // Generate the refresh token with a 24-hour expiration
                            refreshToken: jwt.sign({ userId: user.id }, process.env.SECRETKEY, { expiresIn: '24h' })
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        })
    }
})

const login = asyncHandler(async (req, res) => {
    //console.log("User Login")

    const { email, password } = req.body
    //console.log(email)
    const user = await User.findOne({ email })
    //console.log(user)

    if (user) {
        const flag = await bcrypt.compare(password, user.password)
        const id = user._id
        if (flag) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                // Generate the JWT access token with a 60-minute expiration
                accessToken: jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: '1h' }),
                // Generate the refresh token with a 24-hour expiration
                refreshToken: jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: '24h' })
            })
        } else {
            res.status(400).json({
                message: "Provided password is not correct.",
            })
        }
    } else {
        res.status(400).json({ message: "No account with this email exists." })
    }
})

const sendResetEmail = asyncHandler(async (name, email, token) => {
    try{

        const mailer = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 5000,
            secure: false,
            requireTLS: true,
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        const mailSetUp = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: '<p> Hye' + name + ', please click the link <a href = "http://localhost:3000/api/auth/resetPassword?token='+token+'></a > and reset your password">'
        }

        mailer.sendMail(mailSetUp, function(err, info){
            if(err){
                console.log(err)
            }else{
                console.log("Mail sent successfully", info.response)
            }
        })

    }catch(err){
        res.status(400).json({
            msg: err
        })
    }
})


const forgotPassword = asyncHandler(async (req, res) => {
    try{
        const email = req.body.email
        const user = await User.findOne({email: email})
        if(user){
            const token =  jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: '1h' })

            sendResetEmail(user.username, user.email, token)
            res.status(200).json({
                msg: "Check your email for password reset link "
            })

        }else{
            res.status(200).json({
                msg: "User with this email does not exist"
            })
        }
    }catch(err){
        res.status(400).json({
            err: err
        })
    }
})

const resetPassword = asyncHandler( async (req, res) => {
    try{
        const token = req.query.token
        var decoded = jwt.verify(token, process.env.SECRETKEY)
        const user = await User.findOne({ _id: decoded.id })
        const password = req.body.password
        const saltRounds = 10
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, password) {
                // Store hash in your password DB.
                user.password = password
                user.save()
                    .then((user) => {
                        res.json({
                            msg: user.username + " password updated successfully"
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            msg: err
                        })
                    })
            })
        })

    }catch(err){
        res.status(400).json({
            msg: err
        })
    }
})


module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}
