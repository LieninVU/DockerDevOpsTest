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

app.post('/api/auth', (req, res) =>{
    const email = req.body.email;  
    const password = req.body.password;
    res.status(200).send(`${name} ${date}`)
    console.log(name, date);
})

app.post('/api/registration', (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const fathername = req.body.fathername;
    const date = req.body.date;
    const email = req.body.email;
    const password = req.body.password;

})

app.listen(PORT, () => {
    console.log("Server is Running on PORT: " + PORT);
})
