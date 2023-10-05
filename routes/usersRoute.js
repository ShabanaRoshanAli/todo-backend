const User = require('../models/user')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const userList = await User.find().maxTimeMS(3000)
    try {
        res.send(userList).status(200)
    } catch (error) {
        res.send(error).status(500)
    }

})
router.post('/', async (req, res) => {
    try {
        const userData = await User.findOne({
            email: req.body.email
        });

        if (userData) {
            return res.status(401).send('Email already in use');
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const savedUser = await newUser.save();

        if (!savedUser) {
            return res.status(500).send('User could not be created');
        }

        return res.status(200).send(savedUser);
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error');
    }
});
// login 
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECERET_KEY;
    console.log(secret);

    if (!user) {
        res.status(401).send('The user not found!');
    } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user._id
            },
            secret,
            { expiresIn: '1d' }
        );
        const currentUser = user.isAdmin ? 'ADMIN_USER' : 'NORMAL_USER';

        res.status(200).send({
            user: user.name,
            userId: user._id,
            token,
            isAdmin: currentUser
        });
    } else {
        res.status(400).send('Password is wrong!');
    }
});

router.delete('/:id', async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'the user is deleted!'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.put('/reset', async (req, res) => {
    const userData = await User.findOne({
        name: req.body.name,
        email: req.body.email
    })
    const user = await User.findByIdAndUpdate(
        userData._id,
        {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        },
        // return the new updated data
        { new: true }
    )

    if (!user) {
        return res.status(404).send('the user cannot be updated')
    }
    res.send(user).status(200)
})

module.exports = router;
