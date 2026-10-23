// type of emitter
emitterType = "coneEmitter"; // [coneEmitter:cone emitter, armEmitter:arms emitter, oblicEmitter:oblic emitter]
// type of handle
handleType = "cylindersHandle"; // [ cylindersHandle:2 parts cylinders, ringsHandle:rings, spiralGripHandle:spiral grip, honeyCombHandle:honey comb, curveHandle:curved handle]
// type of pommel
pommelType = "diamondPommel"; // [diamondPommel, diamondSpikePommel, spherePommel, roundPomnel]


/* [emitterType : coneEmitter] */
// color
e1color = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [emitterType : armEmitter] */
// color
e2color = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// color of the arms
e2armColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [emitterType : oblicEmitter] */
// color
e3color = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// max height
e3maxHeight = 50; // [2:1:100]
// emitter diameter
e3diameter = 35; // [30:1:50]
// emitter cut height
e3cutHeight = 20; // [0:1:100]
// emitter angle
e3angle = 45; // [0:5:60]

/* [handleType : cylindersHandle] */
// number of cylinders
h1cylinderNumber = 6; // [3:1:20]
// diameter of cylinders
h1cylinderDiameter = 12; // [5:1:20]
// top color
h1topColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// 6 cylinders color
h1cylinderColor = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// ring color
h1ringColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// bottom color
h1bottomColor = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [handleType : ringsHandle] */
// ring color
h2ringColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// top color
h2Color = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [handleType : spiralGripHandle] */
// top color
h3Color = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [handleType : honeyCombHandle] */
// top color
h4Color = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// honey comb color
h4HoneyCombColor = "orange"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// honey comb radius (small values will take more time to render)
h4outer_radius = 16; // [16:0.1:18]
// honey comb hole diameter
h4hole_diameter = 16; // [5:0.5:30]
// honey comb walls
h4hex_walls = 1; // [0.1:0.1:10]
// invert honey comb (holes/border)
h4Invert = false;

/* [handleType : curveHandle] */
// top color
h5Color = "#444"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// handle radius of the curve
h5Curve = 1000;
// handle diameter
h5diameter = 29;

/* [pommelType : diamondPommel] */
// base color
p1baseColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond base color
p1diamondBaseColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond top color
p1diamondTopColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// twist angle in degrees
p1twistAngle = 0; // [0:5:360]
// diamond length
p1height = 35; // [5:1:50]
// diamond width
p1width = 18; // [5:1:60]
// number of sides in the diamond
p1sides = 6; // [3:1:12]

/* [pommelType : diamondSpikePommel] */
// base color
p2baseColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond base color
p2diamondBaseColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond top color
p2diamondTopColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond length
p2height = 35; // [5:1:50]
// diamond width
p2width = 18; // [5:1:60]
// number of sides in the diamond
p2sides = 6; // [3:1:12]
// color of spikes
p2SpikeColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// length of spikes
p2SpikeLength = 14; // [5:1:20]

/* [pommelType : spherePommel] */
// type of ornament
p3ornament = "rectangle"; // [none, rectangle, spike]
// base color
p3baseColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// base color
p3sphereColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// color of ornament
p3ornamentColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// number of ornament
p3sides = 6; // [3:1:12]

/* [pommelType : roundPomnel] */
// base color
p4baseColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// sphere color
p4sphereColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [display] */
// color of the blade
bladeColor = "red"; // [red:red, Chartreuse:green, DodgerBlue:blue, yellow:yellow,  Magenta:purple, orange:orange, white:white]
// ingnit, light up the blade
ingnit = true;
// show/display the blade
showBlade = true;

/* [Internal debug] */
// part to display
part = "all"; // [all, arm, saber, emitter, handle, pommel, fundation]

// arm stopper size
armStopperSize = 1; // [0.5:0.1:3]

// looseCoef
looseCoef = 0.6; // [0.1:0.1:2]

// rotating animation
animation_rotation = false;
// opening animation
animation_opening = false;
// Debug collision between arms and emitter
debug = false;
// add copyright
addCopyright = true;
// resolution
$fn = 100;

/* [Hidden] */

use <parts/base/blade.scad>;
use <parts/base/fundation.scad>;

use <parts/emitters/coneEmitter.scad>;
use <parts/emitters/armEmitter.scad>;
use <parts/emitters/oblicEmitter.scad>;

use <parts/handles/cylindersHandle.scad>;
use <parts/handles/ringsHandle.scad>;
use <parts/handles/spiralGripHandle.scad>;
use <parts/handles/honeyCombHandle.scad>;
use <parts/handles/curveHandle.scad>;

use <parts/pommels/diamondPommel.scad>;
use <parts/pommels/diamondSpikePommel.scad>;
use <parts/pommels/spherePommel.scad>;
use <parts/pommels/roundPomnel.scad>;

//armAngle = 0; // [-60:1:0]
armAngle = animation_opening
    ?($t < 0.5 ? -60 * (1 - $t * 2) : 0)
    :(ingnit ? 0 : -60);

$vpt = animation_rotation || animation_opening?[0, 0, 0]:[];
$vpr = animation_rotation ?[70, 0, 365 * $t]: (animation_opening?[70, 0, 0]:[]);
$vpd = animation_rotation || animation_opening?1100:[];

