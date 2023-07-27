const Restaurant = require("../models/restaurants")
const asyncHandler = require("express-async-handler")


const getNearbyRestuarants = asyncHandler(async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
    
        if (!(latitude && longitude && radius)) {

            res.status(400).json({
                msg: 'Latitude, longitude, and radius are required' 
            });
        
        }
    
        // Convert radius to meters (assuming it is provided in kilometers)
        const radiusInMeters = (parseFloat(radius) * 1000)
    
        // Perform the geospatial query to find nearby restaurants
        const nearbyRestaurants = await Restaurant.find({
            coordinates: {
            $near: {
                $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: radiusInMeters,
            }
            }
        })
    
        res.status(200).json({ nearbyRestaurants });

    }catch (err) {
            res.status(400).json({
                msg: err
            });
    }
})

const getAllRestuarants = asyncHandler(async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ restaurants });
    } catch (err) {
        res.status(400).json({
            msg: err
        });    
    }
})

const deleteRestuarants = asyncHandler(async (name, email, token) => {
    const { id } = req.params;

    try {
        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            res.status(400).json({ 
                msg: 'Restaurant not found' 
            })
        }

        // Delete the restaurant from the database
        await restaurant.remove();

        res.status(200).json({ 
            msg: 'Restaurant deleted successfully', restaurant 
        });
    }catch (err) {
        res.status(400).json({ 
            msg: 'Error deleting the restaurant', error: err.message 
        });
    }
})




module.exports = {
    getNearbyRestuarants,
    getAllRestuarants,
    deleteRestuarants
}
