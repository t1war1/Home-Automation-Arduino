var socket=io();

$(()=>{

    let living_room_button=$('#living_room_button');

    living_room_button.click(()=>{
        socket.emit('living_room_light');
        if(living_room_button.text()==='Turn on')
        {
            living_room_button.text('Turn off');
        }else {
            living_room_button.text('Turn on');
        }
    });





})

