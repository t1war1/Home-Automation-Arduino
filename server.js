const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');
const io=socketIo(server);

const five=require('johnny-five');
const board=five.Board();
var temp;

app.use(express.static(path.join(__dirname,'public_static')));


var living_room_led, photoresistor,control_pin;

board.on('ready',()=>
{  
    living_room_led=new five.Led(13);
    living_room_led.off();

    control_pin=new five.Pin(12);                              //to select between button and photoresistor

    photoresistor=new five.Sensor({
        pin: "A0",
        freq: 250
    });

    five.Pin.read(control_pin, function(error, value) {          // reads the state of control pin
        // console.log(value);                                   // state of control pin 
          temp = value;
      });

    if (temp!=0)                                              // Only works when control pin will be 1 or it is selected as photoresistor
    {

        photoresistor.on('data',function()
        {
                
        if (temp!=0)

            {
                if(this.scaleTo([0,100])<40)
                {
                console.log("photoresistor on")
                    living_room_led.on();                     
                    console.log(this.value);                       // To see the analog output value from photoresistror
                    io.emit('photoresistor-status',{
                        status:'on'
                    });
                }else
                {
                    console.log("photoresistor off")
                    console.log(this.value);                        // To see the analog output value from photoresistror
                    living_room_led.off();
                    io.emit('photoresistor-status',{
                        status:'off'
                    });
                }
                }
            else
            {
                    
                photoresistor.disable();
                console.log("photoresistor disable")
            }
        
        })
    }

    photoresistor.disable();

    io.on('connection',(socket)=>{
        
            socket.on('living_room_light',(data)=>{
                  //living room light on button press from front-end
                  photoresistor.disable();
                  living_room_led.toggle();
                  console.log("led toggle")
                  photoresistor.disable();
            });
        
            socket.on('disable-photoresistor',(data)=>{
                
                photoresistor.disable();
                control_pin.low();
                console.log("disable photoresistor")
                photoresistor.disable();
        
            });
        
            socket.on('enable-photoresistor',(data)=>{
                             
                control_pin.high();
                console.log("enable photoresistor")
                photoresistor.enable();
            });
        
        });

});


server.listen(4000,()=>{
    console.log(`Server on at http://localhost:4000/`);
});