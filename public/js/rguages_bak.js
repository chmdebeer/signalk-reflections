var rpmPort = new RadialGauge({
    renderTo: 'rpm-port-id',
    //title: "rpm",
    width: 327,
    height: 327,
    units: "R P M",
    minValue: 0,
    maxValue: 6000,
    majorTicks: ["0", "1000", "2000", "3000", "4000", "5000", "6000"],
    minorTicks: 5,
    colorPlate: 'rgba(198, 207, 216,.75)',
    colorValueBoxBackground: 'rgba(198, 207, 216,.75)',
//          strokeTicks: true,
    highlights: [
      { from: 4000, to: 5000, color: 'rgba(244, 179, 66,.75)' },
      { from: 5000, to: 6000, color: 'rgba(244, 74, 65,.85)' }
    ],
    valueInt: 4,
    valueDec: 0
}).draw();

rpmPort.value = 2700;
rpmPort.update();

var gaugeVoltPort = new RadialGauge({
    renderTo: 'volt-port-id',
    width: 120,
    height: 120,
    ticksAngle: 160,
    startAngle: 100,
    units: "volt",
    minValue: 8,
    maxValue: 16,
    majorTicks: ["8", "12", "16"],
    minorTicks: 4,
    colorPlate: 'rgba(198, 207, 216,.75)',
    colorValueBoxBackground: 'rgba(198, 207, 216,.75)',
//          strokeTicks: true,
    highlights: [
      { from: 8, to: 11, color: 'rgba(244, 74, 65,.85)' },
      { from: 14, to: 16, color: 'rgba(244, 74, 65,.85)' }
    ],
    valueInt: 2,
    valueDec: 0,
    fontNumbersSize: 35,
     fontTitleSize: 34,
     fontUnitsSize: 40,
     fontValueSize: 40,
     fontUnitsStyle: 'bold'
}).draw();

gaugeVoltPort.value = 14;
gaugeVoltPort.update();

var gaugeOilPressurePort = new RadialGauge({
    renderTo: 'oil-pressure-port-id',
    width: 120,
    height: 120,
    ticksAngle: 160,
    startAngle: 100,
    units: "PS I",
    minValue: 0,
    maxValue: 80,
    majorTicks: ["0", "40", "80"],
    minorTicks: 3,
    colorPlate: 'rgba(198, 207, 216,.75)',
    colorValueBoxBackground: 'rgba(198, 207, 216,.75)',
//          strokeTicks: true,
    highlights: [
      { from: 0, to: 30, color: 'rgba(244, 74, 65,.85)' },
      { from: 60, to: 80, color: 'rgba(244, 74, 65,.85)' }
    ],
    valueInt: 2,
    valueDec: 0,
    fontNumbersSize: 35,
     fontTitleSize: 34,
     fontUnitsSize: 40,
     fontValueSize: 40,
     fontUnitsStyle: 'bold'
}).draw();

gaugeOilPressurePort.value = 56;
gaugeOilPressurePort.update();

var waterTempPort = new RadialGauge({
    renderTo: 'water-temp-port-id',
    width: 120,
    height: 120,
    ticksAngle: 240,
    startAngle: 20,
    units: "`C",
    minValue: 0,
    maxValue: 120,
    majorTicks: ["", "40", "80", "120"],
    minorTicks: 5,
    colorPlate: 'rgba(198, 207, 216,.75)',
    colorValueBoxBackground: 'rgba(198, 207, 216,.75)',
//          strokeTicks: true,
    highlights: [
      { from: 0, to: 40, color: 'rgba(0, 0, 255,.85)' },
      { from: 100, to: 120, color: 'rgba(244, 74, 65,.85)' }
    ],
    valueInt: 3,
    valueDec: 0,
    fontNumbersSize: 35,
     fontTitleSize: 34,
     fontUnitsSize: 40,
     fontValueSize: 40,
     fontUnitsStyle: 'bold'
}).draw();

waterTempPort.value = 90;
waterTempPort.update();

var rpmStarboard = new RadialGauge({
    renderTo: 'rpm-starboard-id',
    title: "rpm",
    width: 327,
    height: 327
}).draw();

rpmStarboard.value = 56;
rpmStarboard.update();

var gaugeVoltStarboard = new RadialGauge({
    renderTo: 'volt-starboard-id',
    title: "volt",
    width: 120,
    height: 120
}).draw();

gaugeVoltStarboard.value = 56;
gaugeVoltStarboard.update();

var gaugeOilPressureStarboard = new RadialGauge({
    renderTo: 'oil-pressure-starboard-id',
    title: "psi",
    width: 120,
    height: 120
}).draw();

gaugeOilPressureStarboard.value = 56;
gaugeOilPressureStarboard.update();

var waterTempStarboard = new RadialGauge({
    renderTo: 'water-temp-starboard-id',
    title: "`C`",
    width: 120,
    height: 120
}).draw();

waterTempStarboard.value = 56;
waterTempStarboard.update();

var compass2;
compass2 = new steelseries.Compass('canvasCompass2', {
                    size: 400,
                    rotateFace: true,
                    frameDesign: steelseries.FrameDesign.BLACK_METAL,
                    backgroundColor: steelseries.BackgroundColor.CARBON,
                    backgroundVisible: true
                    });

var portBattery = new steelseries.DisplaySingle('portBattery', {
  width: 120, height: 50, unitString: "v", unitStringVisible: true, headerString: "Port Battery", headerStringVisible: true
});
var starboardBattery = new steelseries.DisplaySingle('starboardBattery', {
  width: 120, height: 50, unitString: "v", unitStringVisible: true, headerString: "Starboard Battery", headerStringVisible: true
});
var auxiliaryBattery = new steelseries.DisplaySingle('auxiliaryBattery', {
  width: 120, height: 50, unitString: "v", unitStringVisible: true, headerString: "Auxiliary Battery", headerStringVisible: true
});

Reveal.initialize({
  history: true
});
