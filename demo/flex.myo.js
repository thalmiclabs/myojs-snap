(function(){
	Myo.plugins = Myo.plugins || {};

	Myo.plugins.flex = {
		threshold     : 0.25, //What flex strength we considered to be 'flexed'
		timeout       : 150, //Milliseconds after flexing that we send the event
		emgResolution : 10   //How many EMG datasets we use to smooth the data
	};

	Myo.on('connected', function(){
		this.streamEMG(true);
	});

	//Emits a useful number between 0 and 1 that represents how flexed the arm is
	var emgHistory = Array.apply(null, Array(Myo.plugins.flex.emgResolution)).map(function(){return [0,0,0,0,0,0,0,0]});
	Myo.on('emg', function(pods){
		emgHistory = emgHistory.slice(1);
		emgHistory.push(pods);

		//Find the max values for each pod over the recorded history
		var maxPodValues = emgHistory.reduce(function(r, data){
			return data.map(function(podData, index){
				podData = Math.abs(podData);
				return (podData > r[index]) ? podData : r[index]
			});
		},[0,0,0,0,0,0,0,0]);

		//Find the average and then convert to between 0 and 1
		var podAvg = maxPodValues.reduce(function(r,d){
			return r + d;
		}, 0)/(8 * 128);

		this.trigger('flex_strength', podAvg);
	});

	//Sets a boolean and emits events when the arm becomes flexed. Uses a timeout to smooth the data a bit
	var flexTimer;
	Myo.on('flex_strength', function(val){
		var myo = this;
		if(val > Myo.plugins.flex.threshold && !myo.isArmFlexed){
			myo.isArmFlexed = true;
			myo.trigger('arm_flex');
			clearTimeout(flexTimer);
			flexTimer = null;
		}else if(val < Myo.plugins.flex.threshold && myo.isArmFlexed && !flexTimer){
			flexTimer = setTimeout(function(){
				myo.isArmFlexed = false;
				myo.trigger('arm_unflex');
				flexTimer = null;
			}, Myo.plugins.flex.timeout);
		}
	});
}());