
module honey_comb_cylinder(height = 60, outer_radius = 20, cyl_wall_thickness = 3, hole_diameter = 4, hex_walls = 1) {
    hole_side = hole_diameter * sin(30);
    hole_hspacing = hole_diameter + hole_side + hex_walls;
    hole_zspacing = 0.5 * (hole_diameter * sin(60) + hex_walls);
    hole_layers = floor(height / hole_zspacing);
    cyl_circumference = 2 * PI * outer_radius;
    numholes = floor(cyl_circumference / hole_hspacing);
    angle_step = 360 / numholes;

    difference() {
        cylinder(height, r = outer_radius, $fn = 128);
        translate([0, 0, -1])
            cylinder(height + 2, r = outer_radius - cyl_wall_thickness, $fn = 128);
        for (zn = [0:hole_layers])
            let(z = zn * hole_zspacing, aoffset = zn % 2 == 0 ? 0 : angle_step / 2)
        for (a = [0:angle_step:359.9]) {
            translate([0, 0, z])
                rotate([0, 0, a + aoffset]) punch();
        }
    }

    module punch() {
        rotate([0, 90, 0]) rotate([0, 0, 90])
            cylinder(outer_radius + 1, d1 = 0, d2 = hole_diameter, $fn = 6);
    }
}
