const express = require('express');
const router = express.Router();
const Todo = require('../models/todos')


app.get('/todos', async (req, res) => {
    const todosList = await Todo.find();
    if (todosList) {
        res.json(todosList).status(200)
    } else {
        res.send("Something wemt wrong.")
    }
})

module.exports = router;