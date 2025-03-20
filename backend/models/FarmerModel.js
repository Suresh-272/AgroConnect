// const mongoose = require('mongoose');
// // models/Farmer.js
// const farmerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     farmName: { type: String, required: true },
//     location: {
//       type: { type: String, default: 'Point' },
//       coordinates: [Number]
//     },
//     products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
//     rating: { type: Number, default: 0 },
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
//   });
// const FarmerModel = mongoose.model('Farmers', FarmerSchema);
// module.exports = FarmerModel;
