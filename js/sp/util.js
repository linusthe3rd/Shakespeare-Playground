(function() {
dojo.provide("sp.util");

var PLAY_FOLDER_PATH = "plays/";

sp.getPlay = function(playFileName){
	var dfd = dojo.xhrGet({
		url: PLAY_FOLDER_PATH + playFileName,
		handleAs: "xml",
		sync: true
	});
	
	return dfd;
}

sp.getPlayTitle = function(xmlDom){
	return xmlDom.getElementsByTagName("TITLE")[0].firstChild.data;
}
})();