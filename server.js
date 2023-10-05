require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const TodoRoutes = require('./routes/todosRoute');
const UserRoutes = require('./routes/usersRoute')
const app = express();
const PORT = process.env.PORT || 3050;
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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
app.use('/api/todos', TodoRoutes);
app.use('/api/users', UserRoutes)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})