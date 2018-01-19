var blah = {
    runme: function(functorun) {
        functorun()
    },
    name: "pat",
}

var user = {
    name: "kevin",
    sayname: function() {
        console.log(this.name);
    }
}



user.sayname();
