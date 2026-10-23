use <blade.scad>;

module fundation(looseCoef) {
  color("blue")
    difference() {
      fundationHole(looseCoef, true);
      bladeHole();
    }
}

module fundationHole(looseCoef, fundation = false) {
  translate([0, 0, 6]) {
    d = 27;
    diameter = fundation?d:d + looseCoef;
    translate([0, 0, -206])
      cylinder(h = 206, d = diameter);
  }
}
