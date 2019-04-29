
$(".nav-item").on("click", function () {

    let newContent = $(this).text().toLowerCase() + "_content";
    newContent = newContent.replace(/\s/g, '');
    if (newContent == "play_content" && "not Logged" == loggedUser) { // move to login
        alert("Please log in first :) ")
        $(".content.show").attr("class", "content hide");
        let con = document.getElementById("login_content");
        //$(".active").removeClass("active");
        $("#play_nav").removeClass("active");
        $("#login_nav").addClass("active");
        con.classList.remove("hide");
        con.classList.add("show");
        return;
    }
    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".content.show").attr("class", "content hide");
    let con = document.getElementById(newContent);
    con.classList.remove("hide");
    con.classList.add("show");
});