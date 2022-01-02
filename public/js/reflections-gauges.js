function buildGauges() {

  var gaugeLookup = {};

  var getLCDGauge = function (text, unitString, lcdDecimals, width=120, height=50, headerStringVisible=true) {
    return {width: width, height: height, unitString: unitString, unitStringVisible: true, lcdDecimals: lcdDecimals, headerString: text, headerStringVisible: true};
  };

  var buildEngineGauges = function (gauges, side) {
    gauges['rpm-' + side + '-id'] = {
      gauge: new steelseries.Radial('rpm-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        pointerType: steelseries.PointerType.TYPE1,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        backgroundColor: steelseries.BackgroundColor.BLACK,
        frameVisible: false,
        size: 500,
        // section: sections,
        // area: areas,
        minValue: 0,
        maxValue: 6000,
        unitString: 'RPM',
        threshold: 4500,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 0}),
      scale: function(value) {return value*60;}
    };

    gauges['volt-' + side + '-id'] = {
      gauge: new steelseries.Radial('volt-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        pointerType: steelseries.PointerType.TYPE5,
        pointerColor: steelseries.ColorDef.WHITE,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        backgroundColor: steelseries.BackgroundColor.BLACK,
        frameVisible: false,
        size: 200,
        freeAreaAngle: 180,
        rotationOffset: 90,
        // section: sections,
        // area: areas,
        minValue: 9,
        maxValue: 15,
        unitString: 'volt',
        thresholdVisible: true,
        threshold: 11.3,
        thresholdRising: false,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 1}),
      scale: function(value) {return value;}
    };

    gauges['oil-pressure-' + side + '-id'] = {
      gauge: new steelseries.Radial('oil-pressure-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        pointerType: steelseries.PointerType.TYPE5,
        pointerColor: steelseries.ColorDef.WHITE,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        backgroundColor: steelseries.BackgroundColor.BLACK,
        frameVisible: false,
        size: 200,
        // section: sections,
        // area: areas,
        minValue: 300,
        maxValue: 900,
        unitString: 'kPa',
        thresholdVisible: true,
        threshold: 450,
        thresholdRising: false,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 0}),
      scale: function(value) {return value/1000;}
    };

    gauges['water-temp-' + side + '-id'] = {
      gauge: new steelseries.Radial('water-temp-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        pointerType: steelseries.PointerType.TYPE5,
        pointerColor: steelseries.ColorDef.WHITE,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        backgroundColor: steelseries.BackgroundColor.BLACK,
        frameVisible: false,
        size: 200,
        // centerX: 100,
        // centerY: 100,
        // section: sections,
        // area: areas,
        minValue: 20,
        maxValue: 100,
        unitString: "\xB0C",
        thresholdVisible: true,
        threshold: 85,
        thresholdRising: true,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 0}),
      scale: function(value) {return value-273.15;}
    };

    gauges['fuel-flow-' + side + '-id'] = {
      gauge: new steelseries.DisplaySingle('fuel-flow-' + side + '-id', getLCDGauge('Fuel Flow', "l/h", 0)),
      scale: function(value) {return value * 3600 * 1000;}
    };


    return gauges;
  };

  gaugeLookup['fuel-id'] = {
    gauge: new steelseries.Radial('fuel-id', {
      gaugeType: steelseries.GaugeType.TYPE4,
      pointerType: steelseries.PointerType.TYPE5,
      pointerColor: steelseries.ColorDef.WHITE,
      frameDesign: steelseries.FrameDesign.TILTED_BLACK,
      backgroundColor: steelseries.BackgroundColor.BLACK,
      frameVisible: false,
      size: 200,
      // centerX: 0,
      // centerY: 100,
      // section: sections,
      // area: areas,
      minValue: 0,
      maxValue: 100,
      unitString: "Fuel",
      thresholdVisible: true,
      threshold: 10,
      thresholdRising: false,
      tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
      lcdVisible: true,
      lcdDecimals: 0}),
    scale: function(value) {return value*100;}
  };

  gaugeLookup['volt-aux-id'] = {
    gauge: new steelseries.Radial('volt-aux-id', {
      gaugeType: steelseries.GaugeType.TYPE4,
      pointerType: steelseries.PointerType.TYPE5,
      pointerColor: steelseries.ColorDef.WHITE,
      frameDesign: steelseries.FrameDesign.TILTED_BLACK,
      backgroundColor: steelseries.BackgroundColor.BLACK,
      frameVisible: false,
      size: 200,
      // section: sections,
      // area: areas,
      minValue: 9,
      maxValue: 15,
      unitString: "volt",
      thresholdVisible: true,
      threshold: 11.3,
      thresholdRising: false,
      tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
      lcdVisible: true,
      lcdDecimals: 1}),
    scale: function(value) {return value;}
  };

  // gaugeLookup.portRpm = {
  //   gauge: new steelseries.DisplaySingle('portRpm', getLCDGauge('Tachometer', 'rpm', 0)),
  //   scale: function(value) {return value*60;}
  // };
  //
  // gaugeLookup.starboardRpm = {
  //   gauge: new steelseries.DisplaySingle('starboardRpm', getLCDGauge('Tachometer', 'rpm', 0)),
  //   scale: function(value) {return value*60;}
  // };
  // gaugeLookup.portOil = {
  //   gauge: new steelseries.DisplaySingle('portOil', getLCDGauge('Oil Pressure','psi', 0)),
  //   scale: function(value) {return value*0.000145038;}
  // };
  // gaugeLookup.starboardOil = {
  //   gauge: new steelseries.DisplaySingle('starboardOil', getLCDGauge('Oil Pressure','psi', 0)),
  //   scale: function(value) {return value*0.000145038;}
  // };
  // gaugeLookup.portTemp = {
  //   gauge: new steelseries.DisplaySingle('portTemp', getLCDGauge('Temperature', "\xB0C", 0)),
  //   scale: function(value) {return value-273.15;}
  // };
  // gaugeLookup.starboardTemp = {
  //   gauge: new steelseries.DisplaySingle('starboardTemp', getLCDGauge('Temperature', "\xB0C", 0)),
  //   scale: function(value) {return value-273.15;}
  // };

  gaugeLookup.latitude = {
    gauge: new steelseries.DisplaySingle('latitude', getLCDGauge('Latitude', "\xB0", 5, 210, 50)),
    scale: function(value) {return value;}
  };

  gaugeLookup.longitude = {
    gauge: new steelseries.DisplaySingle('longitude', getLCDGauge('Longitude', "\xB0", 5, 210, 50)),
    scale: function(value) {return value;}
  };

  gaugeLookup.heading = {
    gauge: new steelseries.DisplaySingle('heading', getLCDGauge('Heading', "rad", 6, 210, 50)),
    scale: function(value) {return value;}
  };

  gaugeLookup.magneticVariation = {
    gauge: new steelseries.DisplaySingle('magneticVariation', getLCDGauge('Magnetic Variation', "rad", 6, 210, 50)),
    scale: function(value) {return value;}
  };

  gaugeLookup.speed = {
    gauge: new steelseries.DisplaySingle('speed', getLCDGauge('Speed', "km/h", 0)),
    scale: function(value) {return value*3.6;}
  };

  gaugeLookup.pitch = {
    gauge: new steelseries.DisplaySingle('pitch', getLCDGauge('Pitch', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  gaugeLookup.roll = {
    gauge: new steelseries.DisplaySingle('roll', getLCDGauge('Roll', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  gaugeLookup.yaw = {
    gauge: new steelseries.DisplaySingle('yaw', getLCDGauge('Yaw', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  gaugeLookup.mainCabinTemperature = {
    gauge: new steelseries.DisplaySingle('mainCabinTemperature', getLCDGauge('Cabin', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  gaugeLookup.bilgeTemperature = {
    gauge: new steelseries.DisplaySingle('bilgeTemperature', getLCDGauge('Bilge', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  gaugeLookup.engineRoomTemperature = {
    gauge: new steelseries.DisplaySingle('engineRoomTemperature', getLCDGauge('Engine Room', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  gaugeLookup.acVoltage = {
    gauge: new steelseries.DisplaySingle('acVoltage', getLCDGauge('AC Voltage', "v", 0)),
    scale: function(value) {return value;}
  };

  gaugeLookup.acCurrent = {
    gauge: new steelseries.DisplaySingle('acCurrent', getLCDGauge('AC Current', "amp", 0)),
    scale: function(value) {return value;}
  };

  gaugeLookup.trimPort = {
    gauge: new steelseries.DisplaySingle('trimPort', getLCDGauge('', "deg", 1, 70, 30, false)),
    scale: function(value) {return value/10.0;}
  };
  gaugeLookup.trimStarboard = {
    gauge: new steelseries.DisplaySingle('trimStarboard', getLCDGauge('', "deg", 1, 70, 30, false)),
    scale: function(value) {return value/10.0;}
  };

  gaugeLookup.powerTrimPort = {
    gauge: new steelseries.DisplaySingle('powerTrimPort', getLCDGauge('', "deg", 0, 70, 30, false)),
    scale: function(value) {return value*100;}
  };
  gaugeLookup.powerTrimStarboard = {
    gauge: new steelseries.DisplaySingle('powerTrimStarboard', getLCDGauge('', "deg", 0, 70, 30, false)),
    scale: function(value) {return value*150;}
  };

  // gaugeLookup.steeringAngle = {
  //   gauge: new steelseries.DisplaySingle('steeringAngle', getLCDGauge('', "deg", 0, 70, 30, false)),
  //   scale: function(value) {return ((value / 3.14) * 180);}
  // };
  gaugeLookup['steeringAngle'] = {
    gauge: new steelseries.HalfRadial('steeringAngle', {
      gaugeType: steelseries.GaugeType.TYPE4,
      pointerType: steelseries.PointerType.TYPE10,
      pointerColor: steelseries.ColorDef.WHITE,
      frameDesign: steelseries.FrameDesign.TILTED_BLACK,
      backgroundColor: steelseries.BackgroundColor.BLACK,
      frameVisible: false,
      size: 200,
      // centerX: 100,
      // centerY: 200,
      // section: sections,
      // area: areas,
      minValue: -45,
      maxValue: 45,
      unitString: "deg",
      lcdVisible: false,
      thresholdVisible: false,
      threshold: -90,
      thresholdRising: false,
      tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
      lcdVisible: true,
      lcdDecimals: 0}),
    scale: function(value) {return ((value / 3.14) * -180);}
  };

  var sections = [steelseries.Section(0, 25, 'rgba(0, 0, 220, 0.3)'),
                  steelseries.Section(25, 50, 'rgba(0, 220, 0, 0.3)'),
                  steelseries.Section(50, 75, 'rgba(220, 220, 0, 0.3)') ],

      // Define one area
      areas = [steelseries.Section(75, 100, 'rgba(220, 0, 0, 0.3)')];

  buildEngineGauges(gaugeLookup, 'port');
  buildEngineGauges(gaugeLookup, 'starboard');

  return gaugeLookup;

}
