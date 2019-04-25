var context = canvas.getContext("2d");
var shape= new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var timer;

var right_move_key;
var down_move_key;
var left_move_key;
var up_move_key;

var soup_nuts_amount;

var junk_color;
var solid_color;
var premium_color;

var monster_amount;


$(".nav-item").on("click", function(){
    $(".active").removeClass("active");
    $(this).addClass("active");
    let newContent = $(this).text().toLowerCase() + "_content";
    newContent = newContent.replace(/\s/g, '');
    $(".content.show").attr("class", "content hide");
    let con = document.getElementById(newContent);
    con.classList.remove("hide");
    con.classList.add("show");
});

$("#input_amount_soup_nuts").on("keydown", function(){
    alert("Please use the arrows to select a number between 50 to 90");
    });

$("#input_time_limit").on("keydown", function(){
    alert("Please use the arrows to select a number between 60 to 300 seconds");
});
function setMovementKey(ele, event) {
    let key = event.key;
    let movementDir = ele.id.substring(ele.id.indexOf("_")+1);
    if (confirm("Are you sure" + key)){
        ele.value = "Key choose: " + key;
        $("#" + "img_" + movementDir).removeClass("movement_img").addClass("confirmed_movement_img");
        switch(movementDir) {
            case "right":
                right_move_key = key;
                break;
            case "down":
                down_move_key = key;
                break;
            case "left":
                left_move_key = key;
                break;
            case "up":
                up_move_key = key;
                break;
        }
    }
}

function set_random_settings(){
    /* Setting movement default controls */

    left_move_key = 37;
    up_move_key = 38;
    right_move_key = 39;
    down_move_key = 40;
    $("#txt_right").attr("value", "Key choose: Arrow Right");
    $("#txt_down").attr("value", "Key choose: Arrow Down");
    $("#txt_left").attr("value", "Key choose: Arrow Left");
    $("#txt_up").attr("value", "Key choose: Arrow Up");
    $(".movement_img").addClass("confirmed_movement_img");

    $("#input_amount_soup_nuts").attr("value", Math.floor(Math.random()*(90-50+1)+50));

    /* Setting random soup nuts colors */
    $("#input_junk_color").attr("value", getRandomColor());
    $("#input_solid_color").attr("value", getRandomColor());
    $("#input_premium_color").attr("value", getRandomColor());

    $("#input_time_limit").attr("value", Math.floor(Math.random()*(300-60+1)+60));


}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



$("#game_test").on("click", Start);



// // wait for the DOM to be loaded
// $(document).ready(function() {
//     // bind 'myForm' and provide a simple callback function
//     $('#myForm').ajaxForm(function() {
//         alert("Thank you for your comment!");
//     });
// });
//
// $("#ex6").slider();
// $("#ex6").on("slide", function(slideEvt) {
//     $("#ex6SliderVal").text(slideEvt.value);
// });

//Start();

function Start() {
    function settingsAreValid() {
        if (up_move_key === undefined || right_move_key === undefined
            || down_move_key === undefined || left_move_key === undefined)
                return 1; // Error "Please set game Controls or click on "Set Random" button
        if (up_move_key === right_move_key || up_move_key === down_move_key || up_move_key === left_move_key ||
                right_move_key === down_move_key || right_move_key === left_move_key ||
                down_move_key === left_move_key)
                return 2; // Error "You cant choose same keys for different moves"
        let tmp_amount = $("#input_amount_soup_nuts").val();
        if (tmp_amount === undefined || tmp_amount < 50 || tmp_amount > 90){
            $("#input_amount_soup_nuts").val("");
            return 3; // "Error please select valid amount of soup nuts between 50 to 90
        }
        soup_nuts_amount = tmp_amount;
        let tmp_junk_color = $("#input_junk_color").attr("value");
        let tmp_solid_color = $("#input_solid_color").attr("value")
        let tmp_premium_color = $("#input_premium_color").attr("value")
        if (tmp_junk_color === tmp_solid_color || tmp_junk_color === tmp_premium_color ||
            tmp_solid_color === tmp_premium_color)
                return 4; // "Error: Please choose different colors to the soup nuts"
        junk_color = tmp_junk_color;
        solid_color = tmp_solid_color;
        premium_color = tmp_premium_color;
        let tmp_seconds = $("#input_time_limit").val();
        if (tmp_seconds === undefined || tmp_seconds < 60 || tmp_seconds > 300)
            return 5; // "Error Please use the arrows to select a number between 60 to 300 seconds"
        timer = tmp_seconds;
        monster_amount = Number($(".form-check-input[checked=checked]").attr("value").substring(6));
        return 6;
    }
    let res = settingsAreValid();
    console.log(res);
    if  (res !== 6){
        alert("Input invalid. Error: " + res);
        return;
    }
    else
        alert("All good lets start");

    board = new Array();
    score = 0;
    pac_color="yellow";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
    start_time= new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else{
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = 1;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    shape.i=i;
                    shape.j=j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
    while(food_remain>0){
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 250);
}


function findRandomEmptyCell(board){
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];
}

function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}

function Draw() {
    canvas.width=canvas.width; //clean board
    // let background = new Image();
    // background.src = "files/2.png";
    // background.onload = function(){
    //     context.drawImage(background,0,0);
    // }
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                context.beginPath();
                context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x-30, center.y-30, 60, 60);
                context.fillStyle = "grey"; //color
                context.fill();
            }
        }
    }


}

function UpdatePosition() {
    board[shape.i][shape.j]=0;
    var x = GetKeyPressed()
    if(x==1)
    {
        if(shape.j>0 && board[shape.i][shape.j-1]!=4)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<9 && board[shape.i][shape.j+1]!=4)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<9 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    board[shape.i][shape.j]=2;
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(score>=20&&time_elapsed<=10)
    {
        pac_color="green";
    }
    if(score==50)
    {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else
    {
        Draw();
    }
}