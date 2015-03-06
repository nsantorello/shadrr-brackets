define(function (require, exports, module) {
    "use strict"; 
    
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        MdnsDomain = new NodeDomain("mdns", ExtensionUtils.getModulePath(module, "node/MdnsDomain"));

    var ModuleExports = {},
        upCbs = [],
        downCbs = [];
    
    // Add a callback for when a Shadrr client comes up
    ModuleExports.shadrrUp = function(cb) {
        upCbs.push(cb);
    };
    
    // Add a callback for when a Shadrr client goes down
    ModuleExports.shadrrDown = function(cb) {
        downCbs.push(cb);
    };
    
    MdnsDomain.on("shadrrUp", function(evt, srvData) {
        _.forEach(upCbs, function(cb) { cb(srvData); });         
    });
    
    MdnsDomain.on("shadrrDown", function(evt, srvData) {
        _.forEach(downCbs, function(cb) { cb(srvData); }); 
    });
    
    MdnsDomain.exec("start", false);

    module.exports = ModuleExports;
});