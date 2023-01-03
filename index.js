module.exports = function (app) {
  var plugin = {};
  let _timer = null;
  let thrusterPgn = {
    pgn: 128006,
    dst: 255,
    SID: 11,
    Instance: 11
  };
  thrusterPgn['Power Enabled'] = 'Off';
  thrusterPgn['Direction Control'] = 'Off'


  plugin.id = 'signalk-reflections';
  plugin.name = 'Signal K Reflections';
  plugin.description = 'Plugin that displays and controls Reflections specific data';

  var unsubscribes = [];

  var putActionHandler = function (context, path, value, callback) {
    app.debug(`setting ${path} to ${value}`);

    if (path.indexOf('steering.thruster') > -1) {
      sendThrusterData(path, value);
    } else {
      sendSwitchesData(path.split('.')[3]);
    }

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

    for (var b=1; b<11; b++) {
      for (var s=1; s<28; s++) {
        app.registerPutHandler('vessels.' + value, 'electrical.switches.bank.' + b + '.' + s + '.state', putActionHandler);
      }
    }
    app.registerPutHandler('vessels.' + value, 'steering.thruster.bow.directionControl', putActionHandler);
    app.registerPutHandler('vessels.' + value, 'steering.thruster.bow.powerEnabled', putActionHandler);

    let localSubscription = {
      context: '*', // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 1000 // Every 5000ms
      }]
    };


    // app.streambundle
    //   .getSelfBus('propulsion.port.revolutions')
    //   .forEach(pos => app.debug(pos));

    // app.registerDeltaInputHandler((delta, next) => {
    //   delta.updates.forEach(update => {
    //     update.values.forEach(pathValue => {
    //       if (pathValue.path.startsWith("propulsion.port.revolutions")) {
    //         app.debug(pathValue);
    //       }
    //     })
    //   })
    //   next(delta)
    // })


    // app.subscriptionmanager.subscribe(
    //   localSubscription,
    //   unsubscribes,
    //   subscriptionError => {
    //     app.error('Error:' + subscriptionError);
    //   },
    //   delta => {
    //     delta.updates.forEach(u => {
    //       app.debug(u.source.pgn);
    //       if (u.values[0].path == "propulsion.port.revolutions") {
    //         // app.debug();
    //         app.debug((u.values[0].value*60) + " " + u.timestamp);
    //       }
    //     });
    //   }
    // );

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

  function sendSwitchesData(instance) {
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

  function sendThrusterData(path, value) {
    if (path == 'steering.thruster.bow.powerEnabled') {
      thrusterPgn['Power Enabled'] = value == 1 ? 'On' : 'Off';
    } else if (path == 'steering.thruster.bow.directionControl') {
      if (thrusterPgn['Power Enabled'] == 'On') {
        switch (value) {
          case 0: thrusterPgn['Direction Control'] = 'Off'; break;
          case 2: thrusterPgn['Direction Control'] = 'To Port'; break;
          case 3: thrusterPgn['Direction Control'] = 'To Starboard'; break;
        }
      } else {
        thrusterPgn['Direction Control'] = 'Off';
      }
    }
    

    // app.debug('sending %j', thrusterPgn)
    // app.debug('sending update');
    app.emit('nmea2000JsonOut', thrusterPgn)
  }

  return plugin;
};