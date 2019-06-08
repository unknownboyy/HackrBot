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
    var obj = {
        type:type,
        amount:amount,
        line:line,
        date:new Date().toDateString()
    };
    var final = window.localStorage.getItem("store");
    if (final == null){
        final = {
            data:[]
        };
        final.data.push(obj);
    } else{
        final = JSON.parse(final);
        final.data.push(obj);
    }
    window.localStorage.setItem("store",JSON.stringify(final));
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
        if (event.type == true){
            total = parseInt(total) + parseInt(event.amount);
        } else if (event.type == false){
            total = parseInt(total) - parseInt(event.amount);
        }

        total = parseInt(total);
        window.localStorage.setItem("amount",total);
        var reply;
        if (event.type == true){
            reply = 'Your Balance Rs.'+total;
        } else if (event.type == false){
            reply = 'Your Balance Rs. '+total;
        } else{
            var got_it = isSummary(line);
            if (got_it !=-1){
                reply = 'Total Bal. is Rs. '+total;
            } else{
                reply = 'Sorry!! We didn`t recognised that';
            }
        }
        var bot_reply = $("<div/>",{
            class:"form-control",
            text:"Bot:  "+reply,
            type:"text",
        });
        var my_query = $("<div/>",{
            class:"form-control",
            text:"Me:  "+line,
            type:"text"
        });
        bot_reply.prop("disabled",true);
        my_query.prop("disabled",true);

        bot_reply.css({"width":"50%","float":"left"});
        my_query.css({"width":"50%","float":"right"});

        var box2 = $("<div/>").append($("<br/>")).append($("<br/>")).append(bot_reply);
        var box1 = $("<div/>").append($("<br/>")).append($("<br/>")).append(my_query);


        $('#msgs').append(box1);

        $('#msgs').append(box2);

        $("#msg").val("");
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