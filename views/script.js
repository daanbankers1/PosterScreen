//Setup socket communication
const socket = io.connect("http://145.93.61.214:8000"); 

//Init function
window.onload = init;

//Send to the server to start
function init(){
    socket.emit('start', 'start');
}

//Getting image and putting it on the page
socket.on('Buffer', function(data){
    document.getElementById('poster').src = "data:image/jpeg;base64," + data
    setTimeout(getColors, 500);
})

//initializing colorThief
const colorThief = new ColorThief();

//Defining image for colorThief to use
let img = document.getElementById('poster');

//Creating a variable to put the color in
let rgbColor = "";

//Getting colors out of the poster
function getColors(){
    //Getting most used color
  let colors = colorThief.getColor(img);

  //creating the rgb code for leds
    rgbColor = "rgb("+colors[0]+","+colors[1]+","+colors[2]+")"
}

