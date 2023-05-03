const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    status : {
        type:String,
        enum : ['active', 'inactive'],
    },
    data : {
        type : Date,
        default : Date.now,
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    }

});

// instance method 
todoSchema.methods={
    findActive : function(){
        return mongoose.model('Todo').find({status : "inactive"})
    }
}

// instance method with callback 
todoSchema.methods={
    findActiveCallback : function(cb){
        return mongoose.model('Todo').find({status : "inactive"}, cb)
    }
}

// static methods
todoSchema.statics = {
    findByJS : function(){
        return this.find({title : /js/i});

    }
}

// query method 
todoSchema.query = {
    byLanguage : function(language){
        return this.find({title : new RegExp(language, "i")})
    }
};


module.exports = todoSchema;


