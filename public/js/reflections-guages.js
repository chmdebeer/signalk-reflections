function buildGuages() {

  var guageLookup = {};

  var getBatteryGuage = function (text, unitString, lcdDecimals) {
    return {width: 120, height: 50, unitString: unitString, unitStringVisible: true, lcdDecimals: lcdDecimals, headerString: text, headerStringVisible: true};
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
    guage: new steelseries.DisplaySingle('auxiliaryBattery', getBatteryGuage('Auxiliary Battery', 'v', 2)),
    scale: function(value) {return value;}
  };

  guageLookup.portBattery = {
    guage: new steelseries.DisplaySingle('portBattery', getBatteryGuage('Battery', 'v', 2)),
    scale: function(value) {return value;}
  };
  guageLookup.starboardBattery = {
    guage: new steelseries.DisplaySingle('starboardBattery', getBatteryGuage('Battery', 'v', 2)),
    scale: function(value) {return value;}
  };

  guageLookup.portRpm = {
    guage: new steelseries.DisplaySingle('portRpm', getBatteryGuage('Tachometer', 'rpm', 0)),
    scale: function(value) {return value*60;}
  };
  guageLookup.starboardRpm = {
    guage: new steelseries.DisplaySingle('starboardRpm', getBatteryGuage('Tachometer', 'rpm', 0)),
    scale: function(value) {return value*60;}
  };
  guageLookup.portOil = {
    guage: new steelseries.DisplaySingle('portOil', getBatteryGuage('Oil Pressure','psi', 0)),
    scale: function(value) {return value*0.000145038;}
  };
  guageLookup.starboardOil = {
    guage: new steelseries.DisplaySingle('starboardOil', getBatteryGuage('Oil Pressure','psi', 0)),
    scale: function(value) {return value*0.000145038;}
  };
  guageLookup.portTemp = {
    guage: new steelseries.DisplaySingle('portTemp', getBatteryGuage('Temperature', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };
  guageLookup.starboardTemp = {
    guage: new steelseries.DisplaySingle('starboardTemp', getBatteryGuage('Temperature', "\xB0C", 0)),
    scale: function(value) {return value-273.15;}
  };

  guageLookup.fuel = {
    guage: new steelseries.DisplaySingle('fuel', getBatteryGuage('Fuel', "L", 0)),
    scale: function(value) {return value*1200;}
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
