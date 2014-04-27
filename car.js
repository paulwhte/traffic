/********************************************************************************************************
 *  car.js
 *  
 *  Car structure to be manipulated by controller
 *  -makes no decisions by itself
 *  -speed up, slow down, emergency, maintain speed at correct common speed, mpg "get" function
 ********************************************************************************************************/

    //LANE CONSTANTS
    var ONE = 18.75;
    var TWO = 56.25;
    var THREE = 93.75;
    var FOUR = 131.25;

function Car(speed,lane){
    //setup image
	tcar = new Sprite(sim, 'car.jpg', 38, 20, 1);
    tcar.setAngle(90);
    tcar.setImgAngle(0);
	tcar.boundAction = DIE;
    //tcar.setSize(38,20);
    
    //accel/decel d values
    tcar.accelRate = .25;
    tcar.decelRate = -.35;
    
    //start lane for this car passed in as parameter
    tcar.lane = lane;
	tcar.setPosition(0, lane);
    
    //speed for this car passed in as parameter
    tcar.setSpeed(speed);
    tcar.topSpeed = speed;
    
    //destination lane passed in as parameter needed later maybe 
    //tcar.destLane = destLane;
    
    //needed later maybe
    tcar.carId = 0;
	
	//speed of the previous frame.
	tcar.prevSpeed = speed;
	tcar.accelTime = 0;
	tcar.decelTime = 0;
    
    //return the car's current lane
    tcar.getLane = function()
    {
        return this.lane;
    }
    
    //change the car's current lane by an increment
    tcar.changeLaneBy = function(dLane)
    {
        this.lane += dLane;
    }
    
    //accelerate
    tcar.accel = function()
    {
	if(this.speed < this.topSpeed)
	{
		this.changeSpeedBy(this.accelRate);
		control.accelTime++;
	}
    }
    
    //decelerate
    tcar.decel = function()
    {
        if(this.speed > 0)
        {
            this.changeSpeedBy(this.decelRate);
	    control.decelTime++;
        }
    }
    
    //emergency stop
    tcar.eStop = function()
    {
        if(this.speed > 0)
        {
            //stop car faster than normal
            //the modifier might need adjustment
            car.changeSpeedBy(car.decel - .25);
	    control.decelTime++;
        }
    }
    
    tcar.checkFront = function()
    {
	//check if any cars in this car's lane are too close
	//loop through car list
	for(var i = 0; i < control.cars.length; i++)
	{
		//cars are in the same lane
		if(this.lane == control.cars[i].lane)
		{
			//if this car is behind the other car
			// and the dif between x values is too little
			if(this.x < control.cars[i].x && (control.cars[i].x -this.x) < 85 && this.getSpeed() > control.cars[i].getSpeed())
			{
				//slow down
				//console.log("slowing");
				this.decel();
			}
		}
	}
    }
    
    //returns the mpg of this frame based only on the current speed
    //it is a simplistic way to calculate, but for our purposes ok
    tcar.mpg = function()
    {
        //use the multiplier we calculated to convert the pixels/frame speed to miles/hour
        var x = this.speed * 6.639; 
        
        //input the miles/hour x value into the curve that determines the mpg
        var mpg = (-.0115)*(x^2) + (1.0671)*x + 6.1448;
        
        return mpg;
    }
	
	// Keeps track of the number of frames the car has either accelerated or decelerated.
	tcar.incrementTimeAccelerated = function() {
		// If the car is going faster than the last frame, it accelerated.
		if (this.speed > this.prevSpeed) {
			this.accelTime ++;
		// If the car is going slower than the last frame, it decelerated.
		} else if (this.speed < this.prevSpeed) {
			this.decelTime ++;
		} // end if
		
		// The current speed now becomes the previous speed.
		this.prevSpeed = this.speed;
	} // end incrementTimeAccelerated
	
	tcar.update = function() {
		this.x += this.dx;
        this.y += this.dy;
        this.checkBounds();
        if (this.visible) {
            this.draw();
        } // end if
		this.incrementTimeAccelerated();
		console.log('accel time: ' + this.accelTime + '. decel time: ' + this.decelTime);
	} // end update
	
	return tcar;
}