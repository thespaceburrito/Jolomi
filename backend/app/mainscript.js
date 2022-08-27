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

    if(request.status != '200') {
        alert("could not get commonplaylistobject from link");
        return;
    }
    let res = await request.json();
    
    sessionStorage.setItem('commonplaylistobject', JSON.stringify(res));
  //  document.getElementById('addtospotify').disabled = false;
}


async function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }



async function getLink() {
    let link = document.getElementById("u-search-input-1").value;
    if (validateLink(document.getElementById("u-search-input-1").value)){
        await getPlaylistInfo(link);
        let object = sessionStorage.getItem("commonplaylistobject");
        object = JSON.parse(object);
        

        let tbody = document.querySelector("#container__item2_tbody");
        let songtemplate = document.querySelector("#songrow");
        
       

        object.forEach(function(songs){
            if (songs != null) {
                let newItem = songtemplate.content.cloneNode(true);
                //song name and link
                newItem.querySelector("#songrow__name").textContent = songs.name;
                newItem.querySelector("#songrow__name").href = songs.spotify_url;
                
                //artist name and link
                artistName = new Array();
                songs.artists.forEach(function(data){
                    artistName.push(data.name);
                });
                newItem.querySelector("#songrow__artist").textContent = artistName.join(", ");
                newItem.querySelector("#songrow__artist").href = songs.artists[0].link;

                //song duration in m:ss format
                newItem.querySelector("#songrow__duration").textContent = millisToMinutesAndSeconds(songs.duration);
                
                tbody.appendChild(newItem);
            }
        });

        document.getElementById("fittext1").innerText = "Playlist Name";
    
        
        
    }else{
        alert ("Please enter a valid playlist url");  
    }
   
}

async function getLink2() {
    let link = document.getElementById("u-search-input-2").value;
    if (validateLink(document.getElementById("u-search-input-2").value)){
                
        await getPlaylistInfo(link);
        let object = sessionStorage.getItem("commonplaylistobject");
        object = JSON.parse(object);
        

        let tbody = document.querySelector("#container__item2_tbody");
        let songtemplate = document.querySelector("#songrow");
        
       
        alert(object.songs[0].name);
        Array.from(object).forEach(song => {
            
            if (song != null) {
                let newItem = songtemplate.content.cloneNode(true);
                //song name and link
                newItem.querySelector("#songrow__name").textContent = object.songs.name;
                newItem.querySelector("#songrow__name").href = object.songs.spotify_url;
                
                //artist name and link
                artistName = new Array();
                object.songs.artists.forEach(function(data){
                    artistName.push(data.name);
                });
                newItem.querySelector("#songrow__artist").textContent = artistName.join(", ");
                newItem.querySelector("#songrow__artist").href = object.songs.artists[0].link;

                //song duration in m:ss format
                newItem.querySelector("#songrow__duration").textContent = millisToMinutesAndSeconds(object.songs.duration);
                
                tbody.appendChild(newItem);
            }
        });




       document.getElementById("fittext1").innerText = "Playlist Name";
       ShowFlex("u-search-1");
       Hide("u-search-2");
       ShowInline("u-button");
       ShowFlex("u-table");

        
    }else{
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