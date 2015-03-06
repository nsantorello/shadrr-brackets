define(function (require, exports, module) {  
    "use strict";
    
    var Panel = require("panel"),
        ClientsPanel = require("clients-panel"),
        Mdns = require("mdns"),
        Requests = require("requests"),
        _ = require("vendor/lodash");
    
    var ModuleExports = {},
        clients = {};
    
    function getClientId(data) {
        return data.host + ":" + data.port;   
    }
    
    function addClient(id) {
        if (!(id in clients)) {
            var client = { id: id, address: "http://" + id };
            clients[client.id] = client; 

            Requests.establishConnection(
                client.address, 
                function() {
                    // Add to UI
                    ClientsPanel.addClientToDom(client);

                    console.log("[Shadrr/devices.js] Added client:", client);  
                }, function() {
                    delete clients[id];
                }
            );
        }
    }
    
    function removeClient(id) {
        if (id in clients) {
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
        // Show the client as transmitting in the UI
        ClientsPanel.setIsTransmitting(client, true);
        
        Requests.pushShader(client.address, file, code,
            function() {
                // Show the client as no longer transmitting in the UI
                ClientsPanel.setIsTransmitting(client, false);
            },
            function() { 
                // Client didn't respond, or there was an error communicating -- so remove it
                console.log("[Shadrr/devices.js] Client is stale:", client);
                removeClient(client.id);
            }
        );
    }
    
    module.exports = ModuleExports;
});