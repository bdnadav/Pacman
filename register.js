// var name = "a"
// var pass =  "a"

//var dict = new Object();

var dict ={
    "a": "a"
};

function init () {
   // dict["a"] = "a" ;

}



function register (){





}

function isRegistered( name ,  pass){

    for(var key in dict) {
        var value = dict[key];
            if ( key == name && value == pass ) // user exist
                return true;


    }
    return false ; // not found

}