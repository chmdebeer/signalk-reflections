$(function() {
  console.log('init');

  var musicplayer = document.getElementById("music-player");

  if (musicplayer) {
    musicplayer.setAttribute("data-background-iframe", window.location.protocol + "//" + window.location.hostname + ":8181");
  }

  var gaugelookup = buildGauges();


function propertiesToArray(obj) {
  const isObject = val =>
    typeof val === 'object' && !Array.isArray(val);

  const addDelimiter = (a, b) =>
    a ? `${a}.${b}` : b;

  const paths = (obj = {}, head = '') => {
    return Object.entries(obj)
      .reduce((product, [key, value]) =>
        {
          let fullPath = addDelimiter(head, key)
          return isObject(value) ?
              product.concat(paths(value, fullPath))
          : product.concat(fullPath + '=' + value)
        }, []);
  }

  return paths(obj);
}

  var request = undefined;
  var signalkClient = new SignalK.Client({
    hostname: window.location.hostname,
    port: window.location.port,
    useTLS: false,
    reconnect: true,
    autoConnect: false
  });

  signalkClient.onData = function (data) {
    // console.log(data);
  };

  signalkClient.on('connect', () => {
    console.log('connected');
    var pathCache = {};

    let fuelUsed = {
      port: 0,
      starboard: 0
    };
    let fuelEconomy = {
      rate: {
        port: 0,
        starboard: 0
      },
      speed: 0
    }

    signalkClient
      .API() // create REST API client
      .then((api) => api.self())
      .then((selfResult) => {
        let results = propertiesToArray(selfResult);
        for (let i=0; i<results.length; i++) {

          let field = results[i];
          let fields = field.split('.');
          //if (fields.indexOf('value') > -1) {
    //        console.log(results[i] + ' ' + fields.indexOf('value'));
          //}
        }
        // Do something with boat data
      })

    signalkClient.on('delta', delta => {
      let now = new Date();
      now = now.getTime();

      var updateElement = function (element, value) {
        let newValue = value.value;
        if (element.getAttribute('field-nmea2k')) {
          newValue = newValue[element.getAttribute('field-nmea2k')];
         // console.log(newValue);
        }
   //     console.log('===' + propertiesToArray(value));
        switch (element.getAttribute('type')) {
          case 'checkbox':
            element.checked = (newValue == 1);
            break;
          case 'label':
            if (newValue == 0) {
              element.innerHTML = "";
            } else {
              element.innerHTML = "&nbsp;" + newValue + " &nbsp;";
            }
            break;
          case 'compass':
          case 'lcdGauge':
          case 'odoGauge':
          case 'radialGauge':
            if (gaugelookup[element.id]) {
              gaugelookup[element.id].gauge.setValue(gaugelookup[element.id].scale(newValue));
            }
            break;
          case 'momentary':
            if (newValue == 1) {
              $(this).addClass('on');
            } else {
              $(this).removeClass('on');
            }
            break;
        }
      }

      var cacheAndUpdate = function (value) {
        if (pathCache[value.path]) {
          if (pathCache[value.path].elements.length == 0) {
            // console.log('Skipping ' + value.path);
          } else {
            if ((now - pathCache[value.path].update) < 500) {
              // console.log('Skipping ' + value.path);
            } else {
              pathCache[value.path].update = now;
              pathCache[value.path].value = value;
              pathCache[value.path].elements.forEach(element => {
                // console.log('Cache ' + value.path);
                updateElement(element, value);
              });
            }
          }
        } else {
          // console.log('New Node ' + value.path);
          pathCache[value.path] = {
            elements: [],
            value: value,
            update: now
          }
          $('*[data-nmea2k="' + value.path + '"]').each(function(index, element) {
            pathCache[value.path].elements.push(element);
            updateElement(element, value);
          });
        }
      }


      if ((delta.updates !== undefined) && (delta.updates.length > 0)) {
        delta.updates.forEach(update => {
          // console.log('sources');
          // console.log(update.source.label + '.' + update.source.src);
          update.values.forEach(value => {
            if ((value.path == 'propulsion.port.trip.fuelUsed') || (value.path == 'propulsion.starboard.trip.fuelUsed')) {
              fuelUsed[value.path.split('.')[1]] = value.value;
              value.path = 'propulsion.trip.fuelUsed';
              value.value = fuelUsed.port + fuelUsed.starboard;
            }

            if ((value.path == 'propulsion.port.fuel.rate') || (value.path == 'propulsion.starboard.fuel.rate')) {
              fuelEconomy.rate[value.path.split('.')[1]] = value.value;
            }
            if (value.path == 'navigation.speedOverGround') {
              fuelEconomy.speed = value.value;
              if ((fuelEconomy.rate.port + fuelEconomy.rate.starboard) > 0) {
                let economy = {
                  path: 'propulsion.fuel.economy',
                  value: (fuelEconomy.speed * 3.6) / ((fuelEconomy.rate.port + fuelEconomy.rate.starboard) * 3600 * 1000)
                }
                cacheAndUpdate(economy);
              } 
            }

            cacheAndUpdate(value);
          });
        });
      }
    });
  });

  signalkClient
    .connect()
    .then(() => {
      signalkClient.subscribe({
        context: '*', // Get data for all contexts
        subscribe: [{
          path: '*', // Get all paths
          policy: 'instant'
          // period: 5000 // Every 5000ms
        }]
      });
    })
    .catch(err => console.log(err));

  var toggleButtonOnClick = function (event) {
    // console.log(event);
    // console.log(event.type);
    // console.log(this.getAttribute('type'));

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
        onoff = ((event.type == 'mousedown') || (event.type == 'touchstart')) ? 1 : 0;
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

  var resetButtonOnClick = function (event) {
    // console.log(event);
    // console.log(event.type);
    // console.log(this.getAttribute('type'));

    console.log('Reset request');

    if ((event.type == 'mousedown') || (event.type == 'touchstart')) {
      if (request == undefined) {
        request = signalkClient.request('PUT');
      }

      request.body = {
        updates: [{
          values: [
            {
              path: 'propulsion.port.trip.fuelUsed',
              value: 0
            },
            {
              path: 'propulsion.starboard.trip.fuelUsed',
              value: 0
            }
          ]
        }],
        put: {
          path: 'propulsion.port.trip.fuelUsed',
          value: 0
        }
      };

      console.log('Sending Reset');
      request.once('response', response => {
        console.log('response');
        console.log(response);
      })

      request.send()
    }

  };

  $('input[type]').on('click', toggleButtonOnClick);
  $(".momentary").on('mousedown', toggleButtonOnClick);
  $(".momentary").on('mouseup', toggleButtonOnClick);
  $(".momentary").on("touchstart", toggleButtonOnClick);
  $(".momentary").on("touchend", toggleButtonOnClick);

  $("#reset-fuel").on('mousedown', resetButtonOnClick);
  $("#reset-fuel").on('mouseup', resetButtonOnClick);
  $("#reset-fuel").on("touchstart", resetButtonOnClick);
  $("#reset-fuel").on("touchend", resetButtonOnClick);

  Reveal.initialize({
    history: true
  });

  function showTime(){
      var date = new Date();
      var h = date.getHours(); // 0 - 23
      var m = date.getMinutes(); // 0 - 59
      var s = date.getSeconds(); // 0 - 59
      var session = "AM";

      if(h == 0){
          h = 12;
      }

      if(h > 12){
          h = h - 12;
          session = "PM";
      }

      // h = (h < 10) ? "0" + h : h;
      m = (m < 10) ? "0" + m : m;
      s = (s < 10) ? "0" + s : s;

      var time = h + ":" + m + " " + session;
      // var time = h + ":" + m + ":" + s + " " + session;
      document.getElementById("MyClockDisplay").innerText = time;
      document.getElementById("MyClockDisplay").textContent = time;

      setTimeout(showTime, 15000);

  }

  showTime();
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
