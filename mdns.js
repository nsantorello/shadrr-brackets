define(function (require, exports, module) {
    "use strict"; 
    
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        MdnsDomain = new NodeDomain("mdns", ExtensionUtils.getModulePath(module, "node/MdnsDomain"));

    var Mdns = {
        upCbs: [],
        downCbs: []
    }
    
    // Add a callback for when a Shadrr client comes up
    Mdns.shadrrUp = function(cb) {
        Mdns.upCbs.push(cb);
    };
    
    // Add a callback for when a Shadrr client goes down
    Mdns.shadrrDown = function(cb) {
        Mdns.downCbs.push(cb);
    };
    
    MdnsDomain.on("shadrrUp", function(evt, srvData) {
        _.forEach(Mdns.upCbs, function(cb) { cb(srvData); });         
    });
    
    MdnsDomain.on("shadrrDown", function(evt, srvData) {
        _.forEach(Mdns.downCbs, function(cb) { cb(srvData); }); 
    });
    
    MdnsDomain.exec("start", false);

    module.exports = Mdns;
});