// rotation around z-axis
zRot = 45; // [0:360]
allColors = "red";
echo("zRot: ", zRot);
color(allColors)
    rotate([90, 0, zRot])
        cylinder(d1 = 30, d2 = 5, h = 50);
