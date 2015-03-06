define(function (require, exports, module) {  
    "use strict";
    
    var Panel = require("panel"),
        ClientTemplate = require("text!templates/client.html");
    
    var ModuleExports = {},
        clientsDomNode = $(require("text!templates/client-group.html"));
    
    ModuleExports.setIsTransmitting = function(client, isTransmitting) {
        var transmittingClass = "shadrr-transmitting";
        if (isTransmitting) {
            client.domNode.addClass(transmittingClass);
        } else {
            client.domNode.removeClass(transmittingClass);
        }
    }
    
    function createDomNodeForClient(client) {
        return $(Mustache.render(ClientTemplate, client));
    }
    
    ModuleExports.addClientToDom = function(client) {
        client.domNode = createDomNodeForClient(client);
        clientsDomNode.append(client.domNode);
        Panel.recomputeLayout();
    }
    
    ModuleExports.removeClientFromDom = function(client) {
        client.domNode.remove();
        Panel.recomputeLayout();
    }
    
    Panel.domNode.append(clientsDomNode);
    
    module.exports = ModuleExports;
});