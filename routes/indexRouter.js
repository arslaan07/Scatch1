const express = require('express')
const isLoggedIn = require('../middlewares/isLoggedIn')
const { logoutUser } = require('../controllers/authController')
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')
const router = express.Router()

router.get("/", (req, res) => {
    let error = req.flash("error")
    res.render("index", {error, loggedin: false})
})

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find()
    let success = req.flash("success")
    res.render("shop", {products, success})
})

router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate("cart")
    if(user.cart.length == 0) 
        res.send("No items added to cart")
    else
        res.render("cart", { user })
})

router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email})
    user.cart.push(req.params.productid)
    await user.save()
    req.flash("success", "Added to cart")
    res.redirect("/shop")
})
router.get("/delete/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email})
    let product = await productModel.findOneAndDelete({_id: req.params.productid})
    let productIndex = user.cart.indexOf(product._id);
    user.cart.splice(productIndex, 1)
    await user.save()
    res.redirect("/cart")
})


router.get("/logout", logoutUser)

module.exports = router