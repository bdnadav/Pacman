


let user ={
    userName: "a" ,
    pass : "a" ,
    name: "" ,
    email: "" ,
    date : ""
};
let dict = [];
dict.push(user);
if (localStorage.getItem("users") === null)
    window.localStorage.setItem("users", JSON.stringify(dict));
// dict = [];


function register (username , pass , name , lname, email , date ){
    let user_reg ={
        userName: username,
        pass : pass ,
        name: name ,
        lname: lname ,
        email: email ,
        date : date
    };
    let dict = JSON.parse(window.localStorage.getItem("users"))
    dict.push(user_reg);
    window.localStorage.setItem("users", JSON.stringify(dict));
}

function isRegistered( name ,  pass){
    let dict = JSON.parse(window.localStorage.getItem("users"))
    for( let i=0; i<dict.length; i+=1 ) {
        //var value = dict[key];
        if ( dict[i].userName=== name && dict[i].pass === pass ) // user exist
            return true;


    }
    return false ; // not found

}

function Registered( name ){
    let dict = JSON.parse(window.localStorage.getItem("users"))
    for( let i=0; i<dict.length; i+=1 ) {
        //var value = dict[key];
        if ( dict[i].userName=== name  ) // user exist
            return true;
    }
    return false ; // not found

}

function checkBeforRegister(){
    //save all fields
    let username = document.getElementById("username_field").value;
    let pass = document.getElementById("psw_field").value;
    let  name= document.getElementById("name_field").value;
    var  lname = document.getElementById("lastname_field").value;
    var email = document.getElementById("email_field").value;
    //var date= document.getElementById("date").value; // need to workout

    register(username , pass , name , lname, email , "null")


}

$(document).ready(function() {
    //jQuery code goes here


    $('#username_field').on('input', function() {
        var input=$(this);
        var re =   /^[a-zA-Z0-9]+$/ ;
        var is_usr_name_valid=re.test(input.val());
        var is_usr_name=input.val();
        if(is_usr_name && is_usr_name_valid && !Registered(input.val())){
            input.removeClass("invalid").addClass("valid");
        }
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#name_field').on('input', function() {
        var input=$(this);
        var re =   /^[a-zA-Z]+$/ ;
        var is_name_valid=re.test(input.val());
        var is_name=input.val();
        if(is_name && is_name_valid){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#lastname_field').on('input', function() {
        var input=$(this);
        var re =   /^[a-zA-Z]+$/ ;
        var is_lname_valid=re.test(input.val());
        var is_lname=input.val();
        if(is_lname && is_lname_valid){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#psw_field').on('input', function() {
        var input=$(this);
        var length = input.val().toString().length ;
        var re =   /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
        var is_pass=re.test(input.val());
        if(is_pass && length >=8){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#email_field').on('input', function() {
        var input=$(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email=re.test(input.val());
        if(is_email){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#date_field').on('input', function() {
        var input=$(this);
        input.removeClass("invalid").addClass("valid");
    });

    $("#register_btn button").click(function(event){
        var form_data=$("#reg_contact").serializeArray();
        var error_free=true;
        for (var input in form_data){
            var element=$("#"+ form_data[input]['name'] + "_field");
            var valid=element.hasClass("valid");
            if (  form_data[input]['name'] == "date") valid = true ;
            var error_element=$("span", element.parent());
            if (!valid){error_element.removeClass("error").addClass("error_show"); error_free=false;}
            else{error_element.removeClass("error_show").addClass("error");}
        }
        if (!error_free){
            event.preventDefault();
            alert('error: Form will not  be submitted');
        }
        else{
            alert('No errors: Form will be submitted');
            checkBeforRegister();
        }

    });

});


