var myURL
function validateLink(myURL) {
       var pattern = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
        return pattern.test(myURL);
}



function getLink() {
    if (validateLink(document.getElementById("form__field").value)){
       
    }else{
        document.getElementById('error').innerHTML = "Please enter a valid playlist url";
    }
   
}