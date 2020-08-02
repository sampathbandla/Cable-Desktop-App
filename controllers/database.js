var Datastore = require('nedb')
  , db = new Datastore({ filename: 'users' });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

db.insert({username:"sampath9989",password:"sssU9989@"},(err,user) => {
    console.log(user)
})