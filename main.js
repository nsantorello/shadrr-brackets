define(function (require, exports, module) {
    "use strict";
    
    var DocumentManager = brackets.getModule("document/DocumentManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"), 
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        FileUtils = brackets.getModule("file/FileUtils"),
        _ = require("vendor/lodash"),
        Panel = require("panel"),
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
        if (doc && isShader(doc.name)) {
            Panel.show();            
            FileUtils.readAsText(doc).done(function(text) {
                pushShader(doc.name, text);
            });
        } else {
            Panel.hide();
        }
    }
    
    // Hook into events that require broadcasting shader updates to clients
    DocumentManager.on("documentSaved", documentSaved);
    MainViewManager.on("currentFileChange", currentFileChange);
    
    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "shadrr.less");
});