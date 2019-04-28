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