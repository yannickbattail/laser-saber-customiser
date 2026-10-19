module spiralGripHandle(length, confSpiralGripHandle) {
  color(confSpiralGripHandle.color)
    translate([0, 0, -length])
      cylinder(h = length, d = 31);

  color(confSpiralGripHandle.color)
    translate([0, 0, -length / 2]) {
      linear_extrude(length, center = true, convexity = 10, twist = -720) {
        square(25, center = true);
      }
      rotate([0, 0, length / 4])
        linear_extrude(length, center = true, convexity = 10, twist = 720) {
          square(25, center = true);
        }
    }
}
