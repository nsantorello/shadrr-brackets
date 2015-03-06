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
    
    ModuleExports.panel.show();
    
    module.exports = ModuleExports;
});