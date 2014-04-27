/* controller.js
** Contains the details of the controller object that controls what speed car objects
** should be travelling at as well as when they should switch lanes.
*/

function Controller(mode) {
	this.cars = [];
	this.mpgCounter = 0;
	this.speedCounter = 0;
	this.counter = 0;
	this.totalMPG = 0;
	this.totalSpeed = 0;
	this.mode = mode;
	this.avgSpeed = 0;
	this.simulationFinished = false;
	this.accelTime = 0;
	this.decelTime = 0;
	
	this.update = function() {
	// Runs through the cars seeing if any need to change lanes or speeds and checks if they are able to do such things.
		this.mpgCounter = 0;
		this.speedCounter = 0;
		//console.log(this.cars.length);
		for (var i = 0; i < this.cars.length; i ++) {
			// First check if there's need for the car to activate an emergency stop.
			var car = this.cars[i];
			
			// Add to the running total of each car's speed and mpg.
			this.mpgCounter += car.mpg();
			this.speedCounter += car.getSpeed();
			
			if (this.needToEmergencyStop(car.getLane())) {
				car.eStop();
			// Change the cars' speed only if the ideal speed is an actual speed.
			} else if(this.avgSpeed > 0 && mode != 2) {
				// Slow the car down if it's going faster than the ideal speed.
				if (car.getSpeed() > this.avgSpeed) {
					car.decel();	
				// Speed the car up if it's going slower than the ideal speed
				} else if (car.getSpeed() < this.avgSpeed) {
					car.accel();
				} // end if
				/*
				// Second, check if a car needs to switch lanes.
				if (car.getLane() != car.destLane) {
				
					// Determine which direction the car needs to go to get to the destination lane.
					var direction = car.getLane() - car.destLane;
					if (direction > 0) {
						// Determine if it is okay to change to the next lane.
						var state = this.okayTochangeLane(car, car.getLane() + 1);
						if (state == OKAY) car.changlaneBy(1);
						// If the car can change lanes by going a little faster, speed up.
						else if (state == SPEED_UP) car.accel();
						
					} else if (direction < 0) {
						// Determine if it is okay to change to the next lane.
						if (this.okayToChangeLane(car, car.getLane() - 1) == OKAY) car.changeLaneBy(-1);
						// If the car can change lanes by going a little faster, speed up.
						else if (state == SPEED_UP) car.accel();
					} // end if
				} // end if
				
				// Next, check if a car is at its desired speed.
				if (car.speed < car.desiredSpeed) {
					// Speed the car up if possible.
					if (this.okayToSpeedUp(car)) car.accel();
					
				} else if (car.speed > car.desiredSpeed) {
					// Slow the car down if possible.
					if (this.okayToSlowDown(car)) car.deccel();
				} // end if
				
				// Finally, check if a car can maintain its speed.
				var state = this.okayToStay(car);
				if (state != OKAY) {
					// Try to change lanes to avoid changing speed.
					if (this.okayToChangeLane(car, car.getLane() + 1) == OKAY) car.changeLaneBy(1);
					else if (this.okayToChangeLane(car, car.getLane() - 1) == OKAY) car.changeLaneBy(-1);
					else if (state == SPEED_UP) car.accel();
					else if (state == SLOW_DOWN) car.decel();
				} // end if*/
			} // end if
			
			//check to see if a car is close in front of this car, and slow it down if necessary
			car.checkFront();
			
			//remove car from list when it reaches the end of the road
			if (car.visible == false) {
				this.removeCarAt(i);
				i --;
			} // end if
		} // end for
	
		//if simulation is over (no more cars)
		if (this.cars.length == 0) {
			this.saveData();
			this.simulationFinished = true;
		} else {
			//simulation is not over
			this.counter++;
			
			// Add the average speed and mpg of all cars to the running total of the simulation's speed and mpg.
			this.totalMPG += this.mpgCounter/this.cars.length;
			this.totalSpeed += this.speedCounter/this.cars.length;
		} // end if
	} // end update
	
	this.pickSpeed = function() {
	// Loads the training data from local storage and picks an ideal speed for the cars to go based on the mode and previous sessions.
		var data = [];
		if(localStorage.trainingData != null) {
			var firstSplit = localStorage.trainingData.split(';');
			for (var i = 0; i < firstSplit.length; i ++) {
				data.push(firstSplit[i].split(','));
			} // end for
		} // end if
		
		var bestSpeed = 0;
		var bestTime = 999999999;
		var bestMPG = 0;
		var timesTrained = data.length;

		// Look for the speed that gives the best time and mpg combination.
		for (var i = 0; i < data.length; i ++) {
			// For now, we'll just check for the best time.
			//console.log(data[i]);
			if (parseFloat(data[i][0]) < bestTime) {
				bestTime = parseFloat(data[i][0]);
				bestSpeed = parseFloat(data[i][1]);
			} // end if
		} // end for
		if (this.mode == TRAINING) {
			// Create a random value between -4 and 4 and then weight it depending on how many trials have already been ran.
			var randomness = (12 * Math.random() - 6) * (1 / Math.log(timesTrained + 1));
			if (randomness == Infinity || randomness == -Infinity) randomness = 0;
			this.avgSpeed = bestSpeed + randomness;
			//this.avgSpeed = bestSpeed;
		} else if (this.mode == CONTROLLING) {
			// Set the speed of the cars to the best speed.
			this.avgSpeed = bestSpeed;
		} else if (this.mode == MONITORING) {
			// Set the speed to 0 so the controller knows not to update the cars.
			this.avgSpeed = 0;
		} // end if
		
		//in chaos mode, speeds are not chosen
		if(mode != 2)
		{
			console.log('Best speed: ' + bestSpeed + ',' + 'Chosen (average speed): ' + this.avgSpeed.toFixed(3));
		}
	}
	
	this.saveData = function() {
	// Saves the results of the simulation into the training data in local storage. Also creates the training data array if it does not exist.
		var speed = this.totalSpeed / this.counter;
		var mpg = this.totalMPG / this.counter;
		var data = this.counter + ',' + speed.toFixed(3) + ',' + mpg.toFixed(3) + ';';
		
		//Stats displayed to show results are being made
		console.log("Fuel Efficiency: " + mpg.toFixed(3));
		console.log("Average speed: " + speed);
		console.log("Time spent accel: " + this.accelTime);
		console.log("Time spent decel: " + this.decelTime);
		console.log('New entry: ' + data);
		//console.log(data);
		
		if (localStorage.trainingData != null) {
			// Make the next entry to be stored in the trainingData array.
			localStorage.trainingData += data;
		} else {
			// Create the trainingData array if it does not exist already.
			localStorage.trainingData = data;
		} // end if
	} // end saveData
	
	this.clearData = function() {
	// Deletes the training data.
		delete localStorage.trainingData;
	} // end if
	
	this.resetSimulation = function() {
		this.mpgCounter = 0;
		this.speedCounter = 0;
		this.counter = 0;
		this.totalMPG = 0;
		this.totalSpeed = 0;
		this.avgSpeed = 0;
		this.accelTime = 0;
		this.decelTime = 0;
		this.simulationFinished = false;
		this.pickSpeed();
	} // end resetCurrentData
	
	this.stats = function(car) {
		
	}
	
	this.needToEmergencyStop = function(lane) {
	// Checks to see if cars in the given lane need to execute an emergency stop.
	// Returns true or false.
		return false;
	} // end eStop
	
	/*this.okayToChangeLane = function(car, lane) {
	// Checks to see if it is safe for a car to switch to the given lane by checking how close the cars in that lane are.
	// Returns one of four states: OKAY, SPEED_UP, SLOW_DOWN, or CANNOT_CHANGE.
		return OKAY;
	} // end okayToChangeLane
	
	
	this.okayToSpeedUp = function(car) {
	// Checks to see if it is safe for a car to speed up by checking how close the car in front is (if any).
	// Returns true or false.
		return true;
	} // end okayToSpeedUp
	
	this.okayToSlowDown = function(car) {
	// Checks to see if it is safe for a car to slow down by checking how close the car behind is (if any).
	// Returns true or false.
		return true;
	} // end okayToSlowDown
	
	this.okayToStay = function(car) {
	// Checks to see if it is safe for a car to stay at the same speed by checking both the car in front and behind (if any).
	// Returns one of three states: OKAY, SPEED_UP, or SLOW_DOWN.
		return OKAY;
	} // end okayToStay*/
	
	this.addCar = function(car) {
	// Adds a car to the car array.
		this.cars.push(car);
	} // end addCar
	
	this.removeCar = function(car) {
	// Removes a car from the array.
		var index = this.cars.indexOf(car);
		// Check if the car does actually exist in the array.
		if (index != -1) {
			this.cars.splice(index, 1);
		} // end if
	} // end removeCar
	
	this.removeCarAt = function(index) {
	// Removes the car at the given index.
		// Make sure the index is valid first.
		if (index >= 0 && index < this.cars.length) {
			this.cars.splice(index, 1);
		} // end if
	} // end removeCarAt
	
	this.pickSpeed();
	return this;
} // end Controller constructor

// Constants to determine states.
OKAY = 0; SPEED_UP = 1; SLOW_DOWN = 2; CANNOT_CHANGE = 3;