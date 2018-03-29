var socket=io();

$(()=>{

    let living_room_button=$('#living_room_button');
    let btn_enable=$('#btn-enable');
    let photoresistor_enable=$('#photoresistor-enable');
    let bulb=$('#bulb');

    let control_variable;

    btn_enable.click(()=>{
        control_variable=0;
        socket.emit('disable-photoresistor');
    });

    photoresistor_enable.click(()=>{
        control_variable=1;
        socket.emit('enable-photoresistor');
    });

    living_room_button.click(()=>{
        if(control_variable===0) {
            socket.emit('living_room_light');
            if (living_room_button.text() === 'Turn on') {
                bulb.text('ON');
                living_room_button.text('Turn off');
            } else {
                bulb.text('OFF');
                living_room_button.text('Turn on');
            }
        }
    });

    socket.on('photoresistor-status',(data)=>{
        if(data.status==='on') {
            bulb.text('ON');
            living_room_button.text('Turn off');
        }
        else {
            bulb.text('OFF');
            living_room_button.text('Turn on');
        }

    })




})

