(function(){
	Myo.plugins = Myo.plugins || {};

	if(!Myo.plugins.flex) throw 'snap.myo.js requires flex.myo.js';

	Myo.plugins.snap = {
		max : 2.8,
		min : 0.122070312,
		blip_threshold : -0.1098632808,
	};

	var fillArray = function(size, item){
		return Array.apply(null, Array(size)).map(function(){return item});
	}

	var snapHistory = fillArray(20, {x:0,y:0,z:0});
	Myo.on('accelerometer', function(data){
		var blips = {x:0,y:0,z:0};
		var max = {x:data.x,y:data.y,z:data.z};
		var min = {x:data.x,y:data.y,z:data.z};

		// update snapHistory
		snapHistory.push(data);
		snapHistory = snapHistory.slice(1);


		//Analyze the last bit of accelerometer history for blips on each axis
		for(var i = 1; i < snapHistory.length -1; i++){
			var prev = snapHistory[i+1];
			var current = snapHistory[i];
			var next = snapHistory[i-1];

			['x', 'y', 'z'].forEach(function(axis){
				if((current[axis] - prev[axis]) * (next[axis] - current[axis]) < Myo.plugins.snap.blip_threshold){
					blips[axis]++;
				}
				if(current[axis] > max[axis]) max[axis] = current[axis];
				if(current[axis] < min[axis]) min[axis] = current[axis];
			});
		}

		//Snapping creates certain 'blips' with reverberations on each axis. Checking them here.
		var hasBlip = (blips.x > 0 && blips.y > 2) || (blips.x+blips.y+blips.z > 4);

		//All peaks must be with the thresholds
		var withinThresholds = ['x', 'y', 'z'].reduce(function(r, axis){
			var peakDiff = max[axis] - min[axis];
			return r && peakDiff >= Myo.plugins.snap.min && peakDiff <= Myo.plugins.snap.max;
		}, true);

		if(hasBlip && withinThresholds && this.isArmFlexed){
			this.trigger('snap');
			snapHistory = fillArray(20, {x:0,y:0,z:0});
		}
	});
}());