(function() {
dojo.provide("sp.base");

dojo.require("sp.util");
dojo.require("sp.renderUI");

var PLAY_NAMES = {
	"a_and_c": "a_and_c.xml",
	"all_well":"all_well.xml",
	"as_you":"as_you.xml",
	"com_err": "com_err.xml",
	"coriolan":"coriolan.xml",
	"cymbelin":"cymbelin.xml",
	"dream":"dream.xml",
	"hamlet":"hamlet.xml",
	"hen_iv_1":"hen_iv_1.xml",
	"hen_iv_2":"hen_iv_2.xml",
	"hen_v":"hen_v.xml",
	"hen_vi_1":"hen_vi_1.xml",
	"hen_vi_2":"hen_vi_2.xml",
	"hen_vi_3":"hen_vi_3.xml",
	"hen_viii":"hen_viii.xml",
	"j_caesar":"j_caesar.xml",
	"john":"john.xml",
	"lear":"lear.xml",
	"lll":"lll.xml",
	"m_for_m":"m_for_m.xml",
	"m_wives":"m_wives.xml",
	"macbeth":"macbeth.xml",
	"merchant":"merchant.xml",
	"much_ado":"much_ado.xml",
	"othello":"othello.xml",
	"pericles":"pericles.xml",
	"r_and_j":"r_and_j.xml",
	"rich_ii":"rich_ii.xml",
	"rich_iii":"rich_iii.xml",
	"t_night":"t_night.xml",
	"taming":"taming.xml",
	"tempest":"tempest.xml",
	"timon":"timon.xml",
	"titus":"titus.xml",
	"troilus":"troilus.xml",
	"two_gent":"two_gent.xml",
	"win_tale":"win_tale.xml"
};

sp.base.load = function(){
	dojo.connect(dojo.byId("backButton"), "onclick", null, _showMenu);
	
	// hold off for the page to display the loading screen before
	// we start loading the plays
	setTimeout(function(){
		for (property in PLAY_NAMES){
			var dfd = sp.getPlay(PLAY_NAMES[property]);
			dfd.addCallback(
				dojo.partial(sp.renderUI.createMenu, property)
			);
		}	
	}, 100);
	
}

_showMenu = function(e){
	dojo.removeClass("slidesNode", "removeOverflow");
	dojo.addClass("play", "next");
	dojo.removeClass("playLoading", "previous");
	dojo.addClass("playLoading", "next");
	dojo.removeClass("menu", "previous");
	dojo.byId("playNode").innerHTML = "";
}

})();