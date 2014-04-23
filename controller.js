/* controller.js
** Contains the details of the controller object that controls what speed car objects
** should be travelling at as well as when they should switch lanes.
*/

function Controller() {
	this.cars = [];
	
	this.update = function() {
	// Runs through the cars seeing if any need to change lanes or speeds and checks if they are able to do such things.
	
	for (var i = 0; i < this.cars.length; i ++) {
		// First check if there's need for the car to activate an emergency stop.
		var car = this.cars[i];
		if (needToEmergencyStop(car.getLane())) {
			car.eStop();
		} else {
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
			} // end if
		} // end if
	} // end for
	
	} // end update
	
	this.needToEmergencyStop = function(lane) {
	// Checks to see if cars in the given lane need to execute an emergency stop.
	// Returns true or false.
		return false;
	} // end eStop
	
	this.okayToChangeLane = function(car, lane) {
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
	} // end okayToStay
	
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
	
} // end Controller constructor

// Constants to determine states.
OKAY = 0; SPEED_UP = 1; SLOW_DOWN = 2; CANNOT_CHANGE = 3;