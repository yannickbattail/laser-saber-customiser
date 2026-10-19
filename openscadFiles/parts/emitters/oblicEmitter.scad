
module oblicEmitter(confOblicEmitter) {
  translate([0, 0, -6]) {
    difference() {
      cylinder(h = confOblicEmitter.maxHeight, d = confOblicEmitter.diameter);
      rotate([0, confOblicEmitter.angle, 0])
        translate([0, 0, 100 + confOblicEmitter.cutHeight])
          cube(200, center = true);
    }
  }
}

