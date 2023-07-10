const mongoose=require('mongoose');

var Todoschema= new mongoose.Schema({
    todo:{
        type: String,
        required: true 
    },
});

module.exports= new mongoose.model("Todos",Todoschema);