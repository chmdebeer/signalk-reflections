$(function() {
  console.log('init');

  var guagelookup = buildGuages();


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
    console.log(data);
  };

  signalkClient.on('connect', () => {
    console.log('connected');

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
      if ((delta.updates !== undefined) && (delta.updates.length > 0)) {
        delta.updates.forEach(update => {
          // console.log('sources');
          // console.log(update.source.label + '.' + update.source.src);
          update.values.forEach(value => {
//             console.log(value.path);
            $('*[data-nmea2k="' + value.path + '"]').each(function(index, element) {
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
                case 'lcdGuage':
                case 'radialGuage':
                  if (guagelookup[element.id]) {
                    guagelookup[element.id].guage.setValue(guagelookup[element.id].scale(newValue));
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
