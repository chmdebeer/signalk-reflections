
module.exports = function (app) {
  var plugin = {};
  let _timer = null;


  plugin.id = 'signalk-reflections';
  plugin.name = 'Signal K Reflections';
  plugin.description = 'Plugin that displays and controls Reflections specific data';

  var unsubscribes = [];

  var putActionHandler = function (context, path, value, callback) {
    app.debug(`setting ${path} to ${value}`);

    sendData(path.split('.')[3]);

    if (true) { //doSomething(context, path, value)){
      return { state: 'COMPLETED', statusCode: 200 };
    } else {
      return { state: 'COMPLETED', statusCode: 400 };
    }
  };

  plugin.start = function (options, restartPlugin) {
    // Here we put our plugin logic
    let value = app.getSelfPath('uuid');
    app.debug(`Plugin started for uuid ${value}`);

    for (var b=1; b<5; b++) {
      for (var s=1; s<28; s++) {
        app.registerPutHandler('vessels.' + value, 'electrical.switches.bank.' + b + '.' + s + '.state', putActionHandler);
      }
    }
    // app.registerPutHandler('vessels.' + value, 'electrical.switches.bank.2.19.state', putActionHandler);

    let localSubscription = {
      context: '*', // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 5000 // Every 5000ms
      }]
    };

    app.subscriptionmanager.subscribe(
      localSubscription,
      unsubscribes,
      subscriptionError => {
        app.error('Error:' + subscriptionError);
      },
      delta => {
        delta.updates.forEach(u => {
          // let deltaPath = u.values[0].path;
          // if ((deltaPath == "propulsion.port.revolutions.values") && (deltaPath == "propulsion.port.revolutions.values.length" > 1)) {
          //   app.debug(u);
          // }
          if (u.values[0].path == "electrical.switches.bank.4.3.state") {
            app.debug("lock ");
            app.debug(u);
          }
        });
      }
    );

  };

  plugin.stop = function () {
    unsubscribes.forEach(f => f());
    unsubscribes = [];
    app.debug('Plugin stopped');
  };

  plugin.schema = {
    type: 'object',
    properties: {
      rate: {
        title: "Update Rate (in miliseconds)",
        type: 'number',
        default: 5000
      }
    }
  };

  function sendData(instance) {
    const dst = 255;
    const pgn = {
      pgn: 127501,
      dst: dst,
    };

    let bank = app.signalk.self.electrical.switches.bank;
    if (bank[instance] !== undefined) {
      pgn['Instance'] = parseInt(instance);
      for (var i=1; i<28; i++) {
        if (bank[instance]['' + i]) {
          pgn['Indicator' + i] = bank[instance]['' + i].state.value === 1 ? 'On' : 'Off';
        } else {
          pgn['Indicator' + i] = 'Off';
        }
      }
      // app.debug('sending %j', pgn)
      // app.debug('sending update');
      app.emit('nmea2000JsonOut', pgn)
    }
  }

  return plugin;
};
