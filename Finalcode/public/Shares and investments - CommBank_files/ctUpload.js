if (typeof ClickTaleSetAllSensitive === "function") {
    ClickTaleSetAllSensitive();
}

if (document.location.pathname.toLocaleLowerCase().indexOf('/personal/travel.html') > -1 && document.location.search.toLocaleLowerCase().indexOf('ei=mv_products_travel') > -1) {
    if (typeof ClickTaleGetUID == 'function' && (ClickTaleGetUID() == null || ClickTaleGetUID() == 0 || document.cookie.indexOf('WRUIDA') > -1)) {
        window.ClickTaleUIDCookieName = 'WRUIDA';
        Ratio = 1;
    }
}

function doUpload() {
    if (typeof targetToClicktale != 'undefined' && typeof ClickTaleEvent === 'function') {
        var tParams = targetToClicktale.split(',');
        for (var i = 0; i < tParams.length; i++) {
            ClickTaleEvent(tParams[i]);
        }
    }
    ClickTaleUploadPage();
    window.ClickTaleSSL = 1;
    if (typeof ClickTale === 'function') {
        ClickTale(projectID, recordingRatio, partitionID);
    }
    if ((typeof ClickTalePrevOnReady == 'function') && (ClickTaleOnReady.toString() != ClickTalePrevOnReady.toString())) {
        ClickTalePrevOnReady();
    }
}
function isVisible(element){
    if(element){
        return (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0);
    } else return false;
}
function isReadyToRecord() {
    if (document.querySelectorAll(".cards-inner-wrapper").length > 0) {
        return true;
    } else if (document.querySelector('body') && document.querySelector('body').style && document.querySelector('body').style.display && document.querySelector('body').style.display == 'none') {
        return false;
    }
    else {
        return document.querySelectorAll('.container.content-main').length > 0 ? true : false;
    } 
}

function doOnlyWhen(toDoHandler, toCheckHandler, interval, times, failHandler) {
    if ((!toDoHandler) || (!toCheckHandler)) return;
    if (typeof interval == "undefined") interval = 1000;
    if (typeof times == "undefined") times = 20;

    if (--times < 0) {
        if (typeof failHandler === 'function') {
            failHandler();
        }
        return;
    }
    if (toCheckHandler()) {
        toDoHandler();
        return;
    }

    setTimeout(function () { doOnlyWhen(toDoHandler, toCheckHandler, interval, times, failHandler); }, interval);
};

if (typeof ClickTaleUploadPage === 'function' && window.UseTransport) {
    if (window.EnableChangeMonitor) {
        if (typeof ClickTaleEvent === "function") {
            ClickTaleEvent("CM");
        }
    }
    doOnlyWhen(doUpload, isReadyToRecord, 450, 20, doUpload);
}