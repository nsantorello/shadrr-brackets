define(function (require, exports, module) {  
    "use strict";
    
    var ModuleExports = {},
        _ = require("vendor/lodash");
    
    function createParamString(params) {
        return _.reduce(params, function(str, v, k) {
            return str + (str == "" ? "" : "&") + k + "=" + encodeURIComponent(v);
        }, "");
    }
    
    function sendRequest(addr, params, onSuccess, onError) {
        // Set up request
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.timeout = 5000; // 5 second timeout -- over a local network, this should be more than enough
        xmlHttp.open("POST", addr, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onerror = xmlHttp.ontimeout = onError;
        xmlHttp.onreadystatechange = function() {
            // These look like magic values, but they're not--I promise!
            // http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                onSuccess.apply(this, arguments);
            }
        };
        
        // Transmit data to client
        xmlHttp.send(createParamString(params));
    }
    
    ModuleExports.establishConnection = function(clientAddr, onSuccess, onError) {
        sendRequest(clientAddr + "/connect", 
                    { editor: "Brackets" }, 
                    onSuccess, onError);
    }
    
    ModuleExports.pushShader = function(clientAddr, filename, code, onSuccess, onError) {
        sendRequest(clientAddr + "/shader", 
                    { filename: filename, code: code }, 
                    onSuccess, onError);      
    }
    
    module.exports = ModuleExports;
});