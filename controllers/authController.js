const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')
const { userRegistrationSchema, userLoginSchema } = require('../schemas/validationSchema')

const registerUser = async (req, res) => {
    try{
        let {fullname, email, password} = req.body
        const userInput = {
            fullname,
            email,
            password
        }
        const { error, value } = userRegistrationSchema.validate(userInput)

        if (error) {
            // Handle validation error
            console.error('Validation error:', error.details[0].message)
        } else {
            let user = await userModel.findOne({email})
            if(user) return res.status(401).send("user already exists, please login !")
            else {
                // Proceed with creating the user in the database
                console.log('Valid user input:', value);
                // Create the user in the database here
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if(err) return res.send(err.message)
                        else {
                            let user = await userModel.create({
                                fullname,
                                email,
                                password: hash
                            })
                            let token = generateToken(user)
                            res.cookie("token", token)
                            res.send(user)
                        }
                    })
                })
        
            }
        }
    }
    catch(err) {
        console.log(err.message)
    }
}

const loginUser = async (req, res) => {
    try{
        let { email, password } = req.body
        const userInput = {
            email,
            password
        }
        const { error, value } = userLoginSchema.validate(userInput)

        if (error) {
            // Handle validation error
            console.error('Validation error:', error.details[0].message)
        } else {
            let user = await userModel.findOne({email})
            if(!user) return res.status(401).send("email or password incorrect !")
            else {
                // Proceed with logging in the user in the database
                console.log('Valid user input:', value);
                // Create the user in the database here
                bcrypt.compare(password, user.password, (err, result) => {
                    if(result) {
                        let token = generateToken(user)
                        res.cookie("token", token)
                        res.send("you can login !")
                    }
                    else {
                        req.flash("error", "email or password incorrect")
                        res.redirect("/")
                    }
                })
        
            }
        }
    }
    catch(err) {
        console.log(err.message)
    }
}

const logoutUser = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
}

module.exports = {registerUser, loginUser, logoutUser}