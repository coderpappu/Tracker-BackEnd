const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");

const Todo = new mongoose.model("Todo", todoSchema);

// get all todo
router.get("/", async (req, res) => {
  await Todo.find({ status: "active" }).select({
    _id:0,
    data : 0,
    __v:0
  }).limit(1)
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
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo
    .save()
    .then(() => {
      res.status(200).json("Todo was inserted successfully!");
    })
    .catch(() => {
      res.status(500).json("There was a server side error!");
    });
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
