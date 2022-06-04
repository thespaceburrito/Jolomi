
function loadFile() {
	const request = new XMLHttpRequest();
	request.responseType = "text";
	request.addEventListener("load", parseOurPlaylist);
	request.open("GET", "./usrdata/lists/testlist.dat");
	request.send();
}

function parseOurPlaylist() {
	let playlist = this.responseText;
	let len = playlist.length;
	let songnum = (~~(len/12));
	let songs = new Array();

	for (let i=0; i<songnum; i++) {
		let offset = i * 12;
		songs.push(playlist.slice((offset+0),(offset+12)));
	}

	fillListWithSongs(songs);
}

function fillListWithSongs(songs) {
	let tbody = document.querySelector("#container__item2_tbody");
	let songtemplate = document.querySelector("#songrow");

	songs.forEach(function(song){
		let newItem = songtemplate.content.cloneNode(true);
		newItem.querySelector("#songrow__name").textContent = song;

		tbody.appendChild(newItem);
	});
}
