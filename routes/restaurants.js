const express = require("express")
const router = express.Router()
const {
    getNearbyRestuarants,
    getAllRestuarants,
    deleteRestuarants

} = require("../controllers/restaurant")

router.get("/get-all-restaurants", getAllRestuarants)
router.delete("/delete-restaurant/:id", deleteRestuarants)
router.get('/get-nearby-restaurants', getNearbyRestuarants)


module.exports = router
