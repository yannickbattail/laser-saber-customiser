INCH=25.4;
module blade(confBlade) {
  bladeLength = 200;
  getIn = confBlade.animationOpening
    ?($t > 0.5 ? -199 * (2 - $t * 2) : -199)
    :(confBlade.ingnit ? 0 : -199);
  translate([0, 0, getIn]) {
    color(confBlade.bladeColor, 0.6) {
      union() {
        cylinder(h = bladeLength, d = 25);
        color(confBlade.bladeColor, 0.6) translate([0, 0, bladeLength]) sphere(d = 25);
      }
    }
  }
}

module bladeHole() {
  translate([0, 0, 6]) {
    cylinder(h = 206, d = 25);
    translate([0, 0, -206])
      cylinder(h = 206, d1 = 26.16, d2 = 25);
  }
}
