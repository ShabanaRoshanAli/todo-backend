require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todos');

const app = express();
const PORT = process.env.PORT || 3050;
// to avoid so many errors 
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send({title: 'Todo'})
})
app.get('/todos', async(req, res) =>{
 const todosList = await Todo.find();
 if(todosList) {
    res.json(todosList).status(200)
 }else {
    res.send("Something wemt wrong.")
 }
})
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})