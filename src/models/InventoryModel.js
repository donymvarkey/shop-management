const mongoose = require('mongoose');
const schema = mongoose.Schema;

const InventorySchema = schema({
    productName: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    shopId: {type: schema.Types.ObjectId, required: true}
})

module.exports = mongoose.model('InventoryModel', InventorySchema);