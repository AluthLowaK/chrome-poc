'use strict';
var xhr = new XMLHttpRequest();
xhr.open("GET", "//mockup.oro.world:3000/", true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		console.log("ready");
	}
};
xhr.send();