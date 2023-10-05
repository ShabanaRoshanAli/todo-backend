const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    activity: {
        type: String,
        required: true 
    },
    completed: {
        type: Boolean,
        default: false 
    },
    user:  {
        type: String,
        required: true 
    }
});

module.exports = mongoose.model("activity", activitySchema); 
