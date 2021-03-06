/********************************************************************************************************
 *  car.js
 *  
 *  Car structure to be manipulated by controller
 *  -makes no decisions by itself
 *  -speed up, slow down, emergency, maintain speed at correct common speed, mpg "get" function
 ********************************************************************************************************/

    //LANE CONSTANTS
    var ONE = 37.5;
    var TWO = 112.5;
    var THREE = 187.5;
    var FOUR = 262.5;

function Car(speed,lane){
    //setup image
	tcar = new Sprite(sim, 'car.jpg', 38, 20, 1);
    tcar.setAngle(90);
    tcar.setImgAngle(0);
	tcar.boundAction = DIE;
    //tcar.setSize(38,20);
    
    //accel/decel d values
    tcar.accelRate = .5;
    tcar.decelRate = -.75;
    
    //start lane for this car passed in as parameter
    tcar.lane = lane;
	tcar.setPosition(0, lane);
    
    //speed for this car passed in as parameter
    tcar.setSpeed(speed);
    
    //destination lane passed in as parameter needed later maybe 
    //tcar.destLane = destLane;
    
    //needed later maybe
    tcar.carId = 0;
    
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
        this.changeSpeedBy(this.accelRate);
    }
    
    //decelerate
    tcar.decel = function()
    {
        if(this.speed > 0)
        {
            this.changeSpeedBy(this.decelRate);
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
	return tcar;
}