var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/users" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

module.exports.isUsersExist = function isUsersExist(callback)
{
    db.find({},(err,users) => {
        if(users.length == 0)
        {
            callback(0);
        }
        else
        {
            callback(-1);
        }
    })
}

module.exports.checkIfUserExists = function checkIfUserExists(user,callback){
    db.find({username:user.username},(err,result) => {
        if(err) throw err
        if(result.length == 0)
        {
            callback(false);
        }
        else
        {
            callback(result);
        }
    })
}

module.exports.login = function login(user,callback){
    db.find({username:user.username,password:user.password},(err,result) => {
        if(err) throw err
        if(result.length == 0)
        {
            callback(false);
        }
        else
        {
            callback(result);
        }
    })
}


module.exports.register = function register(user,callback)
{
    this.checkIfUserExists(user,(status) => {
        if(status != false)
        {
            callback({status:false,err:"User Already Created!"})
        }
        else
        {
            db.insert({username:user.username,password:user.password},(err,user) => {
                if(err) throw err
                console.log("User Created : " + user)
                callback({status:true,user:user})
            })
        }
    })
    
}