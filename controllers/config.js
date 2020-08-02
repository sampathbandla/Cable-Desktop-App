const fs = require("fs")
module.exports.check = function check()
{
    raw_data = fs.readFileSync("config.json")
    data = JSON.parse(raw_data)

    if(data.network)
    {
        return 1
    }
    else
    {
        return 2
    }
}

module.exports.setNetworkName = function setNetworkName(name)
{
    name = { network:name }
    name = JSON.stringify(name)
    fs.writeFileSync('config.json', name);
}

module.exports.getNetworkName = function getNetworkName()
{
    raw_data = fs.readFileSync("config.json")
    data = JSON.parse(raw_data)
    return data.network
}
