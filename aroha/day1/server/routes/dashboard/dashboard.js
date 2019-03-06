const express = require('express');
const router =express.Router();

router.get('/users',(req,res)=>{
    res.json({err:false,err_msg:'Dashboard UsersGet'})
});

module.exports = router;