// type of emitter
emitterType = "coneEmitter"; // [coneEmitter:cone emitter, armEmitter:arms emitter, oblicEmitter:oblic emitter]
// type of handle
handleType = "cylindersHandle"; // [ cylindersHandle:2 parts cylinders, ringsHandle:rings, spiralGripHandle:spiral grip, homeyCombHandle:homey comb]
// type of pommel
pommelType = "pommelType1"; // [pommelType1, pommelType2, pommelType3]


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
e3maxHeigh = 50; // [2:1:100]
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

/* [handleType : homeyCombHandle] */
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


/* [pommelType : pommelType1] */
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

/* [pommelType : pommelType2] */
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

/* [pommelType : pommelType3] */
// base color
p3baseColor = "red"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// color of spikes
p3SpikeColor = "silver"; // [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// nomber of spikes
p3sides = 6; // [3:1:12]

/* [display] */
// ingnit, light up the blade
ingnit = true;
// show/display the blade
showBlade = true;
// color of the blade
bladeColor = "red"; // [red:red, Chartreuse:green, DodgerBlue:blue, yellow:yellow,  Magenta:purple, orange:orange, white:white]
// cut the saber in quarter to see the inside
cutInQuarter = false;

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
addCopyright=true;
$fn = 40;

/* [Hidden] */
ringDiameter = 36;
ringThickness = 2;

use <honey_comb.scad>;

//armAngle = 0; // [-60:1:0]
armAngle = animation_opening
    ?($t < 0.5 ? -60 * (1 - $t * 2) : 0)
    :(ingnit ? 0 : -60);

$vpt = animation_rotation || animation_opening?[0, 0, 0]:[];
$vpr = animation_rotation ?[70, 0, 365 * $t]: (animation_opening?[70, 0, 0]:[]);
$vpd = animation_rotation || animation_opening?1100:[];

