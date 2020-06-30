var sim = require("./simulation");

sim.initialize(2);
sim.setSpeed(1);

// set player 1 with the specified CPU brain
sim.setPlayer(0, null);
// set player 2 with the specified CPU brain
sim.setPlayer(1, null);

// normally wouldn't begin until all players have connected
sim.begin();
