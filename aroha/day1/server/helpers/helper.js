
module.exports={
    auth : (req,res,next)=>{
        // return res.json({err:true,err_msg:'Auth Failed'});
        next();
    },
    logger : (req,res,next)=>{
        console.log("GOT A REQUEST");
      //  res.send("I am angry, i will not allow")
        next()
    }
}