confConeEmitter = object(color = e1color, looseCoef=looseCoef);
confArmEmitter = object(color = e2color, armColor = e2armColor, armStopperSize=armStopperSize, armAngle=armAngle, looseCoef=looseCoef);
confOblicEmitter = object(color = e3color, diameter = e3diameter, maxHeight=e3maxHeight, cutHeight = e3cutHeight, angle = e3angle);

confCylindersHandle = object(cylinderNumber=h1cylinderNumber, cylinderDiameter=h1cylinderDiameter, topColor=h1topColor, cylinderColor=h1cylinderColor, ringColor=h1ringColor, bottomColor=h1bottomColor);
confRingsHandle = object(ringColor=h2ringColor, color=h2Color);
confSpiralGripHandle = object(color=h3Color);
confHoneyCombHandle = object(color=h4Color, honeyCombColor=h4HoneyCombColor, outerRadius=h4outer_radius, holeDiameter=h4hole_diameter, hexWalls=h4hex_walls, invert=h4Invert);
confCurveHandle = object(Color=h5Color, Curve=h5Curve, diameter=h5diameter);

confDiamondPommel = object(baseColor=p1baseColor, diamondBaseColor=p1diamondBaseColor, diamondTopColor=p1diamondTopColor, twistAngle=p1twistAngle, height=p1height, width=p1width, sides=p1sides);
confDiamondSpikePommel = object(baseColor=p2baseColor, diamondBaseColor=p2diamondBaseColor, diamondTopColor=p2diamondTopColor, height=p2height, width=p2width, sides=p2sides, SpikeColor=p2SpikeColor, SpikeLength=p2SpikeLength);
confSpherePommel = object(ornament=p3ornament, baseColor=p3baseColor, sphereColor=p3sphereColor, ornamentColor=p3ornamentColor, sides=p3sides);
confRoundPomnel = object(baseColor=p4baseColor, sphereColor=p4sphereColor);

confBlade = object(bladeColor=bladeColor, animationOpening=animation_opening, ingnit=ingnit, showBlade=showBlade);

if (part == "all") {
  if (showBlade) {
    blade(confBlade);
  }
  fundation();
  emitter();
  handle();
  pommel();
} else if (part == "saber") {
  fundation();
  emitter();
  handle();
  pommel();
} else if (part == "emitter") {
    emitter();
} else if (part == "handle") {
    handle();
} else if (part == "pommel") {
    pommel();
} else if (part == "arm") {
    armPos([19, 0, 30], false);
} else if (part == "fundation") {
    fundation();
}

module emitter() {
    if (emitterType == "coneEmitter") {
        coneEmitterAll(confConeEmitter);
    } else if (emitterType == "armEmitter") {
        armEmitterAll(confArmEmitter);
    } else if (emitterType == "oblicEmitter") {
        oblicEmitterAll(confOblicEmitter);
    } else {
      assert(true, str("unknown emitterType: ", emitterType));
    }
}

module coneEmitterAll(confConeEmitter) {
    color(confConeEmitter.color) {
        difference() {
            coneEmitter(confConeEmitter);
            fundationHole(looseCoef);
            bladeHole();
        }
    }
}

module armEmitterAll(confArmEmitter) {
    color(confArmEmitter.armColor)
        arms(confArmEmitter);
    color(confArmEmitter.color) {
        difference() {
            coneEmitter(confArmEmitter);
            armHoles(confArmEmitter);
            fundationHole(looseCoef);
            bladeHole();
        }
    }
}

module oblicEmitterAll(confOblicEmitter) {
    color(confOblicEmitter.color) {
        difference() {
            oblicEmitter(confOblicEmitter);
            fundationHole(looseCoef);
            bladeHole();
        }
    }
}

module handle() {
    difference() {
        translate([0, 0, -6]) {
            length = 206 - 18;
            if (handleType == "cylindersHandle") {
              cylindersHandle(length, confCylindersHandle);
            } else if (handleType == "ringsHandle") {
              ringsHandle(length, confRingsHandle);
            } else if (handleType == "spiralGripHandle") {
              spiralGripHandle(length, confSpiralGripHandle);
            } else if (handleType == "honeyCombHandle") {
              honeyCombHandle(length, confHoneyCombHandle);
            } else if (handleType == "curveHandle") {
              curveHandle(length, confCurveHandle);
            } else {
              assert(true, str("unknown handleType: ", handleType));
            }
        }
        if (addCopyright)
          copyright();
        fundationHole(looseCoef);
    }
}

module copyright() {
    translate([0, 0, -40]) {
        rotate([0, 90, 0]) {
            linear_extrude(30) {
                text("© Copyright XcinnsY", size = 4, valign = "center", font = "Arial");
            }
        }
    }
}

module pommel() {
    difference() {
        translate([0, 0, -194]) {
            if (pommelType == "diamondPommel") {
                diamondPommel(confDiamondPommel);
            } else if (pommelType == "diamondSpikePommel") {
                diamondSpikePommel(confDiamondSpikePommel);
            } else if (pommelType == "spherePommel") {
                spherePommel(confSpherePommel);
            } else if (pommelType == "roundPomnel") {
                roundPomnel(confRoundPomnel);
            } else {
              assert(true, str("unknown pommelType: ", pommelType));
            }
        }
        fundationHole(looseCoef);
    }
}
