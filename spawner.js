function Spawner(situation)
{
    tSpawner = new Sprite(sim, 'road.png', 1500, 150, 0);
    tSpawner.curTime = 0;
    tSpawner.sim1 = [[]];
    tSpawner.situation = situation;
    
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
    
    tSpawner.spawn = function () {
        var time = this.curTime / 20;
        var sim = [];
        if (situation == 1) {
           sim = this.sim1;
        }
        
        for (var i = 0; i < sim.length; i ++) {
            if (sim[i][0] == time) {
                var car = new Car(sim[i][1], sim[i][2]);
                controller.addCar(car);
            }
        }
        
    }
    
    return tSpawner;
}