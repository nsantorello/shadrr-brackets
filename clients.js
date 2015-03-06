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
    
    function addClient(data) {
        var id = getClientId(data);
        if (!(id in clients)) {
            // Track internally
            var client = { id: id };
            client.domNode = createDomNodeForClient(client);
            clients[client.id] = client; 

            // Add to UI
            addClientToDom(client);

            console.log("[Shadrr/devices.js] Added client:", client);  
        }
    }
    
    function removeClient(data) {
        var id = getClientId(data);
        if (id in clients) {
            // Remove internally
            var client = clients[id];
            delete clients[id];

            // Remove from UI
            removeClientFromDom(client);

            console.log("[Shadrr/devices.js] Removed client:", client);
        }
    }
    
    Mdns.shadrrUp(function(data) {
        addClient(data);
    });
    
    Mdns.shadrrDown(function(data) {
        removeClient(data);
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
            console.log("[Shadrr/devices.js] Removing stale client '" + client.id + "'");
            removeClient(client);
        };
        xmlHttp.onreadystatechange = function() {
            // These look like magic values, but they're not--I promise!
            // http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                setIsTransmitting(client, false);
            }
        };
        
        // Set transmission active
        setIsTransmitting(client, true);
        
        // Transmit data to client
        xmlHttp.send("filename=" + file + "&code=" + code);
    }
    
    function setIsTransmitting(client, isTransmitting) {
        var transmittingClass = "shadrr-transmitting";
        var idNode = client.domNode.find(".shadrr-client-id");
        if (isTransmitting) {
            idNode.addClass(transmittingClass);
        } else {
            idNode.removeClass(transmittingClass);
        }
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