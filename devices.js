define(function (require, exports, module) {  
    "use strict";
    
    var mdns = require("mdns"),
        _ = require("vendor/lodash");
    
    var Devices = {
        clients: []
    }
    
    function getClient(data) {
        return data.host + ":" + data.port;   
    }
    
    mdns.shadrrUp(function(data) {
        var client = getClient(data);
        if (!_.contains(Devices.clients, client)) {
            Devices.clients.push(client);
            console.log("[Shadrr/devices.js] Added client:", client);
        }
    });
    
    mdns.shadrrDown(function(data) {
        var client = getClient(data);
        if (_.contains(Devices.clients, client)) {
            _.remove(Devices.clients, function(c) { return c == client; });
            console.log("[Shadrr/devices.js] Removed client:", client);
        }
    });
    
    Devices._broadcastToDevice = function(client, file, code) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "http://" + client, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send("file=" + file + "&code=" + code);
        
        // TODO: handle HTTP errors and potentially remove the device or flag it as bad
        // TODO: need to url escape the code probably
    }
    
    Devices.broadcast = function(file, code) {
        _.forEach(Devices.clients, function(c) { Devices._broadcastToDevice(c, file, code); });
    }
    
    module.exports = Devices;
});