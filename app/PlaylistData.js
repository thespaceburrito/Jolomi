
function loadFile() {
	const request = new XMLHttpRequest();
	//request.responseType = "text";
	//request.addEventListener("load", parseOurPlaylist);
	//request.open("GET", "/usrdata/lists/testlist.dat");
	//request.send();

	// THIS sends a post request to the node server, where we will be parsing the link and sending some info back here.
	request.addEventListener("load", function() {
		//alert(this.responseText);

		const infoRequest = new XMLHttpRequest();
		infoRequest.responseType = "text";
		infoRequest.addEventListener("load", function() {
			alert(this.responseText); //6/4/22 this should just be the isrc dat file
		});
		// THIS sends a get request to the node server that reads the file listed after linktodata=
		// The server is to get this request, contact spotify's API, and send back some info. We will populate our playlist here with that info.
		infoRequest.open("GET", "ret?linktodata=" + this.responseText);
		infoRequest.send();

	});
	request.open("POST", "sendplaylistdata");
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send("link=test");
}

// THIS will have to get moved to app.js given this will become server-side logic
// function parseOurPlaylist() {
// 	let playlist = this.responseText;
// 	let len = playlist.length;
// 	let songnum = (~~(len/12));
// 	let songs = new Array();

// 	for (let i=0; i<songnum; i++) {
// 		let offset = i * 12;
// 		songs.push(playlist.slice((offset+0),(offset+12)));
// 	}

// 	fillListWithSongs(songs);
// }

function fillListWithSongs(songs) {
	let tbody = document.querySelector("#container__item2_tbody");
	let songtemplate = document.querySelector("#songrow");

	songs.forEach(function(song){
		let newItem = songtemplate.content.cloneNode(true);
		newItem.querySelector("#songrow__name").textContent = song;

		tbody.appendChild(newItem);
	});
}
