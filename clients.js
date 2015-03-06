define(function (require, exports, module) {  
    "use strict";
    
    var Panel = require("panel"),
        Mdns = require("mdns"),
        _ = require("vendor/lodash"),
        ClientTemplate = require("text!templates/client.html");
    
    var ModuleExports = {},
        clients = {},
        clientsDomNode = $(require("text!templates/client-group.html"));
    
    function getClientId(data) {
        return data.host + ":" + data.port;   
    }
    
    function addClient(id) {
        // Track internally
        var client = { id: id, isTransmitting: false };
        client.domNode = createDomNodeForClient(client);
        clients[client.id] = client; 
        
        // Add to UI
        addClientToDom(client);
        
        console.log("[Shadrr/devices.js] Added client:", client);  
    }
    
    function removeClient(client) {
        // Remove internally
        delete clients[client.id];
        
        // Remove from UI
        removeClientFromDom(client);
        
        console.log("[Shadrr/devices.js] Removed client:", client);
    }
    
    Mdns.shadrrUp(function(data) {
        var id = getClientId(data);
        if (!(id in clients)) {
            addClient(id);
        }
    });
    
    Mdns.shadrrDown(function(data) {
        var id = getClientId(data);
        if (id in clients) {
            removeClient(clients[id]);
        }
    });
    
    function broadcastToClient(client, file, code) {
        // TODO: eventually pull these requests into a separate file "requests.js"
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "http://" + client.id, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onerror = function() { 
            console.log("[Shadrr/devices.js] Removing stale client '" + client.id + "'");
            removeClient(client);
        };
        xmlHttp.send("filename=" + file + "&code=" + code);
    }
    
    ModuleExports.broadcast = function(file, code) {
        _.forEach(clients, function(c) { broadcastToClient(c.id, file, code); });
    }
    
    function createDomNodeForClient(client) {
        return $(Mustache.render(ClientTemplate, client));
    }
    
    function addClientToDom(client) {
        clientsDomNode.append(client.domNode);
        Panel.recomputeLayout();
    }
    
    function removeClientFromDom(client) {
        client.domNode.remove();
        Panel.recomputeLayout();
    }
    
    Panel.domNode.append(clientsDomNode);
    
    module.exports = ModuleExports;
});