var container;

var CardDragStart = function(event, layer) {
  SaveDragStart(event, layer);
  return layer.states.switch('hold');
};

var CardDragEnd = function(event, layer) {
  console.log('CardDragEnd');


  var layers = container.subLayers;
  var nextCard = null;
  for (var i =0; i<layers.length; i++) {
    //console.log('SubLayer', layers[i].name, layers[i].visible);
    if (layers[i] === layer) {
      break;
    }

    if (layers[i].visible) {
      nextCard = layers[i];
    }
  }


  var d = new Date();
  var duration = d.getTime() - layer.dragStartTime;

  var turnCard = false;
  if (duration < 300 && layer.isClick) {
    turnCard = true;
  }

  if (layer.animation) {
    layer.animation.stop();
  }

  var target = 'top';
  var yDistance = (layer.y - layer.dragStartY);
  var remvoeCard = false;
  if (!turnCard && yDistance > layer.height * 0.4) {
    remvoeCard = true;
    target = 'remove';

    if (nextCard) {
      console.log('set nextCard to top', nextCard.name);
      //nextCard.states.switch('top');
      nextCard.states.switchInstant('top');
    }
  }
  if (turnCard) {
    layer.animation = layer.animate({
      properties: {
        rotationY: 90,
        shadowY: 56,
        shadowX: 456,
        shadowBlur: 128,
        shadowColor: "rgba(0, 0, 0, 0.25)"
      },
      curve: 'ease',
      time: 0.3
    });
  }
  else {
    layer.states.switch(target);
  }


  //var ret = layer.states.switch(target);
  //console.log(ret, layer.animation, turnCard);

  /*
  if (!turnCard) {
  }
  else {
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
  }
  */

  if (turnCard) {
    layer.animation.on('end', function () {
      console.log('Turn Card Animation end');
      layer.visible = false;
      layer.flipSide.visible = true;

      layer.flipSide.states.animationOptions = {
        time: 0.3,
      };


      layer.flipSide.states.switch('top');
    });
  }

  return layer.flipSide;
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

function add2SideCard(container, cardNumber, channel) {
  var title = channel.title;

  var top = addCard(container, cardNumber, title, true, channel);
  var bottom = addCard(container, cardNumber, title + ' Back', false, channel);

  top.flipSide = bottom;
  bottom.flipSide = top;

  bottom.states.switchInstant('flip');

  return top;
}

function addCard(container, cardNumber, text, isFace, channel) {
  var card = add(container, createLayer(width / 1.2, 320));
  card.x = (width - card.width) / 2;
  card.y = 100 * factor;
  card.originX = 0.5;
  card.originY = 0.5;
  card.backgroundColor = "#fff";
  card.borderRadius = "6px";
  card.name = text;
  //card.backgroundColor = Utils.randomColor();

  card.visible = isFace;
  card.isFace = isFace;
  card.cardNumber = cardNumber;
  //card.html = text;
  card.style.border = "1px solid rgba(0,0,0,0.2)";


  card.states.add({
    top: {
      x: card.x,
      y: card.y,
      shadowY: 2,
      shadowX: 2,
      shadowBlur: 28,
      shadowColor: "rgba(0, 0, 0, 0.25)",
      rotationZ: 0,
      rotationY: 0
    },

    hold: {
      shadowY: 26,
      shadowX: 26,
      shadowBlur: 28,
      shadowColor: "rgba(0, 0, 0, 0.25)"
    },

    remove: {
      y: height + 100
    },

    flip: {
      rotationY: 90,
      shadowY: 56,
      shadowX: 456,
      shadowBlur: 128,
      shadowColor: "rgba(0, 0, 0, 0.25)"
    }
  });

  card.states.animationOptions = {
    curve: "ease-in",
    time: 0.15
  };

  enableScroll(card, 1, 1);
  card.on(Events.DragStart, CardDragStart);
  card.on(Events.DragEnd, CardDragEnd);
  card.on(Events.DragMove, CardDragMove);
  card.on(Events.Click, CardFlip);

  var bannerWidth = card.width - 16;
  var bannerHeigth = bannerWidth * 175 / 640
  var banner = new Layer({
    superLayer: card,
    image: channel.mobile_image,
    x: 7,
    y: 7,
    width: bannerWidth,
    height: bannerHeigth
  });
  var icon = new Layer({
    superLayer: card,
    image: channel.thumbnails,
    x: 7,
    y: bannerHeigth + 14,
    width: 44,
    height: 44
  });
  var nameLayer = new Layer({
    superLayer: card,
    x: 44 + 14,
    y: bannerHeigth + 14,
    width: bannerWidth - 44 - 7,
    height: 44,
    backgroundColor: "#fff"
  });
  var descriptionLayer = new Layer({
    superLayer: card,
    x: 7,
    y: nameLayer.maxY + 7,
    width: bannerWidth,
    height: card.height - nameLayer.maxY - 16,
    backgroundColor: "#fff"
  });

  nameLayer.html = '<h4>' + channel.title + '</h4>';
  descriptionLayer.html = '<p>' + channel.description + '</p>';

  return card;
}
var tinder = function() {
  width = 360;
  height = 640;
  factor = 1;

  container = new Layer({
    width: width * factor,
    height: height * factor,
    backgroundColor: "#7ed6ff"
  });

  container.perspective = 100;

  var top;
  for (var i=0; i<6; i++) {
    top = add2SideCard(container,i+1, channelData[i]);
  }

  top.states.switchInstant('top');
};

tinder();