const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 2000;

app.listen(port ,() => {
    console.log(`Server started running on port ${port}`)
});