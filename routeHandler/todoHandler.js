const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");

const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");


// get all todo
router.get("/",checkLogin, async (req, res) => {
  console.log(req.username);
  console.log(req.userId);

  await Todo.find({ })
  .populate('user', 'name username -_id')
  .select({
    _id:0,
    data : 0,
    __v:0
  }).limit()
    .then((data) => {
      res.status(200).json({
        result: data,
        message: "Todo was inserted successfully!",
      });
    })
    .catch(() => {
      res.status(500).json("There was a server side error!");
    });
});


router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

// instance with call back 
router.get("/active-callback",  (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) =>{
    res.status(200).json({
      data,
    });
  });
  
});

// get active todos by static method 
router.get('/js', async(req, res) =>{
  const data = await Todo.findByJS();
  res.status(200).json({
    data,
  });
})

// get todos by langauge 
router.get('/language', async(req, res) =>{
  const data = await Todo.find().byLanguage('react');
  res.status(200).json({
    data,
  });
})


// get a todo by id
router.get("/:id", async (req, res) => {
    await Todo.find({ _id: req.params.id })
        .then((data) => {
          res.status(200).json({
            result: data,
            message: "Todo was inserted successfully!",
          });
        })
        .catch(() => {
          res.status(500).json("There was a server side error!");
        });
});

// post a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user : req.userId
  });
  try{
    let todo = await newTodo.save();
    await User.updateOne({
      _id : req.userId
    }, {
      $push :{
        todos : todo._id
      }
    });
    res.status(200).json("Todo was inserted successfully!");
  }catch{
    res.status(500).json("There was a server side error!");
  }
  

});

// post all todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body)
    .then(() => {
      res.status(200).json("Todo was inserted successfully!");
    })
    .catch(() => {
      res.status(500).json("There was a server side error!");
    });
});

// put todo
router.put("/:id", async (req, res) => {
  // await Todo.updateOne({_id : req.params.id}
  await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
      // {

      // }
    }
  )
    .then(() => {
      res.status(200).json("Todo was Updated successfully!");
    })
    .catch(() => {
      res.status(500).json("There was a server side error!");
    });
});

// delete todo
router.delete("/:id", async (req, res) => {
    // ### this code only for just object or one data delete ###
    await Todo.deleteOne({ _id: req.params.id })
        .then((data) => {
          res.status(200).json({
            message: "Todo was deleted successfully!",
          });
        })
        .catch(() => {
          res.status(500).json("There was a server side error!");
        });

      // ### this code use when you need delete value get and show  ###
    //   let result = await Todo.findOneAndDelete({ _id: req.params.id })
    //     .then((data) => {
    //       res.status(200).json({
    //         message: "Todo was deleted successfully!",
    //       });
    //     })
    //     .catch(() => {
    //       res.status(500).json("There was a server side error!");
    //     });

    //     console.log(result)


     

    
    
});

// router.delete("/all", async (req, res) => {
//     await Todo.deleteMany({status :active})
//         .then((data) => {
//           res.status(200).json({
//             message: "Todo was deleted successfully!",
//           });
//         })
//         .catch(() => {
//           res.status(500).json("There was a server side error!");
//         });
// })


// #Todo 
// 1. findByIdDelete
// 2. deleteMany 

// not work 

module.exports = router;
