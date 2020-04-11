const express = require('express');
const port = 8000;
const app = express();
app.use(express.json());

app.listen(port, () => console.log(`Server at port ${port}`));