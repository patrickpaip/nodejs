const express = require('express');
const router =express.Router();
const authModule= require('../../shared/auth');
router.use(authModule.passport.initialize());
// User Registration

router.post('/login',authModule.authenticateViaPassport,authModule.generateJWT,authModule.returnAuthResponse);

router.post('/userdetails',authModule.ensureAuthenticatedElseError,(req,res)=>{
    res.json({err:false,content:res.locals.mobile})
})

// router('/refreshToken',checkexistance,authModule.generateJWT,authModule.returnAuthResponse);


module.exports = router;