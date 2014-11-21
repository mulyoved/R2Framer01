var container;
var cards = [];

var CardDragStart = function(event, layer) {
  SaveDragStart(event, layer);
  return layer.states.switch('hold');
};

var CardDragEnd = function(event, card) {
  //console.log('CardDragEnd');

  var d = new Date();
  var duration = d.getTime() - card.dragStartTime;

  var yDistance = (card.y - card.dragStartY);
  var xDistance = (card.x - card.dragStartX);
  var target;
  var source;
  var newTopCard;

  if (xDistance > 0) {
    target = 'right';
    source = 'left';
    newTopCard = cards[card.cardNumber-1];
  }
  else {
    target = 'left';
    source = 'right';
    newTopCard = cards[card.cardNumber+1];
  }

  if (Math.abs(xDistance) > card.width * 0.1 && newTopCard) {
    remvoeCard = true;
    SetDragInfo(card, false);
    card.states.switch(target);

    if (newTopCard) {
      SetZOrder(newTopCard.cardNumber, true);
      newTopCard.states.switch('top');
      SetDragInfo(newTopCard, true);
    }
  }
  else {
    SetZOrder(card.cardNumber, true);
    card.states.switch('top');
    if (newTopCard && xDistance != 0) {
      newTopCard.states.switch(source);
    }
  }
};

function CardDragMove(event, card) {
  var xDistance = (card.x - card.dragStartX);
  var yDistance = (card.y - card.dragStartY);

  if (card.animation) {
    //card.animation.stop();
  }

  if (Math.abs(xDistance) > 5) {
    card.isClick = false;
  }

  if (xDistance != 0) {

    var newTopCard = cards[card.cardNumber + (xDistance < 0 ? 1 : -1)];
    var state1;
    var state2;
    if (xDistance > 0) {
      newTopCard = cards[card.cardNumber -1];
      state1 = card.states._states.left;
      state2 = card.states._states.half_left;
    }
    else {
      newTopCard = cards[card.cardNumber + 1];
      state1 = card.states._states.right;
      state2 = card.states._states.half_right;
    }


    var lowScale = card.states._states.right.scale;
    var highScale = 1;

    var newScale = highScale - Utils.modulate(Math.abs(xDistance), [0, 164], [0, highScale - lowScale], true);
    card.scale = newScale;

    var newTopScale = Utils.modulate(Math.abs(xDistance), [0, 164], [lowScale, highScale], true);

    var newTopCard_x = 0;
    if (Math.abs(xDistance) <= 120) {
      SetZOrder(card.cardNumber, false);
      newTopCard_x = Utils.modulate(Math.abs(xDistance), [0, 120], [state1.x, state2.x], false);
    }
    else {
      if (newTopCard) {
        SetZOrder(newTopCard.cardNumber, false);
      }
      newTopCard_x = Utils.modulate(Math.abs(xDistance), [120, 164], [state2.x, card.dragStartX], false);
      if (xDistance > 0) {
        if (newTopCard_x > card.dragStartX) {
          newTopCard_x = card.dragStartX
        }
      }
      else {
        if (newTopCard_x < card.dragStartX) {
          newTopCard_x = card.dragStartX
        }
      }
    }

    if (newTopCard) {
      newTopCard.scale = newTopScale;
      newTopCard.x = newTopCard_x;
    }

    //console.log('Move', xDistance, newTopCard_x, state1, state2);
  }


  //card.scale();



  return card.animation;
}

function CardFlip(event, layer) {
  var d = new Date();
  var duration = d.getTime() - layer.dragStartTime;

  if (duration < 300 && layer.isClick) {
    console.log('CardFlip', layer.isClick, duration);

    if (layer.animation) {
      //layer.animation.stop();
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
  var title = cardNumber + '-'+channel.title;

  var top = addCard(container, cardNumber, title, true, channel);
  var bottom = addCard(container, cardNumber, title + ' Back', false, channel);

  top.flipSide = bottom;
  bottom.flipSide = top;

  bottom.states.switchInstant('flip');

  return top;
}

function SetDragInfo(card, enable) {
  enableScroll(card, enable ? 1 : 0, 0);
  card.on(Events.DragStart, CardDragStart);
  card.on(Events.DragEnd, CardDragEnd);
  card.on(Events.DragMove, CardDragMove);
  //card.on(Events.Click, CardFlip);
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

  var sideScale = 0.8;

  card.states.add({
    top: {
      x: card.x,
      y: card.y,
      shadowY: 2,
      shadowX: 2,
      shadowBlur: 28,
      shadowColor: "rgba(0, 0, 0, 0.25)",
      rotationZ: 0,
      rotationY: 0,
      scale: 1
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
    },

    left: {
      x: width/2 - card.width - 8,
      y: card.y,
      scale: sideScale,
      shadowY: 2,
      shadowX: 2,
      shadowBlur: 28,
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    left2: {
      x: width/2 - card.width - 8,
      y: card.y,
      scale: sideScale,
      shadowColor: null,
    },
    half_left: {
      x: width/2 - card.width - 8,
      y: card.y,
      scale: 1
    },

    right: {
      x: width/2 + 8,
      y: card.y,
      scale: sideScale,
      shadowY: 2,
      shadowX: 2,
      shadowBlur: 28,
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    right2: {
      x: width/2 + 8,
      y: card.y,
      scale: sideScale,
      shadowColor: null,
    },

    half_right: {
      x: width/2 + 8,
      y: card.y,
      scale: 1
    }
  });

  card.states.animationOptions = {
    curve: "ease-in",
    time: 0.15
  };
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
  descriptionLayer.html = '<p>' + card.cardNumber + '-' + channel.description + '</p>';

  return card;
}

function SetZOrder(cardIndex, includePos) {
  for (i=0; i<20; i++) {
    var card = cards[i];
    card.index = 100 - Math.abs(cardIndex - i);

    if (includePos) {
      if (i === cardIndex + 1) {
        card.states.switchInstant('right');
        //console.log('right', card.height);
      }
      if (i >= cardIndex + 2) {
        card.states.switchInstant('right2');
      }
      if (i === cardIndex - 1) {
        card.states.switchInstant('left');
      }
      if (i <= cardIndex - 2) {
        card.states.switchInstant('left2');
      }
    }
  }

}

function DumpCards() {
  for (i=0; i<20; i++) {
    var card = cards[i];
    console.log(card.cardNumber, card.x, card.name, card.states.current, card.shadowY, card.shadowColor);
  }
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
  var cardIndex = 6;
  for (var i=0; i<20; i++) {
    cards.push(add2SideCard(container,i, channelData[i]));
  }

  SetZOrder(cardIndex, true);
  for (i=0; i<20; i++) {
    var card = cards[i];
    if (i == cardIndex) {
      card.states.switchInstant('top');
      SetDragInfo(card, true);
      console.log('top', card.height);
    }
  }

  /*
  debugBtn = new Layer({
    width: 20,
    height: 20,
    backgroundColor: "blue"
  });

  debugBtn.on(Events.Click, DumpCards);
  */
};

tinder();