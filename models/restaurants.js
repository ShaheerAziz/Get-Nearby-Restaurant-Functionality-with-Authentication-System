const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true, unique: 'That email is already taken'
        },
        cuisine: {
            type: String,
            required: true
        },
        location: {
            type: String,
            coordinates:[]
        }
    },
    {
        timestamps: true
    }
);


const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;