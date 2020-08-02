var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/language" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


module.exports.setLanguage = function setLanguage(langName,callback)
{
    db.insert({name:langName},(err,lang) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",lang:lang})
        }
    })
}

module.exports.getLangById = function getLangById(langId,callback)
{
    db.findOne({_id:langId},(err,lang) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",lang:lang})
        }
    })
}

module.exports.getLangByName = function getLangByName(langName,callback)
{
    db.findOne({name:langName},(err,lang) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",lang:lang})
        }
    })
}
module.exports.getLangs= function getLangs(callback)
{
    db.find({},(err,langs) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",langs:langs})
        }
    })
}

module.exports.editLang = function editLang(id,name,callback)
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

module.exports.deleteLang = function deleteLang(id,callback)
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