var myURL
function validateLink(myURL) {
       var pattern = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
        return pattern.test(myURL);
}

function getLink() {
    if (validateLink(document.getElementById("u-search-input-1").value)){
        loadFile();
        document.getElementById("fittext1").innerText = "Playlist Name";
    
        
        
    }else{
        alert ("Please enter a valid playlist url");  
    }
   
}

function getLink2() {
    if (validateLink(document.getElementById("u-search-input-2").value)){
       loadFile();
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
function Hide(hideId) {
    var h = document.getElementById(hideId);
    if (!(h.style.display === "none")) {
        h.style.display = "none";
    } 
 }

 var showId;
 function ShowFlex(showId) {
     var s = document.getElementById(showId);
     if (s.style.display === "none") {
        s.style.display = "flex";
     }
 }

 function ShowInline(showId) {
    var s = document.getElementById(showId);
    if (s.style.display === "none") {
       s.style.display = "inline-block";
    }
}
