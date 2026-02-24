const express = require('express')
const cors = require('cors');
const app = express();


const PORT = 2000;
const FrontEndUlr = process.env.FRONTENDURL;


app.use(express.json());
app.use(cors({
    origin: process.env.FRONTENDURL || 'http://localhost:3000',
    credentials: true
}))


app.get('/', (req,res)=>{
    res.send("hello world");
})

app.post('/upload-data', (req, res) =>{
    const name = req.body.name;  
    const date = req.body.date;
    res.status(200).send(`${name} ${date}`)
    console.log(name, date);
})

app.listen(PORT, () => {
    console.log("Server is Running on PORT: " + PORT);
})
