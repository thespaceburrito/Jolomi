
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

	for (let i = 0; i < songs.length; i++) {
		alert(songs[i]);
	}
	
}
