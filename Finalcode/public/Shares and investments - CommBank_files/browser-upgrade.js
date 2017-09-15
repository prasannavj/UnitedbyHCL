/*
 * File: browser-upgrade.js. Hash: d4a8b828750d18fc4e630253942daefe
 */var NIMBUS=NIMBUS||{};NIMBUS.BrowserDetect={identify:function(a,b){"use strict";this.browser=this.searchString(a,this.dataBrowser)||"Other",this.version=this.searchVersion(a)||this.searchVersion(b)||"Unknown"},searchString:function(a,b){"use strict";for(var c=0;c<b.length;c++)if(this.versionSearchString=b[c].subString,-1!==a.indexOf(b[c].subString))return b[c].identity},searchVersion:function(a){"use strict";var b=a.indexOf(this.versionSearchString);if(-1!==b){var c=a.indexOf("rv:");if("Trident"===this.versionSearchString&&-1!==c)return parseFloat(a.substring(c+3));if("Safari"===this.versionSearchString){var d=a.match(/Version\/(\d\.?\d?\.?\d?)/);if(null===d)return;return parseFloat(d[1])}return parseFloat(a.substring(b+this.versionSearchString.length+1))}},dataBrowser:[{subString:"Chrome",identity:"Chrome"},{subString:"MSIE",identity:"Explorer"},{subString:"Trident",identity:"Explorer"},{subString:"Firefox",identity:"Firefox"},{subString:"Safari",identity:"Safari"},{subString:"Opera",identity:"Opera"}],browserList:[],loadBrowserList:function(a,b){"use strict";var c=this;if(Modernizr.localstorage){var d=localStorage.getItem("browserList");if(null!==d){d=JSON.parse(d);var e=!1;for(var f in d)if(d[f].name)this.browserList.push(d[f]);else if(d[f].updated){var g=new Date,h=g.getTime()-d[f].updated;if(h/=864e5,h>30){e=!0;break}}if(!e)return void b();this.browserList=[]}}$.get(a,function(a){if(c.browserList=a,Modernizr.localstorage){var d=new Date;a.push({updated:d.getTime()}),localStorage.setItem("browserList",JSON.stringify(a))}"undefined"!=typeof b&&b()},"json")},browserGrade:function(a,b){"use strict";if(a=a||this.browser,b=b||this.version,0!==this.browserList.length){var c;for(var d in this.browserList)this.browserList[d].name===a&&(c=this.browserList[d]);if("undefined"!=typeof c)return b>=c.version?"A":"B"}}},NIMBUS_READY.callbacks.push(function(){"use strict";function a(){$(".component_browser-upgrade").show(),"undefined"!=typeof interactionEvent&&interactionEvent("cba-browserupgrade_displayed"),$(".component_browser-upgrade .browserupgrade_open").click(function(){$(this).parents(".component_browser-upgrade").hide(),"undefined"!=typeof interactionEvent&&interactionEvent("cba-browserupgrade_open"),$.cookie("cba-browserupgrade_prevent",1,{path:"/"})}),$(".component_browser-upgrade .browserupgrade_close").click(function(a){a.preventDefault(),$(this).parents(".component_browser-upgrade").hide(),"undefined"!=typeof interactionEvent&&interactionEvent("cba-browserupgrade_close"),$.cookie("cba-browserupgrade_prevent",1,{path:"/"})})}var b=$(".component_browser-upgrade").data("author")||!1;if(!0===b)return void a();if("undefined"!=typeof browserVersionsUrl){var c=parseInt($.cookie("cba-browserupgrade_prevent"))||0;1!==c&&(NIMBUS.BrowserDetect.identify(navigator.userAgent,navigator.appVersion),NIMBUS.BrowserDetect.loadBrowserList(browserVersionsUrl,function(){var b=NIMBUS.BrowserDetect.browserGrade();"B"===b&&a()}))}});
//# sourceMappingURL=../js-maps/browser-upgrade.map