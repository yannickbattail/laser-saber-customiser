use <../../util.scad>;

module spherePommel(confSpherePommel) {
  translate([0, 0, -8]) {
    color(confSpherePommel.baseColor)
      cylinder(h = 8, d = 33);
  }

  translate([0, 0, -20])
    color(confSpherePommel.sphereColor)
      sphere(18);

  translate([0, 0, -24]) {
    color(confSpherePommel.ornamentColor) {
      if (confSpherePommel.ornament == "spike") {
        for (i = [0:confSpherePommel.sides]) {
          rotate([0, 0, 360 / confSpherePommel.sides * i]) {
            translate([17, 0, 0])
              sphere(4);
            translate([18, 0, 0])
              rotate([0, 100, 0])
                cylinder(h = 6, d1 = 7, d2 = 0, center = false);
          }
        }
      } else if (confSpherePommel.ornament == "rectangle") {
        a = 360 / confSpherePommel.sides;
        for (i = [0:confSpherePommel.sides]) {
          rotate([0, 0, a * i]) {
            difference() {
              cylinder(r=21, h=8);
              mmirror([1,0,0])
                rotate([0, 0, a / 4+90])
                  translate([-30, 0, -30])
                    cube(60, center = false);
            }
          }
        }
      }
    }
  }
}
