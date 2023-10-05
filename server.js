require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const TodoRoutes = require('./routes/todosRoute')
const app = express();
const PORT = process.env.PORT || 3050;

app.use(express.json());

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
app.use('/api/todos', TodoRoutes)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})