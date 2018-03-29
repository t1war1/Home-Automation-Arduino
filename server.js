const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');
const io=socketIo(server);

const five=require('johnny-five');
const board=five.Board();

app.use(express.static(path.join(__dirname,'public_static')));


var living_room_led;
board.on('ready',()=>{
    living_room_led=new five.Led(13);
living_room_led.off();
});

io.on('connection',(socket)=>{

    socket.on('living_room_light',(data)=>{  //living room light on button press from front-end

    living_room_led.toggle();

})
})

server.listen(3000,()=>{
    console.log(`Server on at http://localhost:3000/`);
});