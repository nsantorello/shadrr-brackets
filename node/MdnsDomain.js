/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";
    
    var SHADRR_MDNS_TYPE = "_shadrr._tcp.",
        SHADRR_MDNS_RECORD = "SRV";
    
    var _ = require("../vendor/lodash"),
        mdns = require("multicast-dns")();
    
    var _domainManager;
    
    mdns.on("response", function(response) {
        // Find the Shadrr SRV record, if it exists
        var srv = _.find(response.answers, 
            function(a) { return _.contains(a.name, SHADRR_MDNS_TYPE) && a.type == SHADRR_MDNS_RECORD; } );
        if (!srv) return;
        
        // Extract relevant data from SRV record
        var srvData = { host: srv.data.target, port: srv.data.port, ttl: srv.ttl };
        var srvEvent = srvData.ttl > 0 ? "shadrrUp" : "shadrrDown";
        console.log("[Shadrr/node/MdnsDomain.js] Emitting SRV record event '" + srvEvent + "' with data:", srvData);
        
        // Call the appropriate callbacks
        _domainManager.emitEvent("mdns", srvEvent, srvData);
    });

    function cmdStart(cwd, command) {
        console.log("[Shadrr/node/MdnsDomain.js] Starting network discovery service...");
        mdns.query({questions: [{name: SHADRR_MDNS_TYPE, type: SHADRR_MDNS_RECORD}]});
    }
    
    function init(domainManager) {   
        _domainManager = domainManager;
        
        if (!_domainManager.hasDomain("mdns")) {
            _domainManager.registerDomain("mdns", {major: 0, minor: 1});
        }
        
        _domainManager.registerCommand("mdns", "start", cmdStart, true);
        _domainManager.registerEvent("mdns", "shadrrUp");
        _domainManager.registerEvent("mdns", "shadrrDown");
    }

    // In domains export the initialization function.
    exports.init = init;
}());