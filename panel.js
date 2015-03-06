define(function (require, exports, module) {  
    "use strict";
    
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager");
    
    var domNode = $(require("text!templates/panel.html"));
    var ModuleExports = {
        domNode: domNode,
        panel: WorkspaceManager.createBottomPanel("shadrr.panel", domNode)
    }
    
    ModuleExports.recomputeLayout = function() {
        WorkspaceManager.recomputeLayout(false);
    }
    
    ModuleExports.hide = function() {
        ModuleExports.panel.hide();
    }
    
    ModuleExports.show = function() {
        ModuleExports.panel.show();
    }
    
    ModuleExports.recomputeLayout = function() {
        WorkspaceManager.recomputeLayout(false);
    }
    
    module.exports = ModuleExports;
});