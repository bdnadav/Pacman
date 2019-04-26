// var name = "a"
// var pass =  "a"

//var dict = new Object();
var dict = [] ;
var user ={
    userName: "a" ,
    pass : "a" ,
    name: "" ,
    email: "" ,
    date : ""
};
dict.push(user);
function init () {
   // dict["a"] = "a" ;
   // dict.push(user);
}



function register (name , username , name , email , date){
    let user_reg ={
        userName: name,
        pass : username ,
        name: name ,
        email: email ,
        date : date
    };
    dict.push(user_reg);
}

function isRegistered( name ,  pass){

    for( let i=0; i<dict.length; i+=1 ) {
        //var value = dict[key];
            if ( dict[i].userName=== name && dict[i].pass === pass ) // user exist
                return true;


    }
    return false ; // not found

}