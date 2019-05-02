var attempt = 3; // Variable to count number of attempts.
var loggedUser= "not Logged";


// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if ( isRegistered(username , password)){
        alert ("Login successfully");
        loggedUser = username;
        $("#login_txt").html(loggedUser + " Is logged");
        $("#player_name").html("PLAYER:"+loggedUser);

        // window.location = "success.html"; // Redirecting to other page.
        $(".content.show").attr("class", "content hide");
        let con = document.getElementById("welcome_content");
        $(".active").removeClass("active");
        $("#welcome_nav").addClass("active");
        con.classList.remove("hide");
        con.classList.add("show");
        return false;
    }
    else{
        attempt --;// Decrementing by one.
        alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
        if( attempt == 0){
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("submit").disabled = true;
            return false;
        }
    }
}