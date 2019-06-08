
function decode(line){
    var words = line.split(/\s+/);
    var type;
    var amount = 0;
    var done = false;
    for(var i in words){
        if (words[i].match(/(spen)|(los)/) && !done){
            type = false;
            done = true;
        }else if (words[i].match(/(receive)|(won)|(got)/) && !done){
            type = true;
            done = true;
        } else if (!done) {
            type = undefined;
            done = true;
        }

        if (words[i].match(/^\d+$/)){
            amount = parseInt(words[i]);
        }

    }
    return {
        type:type,amount:amount,line:line
    };
}



$(document).ready(function () {

    function chat(line) {
        var message = line;
        var event = decode(message);
        var total = window.localStorage.getItem("amount");
        if (total == null) total = 0;
        total += event.amount;
        window.localStorage.setItem("amount",total);
        var reply;
        if (event.type == true){
            reply = 'Your Balance Increased to: '+total;
        } else if (event.type == false){
            reply = 'Your Balance Decreased to: '+total;
        } else{
            var got_it = isSummary(line);
            if (got_it){
                reply = 'Your Total Balance is: '+total;
            } else{
                reply = 'Sorry!! We didn`t recognised that';
            }
        }
        var bot_reply = $("<div/>",{
            class:"bots",
            text:reply
        });
        var my_query = $("<div/>",{
            class:"my",
            text:line
        });

        $('#msgs').appendChild(my_query);
        $('#msgs').appendChild(bot_reply);
    }

    function isSummary(line) {
        return line.toLowerCase().indexOf("summary");
    }

    function callback_field (event) {
        if (event.keyCode == 13){
            chat($('#msg').val());
        }
    }
    function callback_button(event) {
        chat($('#msg').val());
    }

    $("#send").click(callback_button);
    $("#msg").keyup(callback_field);
});