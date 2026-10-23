use <../../honey_comb.scad>;

module honeyCombHandle(length, confHoneyCombHandle) {
  if (confHoneyCombHandle.invert) {
    difference() {
      color(confHoneyCombHandle.color)
        translate([0, 0, -length])
          cylinder(h = length, d = 31);
      color(confHoneyCombHandle.honeyCombColor)
        translate([0, 0, -length])
          honey_comb_cylinder(length, confHoneyCombHandle.outerRadius, 1, confHoneyCombHandle.holeDiameter, confHoneyCombHandle.hexWalls);
    }
  } else {
    color(confHoneyCombHandle.color)
      translate([0, 0, -length])
        cylinder(h = length, d = 31);
    color(confHoneyCombHandle.honeyCombColor)
      translate([0, 0, -length])
        honey_comb_cylinder(length, confHoneyCombHandle.outerRadius, 1, confHoneyCombHandle.holeDiameter, confHoneyCombHandle.hexWalls);
  }
}
