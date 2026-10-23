
/*
same as mirror but duplicate children
*/
module mmirror(mat) {
  children();
  mirror(mat)
    children();
}

module torus(diameter, width) {
  rotate_extrude()
    translate([diameter, 0])
      circle(d = width);
}

module pipe(diameter, thickness, height) {
  epsilon = 0.001;
  difference() {
    cylinder(h = height, d = diameter);
    translate([0, 0, -epsilon / 2])
      cylinder(h = height + epsilon, d = diameter - thickness);
  }
}

module hexagone(size) {
  circle(size, $fn = 6);
}

module octogone(size) {
  intersection() {
    square(size, center = true);
    rotate([0, 0, 45])
      square(size, center = true);
  }
}

module debugAxis() {
  color("red") {
    cube([1000, 1, 1]);
    cube([1, 1000, 1]);
    cube([1, 1, 1000]);
  }
}

module debugCollision(debug = false) {
  if (debug) {
    color("#ff0000ff")
      intersection() {
        children(0);
        children(1);
      }
    color("#0000ff40")
      children(0);
    color("#00ff0040")
      children(1);
  } else {
    children(0);
    children(1);
  }
}
