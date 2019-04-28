var context = canvas.getContext("2d");
var shape= new Object();
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval_ghost;
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
var ghosts = [{color: "#00FFDE", directionX: 0, directionY:0}, {color:"#FF0000", directionX: 13, directionY:13}, {color:"#FFB8DE",directionX: 0, directionY:13}];
image = new Image;
image.src = 'files/mis-pacman.jpg';
var female_pacman = {image: image, directionX: 1, directionY: 2};
var show_female = true;
var pacman_lives = 3;

var arr_dim = 14;
var board = new Array(14);
for (let i = 0; i < 14; i++){
    board[i] = new Array(14);
}

var max_points;

var last_move;


$(".nav-item").on("click", function(){

    let newContent = $(this).text().toLowerCase() + "_content";
    newContent = newContent.replace(/\s/g, '');
    if ( newContent == "play_content" && "not Logged" == loggedUser){ // move to login
        alert( "Please log in first :) ")
        $(".content.show").attr("class", "content hide");
        let con = document.getElementById("login_content");
        //$(".active").removeClass("active");
        $("#play_nav").removeClass("active");
        $("#login_nav").addClass("active");
        con.classList.remove("hide");
        con.classList.add("show");
        return ;
    }
    $(".active").removeClass("active");
    $(this).addClass("active");
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


$("#game_test").on("click", Start);




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
        if (tmp_amount === undefined || tmp_amount < 50 || tmp_amount > 90) {
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
    if (res !== 6) {
        alert("Input invalid. Error: " + res);
        return;
    } else {
        alert("All good lets start");
        $("#settings").fadeOut(1000, function () {
            $("#game").css("display", "none").removeClass("hide").fadeIn(1000);
        })
    }

    setTimeout(startgame, 1500);
}
    function startgame(){

    score = 0;
    pac_color="yellow";
    var cnt = arr_dim*arr_dim;
    var prem_food_remain = Math.floor(soup_nuts_amount * 0.1);
    var solid_food_remain = Math.floor(soup_nuts_amount * 0.3);
    var junk_food_remain = soup_nuts_amount - prem_food_remain - solid_food_remain;
    max_points = prem_food_remain * 25 + solid_food_remain * 15 + junk_food_remain * 5;

    var pacman_remain = 1;
    start_time= new Date();


    for (var i = 0; i < arr_dim; i++) {
        for (var j = 0; j < arr_dim; j++) {
            if  (((i == 1 || i == 12)&& (j == 2 || j == 3 || j == 4 || j == 9 || j == 10 )) ||
                ((i == 2 || i == 11) && (j == 0 || j == 4 || j == 5 || j == 6 || j == 9 || j == 10 || j == 11)) ||
                ((i == 3 || i == 10) && (j == 6 || j == 11)) ||
                ((i == 4 || i == 9) && (j == 2 || j == 4 || j == 11)) ||
                ((i == 5 || i == 8)  && (j == 2 || j == 6 || j == 7 || j == 11)) ||
                ((i == 6 || i == 7) && (j == 7))
                )

                board[i][j] = 4;

            else{

                var randomNum = Math.random();
                if (randomNum <= 1.0 * junk_food_remain / cnt) {
                    junk_food_remain--;
                    board[i][j] = 1;
                } else if (randomNum <= 1.0 * solid_food_remain / cnt){
                    solid_food_remain--;
                    board[i][j] = 2;
                } else if (randomNum <= 1.0 * prem_food_remain / cnt){
                    prem_food_remain--;
                    board[i][j] = 3;
                } else if ((!(i==0 && (j==0||j==13))) && (!(j==0 && (i==0||i==13))) && pacman_remain == 1 && randomNum < 1.0 * (pacman_remain + junk_food_remain + solid_food_remain + prem_food_remain) / cnt) {
                    shape.i=i;
                    shape.j=j;
                    pacman_remain--;
                    board[i][j] = 5;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
    placeRemainFood("junk_food", junk_food_remain);
    placeRemainFood("solid_food", solid_food_remain);
    placeRemainFood("premium_food", prem_food_remain);

    function placeRemainFood(foodType, foodAmount){
        while(foodAmount>0){
            var emptyCell = findRandomEmptyCell(board);
            switch (foodType) {
                case "junk_food":
                    board[emptyCell[0]][emptyCell[1]] = 1;
                    break;
                case "solid_food":
                    board[emptyCell[0]][emptyCell[1]] = 2;
                    break;
                case "premium_food":
                    board[emptyCell[0]][emptyCell[1]] = 3;
                    break;
            }
            foodAmount--;
        }
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 150);
    addEventListener('keydown', startGame);
    let emptyCell = findRandomEmptyCell(board);
    female_pacman.directionX = emptyCell[0];
    female_pacman.directionY = emptyCell[1];
    }

function startGame(){
    interval_ghost=setInterval(updateCharactersPositions, 350);
    removeEventListener('keydown', startGame);
}


function ghostInCell(i, j){
    ghosts.forEach(function(ghost) {
        if (ghost.i === i && ghost.j === j)
            return true;
    })
    return false;
}


function findRandomEmptyCell(board){
    var i = Math.floor((Math.random() * arr_dim-1) + 1);
    var j = Math.floor((Math.random() * arr_dim-1) + 1);
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * arr_dim-1) + 1);
        j = Math.floor((Math.random() * arr_dim-1) + 1);
    }
    return [i,j];
}

function GetKeyPressed() {
    if (keysDown[38]) { // up
        last_move = "up";
        return 1;
    }
    if (keysDown[40]) { // down
        last_move = "down";
        return 2;
    }
    if (keysDown[37]) { //left
        last_move = "left";
        return 3;
    }
    if (keysDown[39]) {// right
        last_move = "right";
        return 4;
    }
}


function Draw() {
    canvas.width=canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;

    function drawGhosts() {
        for (let i = 0; i < monster_amount; i++){
            let center = new Object();
            center.x = ghosts[i].directionX * 38 + 20;
            center.y = ghosts[i].directionY * 28 + 20;
            context.beginPath();
            context.arc(center.x, center.y, 12.5, 0.15 * Math.PI, 2 * Math.PI);
            context.lineTo(center.x, center.y);
            context.fillStyle = ghosts[i].color; //color
            context.fill();
        }
        if (show_female){
            let center = new Object();
            center.x = female_pacman.directionX * 38;
            center.y = female_pacman.directionY * 28;
            context.drawImage(female_pacman.image, center.x, center.y, 27, 27);
        }
    }

    drawGhosts();

    for (var i = 0; i < arr_dim; i++) {
        for (var j = 0; j < arr_dim; j++) {
            var center = new Object();
            center.x = i * 38 + 20;
            center.y = j * 28 + 20;
            if (board[i][j] == 5) {
                context.beginPath();
                context.arc(center.x, center.y, 12.5, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                // context.restore();
                context.beginPath();
                context.arc(center.x + 5, center.y - 7.5, 2.5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            }
            else if (ghostInCell(i ,j)){
                context.beginPath();
                context.arc(center.x, center.y, 12.5, 0.15 * Math.PI, 2 * Math.PI);
                context.lineTo(center.x, center.y);
                context.fillStyle = "white"; //color
                context.fill();
            }
            else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = junk_color; //color
                context.fill();
            } else if (board[i][j] == 2) {
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = solid_color; //color
                context.fill();
            } else if (board[i][j] == 3) {
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = premium_color; //color
                context.fill();
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x-15, center.y-15, 38, 29);
                context.fillStyle = "blue"; //color
                context.fill();
            }
        }
    }
}

function pacmanMeetsGhost(){
    for (let index = 0; index < monster_amount; index++){
        if ((shape.i == ghosts[index].directionX) && (shape.j == ghosts[index].directionY)){
            console.log((shape.i == ghosts[index].directionX) && (shape.j == ghosts[index].directionY));
            return true;
        }
    }
    return false;
}

function resetGame() {
    var board = new Array(14);
    for (let i = 0; i < 14; i++){
        board[i] = new Array(14);
    }
    ghosts[0].directionX = 0;
    ghosts[0].directionY = 0;
    ghosts[1].directionX = 0;
    ghosts[1].directionY = 13;
    ghosts[2].directionX = 13;
    ghosts[2].directionY = 0;
    show_female = true;

    Start();
}

function guestInCell(x, y) {
    for (let i = 0; i < monster_amount; i++){
        if ((ghosts[i].directionX == x && ghosts[i].directionY == y) || (female_pacman.directionX == x && female_pacman.directionY == y))
            return true;
    }
    return false;
}

function isFreeCell(x, y){
    return (board[x][y] == 0 || board[x][y] == 1  || board[x][y] == 2 || board[x][y] == 3 || board[x][y] == 5) && !guestInCell(x, y);
}

function getRandomMove(directionX, directionY) {
    var moves = [];
    if (directionY > 0 && isFreeCell(directionX, directionY - 1))
        moves.push({x: directionX, y: directionY-1});

    if (directionX < arr_dim-1 && isFreeCell(directionX + 1, directionY))
        moves.push({x: directionX + 1, y: directionY});


    if (directionY < arr_dim-1 && isFreeCell(directionX, directionY + 1))
        moves.push({x: directionX , y: directionY + 1});


    if (directionX > 0 && isFreeCell(directionX-1, directionY))
        moves.push({x: directionX-1 , y: directionY});

    return moves[Math.floor(Math.random()*moves.length)];
}

function updateCharactersPositions() {
    for (let index = 0; index < monster_amount ; index++){
        let newDistanceIfUp;
        let newDistanceIfRight;
        let newDistanceIfDown;
        let newDistanceIfLeft;

        if (ghosts[index].directionY > 0 && isFreeCell(ghosts[index].directionX, ghosts[index].directionY - 1))
            newDistanceIfUp = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX - shape.i) ,2) + Math.pow(Math.abs(ghosts[index].directionY - 1 - shape.j), 2));
        else
            newDistanceIfUp = Number.MAX_VALUE;

        if (ghosts[index].directionX < arr_dim-1 && isFreeCell(ghosts[index].directionX + 1, ghosts[index].directionY))
            newDistanceIfRight = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX + 1 - shape.i),2) + Math.pow(Math.abs( ghosts[index].directionY - shape.j),2));
        else
            newDistanceIfRight = Number.MAX_VALUE;

        if (ghosts[index].directionY < arr_dim-1 && isFreeCell(ghosts[index].directionX, ghosts[index].directionY + 1))
            newDistanceIfDown = Math.sqrt(Math.pow(Math.abs( ghosts[index].directionX - shape.i),2) + Math.pow(Math.abs( ghosts[index].directionY + 1 - shape.j ),2));
        else
            newDistanceIfDown = Number.MAX_VALUE;

        if (ghosts[index].directionX > 0 && isFreeCell(ghosts[index].directionX-1, ghosts[index].directionY))
            newDistanceIfLeft = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX - 1 - shape.i ),2) + Math.pow(Math.abs(ghosts[index].directionY - shape.j),2));
        else
            newDistanceIfLeft = Number.MAX_VALUE;

        let rand = Math.random();
        let minValue = Math.min(newDistanceIfUp, newDistanceIfRight, newDistanceIfDown, newDistanceIfLeft);
        if (rand <= 0.6 || minValue <= 3){
            if (minValue == newDistanceIfUp){
                ghosts[index].directionY = ghosts[index].directionY - 1;
            }
            else if (minValue == newDistanceIfRight){
                ghosts[index].directionX = ghosts[index].directionX + 1;
            }
            else if (minValue == newDistanceIfDown){
                ghosts[index].directionY = ghosts[index].directionY + 1;
            }
            else if (ghosts[index].directionX > 0)
            {
                ghosts[index].directionX = ghosts[index].directionX - 1;
            }
        }
        else{
            if (rand > 0.6 && rand < 0.7 && newDistanceIfUp < 10)
                ghosts[index].directionY = ghosts[index].directionY - 1;
            else if (rand >= 0.7 && rand < 0.8 && newDistanceIfRight < 10)
                ghosts[index].directionX = ghosts[index].directionX + 1;
            else if (rand >= 0.8 && rand < 0.9 && newDistanceIfDown < 10)
                ghosts[index].directionY = ghosts[index].directionY + 1;
            else if (newDistanceIfLeft < 10)
                ghosts[index].directionX = ghosts[index].directionX - 1;
        }
    }
    if (show_female) {
        var nextRandomCell = getRandomMove(female_pacman.directionX, female_pacman.directionY);
        female_pacman.directionX = nextRandomCell.x;
        female_pacman.directionY = nextRandomCell.y;
    }
}

