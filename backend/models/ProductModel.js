const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },  // New field added
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String }, // URL or base64 for image storage
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
