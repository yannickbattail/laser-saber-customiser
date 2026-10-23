module diamondSpikePommel(confDiamondSpikePommel) {
  translate([0, 0, -8])
    color(confDiamondSpikePommel.baseColor)
      cylinder(h = 8, d = 33);

  translate([0, 0, -3])
    color(confDiamondSpikePommel.SpikeColor)
      for (i = [0:confDiamondSpikePommel.sides])
        rotate([0, 0, 360 / confDiamondSpikePommel.sides * i])
          translate([14, 0, 0])
            rotate([0, 140, 0])
              cylinder(h = confDiamondSpikePommel.SpikeLength, d1 = 7, d2 = 0, center = false);

  color(confDiamondSpikePommel.diamondBaseColor)
    translate([0, 0, -14])
      linear_extrude(6, convexity = 20, scale = 0.85)
        circle(confDiamondSpikePommel.width, $fn = confDiamondSpikePommel.sides);

  color(confDiamondSpikePommel.diamondTopColor)
    translate([0, 0, -14])
      rotate([180, 0, 0])
        linear_extrude(confDiamondSpikePommel.height, convexity = 20, scale = 0)
          circle(confDiamondSpikePommel.width, $fn = confDiamondSpikePommel.sides);
}
