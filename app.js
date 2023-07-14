const express = require('express');
const mongoose = require('mongoose');
var morgan = require('morgan');
const Todos = require('./models/Todos');
const app = express();

app.use(morgan('combined'));

//connection
mongoose.connect("mongodb://127.0.0.1/blog", {
  useNewUrlparser: true,
  useUnifiedTopology: true
});

 app.use(express.static('public'));


//middlewares
app.use(express.urlencoded({ extend: true }));
app.set("view engine", "ejs");
app.use(express.json());

//get method:-
app.get("/getData", async (req, res) => {
  const alltodo = await Todos.find();
  res.send({ todo: alltodo });
});

app.get("/find/:todo", async (req, res) => {
  const p1 = req.params.todo;
  console.log(p1);
  let data = await Todos.find({ todo: p1 });
  if (data) {
    res.send({ todo: data });
  } else {
    res.status(404).send(`${p1} is not fond in todolist!`);
  }
});

app.post("/", async (req, res) => {
  const p1= req.body;
    const newTodo=new Todos(p1)

  try{
    const result=await newTodo.save();
        res.send(result);
    }catch(err){
      res.status(404).send(err);
    }
   
});

app.put("/update/:_id", async (req, res) => {
  const p1 = req.params;
  try{
    let data = await Todos.updateOne(
    { _id: p1 },
    {
      $set: { todo: req.body.todo }
    }
  )
  res.send(data);
  }catch{
    res.status(404).send("cannot update!");
  }
});


app.delete("/delete/:_id", async (req, res) => {
  const p1 = req.params;
  try {
    const z = await Todos.findOne({ _id: p1._id });
   const result= await Todos.deleteOne(p1);
    res.send(result);
    
  } catch {
    res.status(404).send("cannot deleted");
  }
});


app.listen(5000||process.env.port, () => {
  console.log("sever is listening at 5000");
})