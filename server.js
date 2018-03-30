const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');
const io=socketIo(server);

const five=require('johnny-five');
const board=five.Board();

app.use(express.static(path.join(__dirname,'public_static')));


var living_room_led, photoresistor,control_pin;

board.on('ready',()=>{
   // console.log("test2")
    living_room_led=new five.Led(13);
    living_room_led.off();

    control_pin=new five.Pin(12);

    photoresistor=new five.Sensor({
        pin: "A0",
        freq: 250
    });
    photoresistor.on('data',function(){
        if(this.scaleTo([0,100])<40)
        {
        //   console.log("photoresistor on")
            living_room_led.on();
            io.emit('photoresistor-status',{
                status:'on'
            });
        }else
        {
          //  console.log("photoresistor off")
            living_room_led.off();
            io.emit('photoresistor-status',{
                status:'off'
            });
        }
    })
    photoresistor.disable();
/*
    control_pin.on('low',function () {
        console.log("test1")
        photoresistor.disable();
    });

    control_pin.on('high',function () {
        console.log("test2")
        photoresistor.enable();
    })

});
*/

io.on('connection',(socket)=>{

    socket.on('living_room_light',(data)=>{  //living room light on button press from front-end
    living_room_led.toggle();
    });

    socket.on('disable-photoresistor',(data)=>{
        
        
        control_pin.write(0);
        console.log("disable photoresistor")
        photoresistor.disable();

    });

    socket.on('enable-photoresistor',(data)=>{
       
        
        control_pin.write(1);
        console.log("enable photoresistor")
        photoresistor.enable();
    });

});

server.listen(4000,()=>{
    console.log(`Server on at http://localhost:4000/`);
});