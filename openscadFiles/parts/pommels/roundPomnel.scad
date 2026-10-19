
module roundPomnel(confRoundPomnel) {
  translate([0, 0, -8]) {
    color(confRoundPomnel.baseColor)
      cylinder(h = 8, d = 33);
  }
  color(confRoundPomnel.sphereColor) {
    translate([0, 0, -38]) {
      rotate_extrude() {
        difference() {
          union() {
            circle(18);
            translate([0, 18])
              square([36, 24], center = true);
          }
          translate([38, 18])
            circle(25);
          // remove -x side for rotate_extrude
          translate([-60, -18])
            square(60);
        }
      }
    }
  }
}
