var CardDragEnd = function(event, layer) {
  console.log('CardDragEnd');

  var d = new Date();
  var duration = d.getTime() - layer.dragStartTime;

  var turnCard = false;
  if (duration < 300 && layer.isClick) {
    turnCard = true;
  }

  if (layer.animation) {
    layer.animation.stop();
  }

  var targetY = layer.dragStartY;
  var yDistance = (layer.y - layer.dragStartY);
  if (!turnCard && yDistance > layer.height * 0.4) {
    targetY = height + 100;
  }

  layer.animation = layer.animate({
    properties: {
      x: layer.dragStartX,
      y: targetY,
      rotationZ: 0,
      rotationY: turnCard ? 90 : 0
    },
    curve: "ease",
    time: turnCard ? 0.4 : 0.10
  });

  if (turnCard) {
    layer.animation.on('end', function () {
      layer.isFace = !layer.isFace;
      layer.html = layer.getCardHTML();

      return layer.animate({
        properties: {
          rotationY: 0
        },
        curve: "ease",
        time: 0.4
      });
    });
  }

  return layer.animation;
};

function CardDragMove(event, layer) {
  var xDistance = (layer.x - layer.dragStartX);
  var yDistance = (layer.y - layer.dragStartY);

  //cardRotationY = Utils.modulate(velocity.x, [-5,5], [-15,15], true)

  if (layer.animation) {
    layer.animation.stop();
  }

  //console.log('CardMove', yDistance);
  if (Math.abs(yDistance) > 5) {
    layer.isClick = false;
  }
  layer.rotationZ = Utils.modulate(yDistance, [-200,200], [-15,15], true);

  //

  /*
  layer.animation = layer.animate({properties: {
    rotationZ: 20
  }});
  */

  return layer.animation;
}

function CardFlip(event, layer) {
  var d = new Date();
  var duration = d.getTime() - layer.dragStartTime;

  if (duration < 300 && layer.isClick) {
    console.log('CardFlip', layer.isClick, duration);

    if (layer.animation) {
      layer.animation.stop();
    }

    return layer.animation = layer.animate({
      properties: {
        rotationZ: 20
      },
      curve: "ease",
      time: 0.10
    });
  }
}

function addCard(container, cardNumber) {
  var card = add(container, createLayer(width / 1.2, 320));
  card.x = (width - card.width) / 2;
  card.y = 100 * factor;
  card.originX = 0.5;
  card.originY = 0.5;
  card.backgroundColor = Utils.randomColor();

  card.isFace = true;
  card.cardNumber = cardNumber;
  card.getCardHTML = function() {
    return 'Card ' + card.cardNumber + (!card.isFace ? ' Back' : '');
  };
  card.html = card.getCardHTML();

  enableScroll(card, 1, 1);
  card.on(Events.DragStart, SaveDragStart);
  card.on(Events.DragEnd, CardDragEnd);
  card.on(Events.DragMove, CardDragMove);
  card.on(Events.Click, CardFlip);
}
var tinder = function() {
  width = 360;
  height = 640;
  factor = 1;

  var container = new Layer({
    width: width * factor,
    height: height * factor,
    backgroundColor: "#7ed6ff"
  });

  addCard(container,1);
  addCard(container,2);
  addCard(container,3);
  addCard(container,4);
  addCard(container,5);
  addCard(container,6);
};

tinder();