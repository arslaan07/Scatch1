const express = require('express')
const isLoggedIn = require('../middlewares/isLoggedIn')
const { logoutUser } = require('../controllers/authController')
const productModel = require('../models/product-model')
const router = express.Router()

router.get("/", (req, res) => {
    let error = req.flash("error")
    res.render("index", {error, loggedin: false})
})

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find()
    res.render("shop", {products})
})

router.get("/logout", logoutUser)

module.exports = router