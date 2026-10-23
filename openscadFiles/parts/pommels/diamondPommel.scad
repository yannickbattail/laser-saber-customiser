module diamondPommel(confDiamondPommel) {
  translate([0, 0, -8])
    color(confDiamondPommel.baseColor)
      cylinder(h = 8, d = 33);
  color(confDiamondPommel.diamondBaseColor)
    translate([0, 0, -14])
      linear_extrude(6, convexity = 20, scale = 0.85)
        circle(confDiamondPommel.width, $fn = confDiamondPommel.sides);
  color(confDiamondPommel.diamondTopColor)
    translate([0, 0, -14])
      rotate([180, 0, 0])
        linear_extrude(confDiamondPommel.height, convexity = 20, scale = 0, twist = confDiamondPommel.twistAngle)
          circle(confDiamondPommel.width, $fn = confDiamondPommel.sides);
}
