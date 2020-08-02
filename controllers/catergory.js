var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/category" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


module.exports.setCat = function setCat(catName,callback)
{
    db.insert({name:catName},(err,cat) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",cat:cat})
        }
    })
}

module.exports.getCatById = function getCatById(catId,callback)
{
    db.findOne({_id:catId},(err,cat) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",cat:cat})
        }
    })
}

module.exports.getCatByName = function getCatByName(catName,callback)
{
    db.findOne({name:catName},(err,cat) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",cat:cat})
        }
    })
}
module.exports.getCats= function getCats(callback)
{
    db.find({},(err,cats) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",cats:cats})
        }
    })
}

module.exports.editCat = function editCats(id,name,callback)
{
  db.update({_id:id},{name:name},(err) => {
    if(err)
    {
      callback("DB_ERROR")
    }
    else
    {
      callback("SUCCESS")
    }
  })
}

module.exports.deleteCat = function deleteCat(id,callback)
{
  db.remove({_id:id},(err,n) => {
    if(err)
    {
      callback("DB_ERROR")
    }
    else
    {
      callback("SUCCESS")
    }
  })
}