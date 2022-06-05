
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

function loadFile() {
	const request = new XMLHttpRequest();
	// THIS sends a post request to the node server, where we will be parsing the link and sending some info back here.
	request.addEventListener("load", function() {
		const infoRequest = new XMLHttpRequest();
		infoRequest.responseType = "json";
		infoRequest.addEventListener("load", function() {
			let playlistObj = this.response;
			console.log(playlistObj);

			//i don't need this to be genuinely good or separate or organized, I'm just going to move it into callback hell and let it suffer there.
			let tbody = document.querySelector("#container__item2_tbody");
			let songtemplate = document.querySelector("#songrow");

			playlistObj.forEach(function(song){
				if (song != null) {
					let newItem = songtemplate.content.cloneNode(true);
					//song name and link
					newItem.querySelector("#songrow__name").textContent = song.name;
					newItem.querySelector("#songrow__name").href = song.external_urls.spotify;
					
					//artist name and link
					artistName = new Array();
					song.artists.forEach(function(data){
						artistName.push(data.name);
					});
					newItem.querySelector("#songrow__artist").textContent = artistName.join(", ");
					newItem.querySelector("#songrow__artist").href = song.artists[0].external_urls.spotify;

					//song duration in m:ss format
					newItem.querySelector("#songrow__duration").textContent = millisToMinutesAndSeconds(song.duration_ms);
					
					tbody.appendChild(newItem);
				}
			});

		});
		// THIS sends a get request to the node server that reads the file listed after linktodata=
		// The server is to get this request, contact spotify's API, and send back some info. We will populate our playlist here with that info.
		infoRequest.open("GET", "ret?linktodata=" + this.responseText);
		infoRequest.send();

	});
	request.open("POST", "sendplaylistdata");
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send();
}

