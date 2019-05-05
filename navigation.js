$(".nav-item").on("click", function () {

    let newContent = $(this).text().toLowerCase() + "_content";
    newContent = newContent.replace(/\s/g, '');
    if (newContent == "play_content" && "not Logged" == loggedUser) { // move to login
        alert("Please log in first :) ")
        let oldContent = $(".content.show").attr("id");
        $(".content.show").attr("class", "content hide");
        let con = document.getElementById("login_content");
        //$(".active").removeClass("active");
        $("#play_nav").removeClass("active");
        $("#login_nav").addClass("active");
        con.classList.remove("hide");
        con.classList.add("show");

        if (oldContent == "play_content"){
            window.clearInterval(interval);
            window.clearInterval(interval_ghost);
            $("#play_content h1").css("display", "");
            $("#settings").css("display", "");
            $("#game").addClass("hide");
            // $("#settings").fadeOut(1000, function () {
            //     $("#game").css("display", "none").removeClass("hide").fadeIn(1000);
        }
        return;
    }
    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".content.show").attr("class", "content hide");
    let con = document.getElementById(newContent);
    con.classList.remove("hide");
    con.classList.add("show");
    console.log($(this).text().toLowerCase());
    if ($(this).text().toLowerCase().replace(/\s/g, '') == "about") {
        openModal();
        addEventListener("keydown", function (e) {
                if (e.keyCode == 27)
                    hideModal();
            }
        )
    }
})


function navigateToRegister() {
    $(".active").removeClass("active");
    $("#register_nav").addClass("active");
    $(".content.show").attr("class", "content hide");
    let con = $("#register_content");
    con.removeClass("hide");
    con.addClass("show");
}

function navigateToLogin() {
    $(".active").removeClass("active");
    $("#login_nav").addClass("active");
    $(".content.show").attr("class", "content hide");
    let con = $("#login_content");
    con.removeClass("hide");
    con.addClass("show");
}

// Get the modal
var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

function openModal() {
    modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function hideModal() {
    modal.style.display = "none";
}
