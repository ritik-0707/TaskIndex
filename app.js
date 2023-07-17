const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Todos = require('./models/Todos');
const Register = require('./models/Register');
const path = require('path');
const morgan=require('morgan');
const app = express();


//connection
mongoose.connect("mongodb://127.0.0.1/blog", {
  useNewUrlparser: true,
  useUnifiedTopology: true
});

app.use(morgan('tiny'));
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

app.use('/public', isAuthenticated, express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Register.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.redirect('/login');
  } else {
    req.session.user = user;
    res.redirect('/dashboard');
  }
});


app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('dashboard', { user: req.session.user });

  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newRegister = new Register({ username, password: hashedPassword });
  try {
    const result = await newRegister.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});


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
  const p1 = req.body;
  const newTodo = new Todos(p1)

  try {
    const result = await newTodo.save();
    res.send(result);
  } catch (err) {
    res.status(404).send(err);
  }

});

app.put("/update/:_id", async (req, res) => {
  const p1 = req.params;
  try {
    let data = await Todos.updateOne(
      { _id: p1 },
      {
        $set: { todo: req.body.todo }
      }
    )
    res.send(data);
  } catch {
    res.status(404).send("cannot update!");
  }
});


app.delete("/delete/:_id", async (req, res) => {
  const p1 = req.params;
  try {
    const z = await Todos.findOne({ _id: p1._id });
    const result = await Todos.deleteOne(p1);
    res.send(result);

  } catch {
    res.status(404).send("cannot deleted");
  }
});


app.listen(5000 || process.env.port, () => {
  console.log("sever is listening at 5000");
})