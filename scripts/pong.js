
//We will need somewhere to draw our scene
var canvas = null;
//We will need a context in which to draw (this can be 3D, 2D etc)
var context = null;

//class object to hold our ball data (position, speed) and functionality to operate on that data
class Ball {
    constructor( a_x, a_y, a_speed, a_radius ){
        //Position variables for the ball
        this.x = a_x; this.y = a_y;
        //Speed variable for the ball
        this.speed = a_speed;
        //radius for the ball
        this.radius = a_radius
    }
    SetPosition( a_x, a_y ){
        this.x = a_x; this.y = a_y;
    }
    SetSpeed( a_speed ){
        this.speed = a_speed;
    }
    Update(){
        //keep the ball inside the gameplay area - horizontally
        if( this.x > canvas.width || this.x < 0 ){
            this.speed = -this.speed;
        }
        this.x += this.speed;
    }
    Draw(){
        //Set our context's fill style
        context.fillStyle = "#000000";
        //begin drawing a path
        context.beginPath();
        context.arc( this.x, this.y, this.radius, 0, Math.PI*2);
        context.closePath();
        //fill what we have just drawn
        context.fill();
    }
}

//class object for the paddles 
class Paddle{
    constructor( a_x, a_y, a_width, a_height, a_upKey, a_downKey){
        this.x = a_x; this.y = a_y; 
        this.width = a_width; this.height = a_height; 
        this.KeyUp = a_upKey; this.KeyDown = a_downKey;
        this.colour = "#000000";
    }
    SetColour( a_colour ){
        this.colour = a_colour;
    }

    Update(){
         //test to see if rPaddleKey is pressed
        if( Key.isDown(this.KeyUp) ){
            this.y -= 2; //if key is down then move the paddle position 2 pixels upwards
        }
        if( Key.isDown(this.KeyDown) ){
            this.y += 2; //if key is down then move paddle 2 pixels down the canvas, canvas origin is top left corner
        }
    }

    Draw(){
        //draw the right paddle
        context.fillStyle = this.colour;
        context.beginPath();
        context.rect(this.x - (this.width * 0.5), this.y - (this.height * 0.5), this.width, this.height);
        context.closePath();
        context.fill();
    }
}

var ball;
var lPaddle;
var rPaddle;


function main(){

    //Using the document that this script will be run from we can get an element by it's ID,
    //Lets ask for the canvas and set it's rendering context to 2D.
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext("2d");
    //Add a border to our canvas so that we can see the area it occupies
    canvas.style = "border:1px solid #000000;";
    //set our canvas size based off our current browser window size
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.50;

    //Create the ball game object
    ball = new Ball( canvas.width * 0.5, canvas.height * 0.5, 2.0, 10.0);
    //create the left paddle
    lPaddle = new Paddle( canvas.width * 0.05, canvas.height * 0.5, 10, 60, Key.W, Key.S);
    lPaddle.SetColour( "#0000FF");
    //create the left paddle
    rPaddle = new Paddle( canvas.width * 0.95, canvas.height * 0.5, 10, 60, Key.UP, Key.DOWN);
    rPaddle.SetColour("#FF0000");
    requestAnimationFrame(mainLoop);
}

function mainLoop(timestamp){
    //clear the canvas each frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //move the ball along it's X axis by 2 pixels each time the function is called.
    //we want the ball to bounce off the edge of the screen
   
    ball.Update();
    ball.Draw();   
    
    lPaddle.Update();
    rPaddle.Update();

    lPaddle.Draw();
    rPaddle.Draw();

    //when an animation frame happens call this function again.
    requestAnimationFrame(mainLoop);

}

//window has an event listener function we can use to point to a function for listening for key press
//and release, lets create a key object to store key presses and key events so we can retrieve them later
var Key = {
    //keep our keys in an array object
    _pressed: {},
    //Keys we're interested in for Pong
    W: 87,
    S: 83,
    UP: 38,
    DOWN:40,

    //function to return if key is down
    isDown: function(keyCode){
        return this._pressed[keyCode];
    },
    //function to set key state to down
    onKeyDown: function(event){
        this._pressed[event.keyCode] = true;
    },
    //function to set key to released
    onKeyUp: function(event){
        this._pressed[event.keyCode] = false;
    }
};//end of our Key object 

//add our event listeners for key up and key down to the window eventlistener
window.addEventListener( 'keyup', function(event){ Key.onKeyUp(event);}, false); //when key is pressed call Key.onKeyUp
window.addEventListener( 'keydown', function(event){ Key.onKeyDown(event);}, false);// when key is released call Key.onKeyDown