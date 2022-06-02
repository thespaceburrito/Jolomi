var myURL
function validateLink(myURL) {
       var pattern = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
        return pattern.test(myURL);
}



function getLink() {
    if (validateLink(document.getElementById("form__field").value)){
        Hide("container__item");
        Show("loader");
        setTimeout(function() { Hide("loader"); Show("container__item2");}, 1500);
        
        
    }else{
        document.getElementById('error').innerHTML = "Please enter a valid playlist url";
    }
   
}

var hideId;
function Hide(hideId) {
    var h = document.getElementById(hideId);
    if (!(h.style.display === "none")) {
        h.style.display = 'none';
    } 
 }

 var showId;
 function Show(showId) {
     var s = document.getElementById(showId);
     if (s.style.display === "none") {
        s.style.display = 'inherit';
     }
 }