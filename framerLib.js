var width = 244;
var height = 681;
var factor = 360 / 244;
var topRowHeight = Math.round(121 * factor);
var y = 0;
var x = 0;

function resetXY() {
  x = 0;
  y = 0;
}

function createLayer(width, height, image) {
  layer = new Layer({
    originX: 0,
    originY: 0,
    width: Math.round(width * factor),
    height: Math.round(height * factor)
  });

  if (image) {
    layer.image ='images/' + image + '.png';
  }

  return layer;
}
function add(container, layer) {
  layer.superLayer = container;

  var y;
  if (container._y) {
    y = container._y;
  }
  else {
    y = 0;
  }

  layer.x = 0;
  layer.y = y;
  container._y = y + layer.height;
  //container.height = container._y;

  return layer;
}

function addH(container, layer) {
  layer.superLayer = container;
  var x;
  if (container._x) {
    x = container._x;
  }
  else {
    x = 0;
  }
  layer.x = x;
  layer.y = 0;

  container._x = x + layer.width;
  container.width = container._x;
  //console.log('addH', container._x, x, layer.width);

  return layer;
}

function enableScroll(layer, x, y) {
  layer.draggable.enabled = true;
  layer.draggable.speedX = x;
  layer.draggable.speedY = y;
}

function SaveDragStart(event, layer) {
  layer.dragStartY = layer.y;
  layer.dragStartX = layer.x;
  layer.isClick = true;
  var d = new Date();
  layer.dragStartTime = d.getTime();
  console.log('SaveDragStart');
}

