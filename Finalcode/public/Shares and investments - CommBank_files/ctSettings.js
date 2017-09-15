var ClicktaleProjects = {
	staging: 174,
	prod: 208
};

var projectID = (window.location.href.indexOf('.stg.') > 0) ? ClicktaleProjects.staging : ClicktaleProjects.prod;
var recordingRatio = 0.1;
var partitionID = "www16";

//////////////////////////////////////////////////////////////////////////////
//DO NOT MODIFY ANYTHING BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING//
/////////////////////////////////////////////////////////////////////////////

window.ClickTaleSettings = window.ClickTaleSettings || {};
window.ClickTaleIncludedOnWindowLoad = true;
window.ClickTaleIncludedOnDOMReady = true;
window.EnableChangeMonitor = false;
window.UseTransport = true;

window.ClickTaleSettings.CheckAgentSupport = function (f, v) {
    if (v.t == v.IE && v.v <= 8) {
        return false;
    }
    else {
        if (!(v.t == v.IE && v.v <= 10)) {
            window.EnableChangeMonitor = true;
			EnableTransport();
        }
        return f(v);
    }
}

function EnableTransport() {

	if (window.EnableChangeMonitor){
		window.ClickTaleSettings.XHRWrapper = {
			Enable: false
		};

        window.ClickTaleSettings.ChangeMonitor = {
            Enable: true,
			LiveExclude : true,
			AddressingMode: "id",
            OnReadyHandler: function (changeMonitor) {
                changeMonitor.observe();
            },
            OnBeforeReadyHandler: function (settings) {
                settings.Enable = window.ClickTaleGetUID ? !!ClickTaleGetUID() : false;
                return settings;
            },
			Filters: {
					MaxBufferSize: 3000000,
					MaxElementCount: 30000
			}
		}
	}
	else {
		window.ClickTaleSettings.XHRWrapper = {
			Enable: true
		};
	}
}

window.ClickTaleSettings.Compression = {
	Method: function () {
		return "deflate";
	}
};
window.ClickTaleSettings.Persistence = {
    EnableStorage: true,
    EnableStreams: true,
    EnableDispatch: true,
};

window.ClickTaleSettings.Transport = {
	Legacy: false,
	MaxConcurrentRequests: 5
};

window.ClickTaleSettings.RewriteRules = {
	OnBeforeRewrite: function (rewriteApi) {
		rewriteApi.add({
			pattern: new RegExp('(<input[^>]*value=")([^"]+)("[^>]*type="text">)', 'gim'),
			replace: "$1-----$3"
		});
		rewriteApi.add({
			pattern: new RegExp('(<input[^>]*type="text"[^>]*value=")([^"]+)("[^>]*>)', 'gim'),
			replace: "$1-----$3"
		});
	}
}