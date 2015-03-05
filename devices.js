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
    
    function addClient(client) {
        Devices.clients.push(client);
        console.log("[Shadrr/devices.js] Added client:", client);        
    }
    
    function removeClient(client) {
        _.remove(Devices.clients, function(c) { return c == client; });
        console.log("[Shadrr/devices.js] Removed client:", client);
    }
    
    mdns.shadrrUp(function(data) {
        var client = getClient(data);
        if (!_.contains(Devices.clients, client)) {
            addClient(client);
        }
    });
    
    mdns.shadrrDown(function(data) {
        var client = getClient(data);
        if (_.contains(Devices.clients, client)) {
            removeClient(client);
        }
    });
    
    Devices._broadcastToDevice = function(client, file, code) {
        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("POST", "http://" + client, true);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.send("file=" + file + "&code=" + code);
        } catch (ex) {
            console.log("[Shadrr/devices.js] Removing stale client '" + client + "'");
            removeClient(client);
        }
    }
    
    Devices.broadcast = function(file, code) {
        _.forEach(Devices.clients, function(c) { Devices._broadcastToDevice(c, file, code); });
    }
    
    module.exports = Devices;
});