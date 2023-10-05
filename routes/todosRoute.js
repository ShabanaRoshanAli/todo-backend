const Activity = require('../models/todos')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const activity = await Activity.find().maxTimeMS(3000)
    try {
        res.send(activity).status(200)
    } catch (error) {
        res.send(error).status(500)
    }

})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const activities = await Activity.find({
            user: id
        });
        if (activities) {
            res.send(activities).status(200)
        } else {
            res.send('Task not found!').status(401)
        }
    } catch (error) {
        res.send(error).status(500)
    }
});

router.post('/', async (req, res) => {
    let postActivity = new Activity({
        activity: req.body.activity,
        completed: req.body.completed,
        user: req.body.user
    })
    console.log(postActivity);
    postActivity = await postActivity.save();
    if (!postActivity) {
        return res.status(404).send('the Task cannot be created')
    }
    res.send(postActivity)
})

router.put("/:id", async (req, res) => {

    const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        {
            activity: req.body.activity,
            completed: req.body.completed,
            user: req.body.userId
        },
        // return the new updated data
        { new: true }
    )
    if (!activity) {
        return res.status(404).send('the activity cannot be created')
    }
    res.send(activity)
})

router.delete('/:id', async (req, res) => {
    const activity = Activity.findByIdAndDelete(req.params.id)
        .then(activity => {
            if (activity) {
                return res.status(200).json({ success: true, message: 'the activity is deleted' })
            } else {
                return res.status(404).json({ success: false, message: 'activity not found' })
            }
        }).catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
})

module.exports = router;