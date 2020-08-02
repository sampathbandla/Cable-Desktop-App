var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/streets" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

module.exports.setStreet = function setStreet(villageId,streetName,callback)
{
    console.log(villageId)
    db.insert({name:streetName,villageId:villageId},(err,street) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",street:street})
        }
    })
}

module.exports.getStreetById = function getStreetById(id,callback)
{
    db.findOne({_id:id},(err,street) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",street:street})
        }
    })
}

module.exports.getStreetByName = function getStreetByName(name,callback)
{
    db.findOne({name:name},(err,street) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",street:street})
        }
    })
}

module.exports.getStreetsByVillageId = function getStreetsByVillageId(id,callback)
{
    db.find({villageId:id},(err,streets) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",streets:streets})
        }
    })
}

module.exports.getStreets = function getStreets(callback)
{
    db.find({},(err,streets) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",streets:streets})
        }
    })
}

module.exports.changeStreetName = function changeStreetName(id,newName,callback)
{
    db.update({_id:id},{$set:{name:newName}},(err) => {
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

module.exports.deleteStreet = function deleteStreet(id,callback)
{
    db.remove({_id:id},(err) => {
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