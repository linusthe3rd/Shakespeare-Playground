(function() {
dojo.provide("sp.renderUI");

dojo.require("dojo.hash");

dojo.require("sp.util");

var CHARACTER_ID = "characters";
var ACTS_ID = "acts";
var SCENES_ID = "scenes";

var curList = null;

// ===================
// Menu Creation Functions
// ===================
sp.renderUI.createMenu = function(playFileName, xmlDom){
	var title = sp.getPlayTitle(xmlDom);
	var summaryObj = _createSummaryData(xmlDom);
	
	_createRow({
		link: playFileName,
		title: title,
		summaryData: summaryObj
	});
	
	if (playFileName === "j_caesar"){
		setTimeout(function(){
			dojo.addClass("pageLoading", "previous");
			dojo.removeClass("menu", "next");	
		}, 1000);
	}
}

_createSummaryData = function(xmlDom){
	var summaryObj = {};
	
	summaryObj[CHARACTER_ID] = xmlDom.getElementsByTagName("PERSONA").length;
	summaryObj[ACTS_ID] = xmlDom.getElementsByTagName("ACT").length;
	summaryObj[SCENES_ID] = xmlDom.getElementsByTagName("SCENE").length;
	
	return summaryObj;
}

_createRow = function(args){
	var link = args.link;
	var title = args.title;
	var summaryData = args.summaryData;	
	
	var menuRoot = dojo.byId("menuDiv");
	dojo.connect(menuRoot, "onclick", null, _loadPlay);
	
	if (!curList || curList.childNodes.length >= 4){
		var row = dojo.create("div", {
			className: "row"
		},menuRoot);

		var list = dojo.create("ul", {
			className: "playList"
		},row);
		
		curList = list;
	}
	
	_createMenuButton(link, title, summaryData);
}

_createMenuButton = function(link, title, summaryData){
	var li = dojo.create("li", {
		className: "playItem"
	},curList);
	
	var button = dojo.create("a", {
		href: "#" + link,
		innerHTML: title
	}, li);
	
	var description = dojo.create("div", {
		className: "playDescription"
	}, li);
	
	_createDescription(description, summaryData);
}

_createDescription = function(descrNode, summaryData){
	dojo.create("div", {
		className: "descrTitle",
		innerHTML: "Summary"
	},descrNode);
	
	dojo.create("div", {
		className: "descrData",
		innerHTML: "Number of Characters: " + summaryData[CHARACTER_ID]
	},descrNode);
	
	dojo.create("div", {
		className: "descrData",
		innerHTML: "Number of Acts: " + summaryData[ACTS_ID]
	},descrNode);
	
	dojo.create("div", {
		className: "descrData",
		innerHTML: "Number of Scenes: " + summaryData[SCENES_ID]
	},descrNode);
}

// ===================
// Play Rendering Functions
// ===================
_loadPlay = function(e){
	dojo.addClass("menu", "previous");
	dojo.removeClass("playLoading", "next");
	
	setTimeout(function(){
		// This setTimeout allows the page to show the second 
		// loading screen before we start loading and rendering
		//the play
		var playFile = e.target.href.substr(e.target.href.lastIndexOf("#")+1)+".xml";
		var dfd = sp.getPlay(playFile);
		dfd.addCallback(function(resp){
			var fragment = document.createDocumentFragment();
			_renderPlay(resp, fragment);
			
			dojo.byId("playNode").appendChild(fragment.cloneNode(true));
			setTimeout(function(){
				//use setTimeout to get the CSS animation to play
				//only after the fragment has been added to the page
				dojo.addClass("slidesNode", "removeOverflow");
				dojo.addClass("playLoading", "previous");
				dojo.removeClass("play", "next");
			}, 350);
		});
	}, 300);
}

_renderPlay = function(xmlDom, fragment){
	var actArr = xmlDom.getElementsByTagName("ACT");

	dojo.forEach(actArr, function(act){
		//build the scenes for each act
		var actNode = dojo.create("div", {
			className: "actNode"
		}, fragment);
		
		var actTitle = dojo.create("div", {
			className: "actTitle",
			innerHTML: act.firstElementChild.textContent
		}, actNode);
		
		dojo.forEach(act.childNodes, function(scene, index){
			//build the character speeches for each scene
			var sceneNode = dojo.create("div", {
				className: "sceneNode"
			},actNode);
			if ( scene.nodeName === "SCENE"){
				var sceneTitle = dojo.create("div", {
					className: "sceneTitle",
					innerHTML: scene.firstElementChild.textContent
				}, sceneNode);
				
				var isLeft = true;
				
				dojo.forEach(scene.childNodes, function(speech, i){
					if (speech.nodeName === "SPEECH"){
						var speechClass = (isLeft) ? "speechLeft" : "speechRight";
						isLeft = !isLeft;
						
						var speechNode = dojo.create("div", {
							className: speechClass 
						}, sceneNode);
						
						_renderSpeech(speech, speechNode);
					}
				});
			} 
		});
	});
}

_renderSpeech = function(speech, speechNode){
	dojo.forEach(speech.childNodes, function(line, i){
		if (line.nodeName === "SPEAKER"){
			dojo.create("div", {
				className: "speaker",
				innerHTML: line.textContent
			}, speechNode);
		} else if (line.nodeName === "LINE"){
			var lineNode = dojo.create("div", {
				className: "line",
				innerHTML: line.textContent 
			},speechNode);
		}
	});
}
})();