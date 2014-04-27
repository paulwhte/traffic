function Spawner(situation, controller)
{
    tSpawner = new Sprite(sim, 'road.png', 1500, 150, 0);
    tSpawner.curTime = 0;
    tSpawner.sim1 = [[1, 0, 15, ONE], [2, 1, 10, TWO], [3, 1, 12, THREE], [4, 1.5, 13, THREE]];
    tSpawner.sim2 = [
			[1, 0, 11, ONE],
			[2, 2, 3, TWO], [3, 4, 6, TWO], [4, 5, 8, TWO], [5, 6, 6, TWO], [6, 8, 5, TWO], [7, 9, 7, TWO],
			[8, 1, 4, THREE], [9, 2, 4, THREE], [10, 3, 4, THREE], [11, 4, 4, THREE],[12, 5, 4, THREE], [13, 6, 4, THREE], [7, 4, THREE], [8, 4, THREE], [9, 4, THREE], [10, 4, THREE],
			[14, 0, 2, FOUR], [15, 10, 5, FOUR], [16, 12, 7, FOUR], [17, 13, 6, FOUR], [18, 15, 6.5, FOUR], [19, 16, 5, FOUR]
		     ];
    tSpawner.situation = situation;
	tSpawner.controller = controller;
    
    tSpawner.update = function () {
        tSpawner.spawn();
        tSpawner.curTime ++;
        
        this.x += this.dx;
        this.y += this.dy;
        this.checkBounds();
        if (this.visible) {
            this.draw();
        } // end if
    }
	
	tSpawner.reset = function() {
		this.curTime = 0;
	} // end reset
    
    tSpawner.spawn = function () {
        var time = this.curTime / 20;
        var sim = [];
        if (situation == 1) {
           sim = this.sim1;
        } else if (situation == 2) {
	    sim = this.sim2;
	}
        
        for (var i = 0; i < sim.length; i ++) {
            if (sim[i][1] == time) {
				//car id,    speed,     lane
                var car = new Car(sim[i][0], sim[i][2], sim[i][3]);
                this.controller.addCar(car);
		  //console.log("Adding car at time: " + this.curTime/20 + " seconds");
            }
        }
        
    }
    
    return tSpawner;
}