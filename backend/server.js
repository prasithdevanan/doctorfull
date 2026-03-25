import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connetDB from './config/mongodb.js';

//app config
const app = express();
const port = process.env.PORT || 4000;
connetDB();

//middleware
app.use(express.json());
app.use(cors());


//routes
app.get('/', (req, res) => {
    res.status(200).send('Hello Worldnnnnnnnn!'); 
})


app.listen(port, () => console.log(`listening on port ${port}`));