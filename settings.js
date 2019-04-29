var right_move_key;
var down_move_key;
var left_move_key;
var up_move_key;


$("#input_amount_soup_nuts").on("keydown", function () {
    alert("Please use the arrows to select a number between 50 to 90");
});

$("#input_time_limit").on("keydown", function () {
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