function UpdatePosition() {

    if (pacmanMeetsGhost()){ // to fix max points case
        if (pacman_lives == 1 && pacmanMeetsGhost){
            window.clearInterval(interval);
            window.alert("Game Over, You don't have anymore live, you can reset the game");
            return;
        }
        else {
            pacman_lives--;
            window.alert("Game Over, But you still have live to try again");
            window.clearInterval(interval);
            window.clearInterval(interval_ghost);

            resetGame();
            return;
        }

    }


    if (show_female == true && shape.i == female_pacman.directionX && shape.j == female_pacman.directionY){
        score += 50;
        show_female = false;
        female_pacman.directionX = -1;
        female_pacman.directionY = -1;
    }
    board[shape.i][shape.j]=0;
    // updateCharactersPositions();

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
        if(shape.j<arr_dim-1 && board[shape.i][shape.j+1]!=4)
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
        if(shape.i<arr_dim-1 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score += 5;
    }
    if(board[shape.i][shape.j]==2)
    {
        score += 15;
    }
    if(board[shape.i][shape.j]==3)
    {
        score += 25;
    }
    board[shape.i][shape.j]=5;
    var currentTime=new Date();
    time_elapsed= Math.floor(timer - (currentTime-start_time)/1000);
    if(score>=0.7*max_points && time_elapsed<=10)
    {
        pac_color="green";
    }



    else
    {
        Draw();
    }
}