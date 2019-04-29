var context = canvas.getContext("2d");
var shape = new Object();
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval_ghost;
var timer;
var timeBonusUsed = false;
var show_time_bonus = false;
var eating = false;

var soup_nuts_amount;

var junk_color;
var solid_color;
var premium_color;

var monster_amount;
var ghosts = [{color: "#00FFDE", directionX: 0, directionY: 0}, {
    color: "#FF0000",
    directionX: 13,
    directionY: 13
}, {color: "#FFB8DE", directionX: 0, directionY: 13}];
img_female_pacman = new Image;
img_female_pacman.src = 'files/mis-pacman.jpg';
var female_pacman = {image: img_female_pacman, directionX: 0, directionY: 0};
img_timer_bonus = new Image;
img_timer_bonus.src = 'files/timer_bonus_fix.png';
var timer_bonus = {image: img_timer_bonus, directionX: -1, directionY: -1};
var show_female = true;
var pacman_lives = 3;

var arr_dim = 14;
var board = new Array(14);
for (let i = 0; i < 14; i++) {
    board[i] = new Array(14);
}

var max_points;

var last_move = right;



$("#input_amount_soup_nuts").on("keydown", function () {
    alert("Please use the arrows to select a number between 50 to 90");
});

$("#input_time_limit").on("keydown", function () {
    alert("Please use the arrows to select a number between 60 to 300 seconds");
});


$("#game_test").on("click", Start);


