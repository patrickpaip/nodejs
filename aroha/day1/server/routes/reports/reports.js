const express = require('express');
const router =express.Router();

router.get('/',(req,res)=>{
    res.json({err:false,err_msg:'Rports Root'})
});

router.get('/users',(req,res)=>{
    res.json({err:false,err_msg:'Rports UsersGet'})
});

router.post('/users',(req,res)=>{
    res.json({err:false,err_msg:'Rports UserPost'})
});

router.post('/users/:userid/active',(req,res)=>{
    console.log(req.params);
    res.json({err:false,err_msg:'Rports UserPost',data: req.params})
});

module.exports = router;