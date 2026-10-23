use <../../util.scad>;

module curveHandle(length, confCurveHandle) {
  color(confCurveHandle.Color) {
    translate([0, 0, -length]) {
      difference() {
        cylinder(h = length, d = 36);
        $fn = 200;
        translate([0, 0, length / 2])
          torus(confCurveHandle.Curve, confCurveHandle.Curve * 2 - confCurveHandle.diameter);
      }
    }
  }
}
