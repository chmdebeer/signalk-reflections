function buildGuages() {

  var guageLookup = {};

  var getLCDGuage = function (text, unitString, lcdDecimals, width=120, height=50) {
    return {width: width, height: height, unitString: unitString, unitStringVisible: true, lcdDecimals: lcdDecimals, headerString: text, headerStringVisible: true};
  };

  var buildEngineGuages = function (guages, side) {
    guages['rpm-' + side + '-id'] = {
      guage: new steelseries.Radial('rpm-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        frameVisible: false,
        size: 327,
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

    guages['volt-' + side + '-id'] = {
      guage: new steelseries.Radial('volt-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        frameVisible: false,
        size: 200,
        // section: sections,
        // area: areas,
        minValue: 8,
        maxValue: 16,
        unitString: 'volt',
        thresholdVisible: true,
        threshold: 10.8,
        thresholdRising: false,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 2}),
      scale: function(value) {return value*60;}
    };

    guages['oil-pressure-' + side + '-id'] = {
      guage: new steelseries.Radial('oil-pressure-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        frameVisible: false,
        size: 200,
        // section: sections,
        // area: areas,
        minValue: 8,
        maxValue: 16,
        unitString: 'psi',
        thresholdVisible: true,
        threshold: 10.8,
        thresholdRising: false,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 2}),
      scale: function(value) {return value*60;}
    };

    guages['water-temp-' + side + '-id'] = {
      guage: new steelseries.Radial('water-temp-' + side + '-id', {
        gaugeType: steelseries.GaugeType.TYPE4,
        frameDesign: steelseries.FrameDesign.TILTED_BLACK,
        frameVisible: false,
        size: 200,
        // section: sections,
        // area: areas,
        minValue: 8,
        maxValue: 16,
        unitString: "'C",
        thresholdVisible: true,
        threshold: 10.8,
        thresholdRising: false,
        tickLabelOrientation: steelseries.TickLabelOrientation.HORIZONTAL,
        lcdVisible: true,
        lcdDecimals: 2}),
      scale: function(value) {return value-273.15;}
    };
    return guages;
  };

  guageLookup.auxiliaryBattery = {
    guage: new steelseries.DisplaySingle('auxiliaryBattery', getLCDGuage('Auxiliary Battery', 'v', 2)),
    scale: function(value) {return value;}
  };

  guageLookup.portBattery = {
    guage: new steelseries.DisplaySingle('portBattery', getLCDGuage('Battery', 'v', 2)),
    scale: function(value) {return value;}
  };
  guageLookup.starboardBattery = {
    guage: new steelseries.DisplaySingle('starboardBattery', getLCDGuage('Battery', 'v', 2)),
    scale: function(value) {return value;}
  };

  guageLookup.portRpm = {
    guage: new steelseries.DisplaySingle('portRpm', getLCDGuage('Tachometer', 'rpm', 0)),
    scale: function(value) {return value*60;}
  };
  guageLookup.starboardRpm = {
    guage: new steelseries.DisplaySingle('starboardRpm', getLCDGuage('Tachometer', 'rpm', 0)),
    scale: function(value) {return value*60;}
  };
  guageLookup.portOil = {
    guage: new steelseries.DisplaySingle('portOil', getLCDGuage('Oil Pressure','psi', 0)),
    scale: function(value) {return value*0.000145038;}
  };
  guageLookup.starboardOil = {
    guage: new steelseries.DisplaySingle('starboardOil', getLCDGuage('Oil Pressure','psi', 0)),
    scale: function(value) {return value*0.000145038;}
  };
  guageLookup.portTemp = {
    guage: new steelseries.DisplaySingle('portTemp', getLCDGuage('Temperature', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };
  guageLookup.starboardTemp = {
    guage: new steelseries.DisplaySingle('starboardTemp', getLCDGuage('Temperature', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  guageLookup.fuel = {
    guage: new steelseries.DisplaySingle('fuel', getLCDGuage('Fuel', "L", 0)),
    scale: function(value) {return value*1200;}
  };

  guageLookup.latitude = {
    guage: new steelseries.DisplaySingle('latitude', getLCDGuage('Latitude', "\xB0", 5, 210, 50)),
    scale: function(value) {return value;}
  };

  guageLookup.longitude = {
    guage: new steelseries.DisplaySingle('longitude', getLCDGuage('Longitude', "\xB0", 5, 210, 50)),
    scale: function(value) {return value;}
  };

  guageLookup.heading = {
    guage: new steelseries.DisplaySingle('heading', getLCDGuage('Heading', "rad", 6, 210, 50)),
    scale: function(value) {return value;}
  };

  guageLookup.magneticVariation = {
    guage: new steelseries.DisplaySingle('magneticVariation', getLCDGuage('Magnetic Variation', "rad", 6, 210, 50)),
    scale: function(value) {return value;}
  };

  guageLookup.speed = {
    guage: new steelseries.DisplaySingle('speed', getLCDGuage('Speed', "km/h", 0)),
    scale: function(value) {return value*3.6;}
  };

  guageLookup.pitch = {
    guage: new steelseries.DisplaySingle('pitch', getLCDGuage('Pitch', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  guageLookup.roll = {
    guage: new steelseries.DisplaySingle('roll', getLCDGuage('Roll', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  guageLookup.yaw = {
    guage: new steelseries.DisplaySingle('yaw', getLCDGuage('Yaw', "rad", 4)),
    scale: function(value) {return value*3.6;}
  };

  guageLookup.mainCabinTemperature = {
    guage: new steelseries.DisplaySingle('mainCabinTemperature', getLCDGuage('Cabin', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  guageLookup.bilgeTemperature = {
    guage: new steelseries.DisplaySingle('bilgeTemperature', getLCDGuage('Bilge', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  guageLookup.engineRoomTemperature = {
    guage: new steelseries.DisplaySingle('engineRoomTemperature', getLCDGuage('Engine Room', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  guageLookup.acVoltage = {
    guage: new steelseries.DisplaySingle('acVoltage', getLCDGuage('AC Voltage', "v", 0)),
    scale: function(value) {return value;}
  };

  guageLookup.acCurrent = {
    guage: new steelseries.DisplaySingle('acCurrent', getLCDGuage('AC Current', "amp", 0)),
    scale: function(value) {return value;}
  };

  var sections = [steelseries.Section(0, 25, 'rgba(0, 0, 220, 0.3)'),
                  steelseries.Section(25, 50, 'rgba(0, 220, 0, 0.3)'),
                  steelseries.Section(50, 75, 'rgba(220, 220, 0, 0.3)') ],

      // Define one area
      areas = [steelseries.Section(75, 100, 'rgba(220, 0, 0, 0.3)')];

  buildEngineGuages(guageLookup, 'port');
  buildEngineGuages(guageLookup, 'starboard');
  return guageLookup;

}
