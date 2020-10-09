const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ShopSchema = schema({
    ownerName: {type: String, required: true},
    shopName: {type: String, required: true},
    shopLocation: {type: String, required: true},
    contact: {type: String, required: true},
    userId: {type: schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('ShopModel', ShopSchema);

