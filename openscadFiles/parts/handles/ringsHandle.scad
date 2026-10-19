use <../../util.scad>;

module ringsHandle(length, confRingsHandle) {
  // cylinder that join rings
  color("pink")
    translate([0, 0, -length])
      cylinder(h = length, d = 28);

  for (i = [0:ceil(length / 4)]) {
    translate([0, 0, i * -4 - 2]) {
      color(confRingsHandle.color) torus(14, 5);
    }
  }
  // middle ring
  color(confRingsHandle.ringColor)
    translate([0, 0, -length / 2])
      cylinder(h = 8, d = 34);
}
