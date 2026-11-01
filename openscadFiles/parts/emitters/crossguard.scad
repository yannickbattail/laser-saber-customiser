use <../../util.scad>;

module crossguard(confCrossguard) {
  translate([0, 0, -6]) {
    color(confCrossguard.color) {
      cylinder(h = 40, d = 34);
    }
    mmirror([1, 0, 0]) {
      translate([0, 0, 20]) {
        rotate([0, 90, 0]) {
          translate([0, 0, confCrossguard.length]) {
            rotate([180, 0, 0]) {
              color(confCrossguard.crossguardColor) {
                linear_extrude(height = confCrossguard.length, scale = [confCrossguard.verticalScale, confCrossguard.
                horizontalScale]) {
                  circle(d = confCrossguard.diamterTip);
                }
              }
            }
            color(confCrossguard.sphereColor)
              sphere(d = confCrossguard.diamterSphere);
          }
        }
      }
    }
  }
}
