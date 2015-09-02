# myojs-snap
A plugin for [Myo.js](https://github.com/thalmiclabs/myo.js) that detects when you snap!

**[See it in action here](http://thalmiclabs.github.io/myojs-snap/demo/)** <small>(requires a myo!)</small>


`snap.myo.js` will emit a `snap` event whenever you snap. It's uses the accelerometer to detect very specific reverbreations in your arm when you snap. It then filters these against your arms muscle activity to reduce false positives from your arm being bumped.

**Note:** Works best if your arm isn't resting on anything and you have a nice strong snap.

```
Myo.on('snap', function(){
	alert('you snapped!');
})
```

Check out the [demo](/demo/index.html) for an example of how to use it.


#### configuration


There's a few configuration variables you can tweak.

```
Myo.plugins.snap = {
	max : 2.8,
	min : 0.122070312,
	blip_threshold : -0.1098632808,
};
```

These numbers are largely magic, choosen from experimentation. Feel free to experiment with them to make the recognizer work better for you.

