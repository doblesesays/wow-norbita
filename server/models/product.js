const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Required name'],
        unique: [true, 'Unique name'],
        index: true,
    },
    img: {
        type: String,
        required: [true, 'Required image'],
    },
    brand: {
        type: String,
    },
    warranty: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Required image'],
    },
    more_info : {
        type: Object,
    },
    info_list : {
        type: Object,
    },
    category: {
        type: String,
        required: [true, 'Category image'],
    }
}, { timestamps: true })

// Validating the unique property attributes
ProductSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', ProductSchema);