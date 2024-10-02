const express = require('express');
const app = express();
const connectDb = require('./connectDb/connectDb');
require('dotenv').config();
const port = process.env.PORT || 2000;
connectDb();
app.use(express.json());
app.use('/api/user', require('./router/userRouter'));
app.listen(port ,() => {
    console.log(`Server started running on port ${port}`)
});