var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var filename = system.args[2];
var srvUrl = system.args[3];

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onAlert  = function(msg) {
    console.log(msg);
};

page.onResourceError = function(trace){
    console.log(JSON.stringify(trace));
};

var includeJsUrls = ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",srvUrl+"jquery.lorem.js",srvUrl+"wireframe.js"];

page.viewportSize = {height:300,width:900};

page.settings.localToRemoteUrlAccessEnabled = true;
page.open(url, function(status) {
    if ( status === "success" ) {
        includeJs(includeJsUrls, page, function() {
            //window.setTimeout(function(){
                page.evaluate(function() {
                    $(document).wireframe({
                        srvUrl: "http://localhost/bt_wireframes"
                    });
                });
                page.render(filename);
                phantom.exit();
            //},30000);
        });
    }else{
        phantom.exit();
    }
});

/**
 * Include more js and then call callback
 * @param urls
 * @param callback
 */
function includeJs(urls,page, callback){
    if(urls.length == 0 && typeof callback === "function"){
        callback();
    }else if(typeof callback === "function"){
        var url = urls.shift();
        page.includeJs(url, function(){
            includeJs(urls, page, callback);
        })
    }
}