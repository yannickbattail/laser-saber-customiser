module pointyEmitter(confPointyEmitter) {
  translate([0, 0, -6]) {
    color(confPointyEmitter.color) {
      difference() {
        cylinder(h = confPointyEmitter.curve + 12, d = confPointyEmitter.diameter);
        translate([0, 0, 12]) {
          translate([-confPointyEmitter.diameter / 2, 0, confPointyEmitter.curve])
            rotate([90, 0, 0])
              cylinder(h = 200, r = confPointyEmitter.curve, center = true);
          translate([0, -confPointyEmitter.diameter / 2, confPointyEmitter.curve])
            rotate([0, 90, 0])
              cylinder(h = 200, r = confPointyEmitter.curve, center = true);
        }
      }
    }
  }
}

