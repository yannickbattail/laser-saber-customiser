use <../../honey_comb.scad>;
use <../../util.scad>;

module coneEmitter(confConeEmitter) {
  ringDiameter = 36;
  ringThickness = 2;

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
        pipe(50, 50 - ringDiameter + ringThickness - confConeEmitter.looseCoef, 17);
      }
    }
  }
}
