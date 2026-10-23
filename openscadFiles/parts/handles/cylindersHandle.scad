use <../../util.scad>;

module cylindersHandle(length, confCylindersHandle) {
  ringSize = 8;
  color(confCylindersHandle.topColor)
    translate([0, 0, -length / 2])
      cylinder(h = length / 2, d = 29);
  distance = 11;
  color(confCylindersHandle.cylinderColor)
    translate([0, 0, -length / 2 + ringSize / 2]) {
      for (i = [0:confCylindersHandle.cylinderNumber]) {
        rotate([0, 0, 360 / confCylindersHandle.cylinderNumber * i]) {
          translate([distance, 0, 0])
            cylinder(h = length / 2 - ringSize / 2, d = confCylindersHandle.cylinderDiameter, center = false);
        }
      }
    }
  color(confCylindersHandle.ringColor)
    translate([0, 0, -length / 2])
      cylinder(h = ringSize, d = 34, center = true);
  color(confCylindersHandle.bottomColor)
    translate([0, 0, -length]) {
      linear_extrude(length / 2, center = false, twist = 360) {
        octogone(30);
      }
      linear_extrude(length / 2, center = false, twist = -120) {
        hexagone(16);
      }
    }
}
