const express = require('express')

const InventoryModel = require('../models/InventoryModel');
const middlewares = require('../middlewares');
const { body } = require('express-validator/check');

var router = express.Router();

router.post('/add/product', middlewares.isAuthorised, [
    body('productName').exists(),
    body('price').isFloat(),
    body('quantity').isInt()
], async (req, res) => {
    try {
        const {productName, price, quantity} = req.body;
        const shopId = req.user.shopId;

        const inventory = new InventoryModel({
            productName: productName,
            price: price,
            quantity: quantity,
            shopId: shopId
        });

        const data = await inventory.save();

        if(data) {
            res.status(200).json({
                status: true,
                msg: 'product added successfully'
            })
        }else {
            res.status(400).json({
                status: false,
                msg: 'failed to add product'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.get('/all/product', middlewares.isAuthorised, async (req, res) => {
    try {
        const shopId = req.user.shopId;

        const data = await InventoryModel.find({shopId: shopId});

        if(data == null || data == undefined) {
            res.status(404).json({
                status: false,
                msg: 'no products found'
            })
        }else {
            res.status(200).json({
                status: true,
                data: data,
                msg: 'fetch success'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.put('/update/product/:productId', [
    body('price').exists().isFloat(),
    body('quantity').exists().isInt()
], middlewares.isAuthorised, async (req, res) => {
    try {
        const {price, quantity} = req.body;
        var update = {
            price: price,
            quantity: quantity
        }

        var data = await InventoryModel.findOneAndUpdate({shopId: req.user.shopId}, update)

        if(data) {
            res.status(200).json({
                status: true,
                msg: 'product updated successfully'
            })
        }else {
            res.status(400).json({
                status: false,
                msg: 'failed to update product'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.delete('/delete/product/:productId', middlewares.isAuthorised, async (req, res) => {
    try {
        const productId = req.params.productId;
        let data = await InventoryModel.findOneAndDelete(productId);

        if(data) {
            res.status(200).json({
                status: true,
                msg: 'product deleted successfully'
            })
        }else {
            res.status(400).json({
                status: false,
                msg: 'failed to delete product'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

module.exports = router;