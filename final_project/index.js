const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { JWT_SECRET } = require('./config/credentials.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const auth = req.session.auth;
    if(!auth)
        return res.status(401).json({message: "Unauthentitcated user."});
    
    const {username} = jwt.verify(auth, JWT_SECRET);
    if(!username)
        return res.status(401).json({message: "Unauthentitcated user."});

    next();
});
 
const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
