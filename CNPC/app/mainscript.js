var myURL
function validateLink(myURL) {
       var pattern = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
        return pattern.test(myURL);
}

async function getPlaylistInfo(link) {
   
    let request = await fetch(`/api/commonplaylistobject?playlistlink=${link}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', }
    });

    if(request.status == '404') {
        if(link.includes("deezer")) {
            document.getElementById("fittext1").style.opacity = 0;
            document.getElementById("u-logo-link").style.opacity = 0;
            Hide("u-search-2"); 
            init();
            request = await fetch(`/api/deezerplisrc?link=${link}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', }
            });
            if(request.status != '200') {
                alert("could not get Deezer Playlist Info");
                return;
            }
            let myPlaylist = await request.json();
            console.log(myPlaylist);

            request = await fetch(`/api/commonplaylistobject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ playlist: myPlaylist })
            });
            if(request.status != '200') {
                alert("could not get commonplaylistobject from link");
                return;
            }
        } else {
            alert("could not get commonplaylistobject from link");
            return;
        }
    }

    request = await fetch(`/api/commonplaylistobject?playlistlink=${link}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', }
    });
    if(request.status != '200') {
        alert("could not get commonplaylistobject from link");
        return;
    }
    let res = await request.json();
    
    sessionStorage.setItem('commonplaylistobject', JSON.stringify(res));
  //  document.getElementById('addtospotify').disabled = false;
}


function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function addToSpotify() {
    let requestBody = {
        commonplaylistobject: JSON.parse(sessionStorage.getItem('commonplaylistobject')),
        name: JSON.parse(sessionStorage.getItem('commonplaylistobject')).name,
        public: false,
        // description: "test of creatively named playlist converter /api/spotifyplaylist endpoint"
    };

    let request = await fetch(`/api/spotifyplaylist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(requestBody)
    });

    let res = await request.json();
    if(res.status != 201) {
        alert("An error occurred while adding playlist to your spotify library: " + res);
        return;
    }
    alert("Successfully added playlist to your spotify account.");                
}

async function getLink2(event, link) {
    if(event != null) event.preventDefault();

   
    
    sessionStorage.clear('commonplaylistobject');
    if (validateLink(link)){
                
        await getPlaylistInfo(link);
        let object = sessionStorage.getItem("commonplaylistobject");
        object = JSON.parse(object);
	        

        let tbody = document.querySelector("#container__item2_tbody");
        let songtemplate = document.querySelector("#songrow");
	tbody.innerHTML = '';

        object.songs.forEach(song => {
            if (song != null) {
                let newItem = songtemplate.content.cloneNode(true);
                //song name and link
                newItem.querySelector("#songrow__name").textContent = song.name;
                newItem.querySelector("#songrow__name").href = song.spotify_url;
                
                //artist name and link
                artistName = new Array();
                song.artists.forEach(data => {
                    let tmp = `<a href="${data.link}" target="_blank" rel="noopener noreferrer">${data.name}</a>`;
                    artistName.push(tmp);
                });
                newItem.querySelector("#songrow__artist").innerHTML = artistName.join(", ");

                //song duration in m:ss format
                newItem.querySelector("#songrow__duration").textContent = millisToMinutesAndSeconds(song.duration);
                tbody.appendChild(newItem);
            }
        });

       document.getElementById("fittext1").style.opacity = 1;
       document.getElementById("u-logo-link").style.opacity = 1;
       document.getElementById("fittext1").innerText = object.name;
       ShowFlex("u-search-1");
       Hide("u-search-2"); 
    
        if(document.getElementById("login-button")) {
            
            document.getElementById("login-button").style.display = 'inline';
        }
        if(document.getElementById("addToSpot")) document.getElementById("addToSpot").style.display = 'inline';
        // document.getElementById("sec-6525").style = "display: block;";
    //    ShowInline("login-button");
        Hide("animation_container");
       ShowFlex("u-table");

       if(document.getElementById("login-button")) {
           document.getElementById("login-button").href = `/login?state=${link}`;
       }
    } else {
        alert ("Please enter a valid playlist url");  
    }
   
}

var hideId;
async function Hide(hideId) {
    var h = document.getElementById(hideId);
    if (!(h.style.display === "none")) {
        h.style.display = "none";
    } 
 }

 var showId;
 async function ShowFlex(showId) {
     var s = document.getElementById(showId);
     if (s.style.display === "none") {
        s.style.display = "flex";
     }
 }

 async function ShowInline(showId) {
    var s = document.getElementById(showId);
    if (s.style.display === "none") {
       s.style.display = "inline-block";
    }
}
