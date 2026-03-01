const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express();
const {Pool} = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");


const PORT = 2000;
const FrontEndUlr = process.env.FRONTENDURL;


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: parseInt(process.env.DB_MAX_CONNECTIONS),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT)
})
pool.on('error',(err) => {
    console.log("Unexpected Error of connection: " + err)
})

async function query(sql, params){
    const connection = await pool.connect();
    try{
        const results = await connection.query(sql, params);
        return results;
    } catch (err){
        console.log("Error executing of query: " + err);
        throw err;
    } finally{
        connection.release();
    }
}

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTENDURL || 'http://localhost:3000',
    credentials: true
}))
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: process.env.DB_SESSION_NAME
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60,
        sameSite: 'lax'
    }
}))


app.get('/', (req,res)=>{
    res.send("hello world");
})

app.post('/api/auth', async (req, res) =>{
    const email = req.body.email;  
    const password = req.body.password;
    const sql = `SELECT * FROM users WHERE email = $1 AND password_hash = $2`;
    try{
        const response = await query(sql, [email, password]);
        if(response.rowCount === 1){ 
            const user = await response.rows[0];
            req.session.id = user.id;
            req.session.isAdmin = user.role === 'admin';
            return res.status(200).json({success:true});
        }
    } catch (error){
        console.error(error);
        return res.status(500).json({success: false, message: `User is not found or You Input wrong data\n${error.message}`})
    }
})

app.post('/api/registration', async(req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const fathername = req.body.fathername;
    const date = req.body.date;
    const email = req.body.email;
    const password = req.body.password;
    const sql = `INSERT INTO users (first_name, last_name, father_name, birth_date, email, password_hash)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role;`;
    try{
    const results = await query(sql, [name, surname, fathername, date, email, password]);    
        if (results.rowCount === 1){
            const user = await results.rows[0];
            req.session.id = user.id;
            req.session.isAdmin = user.role === 'admin';
            return res.status(200).json({success: true})
        }
    } catch (error){
        console.error(error);
        return res.status(500).json({success: false, message: `User is alreade have or You Input wrong data\n${results}`})
    }

})

app.post('/api/logout', async(req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log("LogOut Error: ", err.message);
            return res.status(500).json({success: false, message: err.message})
        }
        res.clearCookie("connection.sid");
        return res.status(200).json({success: true});
    })
})

app.listen(PORT, () => {
    console.log("Server is Running on PORT: " + PORT);
})
