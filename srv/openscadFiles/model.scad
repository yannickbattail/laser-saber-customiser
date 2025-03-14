// part to display
part = "all"; // [all, arm, saber, emitter, handle, pommel, fundation]
// type of emitter
emitterType = "emitterType1"; // [emitterType1:emitter1, emitterType2:armEmitter, emitterType3:oblicEmitter]
// type of handle
handleType = "handleType1"; // [handleType1, handleType2, handleType3]
// type of pommel
pommelType = "pommelType1"; // [pommelType1, pommelType2, pommelType3]

// arm stopper size
armStopperSize = 1; // [0.5:0.1:3]

// looseCoef
looseCoef = 0.6; // [0.1:0.1:2]

/* [emitterType1] */
// color
e1color = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [emitterType2] */
// color
e2color = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// color of the arms
e2armColor = "red";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [emitterType3] */
// color
e3color = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// max height
e3maxHeigh = 50; // [2:1:100]
// emitter diameter
e3diameter = 35; // [30:1:50]
// emitter cut height
e3cutHeight = 20; // [0:1:100]
// emitter angle
e3angle = 45; // [0:5:60]

/* [handleType1] */
// number of cylinders
h1cylinderNumber = 6; // [3:1:20]
// diameter of cylinders
h1cylinderDiameter = 12; // [5:1:20]
// top color
h1topColor = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// 6 cylinders color
h1cylinderColor = "#444";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// ring color
h1ringColor = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// bottom color
h1bottomColor = "#444";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]

/* [pommelType1] */
// base color
p1baseColor = "silver";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond base color
p1diamondBaseColor = "red";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// diamond top color
p1diamondTopColor = "red";// [silver:silver, orange:gold, #444:black, white:white, red:red, green:green, blue:blue, yellow:yellow]
// twist angle in degrees
p1twistAngle = 0; // [0:5:360]
// diamond length
p1height = 35; // [5:1:50]
// diamond width
p1width = 18; // [5:1:60]
// number of sides in the diamond
p1sides = 6; // [3:1:12]

/* [display] */
// ingnit, light up the blade
ingnit = true;
// show/display the blade
showBlade = true;
// color of the blade
bladeColor = "red";// [red:red, Chartreuse:green, DodgerBlue:blue, yellow:yellow,  Magenta:purple, orange:orange, white:white]
// cut the saber in quarter to see the inside
cutInQuarter = false;

/* [Internal debug] */
// rotating animation
animation_rotation = false;
// opening animation
animation_opening = false;
// Debug collision between arms and emitter
debug = false;
$fn = 40;

/* [Hidden] */
ringDiameter = 36;
ringThickness = 2;

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
    debugCollision(debug){
        saber();
    }
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
    if (emitterType == "emitterType1") {
        emitter1();
    } else if (emitterType == "emitterType2") {
        emitter2();
    } else if (emitterType == "emitterType3") {
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
            rotate([0,e3angle,0])
                translate([0,0,100+e3cutHeight])
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
            if (handleType == "handleType1") {
                handle1(length);
            } else if (handleType == "handleType2") {
                handle2(length);
            } else if (handleType == "handleType3") {
                handle3(length);
            }
        }
        fundationHole();
    }
}

module handle1(length) {
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

module handle2(length) {
    // cylinder that join rings
    color("pink")
        translate([0, 0, -length])
            cylinder(h = length, d = 28);

    for (i = [0:ceil(length / 4)]) {
        translate([0, 0, i * -4 - 2]) {
            color("#444") torus(14, 5);
        }
    }
    // middle ring
    color("silver")
        translate([0, 0, -length / 2])
            cylinder(h = 8, d = 34);
}

module handle3(lenght) {
    color("#444")
        translate([0, 0, -lenght])
            cylinder(h = lenght, d = 31);

    color("#444")
        translate([0, 0, -lenght / 2]) {
            linear_extrude(lenght, center = true, convexity = 10, twist = -720) {
                square(25, center = true);
            }
            rotate([0, 0, lenght / 4])
                linear_extrude(lenght, center = true, convexity = 10, twist = 720) {
                    square(25, center = true);
                }
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
    nb = 6;
    translate([0, 0, -8]) {
        color("silver")
            cylinder(h = 8, d = 33, center = false);
    }
    translate([0, 0, -3]) {
        color("silver")
            for (i = [0:nb]) {
                rotate([0, 0, 360 / nb * i]) {
                    translate([14, 0, 0])
                        rotate([0, 140, 0])
                            cylinder(h = 14, d1 = 7, d2 = 0, center = false);
                }
            }
    }
    color("red")
        translate([0, 0, -14])
            linear_extrude(6, convexity = 20, scale = 0.9/*,twist = 60*/) {
                hexagone(16);
            }
    color("red")
        translate([0, 0, -14])
            rotate([180, 0, 0])
                linear_extrude(10, convexity = 20, scale = 0/*,twist = 60*/) {
                    hexagone(16);
                }
}

module pommel3() {
    translate([0, 0, -10])
        color("darkred")
            sphere(18);
    nb = 6;
    translate([0, 0, -14]) {
        color("silver")
            for (i = [0:nb]) {
                rotate([0, 0, 360 / nb * i]) {
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
