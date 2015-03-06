define(function (require, exports, module) {
    "use strict";
    
    var DocumentManager = brackets.getModule("document/DocumentManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"), 
        FileUtils = brackets.getModule("file/FileUtils"),
        _ = require("vendor/lodash"),
        Clients = require("clients");

    function pushShader(filename, code) {
        Clients.broadcast(filename, code); 
    }
    
    function isShader(filename) {
        // Fragment shader extensions
        // TODO: move this to preferences
        var shaderExts = [".frag", ".glsl", ".glslf", ".fsh"];
        
        // Check if any extensions match the filename
        return _.any(shaderExts, function(ext) { 
            return _.endsWith(filename, ext); 
        });
    }
    
    function documentSaved(mgr, doc) {
        if (isShader(doc.file.name)) {
            pushShader(doc.file.name, doc.getText());   
        }
    }
    
    function currentFileChange(mgr, doc) {
        if (isShader(doc.name)) {
            FileUtils.readAsText(doc).done(function(text) {
                pushShader(doc.name, text);
            });
        }
    }
    
    // Hook into events that require broadcasting shader updates to clients
    DocumentManager.on("documentSaved", documentSaved);
    MainViewManager.on("currentFileChange", currentFileChange);
});