if (part == "all") {
    wholeSaber();
} else if (part == "saber") {
    saber();
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

module wholeSaber() {
    saber();
    if (showBlade) {
        blade();
    }
}

module blade() {
    bladeLength = 200;
    getIn = animation_opening
        ?($t > 0.5 ? -199 * (2 - $t * 2) : -199)
        :(ingnit ? 0 : -199);
    translate([0, 0, getIn]) {
        color(bladeColor, 0.6) {
            union() {
                cylinder(h = bladeLength, d = 25);
                color(bladeColor, 0.6) translate([0, 0, bladeLength]) sphere(d = 25);
            }
        }
    }
}

module saber() {
    difference() {
        union() {
            fundation();
            emitter();
            handle();
            pommel();
        }
        if (cutInQuarter) {
            translate([0, 0, -300])
                cube([50, 50, 600], center = false);
        }
    }
}

module emitter() {
    if (emitterType == "coneEmitter") {
        emitter1();
    } else if (emitterType == "armEmitter") {
        emitter2();
    } else if (emitterType == "oblicEmitter") {
        emitter3();
    }
}

module emitter1() {
    color(e1color) {
        difference() {
            emitterBlock();
            fundationHole();
            bladeHole();
        }
    }
}

module emitter2() {
    color(e2armColor)
        arms();
    color(e2color) {
        difference() {
            emitterBlock();
            armHoles();
            fundationHole();
            bladeHole();
        }
    }
}

module emitter3() {
    color(e3color) {
        difference() {
            oblicEmitter();
            fundationHole();
            bladeHole();
        }
    }
}

module emitterBlock() {
    translate([0, 0, -6]) {
        difference() {
            union() {
                a = 46;
                translate([0, 0, 30]) {
                    cylinder(h = 10, d1 = a, d2 = 37);
                }
                cylinder(h = 30, d1 = 6, d2 = a);
                cylinder(h = 22, d = 35);
            }
            // some room for the ring
            translate([0, 0, 6]) {
                pipe(50, 50 - ringDiameter + ringThickness - looseCoef, 17);
            }
        }
    }
}

module oblicEmitter() {
    translate([0, 0, -6]) {
        difference() {
            cylinder(h = e3maxHeigh, d = e3diameter);
            rotate([0, e3angle, 0])
                translate([0, 0, 100 + e3cutHeight])
                    cube(200, center = true);
        }
    }
}

module fundation() {
    color("blue")
        difference() {
            fundationHole(true);
            bladeHole();
        }
}

module fundationHole(fundation = false) {
    translate([0, 0, 6]) {
        d = 27;
        diameter = fundation?d:d + looseCoef;
        translate([0, 0, -206])
            cylinder(h = 206, d = diameter);
    }
}

module bladeHole() {
    translate([0, 0, 6]) {
        cylinder(h = 206, d1 = 25, d2 = 25);
        translate([0, 0, -206])
            cylinder(h = 206, d1 = 26.16, d2 = 25);
    }
}

module handle() {
    difference() {
        translate([0, 0, -6]) {
            length = 206 - 18;
            if (handleType == "cylindersHandle") {
                cylindersHandle(length);
            } else if (handleType == "ringsHandle") {
                ringsHandle(length);
            } else if (handleType == "spiralGripHandle") {
                spiralGripHandle(length);
            } else if (handleType == "homeyCombHandle") {
                honey_comb_handle(length);
            }
        }
        if (addCopyright)
            copyright();
        fundationHole();
    }
}

module copyright() {
    translate([0, 0, -40]) {
        rotate([0, 90, 0]) {
            linear_extrude(30) {
                text("© Copyright Yannick Battail", size = 4, valign = "center", font = "Arial");
            }
        }
    }
}

module cylindersHandle(length) {
    ringSize = 8;
    color(h1topColor)
        translate([0, 0, -length / 2])
            cylinder(h = length / 2, d = 29);
    distance = 11;
    color(h1cylinderColor)
        translate([0, 0, -length / 2 + ringSize / 2]) {
            for (i = [0:h1cylinderNumber]) {
                rotate([0, 0, 360 / h1cylinderNumber * i]) {
                    translate([distance, 0, 0])
                        cylinder(h = length / 2 - ringSize / 2, d = h1cylinderDiameter, center = false);
                }
            }
        }
    color(h1ringColor)
        translate([0, 0, -length / 2])
            cylinder(h = ringSize, d = 34, center = true);
    color(h1bottomColor)
        translate([0, 0, -length]) {
            linear_extrude(length / 2, center = false, twist = 360) {
                octogone(30);
            }
            linear_extrude(length / 2, center = false, twist = -120) {
                hexagone(16);
            }
        }
}

module ringsHandle(length) {
    // cylinder that join rings
    color("pink")
        translate([0, 0, -length])
            cylinder(h = length, d = 28);

    for (i = [0:ceil(length / 4)]) {
        translate([0, 0, i * -4 - 2]) {
            color(h2Color) torus(14, 5);
        }
    }
    // middle ring
    color(h2ringColor)
        translate([0, 0, -length / 2])
            cylinder(h = 8, d = 34);
}

module spiralGripHandle(length) {
    color(h3Color)
        cylinder(h = length, d = 31);

    color(h3Color)
        translate([0, 0, -length / 2]) {
            linear_extrude(length, center = true, convexity = 10, twist = -720) {
                square(25, center = true);
            }
            rotate([0, 0, length / 4])
                linear_extrude(length, center = true, convexity = 10, twist = 720) {
                    square(25, center = true);
                }
        }
}

module honey_comb_handle(length) {
    if (h4Invert) {
        difference() {
            color(h4Color)
                translate([0, 0, -length])
                    cylinder(h = length, d = 31);
            color(h4HoneyCombColor)
                translate([0, 0, -length])
                    honey_comb_cylinder(length, h4outer_radius, 1, h4hole_diameter, h4hex_walls);
        }
    } else {
        color(h4Color)
            translate([0, 0, -length])
                cylinder(h = length, d = 31);
        color(h4HoneyCombColor)
            translate([0, 0, -length])
                honey_comb_cylinder(length, h4outer_radius, 1, h4hole_diameter, h4hex_walls);
    }
}

module pommel() {
    difference() {
        translate([0, 0, -194]) {
            if (pommelType == "pommelType1") {
                pommel1();
            } else if (pommelType == "pommelType2") {
                pommel2();
            } else if (pommelType == "pommelType3") {
                pommel3();
            }
        }
        fundationHole();
    }
}

module pommel1() {
    translate([0, 0, -8]) {
        color(p1baseColor)
            cylinder(h = 8, d = 33);
    }
    color(p1diamondBaseColor)
        translate([0, 0, -14])
            linear_extrude(6, convexity = 20, scale = 0.85) {
                circle(p1width, $fn = p1sides);
            }
    color(p1diamondTopColor)
        translate([0, 0, -14])
            rotate([180, 0, 0])
                linear_extrude(p1height, convexity = 20, scale = 0, twist = p1twistAngle) {
                    circle(p1width, $fn = p1sides);
                }
}

module pommel2() {
    translate([0, 0, -8]) {
        color(p2baseColor)
            cylinder(h = 8, d = 33);
    }
    translate([0, 0, -3]) {
        color(p2SpikeColor)
            for (i = [0:p2sides]) {
                rotate([0, 0, 360 / p2sides * i]) {
                    translate([14, 0, 0])
                        rotate([0, 140, 0])
                            cylinder(h = p2SpikeLength, d1 = 7, d2 = 0, center = false);
                }
            }
    }
    color(p2diamondBaseColor)
        translate([0, 0, -14])
            linear_extrude(6, convexity = 20, scale = 0.85) {
                circle(p2width, $fn = p2sides);
            }
    color(p2diamondTopColor)
        translate([0, 0, -14])
            rotate([180, 0, 0])
                linear_extrude(p2height, convexity = 20, scale = 0) {
                    circle(p2width, $fn = p2sides);
                }
}

module pommel3() {
    translate([0, 0, -10])
        color(p3baseColor)
            sphere(18);
    translate([0, 0, -14]) {
        color(p3SpikeColor)
            for (i = [0:p3sides]) {
                rotate([0, 0, 360 / p3sides * i]) {
                    translate([17, 0, 0])
                        sphere(4);
                    translate([18, 0, 0])
                        rotate([0, 100, 0])
                            cylinder(h = 6, d1 = 7, d2 = 0, center = false);
                }
            }
    }
}

module armHoles() {
    for (i = [0:5]) {
        rotate([0, 0, 60 * i]) {
            armHole();
        }
    }
}

module armHole() {
    width = 6;
    translate([18, 0, 32]) {
        cube([30, width + looseCoef, 50], center = true);
    }
    // axis holes
    translate([18, 0, 24]) {
        rotate([90, 0, 0]) cylinder(h = 60, d = 1.75 + looseCoef, center = true);
    }
}

module arms() {
    for (i = [0:5]) {
        rotate([0, 0, 60 * i]) {
            armPos([18, 0, 24]);
        }
    }
}

module armPos(rot, axis = true) {
    color("red")
        translate(rot) {
            rotate([0, armAngle, 0]) {
                if (axis) {
                    arm(rot);
                    rotate([90, 0, 0]) cylinder(h = 28, d = 1.75, center = true);
                } else {
                    difference() {
                        arm(rot);
                        rotate([90, 0, 0]) cylinder(h = 28, d = 1.75 + looseCoef, center = true);
                    }
                }
            }
        }
}

module arm(rot) {
    width = 6;
    difference() {
        rotate([90, 0, 180]) {
            translate([0, 0, -width / 2]) {
                linear_extrude(width) {
                    polygon(points = [[6, -16], [6, 10], [0, 10], [-30, 40], [-40, 45], [-6, 0]]);
                }
            }
            translate([-8.3, 3, width / 2])
                rotate([0, 0, 217])
                    armStopper(2, -90);
            translate([-1.5, -6, width / 2])
                rotate([0, 0, 217])
                    armStopper(2, -90);
            translate([-8.3, 3, -width / 2])
                rotate([0, 0, 217])
                    armStopper(2, 180);
            translate([-1.5, -6, -width / 2])
                rotate([0, 0, 217])
                    armStopper(2, 180);
        }
        // make it pointy
        rotate([0, 60, 0]) {
            translate(-rot) {
                rotate([0, 0, 30])
                    translate([-50, 0, 0])
                        cube([100, 100, 100], center = false);
                rotate([0, 0, 150])
                    translate([-50, 0, 0])
                        cube([100, 100, 100], center = false);

            }
        }
    }
}

module armStopper(length, angle) {
    rotate([90, angle, 0])
        linear_extrude(length, center = true) {
            polygon(points = [[0, 0], [0, armStopperSize], [armStopperSize, 0]]);
        }
}

module armAxis() {
    rotate([90, 0, 0]) cylinder(h = 28, d = 1.75, center = true);
}

module torus(diameter, width) {
    rotate_extrude()
        translate([diameter, 0])
            circle(d = width);
}

module pipe(diameter, thickness, height) {
    epsilon = 0.001;
    difference() {
        cylinder(h = height, d = diameter);
        translate([0, 0, -epsilon / 2])
            cylinder(h = height + epsilon, d = diameter - thickness);
    }
}

module hexagone(size) {
    circle(size, $fn = 6);
}

module octogone(size) {
    intersection() {
        square(size, center = true);
        rotate([0, 0, 45])
            square(size, center = true);
    }
}

module debugAxis() {
    color("red") {
        cube([1000, 1, 1]);
        cube([1, 1000, 1]);
        cube([1, 1, 1000]);
    }
}

module debugCollision(debug = false) {
    if (debug) {
        color("#ff0000ff")
            intersection() {
                children(0);
                children(1);
            }
        color("#0000ff40")
            children(0);
        color("#00ff0040")
            children(1);
    } else {
        children(0);
        children(1);
    }
}
