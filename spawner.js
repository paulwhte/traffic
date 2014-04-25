function Spawner(situation, controller)
{
    tSpawner = new Sprite(sim, 'road.png', 1500, 150, 0);
    tSpawner.curTime = 0;
    tSpawner.sim1 = [[0, 15, ONE], [1, 10, TWO], [1, 12, THREE], [1.25, 13, THREE]];
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
        }
        
        for (var i = 0; i < sim.length; i ++) {
            if (sim[i][0] == time) {
                var car = new Car(sim[i][1], sim[i][2]);
                this.controller.addCar(car);
		  //console.log("Adding car at time: " + this.curTime/20 + " seconds");
            }
        }
        
    }
    
    return tSpawner;
}