
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body }  = require('express-validator/check');

const middlewares = require('../middlewares')
const UserModel = require('../models/UserModel');
const ShopModel = require('../models/ShopModel')

let router = express.Router();


router.post('/shop/register', [
    body('ownerName').exists(),
    body('ownerAddress').exists(),
    body('shopName').exists(),
    body('shopAddress').exists(),
    body('contact').exists(),
    body('username').exists(),
    body('password').exists()
], async (req, res) => {
    try {
        const {ownerName, ownerAddress, shopName, shopAddress, contact, username, password} = req.body;
        
        let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        let user = new UserModel({
            username: username,
            password: hash
        })

        let data = await user.save();

        let shop = new ShopModel({
            ownerName: ownerName,
            ownerAddress: ownerAddress,
            shopName: shopName,
            shopAddress: shopAddress,
            contact: contact,
            userId: data._id
        })
        let s = await shop.save()
        if(data && s) {
            res.status(200).json({
                status: true,
                msg: 'registration success'
            })
        }else {
            res.status(400).json({
                status: false,
                msg: 'registration failed'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.post('/user/login', [
    body('username').exists(),
    body('password').exists()
], async (req, res) => {
    try {
        const {username, password} = req.body;
        let data = await UserModel.findOne({username: username});
        if (data == null || data == undefined) {
            res.status(404).json({
                status: false,
                msg: `user with ${username} not found`
            })
        }
        if (bcrypt.compareSync(password, data.password)) {
            signiningData = {
                username: data.username,
                id: data._id
            }
            token = jwt.sign(signiningData, req.app.get('secret'));
            signiningData['token'] = token;

            res.status(200).json({
                status: true,
                msg: 'login success',
                token: signiningData
            })
        } else {
            res.status(401).json({
                status: false,
                msg: `invalid username or password`
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.post('/user/check/username/:username', async (req, res) => {
    try {
        let usernameIsExists = await UserModel.findOne({username: req.params.username});
         if(usernameIsExists) {
             res.status(409).json({
                 status: false,
                 msg: `${req.params.username} already exists`
             })
         }else {
             res.status(200).json({
                 status: true,
                 msg: `${req.params.username} is available`
             })
         }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Internal server error: ${error}`
        })
    }
})

router.post('/user/update/profile', [
    body('ownerAddress').exists(),
    body('shopName').exists(),
    body('shopAddress').exists(),
    body('contact').exists(),
], middlewares.isAuthorised, async (req, res) => {
    try {
        const {ownerAddress, shopName, shopAddress, contact} = req.body;
        var update = {
            ownerAddress: ownerAddress,
            shopName: shopName,
            shopAddress: shopAddress,
            contact: contact
        }

        var data = await ShopModel.findByIdAndUpdate(req.user.id, update)

        if(data) {
            res.status(200).json({
                status: true,
                msg: 'update success'
            })
        }else {
            res.status(400).json({
                status: false,
                msg: 'failed to update profile'
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