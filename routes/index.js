const router= require("express").Router();
const Todos = require('../models/Todos');

router.get("/",async(req,resp)=>{
    const alltodo=await Todos.find();
    resp.render("index",{todo: alltodo});

})
app.get("/todo", async (req, res) => {
    const alltodo = await Todos.find();
    res.send({ todo: alltodo });
  });
  
  
  //search module
  app.get("/find", async (req, res) => {
    const p1 = req.query.todo;
    console.log(p1);
    let data = await Todos.findOne({ todo: p1 })
    if (data) {
      res.render("index2", { todo: data });
    } else {
      res.status(404).render("partials/message", { p1 });
    }
  });
  
  
  
  
  //app.use(require('./routes/todo'));
  app.post("/add/todo", async (req, res) => {
    const p1 = req.body;
    const newTodo = new Todos(p1);
    try {
      await newTodo.save()
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  });
  
  //note: dynamic route are always below the static one
  app.get("/delete/:_id", async (req, res) => {
    const p1 = req.params;
    //console.log(p1);
    try {
      const z = await Todos.findOne({ _id: p1._id });
      await Todos.deleteOne(p1);
      const alltodo = await Todos.find();
      const deleteMessage = `${z.todo} get Deleted sucessfully!`;
      res.render('index', { deleteMessage: deleteMessage, todo: alltodo });
    } catch (error) {
      console.log(error);
    }
     
  
  });
  
  app.post("/update/:_id", async (req, res) => {
    const p1 = req.params;
    let data = await Todos.updateOne(
      { _id: p1 },
      {
        $set: { todo: req.body.todo }
      }
  
    )
    res.redirect("/");
  
  });

//module.exports=router; 