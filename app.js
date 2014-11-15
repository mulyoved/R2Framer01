// Welcome to Framer

// This is just demo code. Feel free to delete it all.


var topRow = [];
var ct = [];
var cb = [];

function HDragEnd(event, layer) {
	//console.log('DragEnd', event, layer, layer.x);
	var x = layer.x;
	var r = Math.round(122 * factor);
	x = Math.round(x / r) * r;
	if (x > 0) {
		x = 0;
	}

	//console.log('DragEnd', layer.x, x, r);

	/* Snap back to origin */
	var animation;
	return animation = layer.animate({
		properties: {
			x: x,
			y: layer.y
		},
		curve: "spring",
		curveOptions: {
			friction: 20,
			tension: 400,
			velocity: 20
		}
	});
}

function VDragEnd(event, layer) {
	//console.log('DragEnd', event, layer, layer.x);
	var y = layer.y;
	var r = Math.round(50 * factor);
	y = Math.round(y / r) * r;
	if (y > 0) {
		y = 0;
	}

	//console.log('DragEnd', layer.x, x, r);

	/* Snap back to origin */
	var animation;
	return animation = layer.animate({
		properties: {
			x: layer.x,
			y: y
		},
		curve: "spring",
		curveOptions: {
			friction: 20,
			tension: 400,
			velocity: 20
		}
	});
}

function RowDragEnd(event, layer) {
	bottomContent._scrollView.draggable.enabled = true;

	console.log('DragEnd', event, layer, layer.x);
	var x = layer.x;

	var r = Math.round(100 * factor);
	x = Math.round(x / r) * r;

	var animation;
	return animation = layer.animate({
		properties: {
			x: x,
			y: layer.y
		},
		curve: "ease",
		time: 0.10
	});
}

var container = new Layer({
	width: width * factor,
	height: height * factor,
	backgroundColor: "#7ed6ff"
});

topRow[0] = add(container, createLayer(width, 121));
enableScroll(topRow[0], 1, 0);
topRow[0].on(Events.DragEnd, HDragEnd);


topRow[1] = add(container, createLayer(width, 121));
enableScroll(topRow[1], 1, 0);
topRow[1].on(Events.DragEnd, HDragEnd);


bottomContent = add(container, createLayer(width, 681 * 2/factor));
bottomContent._scrollView = add(bottomContent, createLayer(width, height - 121 * 2));
enableScroll(bottomContent._scrollView, 0, 1);
bottomContent._scrollView.on(Events.DragEnd, VDragEnd);


for (i = 0; i < 6; i++) {
	addH(topRow[0], createLayer(244, 121, 'ct' + (1 + (i % 3))));
}

for (i = 0; i < 6; i++) {
	addH(topRow[1], createLayer(244, 121, 'ct' + (1 + ((i+1) % 2))));
}
for (i = 0; i < 28; i++) {
	var row =new Layer({
		width: width,
		height: 50 * factor,
		x: 0,
		y: 0,
		originX: 0,
		originY: 0
	});

	addH(row, createLayer(100, 50, 'shareicons'));
	addH(row, createLayer(244, 50, 'cb' + (i % 3 + 1)));

	add(bottomContent._scrollView, row);
	bottomContent._scrollView.on(Events.DragStart, SaveDragStart);

	bottomContent._scrollView.x = -100 * factor;

	enableScroll(row, 1, 0);
	row.draggable.maxDragFrame = {
		x: 0,
		y: 0,
		//height: 50 * factor,
		width: row.width + (100) * factor
	};

	row.on(Events.DragMove, HDragMove);
	row.on(Events.DragEnd, RowDragEnd);
	row.on(Events.DragStart, SaveDragStart);
}

function HDragMove(event, layer) {
	var distance = (layer.x - layer.dragStartX);
	var vDistance = (bottomContent._scrollView.x - bottomContent._scrollView.dragStartX);
	console.log('DragMove', layer.x, distance, vDistance, bottomContent._scrollView.x, bottomContent._scrollView.dragStartX);
	if (distance > 5 && distance > vDistance) {
		bottomContent._scrollView.draggable.enabled = false;
		bottomContent._scrollView.y = 0;
	}
}

// Define a set of states with names (the original state is 'default')

//print('version 0.0.3', factor);