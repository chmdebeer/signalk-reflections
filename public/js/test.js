var knob = $('.knob');
var angle = 0;
var minangle = 0;
var maxangle = 270;

console.log('knob');
console.log(knob);

function moveKnob(direction) {

  if(direction == 'up') {
    if((angle + 2) <= maxangle) {
      angle = angle + 2;
      setAngle();
    }
  }

  else if(direction == 'down') {
    if((angle - 2) >= minangle) {
      angle = angle - 2;
      setAngle();
    }
  }

}

function setAngle() {

  // rotate knob
  knob.css({
    '-moz-transform':'rotate('+angle+'deg)',
    '-webkit-transform':'rotate('+angle+'deg)',
    '-o-transform':'rotate('+angle+'deg)',
    '-ms-transform':'rotate('+angle+'deg)',
    'transform':'rotate('+angle+'deg)'
  });

  // highlight ticks
  var activeTicks = (Math.round(angle / 10) + 1);
  $('.tick').removeClass('activetick');
  $('.tick').slice(0,activeTicks).addClass('activetick');

  // update % value in text
  var pc = Math.round((angle/270)*100);
  $('.current-value').text(pc+'%');

}

// mousewheel event - firefox
knob.bind('DOMMouseScroll', function(e){
  if(e.originalEvent.detail > 0) {
    moveKnob('down');
  } else {
    moveKnob('up');
  }
  return false;
});

// mousewheel event - ie, safari, opera
knob.bind('mousewheel', function(e){
  if(e.originalEvent.wheelDelta < 0) {
    moveKnob('down');
  } else {
    moveKnob('up');
  }
  return false;
});

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      moveKnob('down');
      // Do something for "down arrow" key press.
      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      moveKnob('up');
      // Do something for "up arrow" key press.
      break;
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
