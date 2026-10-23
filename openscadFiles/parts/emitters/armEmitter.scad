module armHoles(confArmEmitter) {
  for (i = [0:5]) {
    rotate([0, 0, 60 * i]) {
      _armHole(confArmEmitter);
    }
  }
}

module _armHole(confArmEmitter) {
  width = 6;
  translate([18, 0, 32]) {
    cube([30, width + confArmEmitter.looseCoef, 50], center = true);
  }
  // axis holes
  translate([18, 0, 24]) {
    rotate([90, 0, 0])
      cylinder(h = 60, d = 1.75 + confArmEmitter.looseCoef, center = true);
  }
}

module arms(confArmEmitter) {
  for (i = [0:5]) {
    rotate([0, 0, 60 * i]) {
      _armPos([18, 0, 24], confArmEmitter);
    }
  }
}

module _armPos(rot, confArmEmitter, axis = true) {
  color("red")
    translate(rot) {
      rotate([0, confArmEmitter.armAngle, 0]) {
        if (axis) {
          _arm(rot, confArmEmitter.armStopperSize);
          rotate([90, 0, 0]) cylinder(h = 28, d = 1.75, center = true);
        } else {
          difference() {
            _arm(rot, aconfArmEmitter.rmStopperSize);
            rotate([90, 0, 0]) cylinder(h = 28, d = 1.75 + confArmEmitter.looseCoef, center = true);
          }
        }
      }
    }
}

module _arm(rot, armStopperSize) {
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
          _armStopper(2, -90, armStopperSize);
      translate([-1.5, -6, width / 2])
        rotate([0, 0, 217])
          _armStopper(2, -90, armStopperSize);
      translate([-8.3, 3, -width / 2])
        rotate([0, 0, 217])
          _armStopper(2, 180, armStopperSize);
      translate([-1.5, -6, -width / 2])
        rotate([0, 0, 217])
          _armStopper(2, 180, armStopperSize);
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

module _armStopper(length, angle, armStopperSize) {
  rotate([90, angle, 0])
    linear_extrude(length, center = true) {
      polygon(points = [[0, 0], [0, armStopperSize], [armStopperSize, 0]]);
    }
}

module _armAxis() {
  rotate([90, 0, 0])
    cylinder(h = 28, d = 1.75, center = true);
}
