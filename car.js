/********************************************************************************************************
 *  car.js
 *  
 *  Car structure to be manipulated by controller
 *  -makes no decisions by itself
 *  -speed up, slow down, emergency, maintain speed at correct common speed, mpg "get" function
 ********************************************************************************************************/

function car(/*parameters*/){
    //setup image
    this.setAngle(90);
    this.setImgAngle(0);
    
    //accel/decel d values
    this.accel = .5;
    this.decel = -.75;
    
    //start lane for this car passed in as parameter
    this.lane = lane;
    
    //speed for this car passed in as parameter
    this.speed = speed;
    
    //destination lane passed in as parameter needed later maybe 
    this.destLane = destLane;
    
    //needed later maybe
    this.carId = 0;
    
    //return the car's current lane
    this.getLane = function()
    {
        return this.lane;
    }
    
    //change the car's current lane by an increment
    this.changeLaneBy = function(dLane)
    {
        this.lane += dLane;
    }
    
    //accelerate
    this.accel = function()
    {
        this.changeSpeedBy(this.accel);
    }
    
    //decelerate
    this.decel = function()
    {
        if(this.speed > 0)
        {
            this.changeSpeedBy(this.decel);
        }
    }
    
    //emergency stop
    this.eStop = function()
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
    this.mpg = function()
    {
        //use the multiplier we calculated to convert the pixels/frame speed to miles/hour
        var x = this.speed * 6.639; 
        
        //input the miles/hour x value into the curve that determines the mpg
        var mpg = (-.0115)*(x^2) + (1.0671)*x + 6.1448;
        
        return mpg;
    }
}