function Start() {
    let res = settingsAreValid();
    if (res !== 6) { // fix to switch cases (error types)
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

function initBoard() {
    pac_color = "yellow";
    var cnt = arr_dim * arr_dim;
    var prem_food_remain = Math.floor(soup_nuts_amount * 0.1);
    var solid_food_remain = Math.floor(soup_nuts_amount * 0.3);
    var junk_food_remain = soup_nuts_amount - prem_food_remain - solid_food_remain;
    max_points = prem_food_remain * 25 + solid_food_remain * 15 + junk_food_remain * 5;
    var pacman_remain = 1;


    function placeRemainFood(foodType, foodAmount) {
        while (foodAmount > 0) {
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

    for (var i = 0; i < arr_dim; i++) {
        for (var j = 0; j < arr_dim; j++) {
            if (((i == 1 || i == 12) && (j == 2 || j == 3 || j == 4 || j == 9 || j == 10)) ||
                ((i == 2 || i == 11) && (j == 0 || j == 4 || j == 5 || j == 6 || j == 9 || j == 10 || j == 11)) ||
                ((i == 3 || i == 10) && (j == 6 || j == 11)) ||
                ((i == 4 || i == 9) && (j == 2 || j == 4 || j == 11)) ||
                ((i == 5 || i == 8) && (j == 2 || j == 6 || j == 7 || j == 11)) ||
                ((i == 6 || i == 7) && (j == 7))
            )

                board[i][j] = 4;

            else {

                var randomNum = Math.random();
                if (randomNum <= 1.0 * junk_food_remain / cnt) {
                    junk_food_remain--;
                    board[i][j] = 1;
                } else if (randomNum <= 1.0 * solid_food_remain / cnt) {
                    solid_food_remain--;
                    board[i][j] = 2;
                } else if (randomNum <= 1.0 * prem_food_remain / cnt) {
                    prem_food_remain--;
                    board[i][j] = 3;
                } else if ((!(i == 0 && (j == 0 || j == 13))) && (!(j == 0 && (i == 0 || i == 13))) && pacman_remain == 1 && randomNum < 1.0 * (pacman_remain + junk_food_remain + solid_food_remain + prem_food_remain) / cnt) {
                    shape.i = i;
                    shape.j = j;
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
}

function setFemalePacmanRandomPosition() {
    let emptyCell = findRandomEmptyCell(board);
    while(!isFreeCell(emptyCell[0], emptyCell[1]))
        emptyCell = findRandomEmptyCell(board);
    female_pacman.directionX = emptyCell[0];
    female_pacman.directionY = emptyCell[1];
}

function startgame() {

    score = 0;

    start_time = new Date();

    initBoard();
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval = setInterval(UpdatePosition, 150);
    // interval_draw = setInterval(Draw, 5);
    addEventListener('keydown', startGame);
    setFemalePacmanRandomPosition();
    }


    function startGame() {
        interval_ghost = setInterval(updateCharactersPositions, 350);
        removeEventListener('keydown', startGame);
    }


    function ghostInCell(i, j) {
        ghosts.forEach(function (ghost) {
            if (ghost.i === i && ghost.j === j)
                return true;
        })
        return false;
    }


    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * arr_dim - 1) + 1);
        var j = Math.floor((Math.random() * arr_dim - 1) + 1);
        while (board[i][j] != 0) {
            i = Math.floor((Math.random() * arr_dim - 1) + 1);
            j = Math.floor((Math.random() * arr_dim - 1) + 1);
        }
        return [i, j];
    }

    function GetKeyPressed() {
        if (keysDown[up_move_key]) { // up
            last_move = "up";
            eating = !eating;
            return 1;
        }
        if (keysDown[down_move_key]) { // down
            last_move = "down";
            eating = !eating;
            return 2;
        }
        if (keysDown[left_move_key]) { //left
            last_move = "left";
            eating = !eating;
            return 3;
        }
        if (keysDown[right_move_key]) {// right
            last_move = "right";
            eating = !eating;
            return 4;
        }
    }


    function Draw() {
        canvas.width = canvas.width; //clean board
        lblScore.value = score;
        lblTime.value = time_elapsed;

        function drawGhosts() {
            let left;
            for (let i = 0; i < monster_amount; i++) {
                var s = 30,
                    top = (ghosts[i].directionY) * 28 + 3.5;
                left = (ghosts[i].directionX) * 38 + 4.5;
                var tl = left + s + 10;
                var base = top + s;
                var inc = s / 10;
                context.fillStyle = ghosts[i].color; //color
                context.beginPath();

                context.moveTo(left, base);

                context.quadraticCurveTo(left, top, left + (s / 2), top);
                context.quadraticCurveTo(left + s, top, left + s, base);

                // Wavy things at the bottom
                context.quadraticCurveTo(tl - (inc * 1), base, tl - (inc * 2), base);
                context.quadraticCurveTo(tl - (inc * 3), base, tl - (inc * 4), base);
                context.quadraticCurveTo(tl - (inc * 5), base, tl - (inc * 6), base);
                context.quadraticCurveTo(tl - (inc * 7), base, tl - (inc * 8), base);
                context.quadraticCurveTo(tl - (inc * 9), base, tl - (inc * 10), base);

                context.closePath();
                context.fill();

                context.beginPath();
                context.fillStyle = "#FFF";
                context.arc(left + 6, top + 6, s / 6, 0, 300, false);
                context.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
                context.closePath();
                context.fill();

            }
            if (show_female) {
                let center = new Object();
                center.x = female_pacman.directionX * 38 + 10;
                center.y = female_pacman.directionY * 28;
                context.drawImage(female_pacman.image, center.x, center.y, 30, 30);
            }
            if (show_time_bonus){
                let center = new Object();
                center.x = timer_bonus.directionX * 38;
                center.y = timer_bonus.directionY * 28;
                context.drawImage(timer_bonus.image, center.x, center.y, 30, 30);
            }
        }

        for (var i = 0; i < arr_dim; i++) {
            for (var j = 0; j < arr_dim; j++) {
                var center = new Object();
                center.x = i * 38 + 20;
                center.y = j * 28 + 20;
                if (board[i][j] == 5) {
                    context.beginPath();
                    if (eating){
                        context.arc(center.x, center.y, 12.5, 0, 1.9 * Math.PI); // half circle - up
                    }
                    else {
                        switch (last_move) {
                            case "up":
                                context.arc(center.x, center.y, 12.5, 1.65 * Math.PI, 1.35 * Math.PI); // half circle - up
                                break;
                            case "right":
                                context.arc(center.x, center.y, 12.5, 0.15 * Math.PI, 1.85 * Math.PI); // half circle - right
                                break;
                            case "down":
                                context.arc(center.x, center.y, 12.5, 0.65 * Math.PI, 0.35 * Math.PI); // half circle - down
                                break;
                            case "left":
                                context.arc(center.x, center.y, 12.5, 1.15 * Math.PI, 0.85 * Math.PI); // half circle - left
                                break;
                        }
                    }
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    switch (last_move) {
                        case "up":
                            context.arc(center.x + 7, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                            break;
                        case "right":
                            context.arc(center.x + 7, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                            break;
                        case "down":
                            context.arc(center.x + 7, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                            break;
                        case "left":
                            context.arc(center.x + 7, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                            break;
                    }
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (ghostInCell(i, j)) {
                    context.beginPath();
                    context.arc(center.x, center.y, 12.5, 0.15 * Math.PI, 2 * Math.PI);
                    context.lineTo(center.x, center.y);
                    context.fillStyle = "white"; //color
                    context.fill();
                } else if (board[i][j] == 1) {
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
                } else if (board[i][j] == 4) {
                    context.beginPath();
                    context.rect(center.x - 15, center.y - 15, 38, 29);
                    context.fillStyle = "blue"; //color
                    context.fill();
                }
            }
        }
        drawGhosts();
    }

    function pacmanMeetsGhost() {
        for (let index = 0; index < monster_amount; index++) {
            if ((shape.i == ghosts[index].directionX) && (shape.j == ghosts[index].directionY)) {
                console.log((shape.i == ghosts[index].directionX) && (shape.j == ghosts[index].directionY));
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        var board = new Array(14);
        for (let i = 0; i < 14; i++) {
            board[i] = new Array(14);
        }
        ghosts[0].directionX = 0;
        ghosts[0].directionY = 0;
        ghosts[1].directionX = 0;
        ghosts[1].directionY = 13;
        ghosts[2].directionX = 13;
        ghosts[2].directionY = 0;
        show_female = true;
        timer_bonus.directionX = -1;
        timer_bonus.directionY = -1;
        show_time_bonus = false;
        timeBonusUsed = false;
        Start();
    }

    function characterInCell(x, y) {
        for (let i = 0; i < monster_amount; i++) {
            if ((ghosts[i].directionX == x && ghosts[i].directionY == y) || (female_pacman.directionX == x && female_pacman.directionY == y) || (timer_bonus.directionX == x && timer_bonus.directionY == y))
                return true;
        }
        return false;
    }

    function isFreeCell(x, y) {
        return (board[x][y] == 0 || board[x][y] == 1 || board[x][y] == 2 || board[x][y] == 3 || board[x][y] == 5) && !characterInCell(x, y);
    }

    function getRandomMove(directionX, directionY) {
        var moves = [];
        if (directionY > 0 && isFreeCell(directionX, directionY - 1))
            moves.push({x: directionX, y: directionY - 1});

        if (directionX < arr_dim - 1 && isFreeCell(directionX + 1, directionY))
            moves.push({x: directionX + 1, y: directionY});


        if (directionY < arr_dim - 1 && isFreeCell(directionX, directionY + 1))
            moves.push({x: directionX, y: directionY + 1});


        if (directionX > 0 && isFreeCell(directionX - 1, directionY))
            moves.push({x: directionX - 1, y: directionY});

        return moves[Math.floor(Math.random() * moves.length)];
    }

    function updateCharactersPositions() {
        for (let index = 0; index < monster_amount; index++) {
            let newDistanceIfUp;
            let newDistanceIfRight;
            let newDistanceIfDown;
            let newDistanceIfLeft;

            if (ghosts[index].directionY > 0 && isFreeCell(ghosts[index].directionX, ghosts[index].directionY - 1))
                newDistanceIfUp = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX - shape.i), 2) + Math.pow(Math.abs(ghosts[index].directionY - 1 - shape.j), 2));
            else
                newDistanceIfUp = Number.MAX_VALUE;

            if (ghosts[index].directionX < arr_dim - 1 && isFreeCell(ghosts[index].directionX + 1, ghosts[index].directionY))
                newDistanceIfRight = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX + 1 - shape.i), 2) + Math.pow(Math.abs(ghosts[index].directionY - shape.j), 2));
            else
                newDistanceIfRight = Number.MAX_VALUE;

            if (ghosts[index].directionY < arr_dim - 1 && isFreeCell(ghosts[index].directionX, ghosts[index].directionY + 1))
                newDistanceIfDown = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX - shape.i), 2) + Math.pow(Math.abs(ghosts[index].directionY + 1 - shape.j), 2));
            else
                newDistanceIfDown = Number.MAX_VALUE;

            if (ghosts[index].directionX > 0 && isFreeCell(ghosts[index].directionX - 1, ghosts[index].directionY))
                newDistanceIfLeft = Math.sqrt(Math.pow(Math.abs(ghosts[index].directionX - 1 - shape.i), 2) + Math.pow(Math.abs(ghosts[index].directionY - shape.j), 2));
            else
                newDistanceIfLeft = Number.MAX_VALUE;

            let rand = Math.random();
            let minValue = Math.min(newDistanceIfUp, newDistanceIfRight, newDistanceIfDown, newDistanceIfLeft);
            if (rand <= 0.6 || minValue <= 3) {
                if (minValue == newDistanceIfUp) {
                    ghosts[index].directionY = ghosts[index].directionY - 1;
                } else if (minValue == newDistanceIfRight) {
                    ghosts[index].directionX = ghosts[index].directionX + 1;
                } else if (minValue == newDistanceIfDown) {
                    ghosts[index].directionY = ghosts[index].directionY + 1;
                } else if (ghosts[index].directionX > 0) {
                    ghosts[index].directionX = ghosts[index].directionX - 1;
                }
            } else {
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

        if (show_time_bonus) {
            var nextRandomCell = getRandomMove(timer_bonus.directionX, timer_bonus.directionY);
            timer_bonus.directionX = nextRandomCell.x;
            timer_bonus.directionY = nextRandomCell.y;
        }
    }

    function UpdatePosition() {

        if (pacmanMeetsGhost()) { // to fix max points case
            if (pacman_lives == 1 && pacmanMeetsGhost) {
                window.clearInterval(interval);
                window.alert("Game Over, You don't have anymore live, you can reset the game");
                return;
            } else {
                pacman_lives--;
                window.alert("Game Over, But you still have live to try again");
                window.clearInterval(interval);
                window.clearInterval(interval_ghost);

                resetGame();
                return;
            }

        }


        if (show_female == true && shape.i == female_pacman.directionX && shape.j == female_pacman.directionY) {
            score += 50;
            show_female = false;
            female_pacman.directionX = -1;
            female_pacman.directionY = -1;
        }
        if (shape.i == timer_bonus.directionX && shape.j == timer_bonus.directionY) {
            timer *= 2;
            show_time_bonus = false;
            timer_bonus.directionX = -1;
            timer_bonus.directionY = -1;
        }
        board[shape.i][shape.j] = 0;

        var x = GetKeyPressed()
        if (x == 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
                shape.j--;
            }
        }
        if (x == 2) {
            if (shape.j < arr_dim - 1 && board[shape.i][shape.j + 1] != 4) {
                shape.j++;
            }
        }
        if (x == 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
                shape.i--;
            }
        }
        if (x == 4) {
            if (shape.i < arr_dim - 1 && board[shape.i + 1][shape.j] != 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] == 1) {
            score += 5;
        }
        if (board[shape.i][shape.j] == 2) {
            score += 15;
        }
        if (board[shape.i][shape.j] == 3) {
            score += 25;
        }
        board[shape.i][shape.j] = 5;
        var currentTime = new Date();
        time_elapsed = Math.floor(timer - (currentTime - start_time) / 1000);
        if ((time_elapsed <= 0.6 * $("#input_time_limit").val()) && !timeBonusUsed) {
            timeBonusUsed = true;
            show_time_bonus = true;
            let emptyCell = findRandomEmptyCell(board);
            while (characterInCell(emptyCell[0], emptyCell[1]))
                emptyCell = findRandomEmptyCell(board);

            timer_bonus.directionX = emptyCell[0];
            timer_bonus.directionY = emptyCell[1];
        }
        if (score >= 0.7 * max_points && time_elapsed <= 10) {
            pac_color = "green";
        } else {
            Draw();
        }

}