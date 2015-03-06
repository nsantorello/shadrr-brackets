define(function (require, exports, module) {  
    "use strict";
    
    var Panel = require("panel"),
        ClientsPanel = require("clients-panel"),
        Mdns = require("mdns"),
        _ = require("vendor/lodash");
    
    var ModuleExports = {},
        clients = {};
    
    function getClientId(data) {
        return data.host + ":" + data.port;   
    }
    
    function addClient(id) {
        if (!(id in clients)) {
            // Track internally
            var client = { id: id };
            clients[client.id] = client; 

            // Add to UI
            ClientsPanel.addClientToDom(client);

            console.log("[Shadrr/devices.js] Added client:", client);  
        }
    }
    
    function removeClient(id) {
        if (id in clients) {
            // Remove internally
            var client = clients[id];
            delete clients[id];

            // Remove from UI
            ClientsPanel.removeClientFromDom(client);

            console.log("[Shadrr/devices.js] Removed client:", client);
        }
    }
    
    Mdns.shadrrUp(function(data) {
        addClient(getClientId(data));
    });
    
    Mdns.shadrrDown(function(data) {
        removeClient(getClientId(data));
    });
    
    ModuleExports.broadcast = function(file, code) {
        _.forEach(clients, function(c) { broadcastToClient(c, file, code); });
    }
    
    function broadcastToClient(client, file, code) {
        // TODO: eventually pull these requests into a separate file "requests.js"
        // Set up request
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.timeout = 5000; // 5 second timeout -- over a local network, this should be more than enough
        xmlHttp.open("POST", "http://" + client.id, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onerror = xmlHttp.ontimeout = function() { 
            console.log("[Shadrr/devices.js] Client is stale:", client);
            removeClient(client.id);
        };
        xmlHttp.onreadystatechange = function() {
            // These look like magic values, but they're not--I promise!
            // http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                ClientsPanel.setIsTransmitting(client, false);
            }
        };
        
        // Set transmission active
        ClientsPanel.setIsTransmitting(client, true);
        
        // Transmit data to client
        xmlHttp.send("filename=" + file + "&code=" + code);
    }
    
    module.exports = ModuleExports;
});