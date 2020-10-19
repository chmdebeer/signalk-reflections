$(function() {
  console.log('init');

  var guagelookup = buildGuages();

  var request = undefined;
  var signalkClient = new SignalK.Client({
    hostname: window.location.hostname,
    port: window.location.port,
    useTLS: false,
    reconnect: true,
    autoConnect: false
  });

  signalkClient.onData = function (data) {
    console.log(data);
  };

  signalkClient.on('connect', () => {
    console.log('connected');

    signalkClient.on('delta', delta => {
      if ((delta.updates !== undefined) && (delta.updates.length > 0)) {
        delta.updates.forEach(update => {
          // console.log('sources');
          // console.log(update.source.label + '.' + update.source.src);
          update.values.forEach(value => {
            // console.log(value.path);
            $('*[data-nmea2k="' + value.path + '"]').each(function(index, element) {
              // console.log('found: ' + element.getAttribute('type'));
              switch (element.getAttribute('type')) {
                case 'checkbox':
                  element.checked = (value.value == 1);
                  break;
                case 'lcdGuage':
                case 'radialGuage':
                  if (guagelookup[element.id]) {
                    guagelookup[element.id].guage.setValue(guagelookup[element.id].scale(value.value));
                  }
                  break;
                case 'momentary':
                  if (value.value == 1) {
                    $(this).addClass('on');
                  } else {
                    $(this).removeClass('on');
                  }
                  break;
              }
            });
          });
        });
      }
    });
  });

  signalkClient
    .connect()
    .then(() => {
      signalkClient.subscribe();
    })
    .catch(err => console.log(err));

  var toggleButtonOnClick = function (event) {
    console.log(event);
    console.log(event.type);
    console.log(this.getAttribute('type'));

    var nmea2kField = this.getAttribute('data-nmea2k');
    if (!nmea2kField) {
      console.log('No nmea mapping');
      return;
    }

    var onoff = 0;

    switch (this.getAttribute('type')) {
      case 'radio':
        onoff = this.checked ? 1 : 0;
        // console.log(`checkbox: ${onoff}`);
        break;
      case 'checkbox':
        onoff = this.checked ? 1 : 0;
        // console.log(`checkbox: ${onoff}`);
        break;
      case 'momentary':
        onoff = (event.type == 'mousedown') ? 1 : 0;
        // console.log(`momentary: ${onoff}`);
        break;
    }

    if (request == undefined) {
      request = signalkClient.request('PUT');
    }

    request.body = {
      updates: [{
        values: [
          {
            path: nmea2kField,
            value: onoff
          }
        ]
      }],
      put: {
        path: nmea2kField,
        value: onoff
      }
    };

    request.once('response', response => {
      console.log('response');
      console.log(response);
    })

    request.send()

  };

  $('input[type]').on('click', toggleButtonOnClick);
  $(".momentary").on('mousedown', toggleButtonOnClick);
  $(".momentary").on('mouseup', toggleButtonOnClick);

  Reveal.initialize({
    history: true
  });


  // console.log($("#batteries").find('tbody'));
  // $("#batteries").find('tbody').append("<tr><td>blah</td></tr>");
  // updateStateFromWebSocket();
  // var joy = new JoyStick('joyDiv');
  //
  // var inputPosX = document.getElementById("posizioneX");
  // var inputPosY = document.getElementById("posizioneY");
  // var direzione = document.getElementById("direzione");
  // var x = document.getElementById("X");
  // var y = document.getElementById("Y");
  // setInterval(function(){ inputPosX.value=joy.GetPosX(); }, 50);
  // setInterval(function(){ inputPosY.value=joy.GetPosY(); }, 50);
  // setInterval(function(){ direzione.value=joy.GetDir(); }, 50);
  // setInterval(function(){ x.value=joy.GetX(); }, 50);
  // setInterval(function(){ y.value=joy.GetY(); }, 50);

});
