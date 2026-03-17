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
        const results = params && params.length > 0 ? 
        await connection.query(sql, params) :
        await connection.query(sql);
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
        maxAge: 1000 * 60 * 10,
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
            req.session.userId = user.id;
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
            req.session.userId = user.id;
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

const isAdmin = (req,res, next) => {
    if(req.session.isAdmin){
        return next();
    }
    else{
        return res.status(401).json({success: false, isAdmin: false, message: 'You arent an Admin'})
    }

}

const isAuthenticated = (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({success: false, message: "Unathorized, Please Log In"})
    }
    if(req.session.cookie.expires && req.session.cookie.expires < Date.now()){
        req.session.destroy(err => {
        if(err){
            console.log("LogOut Error: ", err.message);
            return res.status(500).json({success: false, message: err.message})
        }
        res.clearCookie("connection.sid");
        return res.status(401).json({success: false, message: "Your Session Term is Finish"});
    })
        return;
    }
    const sessionTime = 1000 * 60 * 10;
    req.session.cookie.maxAge = sessionTime;
    req.session.cookie.expires = new Date(Date.now() + sessionTime);
    return next();
}   


app.get('/api/check-authenticated', isAuthenticated, async(req, res) => {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const id = req.session.userId;
    const response = await query(sql, [id]);
    const result = await response.rows[0];
    return res.status(200).json({isAuthenticated: true, success: true, body: result});
})

app.get('/api/isAdmin', isAuthenticated, isAdmin, (req, res) => {
    return res.status(200).json({success: true, isAdmin: true});
});

app.get('/api/get-my-id', isAuthenticated, (req, res) =>{
    return res.status(200).json({success: true, userId: req.session.userId});
})

app.get('/api/get-all-users', isAuthenticated, isAdmin, async(req, res) => {
    const sql = "SELECT * FROM users";
    try{
        const result = await query(sql, []);
        const response = await result.rows;
        return res.status(200).json({success: true, users: response});
    } catch (error) {
        console.log("Error fetching users: ", error);
        return res.status(500).json({success: false, message: error.message});
    }
})


app.delete('/api/delete-user/:userId', isAuthenticated, async(req, res) => {
    const userId = req.params.userId;
    const sql = "DELETE from users WHERE id = $1";
    if(req.session.isAdmin){
        const response = await query(sql, [userId]);
    }
    else if (req.session.userId == userId){
        const response = await query(sql, [userId]);
    }
    else{
        return res.status(403).json({success: false, message: "You tried to Delete Another User"});
    }
    return res.status(200).json({success:true, message:"User was Deleted"});
})

app.listen(PORT, () => {
    console.log("Server is Running on PORT: " + PORT);
})
