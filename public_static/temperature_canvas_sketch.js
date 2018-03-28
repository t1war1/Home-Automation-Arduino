var chartpoints = [];
chartpoints.push({x: 0, y: 0});
var socket = io.connect("http://localhost:3000");
// Creating a canvas where the chart will be displayed and matching the connection with the socket
function setup() {
    cnv = createCanvas(displayWidth / 2, displayHeight / 5);
    cnv.parent("termo-container");
    // Gets a change whenever the temperature sensor changes and sets it to its element
    socket.on('temperature', function(temperature) {
        $("#termometer").val(temperature + "°C");
        createPoint(temperature);
    });
}
// Handle chart points to display
function draw() {
    background(255);
    noFill();
    stroke(0);
    // Here we draw the last temperature value from the chartpoints array where it is supposed to be
    //// Starts draw of point
    beginShape();
    for (var i=0; i < chartpoints.length; i++) {
        var P = chartpoints[i];
        vertex(P.x, height - P.y);
        text(P.y, P.x, height - P.y);
        //if (P.x<0)chartpoints.pop(i);
        P.x--;
    }
    endShape();
    //// Ends draw of point
}
// This function is called whenever the tmp36 sends a new value to the client
function createPoint(temp) {
    //var t = random(0, height-20);
    // Creates a new point with x -> live width of the canvas & y -> the temperature value from arduino
    var P = new Points(width, temp);
    chartpoints.push(P);
}
// Custom class of points that will be drawed
var Points = function()
{
    var x;
    var y;
    var constructor = function Points(x, y)
    {
        this.x = x;
        this.y = y;
    };
    return constructor;
}();
