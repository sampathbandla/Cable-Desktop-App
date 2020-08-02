var Datastore = require('nedb')
  , db = new Datastore({ filename: "databases/channels" });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


module.exports.setChannel = function setChannel(channelName,price,cat,lang,callback)
{
    db.insert({name:channelName,price:price,cat:cat,lang:lang},(err,channel) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channel:channel})
        }
    })
}

module.exports.getChannelById = function getChannelById(channelId,callback)
{
    db.findOne({_id:channelId},(err,channel) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channel:channel})
        }
    })
}

module.exports.getChannelByName = function getChannelByName(channelName,callback)
{
    db.findOne({name:channelName},(err,channel) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channel:channel})
        }
    })
}

module.exports.getChannelByCat = function getChannelByCat(catId,callback)
{
    db.find({cat:catId},(err,channels) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channels:channels})
        }
    })
}

module.exports.getChannelByLang = function getChannelByLang(langId,callback)
{
    db.find({lang:langId},(err,channels) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channels:channels})
        }
    })
}


module.exports.getChannels = function getChannels(callback)
{
    db.find({},(err,channels) => {
        if(err)
        {
            callback({status:"DB_ERROR"})
        }
        else
        {
          callback({status:"SUCCESS",channels:channels})
        }
    })
}

module.exports.editChannel = function editChannel(id,name,price,cat,lang,callback)
{
  db.update({_id:id},{name:name,price:price,cat:cat,lang:lang},(err) => {
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

module.exports.deleteChannel = function deleteChannel(id,callback)
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