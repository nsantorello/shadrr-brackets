define(function (require, exports, module) {  
    "use strict";
    
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager");
    
    var PanelExports = {};
    PanelExports.domNode = $(require("text!templates/panel.html"));
    PanelExports.panel = WorkspaceManager.createBottomPanel("shadrr.panel", PanelExports.domNode);
    
    PanelExports.recomputeLayout = function() {
        WorkspaceManager.recomputeLayout(false);
    }
    
    PanelExports.panel.show();
    
    module.exports = PanelExports;
});