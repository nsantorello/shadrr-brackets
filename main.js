define(function (require, exports, module) {
    "use strict";
    
    var DocumentManager = brackets.getModule("document/DocumentManager"),
        _ = require("vendor/lodash"),
        Devices = require("devices");

    function documentSaved(mgr, doc) {
        // Fragment shader extensions that will trigger a broadcast to Shadrr clients
        var shaderExts = [".frag", ".glsl", ".glslf"];
        
        // If we're saving a fragment shader, broadcast the change to connected devices.
        if (_.any(shaderExts, function(x) { 
                return _.endsWith(doc.file.name, x); 
            })) { 
            Devices.broadcast(doc.file.name, doc.getText());
        }  
    }
    
    // See all DocumentManager events at 
    // https://github.com/adobe/brackets/blob/master/src/document/DocumentManager.js#L55
    DocumentManager.on("documentSaved", documentSaved);
});