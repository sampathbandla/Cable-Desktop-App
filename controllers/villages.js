var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/villages" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

module.exports.setVillage = function setVillage(villageName,callback)
{
    db.insert({name:villageName},(err,village) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",village:village})
        }
    })
}

module.exports.getVillageById = function getVillageById(id,callback)
{
    db.findOne({_id:id},(err,village) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",village:village})
        }
    })
}

module.exports.getVillageByName = function getVillageByName(name,callback)
{
    db.findOne({name:name},(err,village) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",village:village})
        }
    })
}

module.exports.getVillages = function getVillages(callback)
{
    db.find({},(err,villages) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
            callback({status:"SUCCESS",villages:villages})
        }
    })
}

module.exports.changeVillageName = function changeVillageName(id,newName,callback)
{
    db.update({_id:id},{name:newName},(err) => {
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

module.exports.deleteVillage = function deleteVillage(id,callback)
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