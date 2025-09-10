const jwt = require('jsonwebtoken');
const jwtVerifier = (req,res,next) =>
    {
        const authHeader = req.headers['authorization'];
        if(!authHeader)
            {
                return res.status(401).json({Message:'Looks like you are not signed in'});
            }
        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_KEY,(err,decoded)=>
        {
            if(err){return res.status(400).json({Message:'Not valid token'})};
            req.user = decoded.email;
            res.status(200);
            next();
        });
    };
module.exports = jwtVerifier;