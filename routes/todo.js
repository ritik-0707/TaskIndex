const router=require('express').Router();
const Todos = require('../models/Todos');

//routes
router.post("/add/todo",(req,resp)=>{ 
    const p1= req.body;
    const newTodo=new Todos(p1)
    //save p1
    newTodo.save().then(()=>{
        console.log("sucessfully saved!");
        resp.redirect("/");
    }).catch((err)=>{ 
        console.log(err);
    })

});

router.get("/delete/todo/:_id",(req,resp)=>{
    const p1= req.params;

    //delete p1
    Todos.deleteOne(p1).then(()=>{
        console.log("sucessfully deleted!");
        resp.redirect("/");
    }).catch((err)=>{
        console.log(err);
    })

}); 

//module.exports=router;