module pointyEmitter(confPointyEmitter) {
  translate([0, 0, -6]) {
    color(confPointyEmitter.color) {
      c = confPointyEmitter.curve;
      r = confPointyEmitter.diameter / 2;
      move = c - r * sqrt(2) / 2;
      difference() {
        cylinder(h = confPointyEmitter.curve * confPointyEmitter.scale + 12, d = confPointyEmitter.diameter);
        rotate([0, 0, -45 + confPointyEmitter.rotation]) {
          translate([0, 0, 12]) {
            translate([-1 * move, 0, confPointyEmitter.curve * confPointyEmitter.scale])
              rotate([90, 0, 0])
                scale([1, confPointyEmitter.scale, 1])
                  cylinder(h = 200, r = confPointyEmitter.curve, center = true);
            translate([0, -1 * move, confPointyEmitter.curve * confPointyEmitter.scale])
              rotate([0, 90, 0])
                scale([confPointyEmitter.scale, 1, 1])
                  cylinder(h = 200, r = confPointyEmitter.curve, center = true);
          }
        }
      }
    }
  }
}

