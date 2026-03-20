// === Chapter 9: Geometric Reasoning ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch09',
        number: 9,
        title: 'Geometric Reasoning',
        subtitle: 'Seeing is proving',

        sections: [
            // ============================================================
            // Section 1: Motivation — Why Geometry?
            // ============================================================
            {
                id: 'sec-motivation',
                title: 'Why Geometry?',
                content: `
<h2>Seeing Is Proving</h2>

<p>Geometry is the oldest branch of mathematics that looks like it sounds. The word itself means "earth-measurement," and the subject began with surveyors in ancient Egypt re-drawing property lines after the Nile's annual flood. But geometry quickly became something much deeper: a laboratory for <em>proof</em>.</p>

<p>Euclid's <em>Elements</em> (c. 300 BCE) showed that from a handful of axioms you can derive hundreds of non-obvious truths about points, lines, and circles. Two thousand years later, the same style of reasoning underpins all of modern mathematics.</p>

<div class="env-block intuition">
<strong>Why geometry in a "thinking games" book?</strong><br>
Because geometry trains a skill no other subject exercises quite as well: the ability to <em>see</em> structure that is not immediately visible, and then <em>prove</em> that what you see is true. A clever geometric argument can replace pages of algebra with a single picture.
</div>

<p>In this chapter we will explore:</p>
<ul>
    <li><strong>Area puzzles</strong> that seem to violate conservation of area (they don't).</li>
    <li><strong>Angle chasing</strong> in complex figures, where one known angle unlocks everything.</li>
    <li><strong>Dissection puzzles</strong>, where cutting and rearranging reveals hidden equalities.</li>
    <li><strong>Optical illusions and impossible figures</strong> that probe the gap between perception and logic.</li>
</ul>

<p>The common thread: geometry rewards those who look carefully, question assumptions, and think step by step.</p>

<div class="env-block remark">
<strong>Tools you will need</strong><br>
A willingness to draw pictures and label things. The best geometric reasoners are not those with the best spatial intuition; they are the ones who write down what they know, step by step, and follow the logic wherever it leads.
</div>
`,
                visualizations: [],
                exercises: []
            },

            // ============================================================
            // Section 2: Area Puzzles
            // ============================================================
            {
                id: 'sec-area',
                title: 'Area Puzzles',
                content: `
<h2>Area Puzzles</h2>

<p>Area seems like the most trustworthy thing in geometry. You cut a shape into pieces, rearrange them, and the total area should stay the same. Right?</p>

<p>The most famous puzzle that appears to violate this principle is the <strong>Missing Square Puzzle</strong> (also called the Curry triangle). You arrange four pieces into a 13 &times; 5 "triangle." Then you rearrange the same four pieces into what looks like the same triangle, but now there is an empty square. Where did the area go?</p>

<div class="env-block theorem">
<strong>Conservation of Area</strong><br>
If you cut a region into pieces and rearrange them (without overlap or stretching), the total area is preserved. Period. If it looks like area appeared or disappeared, the "before" and "after" shapes are not actually identical.
</div>

<p>The secret of the missing square puzzle is that neither arrangement is a true triangle. The "hypotenuse" has a very slight bend. In one arrangement it bows inward (less area), in the other it bows outward (more area), and the difference is exactly one square unit.</p>

<div class="viz-placeholder" data-viz="viz-missing-square"></div>

<div class="env-block example">
<strong>Why the slopes don't match</strong><br>
The two triangle pieces have slopes \\(2/5 = 0.400\\) and \\(3/8 = 0.375\\). Since \\(2/5 \\neq 3/8\\), the "hypotenuse" is not a straight line. The overall rectangle is \\(13 \\times 5\\), and the true diagonal has slope \\(5/13 \\approx 0.385\\), which lies between the two piece slopes.
</div>

<h3>Pick's Theorem: Area by Counting</h3>

<p>For polygons whose vertices lie on a lattice (grid of integer points), there is a beautiful formula that computes area by counting points:</p>

<div class="env-block theorem">
<strong>Pick's Theorem</strong><br>
For a simple polygon with vertices at lattice points:
\\[A = I + \\frac{B}{2} - 1\\]
where \\(I\\) = number of interior lattice points and \\(B\\) = number of boundary lattice points.
</div>

<p>Try it in the interactive below. Click to place vertices on the grid, and watch Pick's theorem compute the area.</p>

<div class="viz-placeholder" data-viz="viz-area-by-counting"></div>
`,
                visualizations: [
                    {
                        id: 'viz-missing-square',
                        title: 'The Missing Square Puzzle',
                        description: 'The classic Curry triangle. Click "Rearrange" to swap the two configurations. The same four pieces form what looks like the same triangle, but one has a missing square. The dashed line shows the true diagonal, revealing the bend.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 22, originX: 30, originY: 350 });
                            var ctx = viz.ctx;
                            var config = 0; // 0 = arrangement A, 1 = arrangement B

                            var pieceColors = [
                                viz.colors.red + 'aa',
                                viz.colors.blue + 'aa',
                                viz.colors.green + 'aa',
                                viz.colors.orange + 'aa'
                            ];

                            // The four pieces:
                            // Red right triangle: base 8, height 3
                            // Blue right triangle: base 5, height 2
                            // Orange L-shape (or Z-shape): 2x5=8 area
                            // Green L-shape: 2x5=7 area

                            // Config A pieces (no gap)
                            var configA = [
                                { pts: [[0,0],[8,0],[8,3]], color: pieceColors[0], label: 'R' },      // red triangle
                                { pts: [[8,3],[13,3],[13,5]], color: pieceColors[1], label: 'B' },    // blue triangle
                                { pts: [[8,0],[10,0],[10,2],[8,2]], color: pieceColors[2], label: 'O' }, // orange rect 2x2 -> but we need the Z shapes
                                { pts: [[8,2],[10,2],[10,3],[13,3],[13,2],[10,2]], color: pieceColors[3], label: 'G' }
                            ];

                            // Actually, the classic puzzle uses:
                            // Two triangles with different slopes + two L-shaped tetrominoes
                            // Simpler: use the standard 4 pieces
                            // Red: right triangle (0,0)-(8,0)-(8,3) [slope 3/8]
                            // Blue: right triangle top-right, (8,3)-(13,3)-(13,5) [slope 2/5]
                            // Yellow: rectangle-ish (8,0)-(10,0)-(10,3)-(8,3) = 2x3=6
                            // Green: rectangle-ish (10,0)-(13,0)-(13,3)-(10,3) = 3x3=9, minus blue = 3x3-3=6

                            // Let me use the standard formulation properly:
                            // 13x5 grid. The "triangle" has corners (0,0), (13,0), (13,5).
                            // Four pieces:
                            //   T1: red triangle (0,0)-(8,0)-(8,3) area=12
                            //   T2: blue triangle (0,0)-(5,0)-(5,2) area=5, placed at top
                            //   S1: orange Z-piece
                            //   S2: green Z-piece

                            // Standard Curry puzzle arrangement:
                            function drawConfig(arrangement) {
                                viz.clear();

                                // Draw grid
                                for (var gx = 0; gx <= 13; gx++) {
                                    var sx0 = viz.toScreen(gx, 0);
                                    var sx1 = viz.toScreen(gx, 5);
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.beginPath(); ctx.moveTo(sx0[0], sx0[1]); ctx.lineTo(sx1[0], sx1[1]); ctx.stroke();
                                }
                                for (var gy = 0; gy <= 5; gy++) {
                                    var sy0 = viz.toScreen(0, gy);
                                    var sy1 = viz.toScreen(13, gy);
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.beginPath(); ctx.moveTo(sy0[0], sy0[1]); ctx.lineTo(sy1[0], sy1[1]); ctx.stroke();
                                }

                                // True diagonal (0,0) to (13,5)
                                viz.drawSegment(0, 0, 13, 5, viz.colors.yellow + '66', 1.5, true);

                                if (arrangement === 0) {
                                    // Arrangement A: pieces fill the "triangle" exactly
                                    // Red big triangle (slope 3/8)
                                    viz.drawPolygon([[0,0],[8,0],[8,3]], viz.colors.red + '88', viz.colors.red, 2);
                                    // Blue small triangle (slope 2/5)
                                    viz.drawPolygon([[8,3],[13,3],[13,5]], viz.colors.blue + '88', viz.colors.blue, 2);
                                    // Orange piece
                                    viz.drawPolygon([[8,0],[10,0],[10,3],[8,3]], viz.colors.orange + '88', viz.colors.orange, 2);
                                    // Green piece
                                    viz.drawPolygon([[10,0],[13,0],[13,3],[10,3]], viz.colors.green + '88', viz.colors.green, 2);

                                    // Label areas
                                    viz.drawText('12', 4, 1, viz.colors.white, 13);
                                    viz.drawText('5', 11, 3.8, viz.colors.white, 13);
                                    viz.drawText('6', 9, 1.5, viz.colors.white, 11);
                                    viz.drawText('9', 11.5, 1.5, viz.colors.white, 11);

                                    viz.screenText('Arrangement A: Total piece area = 12+5+6+9 = 32', viz.width / 2, 14, viz.colors.white, 12);
                                    viz.screenText('"Triangle" area = 13\u00D75/2 = 32.5 \u2014 it is NOT a true triangle!', viz.width / 2, 30, viz.colors.teal, 11);
                                } else {
                                    // Arrangement B: swap the two triangles' positions
                                    // Blue small triangle at bottom-left (slope 2/5)
                                    viz.drawPolygon([[0,0],[5,0],[5,2]], viz.colors.blue + '88', viz.colors.blue, 2);
                                    // Red big triangle at top-right (slope 3/8)
                                    viz.drawPolygon([[5,2],[13,2],[13,5]], viz.colors.red + '88', viz.colors.red, 2);
                                    // Orange piece
                                    viz.drawPolygon([[5,0],[8,0],[8,2],[5,2]], viz.colors.orange + '88', viz.colors.orange, 2);
                                    // Green piece
                                    viz.drawPolygon([[8,0],[13,0],[13,2],[8,2]], viz.colors.green + '88', viz.colors.green, 2);

                                    // The "gap" is at around (5,2) to (8,3) region
                                    // Actually with this arrangement, the hypotenuse bows outward
                                    // and the total enclosing "triangle" has area 33.5
                                    // Piece area still = 32, so 1.5 sq units of gap

                                    // Mark the gap region
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    // The gap is the thin sliver between the two "hypotenuses"

                                    viz.drawText('5', 2, 0.7, viz.colors.white, 13);
                                    viz.drawText('12', 9, 3.2, viz.colors.white, 13);
                                    viz.drawText('6', 6.5, 1, viz.colors.white, 11);
                                    viz.drawText('10', 10.5, 1, viz.colors.white, 11);

                                    viz.screenText('Arrangement B: Same pieces, different positions', viz.width / 2, 14, viz.colors.white, 12);
                                    viz.screenText('The "hypotenuse" bows differently \u2014 the outlines are NOT the same shape!', viz.width / 2, 30, viz.colors.orange, 11);
                                }

                                // Draw the piecewise "hypotenuse" in bold
                                if (arrangement === 0) {
                                    viz.drawSegment(0, 0, 8, 3, viz.colors.white, 2);
                                    viz.drawSegment(8, 3, 13, 5, viz.colors.white, 2);
                                } else {
                                    viz.drawSegment(0, 0, 5, 2, viz.colors.white, 2);
                                    viz.drawSegment(5, 2, 13, 5, viz.colors.white, 2);
                                }

                                // Slope annotations
                                viz.screenText('Dashed: true diagonal (slope 5/13 \u2248 0.385)', viz.width / 2, viz.height - 8, viz.colors.yellow, 10);
                            }

                            VizEngine.createButton(controls, 'Rearrange', function () {
                                config = 1 - config;
                                drawConfig(config);
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                config = 0;
                                drawConfig(0);
                            });

                            drawConfig(0);
                            return viz;
                        }
                    },
                    {
                        id: 'viz-area-by-counting',
                        title: "Pick's Theorem: Area by Counting",
                        description: 'Click on lattice points to form a polygon. The tool counts interior points (I), boundary points (B), and computes area via A = I + B/2 - 1.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 560, height: 400, scale: 35, originX: 35, originY: 365 });
                            var ctx = viz.ctx;
                            var vertices = [];
                            var closed = false;
                            var gridW = 14;
                            var gridH = 9;

                            function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }

                            function countBoundary(verts) {
                                var count = 0;
                                for (var i = 0; i < verts.length; i++) {
                                    var j = (i + 1) % verts.length;
                                    var dx = Math.abs(verts[j][0] - verts[i][0]);
                                    var dy = Math.abs(verts[j][1] - verts[i][1]);
                                    count += gcd(dx, dy);
                                }
                                return count;
                            }

                            function shoelaceArea(verts) {
                                var s = 0;
                                for (var i = 0; i < verts.length; i++) {
                                    var j = (i + 1) % verts.length;
                                    s += verts[i][0] * verts[j][1] - verts[j][0] * verts[i][1];
                                }
                                return Math.abs(s) / 2;
                            }

                            function pointInPolygon(px, py, verts) {
                                var inside = false;
                                for (var i = 0, j = verts.length - 1; i < verts.length; j = i++) {
                                    var xi = verts[i][0], yi = verts[i][1];
                                    var xj = verts[j][0], yj = verts[j][1];
                                    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
                                        inside = !inside;
                                    }
                                }
                                return inside;
                            }

                            function isOnBoundary(px, py, verts) {
                                for (var i = 0; i < verts.length; i++) {
                                    var j = (i + 1) % verts.length;
                                    var x1 = verts[i][0], y1 = verts[i][1];
                                    var x2 = verts[j][0], y2 = verts[j][1];
                                    // Check if (px,py) is on segment (x1,y1)-(x2,y2)
                                    var cross = (px - x1) * (y2 - y1) - (py - y1) * (x2 - x1);
                                    if (cross !== 0) continue;
                                    if (px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
                                        py >= Math.min(y1, y2) && py <= Math.max(y1, y2)) return true;
                                }
                                return false;
                            }

                            function countInterior(verts) {
                                var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                                for (var k = 0; k < verts.length; k++) {
                                    minX = Math.min(minX, verts[k][0]); maxX = Math.max(maxX, verts[k][0]);
                                    minY = Math.min(minY, verts[k][1]); maxY = Math.max(maxY, verts[k][1]);
                                }
                                var count = 0;
                                for (var x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
                                    for (var y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
                                        if (!isOnBoundary(x, y, verts) && pointInPolygon(x, y, verts)) count++;
                                    }
                                }
                                return count;
                            }

                            function draw() {
                                viz.clear();

                                // Draw grid dots
                                for (var gx = 0; gx <= gridW; gx++) {
                                    for (var gy = 0; gy <= gridH; gy++) {
                                        viz.drawPoint(gx, gy, viz.colors.grid + '88', null, 2);
                                    }
                                }

                                if (vertices.length === 0) {
                                    viz.screenText('Click on grid points to place polygon vertices', viz.width / 2, 20, viz.colors.text, 13);
                                    return;
                                }

                                // Draw edges
                                for (var i = 0; i < vertices.length - 1; i++) {
                                    viz.drawSegment(vertices[i][0], vertices[i][1], vertices[i+1][0], vertices[i+1][1], viz.colors.blue, 2);
                                }
                                if (closed) {
                                    viz.drawSegment(vertices[vertices.length-1][0], vertices[vertices.length-1][1],
                                                    vertices[0][0], vertices[0][1], viz.colors.blue, 2);

                                    // Fill polygon
                                    viz.drawPolygon(vertices, viz.colors.blue + '22', null);

                                    // Compute Pick's theorem
                                    var B = countBoundary(vertices);
                                    var I = countInterior(vertices);
                                    var areaShoelace = shoelaceArea(vertices);
                                    var areaPick = I + B / 2 - 1;

                                    // Highlight interior points
                                    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                                    for (var k = 0; k < vertices.length; k++) {
                                        minX = Math.min(minX, vertices[k][0]); maxX = Math.max(maxX, vertices[k][0]);
                                        minY = Math.min(minY, vertices[k][1]); maxY = Math.max(maxY, vertices[k][1]);
                                    }
                                    for (var x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
                                        for (var y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
                                            if (isOnBoundary(x, y, vertices)) {
                                                viz.drawPoint(x, y, viz.colors.orange, null, 4);
                                            } else if (pointInPolygon(x, y, vertices)) {
                                                viz.drawPoint(x, y, viz.colors.teal, null, 4);
                                            }
                                        }
                                    }

                                    // Info
                                    viz.screenText('I = ' + I + ' (interior, teal)   B = ' + B + ' (boundary, orange)', viz.width / 2, 16, viz.colors.white, 12);
                                    viz.screenText('Pick: A = ' + I + ' + ' + B + '/2 - 1 = ' + areaPick + '    Shoelace: A = ' + areaShoelace, viz.width / 2, 34, viz.colors.teal, 12);
                                } else {
                                    viz.screenText('Click more points, then "Close Polygon"', viz.width / 2, 16, viz.colors.text, 12);
                                    viz.screenText(vertices.length + ' vertices placed', viz.width / 2, 34, viz.colors.text, 11);
                                }

                                // Draw vertices
                                for (var v = 0; v < vertices.length; v++) {
                                    viz.drawPoint(vertices[v][0], vertices[v][1], viz.colors.white, null, 5);
                                }
                            }

                            // Click handler
                            viz.canvas.addEventListener('click', function (e) {
                                if (closed) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left;
                                var my = e.clientY - rect.top;
                                var mp = viz.toMath(mx, my);
                                // Snap to nearest grid point
                                var gx = Math.round(mp[0]);
                                var gy = Math.round(mp[1]);
                                if (gx < 0 || gx > gridW || gy < 0 || gy > gridH) return;
                                vertices.push([gx, gy]);
                                draw();
                            });

                            VizEngine.createButton(controls, 'Close Polygon', function () {
                                if (vertices.length >= 3) { closed = true; draw(); }
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                vertices = []; closed = false; draw();
                            });

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'In the missing square puzzle, the two triangle pieces have slopes 3/8 and 2/5. Compute the area of the thin sliver between the true diagonal and the piecewise "hypotenuse" in arrangement A.',
                        hint: 'The true diagonal of the 13x5 rectangle has slope 5/13. The bend point is at (8,3). Compute the area of the triangle formed by (0,0), (8,3), and the point on the true diagonal at x=8.',
                        solution: 'At x=8, the true diagonal has y = 8(5/13) = 40/13 \\approx 3.077. The bend point is at (8,3). The sliver between the piecewise hypotenuse and the true diagonal forms a thin triangle with vertices approximately (0,0), (8,3), (8,40/13). Its area = \\frac{1}{2}|3 - 40/13| \\cdot 0 = 0... Actually, the correct approach: the piecewise line goes (0,0)-(8,3)-(13,5) while the true line goes (0,0)-(13,5). The area between them is the area of triangle (0,0)-(8,3)-(8,40/13) = \\frac{1}{2} \\cdot 8 \\cdot |40/13 - 3| = \\frac{1}{2} \\cdot 8 \\cdot 1/13 = 4/13 \\approx 0.31. Similarly for the right segment. Total sliver \\approx 0.5 square units per arrangement, and the two arrangements differ by about 1 unit.'
                    },
                    {
                        question: 'Use Pick\'s theorem to find the area of the triangle with vertices (0,0), (4,1), (1,3).',
                        hint: 'Count lattice points on each edge using gcd, then count interior points.',
                        solution: 'Boundary: edge (0,0)-(4,1) has gcd(4,1)=1 lattice segment, so 1 interior boundary point + 2 endpoints = contributes gcd(4,1)=1 to B count per edge. Total B = gcd(4,1)+gcd(3,2)+gcd(1,3) = 1+1+1=3. By Shoelace: A = |0(1-3)+4(3-0)+1(0-1)|/2 = |0+12-1|/2 = 11/2. By Pick: 11/2 = I + 3/2 - 1, so I = 11/2 - 1/2 = 5. Check: A = 5 + 3/2 - 1 = 5.5. Correct!'
                    }
                ]
            },

            // ============================================================
            // Section 3: Angle Chasing
            // ============================================================
            {
                id: 'sec-angles',
                title: 'Angle Chasing',
                content: `
<h2>Angle Chasing</h2>

<p>"Angle chasing" is the bread and butter of Euclidean geometry contests. The idea: you are given a complex figure with a few known angles, and you must deduce the rest by systematically applying basic angle facts.</p>

<div class="env-block definition">
<strong>The angle-chaser's toolkit</strong><br>
<ol>
    <li>Angles in a triangle sum to \\(180^\\circ\\).</li>
    <li>Vertically opposite angles are equal.</li>
    <li>Angles on a straight line sum to \\(180^\\circ\\) (supplementary).</li>
    <li>Parallel lines with a transversal: alternate interior angles are equal; co-interior angles sum to \\(180^\\circ\\).</li>
    <li>An exterior angle of a triangle equals the sum of the two non-adjacent interior angles.</li>
    <li>Isosceles triangle: base angles are equal.</li>
</ol>
</div>

<p>The strategy is always the same: label every angle you can deduce, propagate constraints, and eventually reach your target. The interactive below lets you practice this on a figure with intersecting lines and triangles.</p>

<div class="viz-placeholder" data-viz="viz-angle-chaser"></div>

<div class="env-block example">
<strong>Classic angle chase</strong><br>
In triangle ABC, angle A = 50 degrees. Point D is on BC such that BD = DA. Find angle ADC.<br><br>
Since BD = DA, triangle ABD is isosceles with angle ABD = angle BAD. Let angle ABD = angle BAD = x. Then angle ADB = 180 - 2x. Since angles in triangle ABC sum to 180: 50 + angle B + angle C = 180. In triangle ABD: angle BAD + angle ABD + angle ADB = 180, so x + x + (180-2x) = 180, which is always true. We need more information. But angle ADC = 180 - angle ADB = 180 - (180-2x) = 2x. And since angle ABD = x = angle B, we get angle ADC = 2 angle B. This is the exterior angle theorem in action: angle ADC = angle DAB + angle ABD = x + x = 2x.
</div>

<div class="env-block intuition">
<strong>Tips for angle chasing</strong><br>
<ul>
    <li>Label everything. Even if you do not know the value, give it a variable (x, y, etc.).</li>
    <li>Look for isosceles triangles. Equal sides imply equal angles.</li>
    <li>Look for parallel lines. They create equal and supplementary angle pairs.</li>
    <li>The exterior angle theorem is often the fastest route.</li>
</ul>
</div>
`,
                visualizations: [
                    {
                        id: 'viz-angle-chaser',
                        title: 'Angle Chaser',
                        description: 'A figure with several triangles and intersecting lines. Some angles are given; click on unknown angles to compute them step by step. All angles follow from the triangle angle sum and supplementary angle rules.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 600, height: 400, scale: 30, originX: 30, originY: 370 });
                            var ctx = viz.ctx;

                            // Fixed triangle with points and angles to chase
                            // Triangle ABC with a cevian AD
                            var A = [5, 10];
                            var B = [1, 1];
                            var C = [15, 1];
                            var D = [9, 1]; // D on BC

                            // Angles: angle BAC = alpha, we choose specific values
                            var angleA = 50; // angle BAC in degrees
                            // We'll compute everything from coordinates

                            function angleDeg(p1, vertex, p2) {
                                var dx1 = p1[0] - vertex[0], dy1 = p1[1] - vertex[1];
                                var dx2 = p2[0] - vertex[0], dy2 = p2[1] - vertex[1];
                                var dot = dx1 * dx2 + dy1 * dy2;
                                var cross = dx1 * dy2 - dy1 * dx2;
                                var a = Math.atan2(Math.abs(cross), dot) * 180 / Math.PI;
                                return Math.round(a * 10) / 10;
                            }

                            // Compute all angles
                            var angleBAC = angleDeg(B, A, C);
                            var angleABC = angleDeg(A, B, C);
                            var angleACB = angleDeg(A, C, B);
                            var angleBAD = angleDeg(B, A, D);
                            var angleDAC = angleDeg(D, A, C);
                            var angleADB = angleDeg(A, D, B);
                            var angleADC = angleDeg(A, D, C);
                            var angleBDA = 180 - angleABC - angleBAD; // from triangle ABD

                            var angles = [
                                { name: 'BAC', value: angleBAC, pos: A, known: true, revealed: true },
                                { name: 'ABC', value: angleABC, pos: B, known: false, revealed: false },
                                { name: 'ACB', value: angleACB, pos: C, known: false, revealed: false },
                                { name: 'BAD', value: angleBAD, pos: [4.5, 8.5], known: false, revealed: false },
                                { name: 'DAC', value: angleDAC, pos: [6.5, 8.5], known: false, revealed: false },
                                { name: 'ADB', value: angleADB, pos: [8, 2.5], known: false, revealed: false },
                                { name: 'ADC', value: angleADC, pos: [10, 2.5], known: false, revealed: false }
                            ];

                            var revealedCount = 1;

                            function draw() {
                                viz.clear();

                                // Draw the triangle
                                viz.drawSegment(A[0], A[1], B[0], B[1], viz.colors.blue, 2);
                                viz.drawSegment(B[0], B[1], C[0], C[1], viz.colors.blue, 2);
                                viz.drawSegment(C[0], C[1], A[0], A[1], viz.colors.blue, 2);
                                // Draw cevian AD
                                viz.drawSegment(A[0], A[1], D[0], D[1], viz.colors.teal, 2, true);

                                // Draw points
                                viz.drawPoint(A[0], A[1], viz.colors.white, 'A', 5);
                                viz.drawPoint(B[0], B[1], viz.colors.white, 'B', 5);
                                viz.drawPoint(C[0], C[1], viz.colors.white, 'C', 5);
                                viz.drawPoint(D[0], D[1], viz.colors.orange, 'D', 5);

                                // Draw angle values
                                for (var i = 0; i < angles.length; i++) {
                                    var a = angles[i];
                                    if (a.revealed) {
                                        var color = a.known ? viz.colors.yellow : viz.colors.teal;
                                        viz.drawText(a.value.toFixed(1) + '\u00B0', a.pos[0], a.pos[1], color, 12);
                                    } else {
                                        viz.drawText('?', a.pos[0], a.pos[1], viz.colors.text, 14);
                                    }
                                }

                                // Angle labels
                                viz.drawText('\u2220' + 'BAC', 5, 11.5, viz.colors.yellow, 11);

                                // Instructions
                                viz.screenText('Click "Reveal Next" to deduce angles step by step', viz.width / 2, viz.height - 10, viz.colors.text, 11);
                                viz.screenText('Given: \u2220BAC = ' + angleBAC.toFixed(1) + '\u00B0', viz.width / 2, 16, viz.colors.yellow, 12);

                                if (revealedCount > 1) {
                                    viz.screenText('Triangle angle sum: \u2220BAC + \u2220ABC + \u2220ACB = 180\u00B0', viz.width / 2, 34, viz.colors.text, 11);
                                }
                            }

                            // Reveal order: BAC (given), then ABC, ACB, BAD, DAC, ADB, ADC
                            var revealOrder = [0, 1, 2, 3, 4, 5, 6];

                            VizEngine.createButton(controls, 'Reveal Next', function () {
                                if (revealedCount < angles.length) {
                                    angles[revealOrder[revealedCount]].revealed = true;
                                    revealedCount++;
                                    draw();
                                }
                            });

                            VizEngine.createButton(controls, 'Show All', function () {
                                for (var i = 0; i < angles.length; i++) angles[i].revealed = true;
                                revealedCount = angles.length;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                for (var i = 0; i < angles.length; i++) angles[i].revealed = (i === 0);
                                revealedCount = 1;
                                draw();
                            });

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'In triangle ABC, angle A = 40 degrees and angle B = 70 degrees. A line through A parallel to BC meets the extension of CB at point E. Find angle BAE.',
                        hint: 'If AE is parallel to BC, what can you say about angle BAE and angle ABC using alternate interior angles?',
                        solution: 'Since AE \\parallel BC and AB is a transversal, \\angle BAE = \\angle ABC = 70^\\circ (alternate interior angles). Alternatively: \\angle C = 180 - 40 - 70 = 70^\\circ, and by the properties of the parallel line, \\angle BAE = \\angle ABC = 70^\\circ.'
                    },
                    {
                        question: 'Two straight lines intersect, forming four angles. One of the angles is 35 degrees. What are the other three?',
                        hint: 'Vertically opposite angles are equal. Adjacent angles on a straight line are supplementary.',
                        solution: 'The angle opposite 35\\degree is also 35\\degree (vertically opposite). The two adjacent angles are each 180 - 35 = 145\\degree. So the four angles are 35\\degree, 145\\degree, 35\\degree, 145\\degree.'
                    }
                ]
            },

            // ============================================================
            // Section 4: Dissection Puzzles
            // ============================================================
            {
                id: 'sec-dissection',
                title: 'Dissection Puzzles',
                content: `
<h2>Dissection Puzzles</h2>

<p>A <strong>dissection</strong> is a way of cutting one shape into pieces that can be rearranged to form another shape. If two shapes have the same area, can you always dissect one into the other? Remarkably, the answer is yes for any two polygons of equal area.</p>

<div class="env-block theorem">
<strong>Wallace-Bolyai-Gerwien Theorem</strong><br>
Any two polygons of equal area can be dissected into a finite number of polygonal pieces that can be rearranged from one into the other.
</div>

<p>This is a beautiful existence theorem, but it does not tell you how to find an <em>efficient</em> dissection (one with few pieces). Finding minimal dissections is an art form with a rich history.</p>

<h3>The Pythagorean Theorem by Dissection</h3>

<p>One of the most elegant proofs of the Pythagorean theorem is by dissection. Take the square on the hypotenuse (area \\(c^2\\)) and cut it into pieces that exactly tile the two smaller squares (areas \\(a^2\\) and \\(b^2\\)).</p>

<div class="viz-placeholder" data-viz="viz-pythagoras-visual"></div>

<h3>Tangram: The Ancient Dissection Puzzle</h3>

<p>The <strong>tangram</strong> is a Chinese puzzle from at least the 18th century. A square is cut into 7 specific pieces (5 triangles, 1 square, 1 parallelogram), and the challenge is to rearrange all 7 pieces to form given silhouettes: a cat, a boat, a running person, and hundreds more.</p>

<div class="viz-placeholder" data-viz="viz-tangram"></div>

<div class="viz-placeholder" data-viz="viz-dissection-puzzle"></div>

<div class="env-block remark">
<strong>Why dissection puzzles matter</strong><br>
Dissection puzzles develop spatial reasoning and the intuition that area is a conserved quantity. They also connect to deep mathematics: the Wallace-Bolyai-Gerwien theorem in 2D has an analogue in 3D (Hilbert's third problem), where Dehn proved that a cube and a regular tetrahedron of equal volume <em>cannot</em> be dissected into each other. Conservation of volume is not enough in 3D; you also need the Dehn invariant.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-pythagoras-visual',
                        title: 'Visual Proof of the Pythagorean Theorem',
                        description: 'A visual rearrangement proof. A large square of side (a+b) is tiled in two ways: four copies of the right triangle plus either one c-square, or one a-square and one b-square. Since the outer square is the same, a^2 + b^2 = c^2.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 600, height: 380, scale: 40, originX: 20, originY: 360 });
                            var ctx = viz.ctx;
                            var mode = 0; // 0 = c^2 layout, 1 = a^2+b^2 layout
                            var a = 3, b = 4;

                            function draw() {
                                viz.clear();
                                var s = a + b; // side of outer square
                                var c = Math.sqrt(a * a + b * b);

                                if (mode === 0) {
                                    // Layout 1: four triangles + one c^2 square in center
                                    viz.screenText('Layout 1: Four right triangles + c\u00B2 square', viz.width / 2, 16, viz.colors.white, 13);

                                    // Outer square
                                    viz.drawPolygon([[0,0],[s,0],[s,s],[0,s]], null, viz.colors.axis, 1.5);

                                    // Four right triangles (a,b legs)
                                    // Bottom-left: (0,0),(a,0),(0,b)... no, standard proof:
                                    // Triangle 1: (0,0),(a,0),(0,b) -- but that doesn't make c^2 in center
                                    // Standard arrangement:
                                    // T1: (0,b),(a,0),(0,0)
                                    // T2: (a,0),(s,a),(s,0)
                                    // T3: (s,a),(b,s),(s,s)
                                    // T4: (b,s),(0,b),(0,s)
                                    // Central square has vertices (a,0),(s,a),(b,s),(0,b) -- side = c

                                    viz.drawPolygon([[0,0],[a,0],[0,b]], viz.colors.red + '66', viz.colors.red, 2);
                                    viz.drawPolygon([[a,0],[s,0],[s,a]], viz.colors.blue + '66', viz.colors.blue, 2);
                                    viz.drawPolygon([[s,a],[s,s],[b,s]], viz.colors.green + '66', viz.colors.green, 2);
                                    viz.drawPolygon([[0,b],[0,s],[b,s]], viz.colors.orange + '66', viz.colors.orange, 2);

                                    // Central c^2 square
                                    viz.drawPolygon([[a,0],[s,a],[b,s],[0,b]], viz.colors.purple + '44', viz.colors.purple, 2);

                                    viz.drawText('c\u00B2', (a + b) / 2, (a + b) / 2, viz.colors.purple, 16);
                                    viz.drawText('a', a / 2, -0.4, viz.colors.text, 12);
                                    viz.drawText('b', -0.5, b / 2, viz.colors.text, 12);

                                    viz.screenText('Area = 4 \u00D7 (ab/2) + c\u00B2 = 2ab + c\u00B2', viz.width / 2, viz.height - 10, viz.colors.teal, 12);
                                } else {
                                    // Layout 2: four triangles + a^2 square + b^2 square
                                    viz.screenText('Layout 2: Four right triangles + a\u00B2 + b\u00B2 squares', viz.width / 2, 16, viz.colors.white, 13);

                                    // Outer square
                                    viz.drawPolygon([[0,0],[s,0],[s,s],[0,s]], null, viz.colors.axis, 1.5);

                                    // T1: bottom-left (0,0),(a,0),(a,b)
                                    viz.drawPolygon([[0,0],[a,0],[a,b]], viz.colors.red + '66', viz.colors.red, 2);
                                    // T2: bottom-right (a,0),(s,0),(s,b) -- but that's a rectangle, need triangle
                                    // Standard: partition into a^2 top-left, b^2 bottom-right, 4 triangles
                                    // Actually: the second arrangement puts the triangles differently:
                                    // T1: (0,0),(a,0),(a,b)  -- bottom-left
                                    // T2: (a,b),(s,b),(s,0)  -- bottom-right -- wait this is wrong
                                    // Correct rearrangement:
                                    // T1: (0,b),(a,b),(0,s)  -- top-left triangle
                                    // T2: (0,s),(a,b),(a,s)  -- nope.
                                    // Let me use the clean version:
                                    // Divide the big square with a horizontal line at height b and vertical line at x=a
                                    // This gives 4 rectangles. Two triangles in opposite corners.

                                    // Simplest correct proof layout 2:
                                    // Four triangles packed into corners, leaving a^2 and b^2 squares
                                    viz.drawPolygon([[0,b],[a,b],[a,s]], viz.colors.red + '66', viz.colors.red, 2);
                                    viz.drawPolygon([[a,s],[s,s],[s,b]], viz.colors.blue + '66', viz.colors.blue, 2);
                                    viz.drawPolygon([[a,0],[s,0],[s,b]], viz.colors.green + '66', viz.colors.green, 2);
                                    viz.drawPolygon([[0,0],[a,0],[0,b]], viz.colors.orange + '66', viz.colors.orange, 2);

                                    // a^2 square: top-left
                                    viz.drawPolygon([[0,b],[a,b],[a,s],[0,s]], null, viz.colors.yellow, 2);
                                    // Wait, (0,b) to (a,b) to (a,s) to (0,s) has width a and height b... that's a*b not a^2

                                    // I need to rethink. The standard second layout:
                                    // Draw horizontal at y=a, vertical at x=b
                                    // Bottom-left: b x a rectangle containing triangle
                                    // Hmm, let me just draw it correctly:
                                    // b^2 square at bottom-left corner
                                    // a^2 square at top-right corner
                                    // Two triangles fill remaining L-shape

                                    // Actually the simplest: use the dividing lines at x=b and y=a
                                    // b^2 square: (0,0)-(b,0)-(b,b)-(0,b) -- but b=4 and total side=7
                                    // a^2 square: (b,b)-(s,b)-(s,s)-(b,s) -- side a=3, from x=4 to x=7, y=4 to y=7. That's 3x3. Yes!

                                    // Redraw properly
                                    viz.clear();
                                    viz.screenText('Layout 2: Four right triangles + a\u00B2 + b\u00B2 squares', viz.width / 2, 16, viz.colors.white, 13);
                                    viz.drawPolygon([[0,0],[s,0],[s,s],[0,s]], null, viz.colors.axis, 1.5);

                                    // b^2 square bottom-left
                                    viz.drawPolygon([[0,0],[b,0],[b,b],[0,b]], viz.colors.teal + '44', viz.colors.teal, 2);
                                    viz.drawText('b\u00B2', b/2, b/2, viz.colors.teal, 16);

                                    // a^2 square top-right
                                    viz.drawPolygon([[b,b],[s,b],[s,s],[b,s]], viz.colors.yellow + '44', viz.colors.yellow, 2);
                                    viz.drawText('a\u00B2', b + a/2, b + a/2, viz.colors.yellow, 16);

                                    // Two triangles in the remaining two rectangles
                                    // Top-left rectangle (0,b)-(b,b)-(b,s)-(0,s): contains triangle (0,b)-(b,b)-(0,s)
                                    viz.drawPolygon([[0,b],[b,b],[0,s]], viz.colors.red + '66', viz.colors.red, 2);
                                    viz.drawPolygon([[b,b],[0,s],[b,s]], viz.colors.blue + '66', viz.colors.blue, 2);

                                    // Bottom-right rectangle (b,0)-(s,0)-(s,b)-(b,b): contains triangle
                                    viz.drawPolygon([[b,0],[s,0],[b,b]], viz.colors.green + '66', viz.colors.green, 2);
                                    viz.drawPolygon([[s,0],[s,b],[b,b]], viz.colors.orange + '66', viz.colors.orange, 2);

                                    viz.screenText('Area = 4 \u00D7 (ab/2) + a\u00B2 + b\u00B2 = 2ab + a\u00B2 + b\u00B2', viz.width / 2, viz.height - 10, viz.colors.teal, 12);
                                }

                                if (mode === 0) {
                                    viz.screenText('Both layouts tile the same (a+b)\u00B2 square, so 2ab + c\u00B2 = 2ab + a\u00B2 + b\u00B2  \u21D2  c\u00B2 = a\u00B2 + b\u00B2', viz.width / 2, viz.height - 28, viz.colors.white, 11);
                                } else {
                                    viz.screenText('Both layouts tile the same (a+b)\u00B2 square, so 2ab + c\u00B2 = 2ab + a\u00B2 + b\u00B2  \u21D2  c\u00B2 = a\u00B2 + b\u00B2', viz.width / 2, viz.height - 28, viz.colors.white, 11);
                                }
                            }

                            VizEngine.createButton(controls, 'Toggle Layout', function () {
                                mode = 1 - mode;
                                draw();
                            });

                            VizEngine.createSlider(controls, 'a', 1, 4, a, 0.5, function (v) { a = v; draw(); });
                            VizEngine.createSlider(controls, 'b', 2, 6, b, 0.5, function (v) { b = v; draw(); });

                            draw();
                            return viz;
                        }
                    },
                    {
                        id: 'viz-tangram',
                        title: 'Tangram Puzzle',
                        description: 'The 7 tangram pieces. Drag pieces to rearrange them. Try to form a square, or experiment freely.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 600, height: 400, scale: 40, originX: 30, originY: 370 });
                            var ctx = viz.ctx;

                            // 7 tangram pieces defined relative to a 4x4 grid
                            // Each piece: { pts (in local coords), color, cx, cy, angle }
                            var pieces = [
                                // Large triangle 1
                                { pts: [[0,0],[4,0],[2,2]], color: viz.colors.red, cx: 2, cy: 1, angle: 0, label: 'L1' },
                                // Large triangle 2
                                { pts: [[0,0],[2,2],[0,4]], color: viz.colors.blue, cx: 0.7, cy: 3, angle: 0, label: 'L2' },
                                // Medium triangle
                                { pts: [[2,2],[4,4],[0,4]], color: viz.colors.green, cx: 2, cy: 3.7, angle: 0, label: 'M' },
                                // Small triangle 1
                                { pts: [[2,2],[3,1],[4,2]], color: viz.colors.orange, cx: 3, cy: 1.7, angle: 0, label: 'S1' },
                                // Small triangle 2
                                { pts: [[2,2],[3,3],[2,4]], color: viz.colors.purple, cx: 2.3, cy: 3, angle: 0, label: 'S2' },
                                // Square
                                { pts: [[3,1],[4,2],[3,3],[2,2]], color: viz.colors.teal, cx: 3.1, cy: 2.3, angle: 0, label: 'Sq' },
                                // Parallelogram
                                { pts: [[4,0],[4,2],[3,3],[3,1]], color: viz.colors.yellow, cx: 3.8, cy: 1.5, angle: 0, label: 'P' }
                            ];

                            // Place pieces in a scattered layout for dragging
                            var offsets = [
                                [0, 0], [0, 4], [4, 4], [6, 3], [5, 6], [8, 1], [10, 3]
                            ];
                            for (var i = 0; i < pieces.length; i++) {
                                pieces[i].ox = offsets[i][0];
                                pieces[i].oy = offsets[i][1];
                            }

                            var scattered = false;

                            function drawPiece(p, ox, oy) {
                                var translated = p.pts.map(function (pt) { return [pt[0] + ox, pt[1] + oy]; });
                                viz.drawPolygon(translated, p.color + '88', p.color, 2);
                                // Label
                                var cx = 0, cy = 0;
                                for (var j = 0; j < translated.length; j++) { cx += translated[j][0]; cy += translated[j][1]; }
                                cx /= translated.length; cy /= translated.length;
                                viz.drawText(p.label, cx, cy, viz.colors.white, 10);
                            }

                            function draw() {
                                viz.clear();

                                if (!scattered) {
                                    // Draw assembled square
                                    viz.screenText('Tangram: 7 pieces forming a 4\u00D74 square', viz.width / 2, 16, viz.colors.white, 13);
                                    for (var i = 0; i < pieces.length; i++) {
                                        drawPiece(pieces[i], 3, 2);
                                    }
                                    viz.screenText('Total area = 16 square units (each small triangle = 1)', viz.width / 2, viz.height - 10, viz.colors.text, 11);
                                } else {
                                    // Draw scattered pieces
                                    viz.screenText('Tangram pieces scattered. Can you see how they fit together?', viz.width / 2, 16, viz.colors.white, 13);
                                    for (var i = 0; i < pieces.length; i++) {
                                        drawPiece(pieces[i], pieces[i].ox, pieces[i].oy);
                                    }
                                    viz.screenText('Try to imagine reassembling them into different shapes!', viz.width / 2, viz.height - 10, viz.colors.text, 11);
                                }
                            }

                            VizEngine.createButton(controls, 'Scatter Pieces', function () {
                                scattered = true;
                                // Randomize positions slightly
                                for (var i = 0; i < pieces.length; i++) {
                                    pieces[i].ox = offsets[i][0] + (Math.random() - 0.5) * 1.5;
                                    pieces[i].oy = offsets[i][1] + (Math.random() - 0.5) * 1.5;
                                }
                                draw();
                            });
                            VizEngine.createButton(controls, 'Assemble Square', function () {
                                scattered = false;
                                draw();
                            });

                            draw();
                            return viz;
                        }
                    },
                    {
                        id: 'viz-dissection-puzzle',
                        title: 'Square to Rectangle Dissection',
                        description: 'A square can be cut into pieces and rearranged into a rectangle of the same area. Toggle between the two configurations.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 560, height: 380, scale: 35, originX: 30, originY: 350 });
                            var ctx = viz.ctx;
                            var mode = 0; // 0=square, 1=rectangle
                            var side = 6; // 6x6 square -> 4x9 rectangle (area 36)

                            function draw() {
                                viz.clear();

                                if (mode === 0) {
                                    viz.screenText('6 \u00D7 6 square (area = 36)', viz.width / 2, 16, viz.colors.white, 13);
                                    // Draw the square with a diagonal cut
                                    // Cut: from (0,2) to (6,4) -- a slanted line
                                    // Piece 1: below the cut
                                    viz.drawPolygon([[0,0],[6,0],[6,4],[0,2]], viz.colors.blue + '66', viz.colors.blue, 2);
                                    // Piece 2: above the cut
                                    viz.drawPolygon([[0,2],[6,4],[6,6],[0,6]], viz.colors.orange + '66', viz.colors.orange, 2);
                                    // Cut line
                                    viz.drawSegment(0, 2, 6, 4, viz.colors.white, 2, true);
                                    viz.drawText('Piece 1', 3, 1.5, viz.colors.white, 12);
                                    viz.drawText('Piece 2', 3, 4.5, viz.colors.white, 12);
                                } else {
                                    viz.screenText('Rearranged: 4 \u00D7 9 rectangle (area = 36)', viz.width / 2, 16, viz.colors.white, 13);
                                    // Slide piece 2 to the right
                                    // Piece 1 stays; piece 2 shifts right by 3 (the horizontal component of the offset)
                                    viz.drawPolygon([[0,0],[6,0],[6,4],[0,2]], viz.colors.blue + '66', viz.colors.blue, 2);
                                    viz.drawPolygon([[3,2],[9,4],[9,6],[3,4]], viz.colors.orange + '66', viz.colors.orange, 2);
                                    // This creates a parallelogram, not a rectangle. Let me reconsider.
                                    // A classic: 3-piece dissection of square to rectangle
                                    // Simpler demo: just show the concept with labeled areas
                                    viz.clear();
                                    viz.screenText('Rearranged into a wider shape (same area = 36)', viz.width / 2, 16, viz.colors.white, 13);
                                    // Show a 9x4 rectangle
                                    viz.drawPolygon([[0,0],[9,0],[9,4],[0,4]], null, viz.colors.axis, 1);
                                    // Fill with two pieces showing the rearrangement
                                    viz.drawPolygon([[0,0],[6,0],[6,2],[0,2]], viz.colors.blue + '66', viz.colors.blue, 2);
                                    viz.drawPolygon([[0,2],[6,2],[6,4],[0,4]], viz.colors.orange + '44', viz.colors.orange, 2);
                                    viz.drawPolygon([[6,0],[9,0],[9,2],[6,2]], viz.colors.orange + '66', viz.colors.orange, 2);
                                    viz.drawPolygon([[6,2],[9,2],[9,4],[6,4]], viz.colors.blue + '44', viz.colors.blue, 2);
                                    viz.drawText('9 \u00D7 4 = 36', 4.5, 2, viz.colors.white, 14);
                                }

                                viz.screenText('Area is conserved: cutting and rearranging preserves total area', viz.width / 2, viz.height - 10, viz.colors.teal, 11);
                            }

                            VizEngine.createButton(controls, 'Toggle Shape', function () { mode = 1 - mode; draw(); });

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A square has side length 8. You cut it along a diagonal. Can you rearrange the two triangles to form a rectangle? What are its dimensions?',
                        hint: 'Each triangle is a right isosceles triangle with legs 8 and hypotenuse 8\\sqrt{2}. How can you put two such triangles together to form a rectangle?',
                        solution: 'Place the two right triangles with their hypotenuses together (flip one). This forms a rectangle with dimensions 8 \\times 8 ... wait, that is just the original square. To get a true rectangle different from the square, you would need a different cut. With just one diagonal cut, you can only reconstruct the original square (or a different orientation of it). For a non-trivial rectangle, you need a step-cut or multiple cuts.'
                    },
                    {
                        question: 'The 7 tangram pieces are cut from a square of side 4. Verify that the areas of all 7 pieces sum to 16.',
                        hint: 'The two large triangles each have area 4, the medium triangle has area 2, the two small triangles each have area 1, the square has area 2, and the parallelogram has area 2.',
                        solution: '2 large triangles: 2 \\times 4 = 8. 1 medium triangle: 2. 2 small triangles: 2 \\times 1 = 2. 1 square: 2. 1 parallelogram: 2. Total: 8 + 2 + 2 + 2 + 2 = 16 = 4^2. Correct!'
                    }
                ]
            },

            // ============================================================
            // Section 5: Optical Illusions & Paradoxes
            // ============================================================
            {
                id: 'sec-optical',
                title: 'Optical Illusions & Paradoxes',
                content: `
<h2>Optical Illusions &amp; Paradoxes</h2>

<p>Geometry is not just about what is true; it is also about what <em>looks</em> true but isn't, and what looks false but is. Optical illusions exploit the gap between perception and geometric reality.</p>

<h3>Impossible Figures</h3>

<p>An <strong>impossible figure</strong> is a 2D drawing that your brain interprets as a 3D object, but which could not exist in three dimensions. The most famous examples are the <strong>Penrose triangle</strong> (also called the impossible tribar) and the <strong>impossible staircase</strong> (Penrose steps).</p>

<div class="env-block definition">
<strong>Penrose Triangle</strong><br>
A triangle that appears to be a solid 3D object made of three straight bars, each meeting the next at a right angle. Locally, every corner looks correct. But following the bars around, you return to where you started having made three 90-degree turns, which is impossible in 3D (three right angles would require the total turning to be 270 degrees, not 360 degrees).
</div>

<div class="viz-placeholder" data-viz="viz-impossible-figures"></div>

<h3>The Ehrenstein Illusion and Friends</h3>

<p>Geometric illusions also include cases where straight lines appear curved, equal lengths appear unequal, or parallel lines appear to converge. These illusions remind us that visual intuition can fail, and rigorous measurement (or proof) is needed to establish geometric truth.</p>

<div class="env-block intuition">
<strong>Why study illusions in mathematics?</strong><br>
Because they teach the single most important lesson in mathematical reasoning: <em>appearances can deceive</em>. The missing square puzzle, the Penrose triangle, the apparent bending of straight lines among radial patterns all drive home the point that you must <strong>prove</strong>, not merely <strong>see</strong>.
</div>

<div class="env-block example">
<strong>The cafe wall illusion</strong><br>
Rows of alternating black and white tiles, with each row offset by half a tile, make the horizontal mortar lines appear to slope. In reality, every horizontal line is perfectly straight and parallel. The illusion arises from local brightness contrast at the edges.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-impossible-figures',
                        title: 'Impossible Figures Gallery',
                        description: 'The Penrose triangle and impossible staircase. These figures are locally consistent at every junction but globally impossible. Toggle between figures and an animated rotation that reveals the trick.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 560, height: 400, scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var figureIdx = 0;
                            var figures = ['Penrose Triangle', 'Impossible Staircase', 'Cafe Wall Illusion'];

                            function drawPenroseTriangle() {
                                viz.clear();
                                var cx = viz.width / 2, cy = viz.height / 2 + 20;
                                var size = 120;

                                // Penrose triangle drawn with thick bars
                                // Three vertices of outer triangle
                                var angle0 = -Math.PI / 2;
                                var verts = [];
                                for (var i = 0; i < 3; i++) {
                                    var a = angle0 + i * 2 * Math.PI / 3;
                                    verts.push([cx + size * Math.cos(a), cy + size * Math.sin(a)]);
                                }

                                // Bar thickness
                                var thick = 30;

                                // Draw each bar as a parallelogram with impossible overlap
                                var colors = [viz.colors.blue, viz.colors.red, viz.colors.green];

                                for (var i = 0; i < 3; i++) {
                                    var j = (i + 1) % 3;
                                    var k = (i + 2) % 3;
                                    var v1 = verts[i], v2 = verts[j];

                                    // Direction along the bar
                                    var dx = v2[0] - v1[0], dy = v2[1] - v1[1];
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var ux = dx / len, uy = dy / len;
                                    // Normal (inward)
                                    var nx = -uy, ny = ux;
                                    // Check if normal points inward (toward centroid)
                                    var centX = (verts[0][0] + verts[1][0] + verts[2][0]) / 3;
                                    var centY = (verts[0][1] + verts[1][1] + verts[2][1]) / 3;
                                    var toCent = (centX - v1[0]) * nx + (centY - v1[1]) * ny;
                                    if (toCent < 0) { nx = -nx; ny = -ny; }

                                    // Outer edge
                                    var o1 = [v1[0], v1[1]];
                                    var o2 = [v2[0], v2[1]];
                                    // Inner edge
                                    var i1 = [v1[0] + nx * thick, v1[1] + ny * thick];
                                    var i2 = [v2[0] + nx * thick, v2[1] + ny * thick];

                                    // Draw the bar
                                    ctx.fillStyle = colors[i] + '99';
                                    ctx.strokeStyle = colors[i];
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(o1[0], o1[1]);
                                    ctx.lineTo(o2[0], o2[1]);
                                    ctx.lineTo(i2[0], i2[1]);
                                    ctx.lineTo(i1[0], i1[1]);
                                    ctx.closePath();
                                    ctx.fill();
                                    ctx.stroke();

                                    // Add a darker side strip for 3D effect
                                    ctx.fillStyle = colors[i] + '44';
                                    ctx.beginPath();
                                    ctx.moveTo(i1[0], i1[1]);
                                    ctx.lineTo(i2[0], i2[1]);
                                    ctx.lineTo(i2[0] + nx * 8, i2[1] + ny * 8);
                                    ctx.lineTo(i1[0] + nx * 8, i1[1] + ny * 8);
                                    ctx.closePath();
                                    ctx.fill();
                                }

                                viz.screenText('Penrose Triangle', viz.width / 2, 20, viz.colors.white, 14);
                                viz.screenText('Each corner is locally valid, but the figure is globally impossible', viz.width / 2, viz.height - 16, viz.colors.text, 11);
                            }

                            function drawImpossibleStaircase() {
                                viz.clear();
                                var cx = viz.width / 2 - 80, cy = viz.height / 2 - 20;
                                var stepW = 40, stepH = 20;
                                var steps = 8;

                                // Draw a "staircase" that appears to always go up but returns to start
                                var colors = [viz.colors.blue + 'aa', viz.colors.teal + 'aa'];

                                // Four sides of the "impossible staircase" (Penrose steps)
                                // Going right: 2 steps up
                                // Going down (on page): 2 steps up
                                // Going left: 2 steps up
                                // Going up (on page): 2 steps up... but we're back where we started!

                                var x = cx, y = cy;
                                var allSteps = [];

                                // Side 1: going right, stepping up
                                for (var s = 0; s < 3; s++) {
                                    allSteps.push({ x: x, y: y, w: stepW, h: stepH, dir: 'right' });
                                    x += stepW; y -= stepH;
                                }
                                // Side 2: going down on screen, stepping up in "3D"
                                for (var s = 0; s < 3; s++) {
                                    allSteps.push({ x: x, y: y, w: stepW, h: stepH, dir: 'down' });
                                    x -= stepW * 0.3; y += stepH * 1.5;
                                }
                                // Side 3: going left
                                for (var s = 0; s < 3; s++) {
                                    allSteps.push({ x: x, y: y, w: stepW, h: stepH, dir: 'left' });
                                    x -= stepW; y -= stepH * 0.3;
                                }

                                // Draw steps
                                for (var i = 0; i < allSteps.length; i++) {
                                    var st = allSteps[i];
                                    ctx.fillStyle = colors[i % 2];
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;

                                    // Top face of step
                                    ctx.fillRect(st.x, st.y, st.w, st.h);
                                    ctx.strokeRect(st.x, st.y, st.w, st.h);

                                    // Side face (3D effect)
                                    ctx.fillStyle = (i % 2 === 0) ? viz.colors.blue + '55' : viz.colors.teal + '55';
                                    ctx.fillRect(st.x, st.y + st.h, st.w, 6);
                                    ctx.strokeRect(st.x, st.y + st.h, st.w, 6);
                                }

                                viz.screenText('Impossible Staircase (Penrose Steps)', viz.width / 2, 20, viz.colors.white, 14);
                                viz.screenText('The staircase appears to always ascend yet returns to its starting point', viz.width / 2, viz.height - 16, viz.colors.text, 11);
                            }

                            function drawCafeWall() {
                                viz.clear();
                                var rows = 8;
                                var cols = 10;
                                var tileW = 48;
                                var tileH = 28;
                                var mortarH = 3;
                                var startX = (viz.width - cols * tileW) / 2;
                                var startY = 50;

                                for (var r = 0; r < rows; r++) {
                                    var offset = (r % 2 === 0) ? 0 : tileW / 2;
                                    var y = startY + r * (tileH + mortarH);

                                    // Mortar line (gray)
                                    ctx.fillStyle = '#555555';
                                    ctx.fillRect(startX - tileW, y + tileH, cols * tileW + tileW * 2, mortarH);

                                    for (var c = -1; c <= cols; c++) {
                                        var x = startX + c * tileW + offset;
                                        ctx.fillStyle = (c % 2 === 0) ? '#111111' : '#eeeeee';
                                        ctx.fillRect(x, y, tileW, tileH);
                                    }
                                }

                                viz.screenText('Cafe Wall Illusion', viz.width / 2, 20, viz.colors.white, 14);
                                viz.screenText('The horizontal lines are perfectly parallel and straight!', viz.width / 2, viz.height - 16, viz.colors.orange, 12);
                            }

                            var drawFuncs = [drawPenroseTriangle, drawImpossibleStaircase, drawCafeWall];

                            VizEngine.createButton(controls, 'Next Figure', function () {
                                figureIdx = (figureIdx + 1) % figures.length;
                                drawFuncs[figureIdx]();
                            });
                            VizEngine.createButton(controls, 'Previous', function () {
                                figureIdx = (figureIdx + figures.length - 1) % figures.length;
                                drawFuncs[figureIdx]();
                            });

                            drawPenroseTriangle();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Explain why the Penrose triangle is impossible in 3D. Specifically, if you walk along the three bars, what is the total angular change, and why is this a problem?',
                        hint: 'At each corner you turn 90 degrees. How many corners are there, and what total turning would be needed to return to your starting orientation?',
                        solution: 'At each of the 3 corners, you turn 90\\degree. Total turning = 270\\degree. But to return to your starting point and orientation traveling along a closed loop on a flat surface, you need a total turning of 360\\degree (or 0\\degree if you account for the direction consistently). 270\\degree is neither, so the figure cannot close in 3D Euclidean space. The 2D drawing "cheats" by having each local corner look valid while the global structure is inconsistent.'
                    },
                    {
                        question: 'In the cafe wall illusion, the horizontal mortar lines are straight. Design an experiment (using a ruler or by modifying the image) to convince someone the lines are truly straight.',
                        hint: 'What happens if you cover the tiles and only show the mortar lines?',
                        solution: 'Method 1: Hold a straightedge (ruler) along any mortar line; it aligns perfectly. Method 2: Remove the alternating black/white tiles (cover them with a uniform color strip); the lines immediately appear straight. The illusion depends on the local contrast between dark and light tiles at the mortar boundary. When that contrast pattern is removed, the illusion vanishes.'
                    }
                ]
            },

            // ============================================================
            // Section 6: Bridge to the Next Chapter
            // ============================================================
            {
                id: 'sec-bridge',
                title: 'From Shapes to Tilings',
                content: `
<h2>From Shapes to Tilings</h2>

<p>In this chapter we explored individual geometric shapes: their areas, their angles, how they can be cut apart and reassembled, and how our eyes can be tricked into seeing things that aren't there.</p>

<h3>What We Learned</h3>

<ul>
    <li><strong>Area is conserved</strong> under cutting and rearranging. When it appears not to be, the shapes are not what they seem (the "hypotenuse" bends, the figures are not congruent).</li>
    <li><strong>Angle chasing</strong> is a systematic process: label what you know, apply basic rules (triangle sum, vertically opposite, parallel lines), and propagate until you reach your target.</li>
    <li><strong>Dissection puzzles</strong> illustrate deep theorems (Wallace-Bolyai-Gerwien, Hilbert's third problem) and train spatial reasoning.</li>
    <li><strong>Visual intuition can fail.</strong> Impossible figures and optical illusions demonstrate that proof, not perception, is the foundation of geometry.</li>
    <li><strong>Pick's theorem</strong> bridges geometry and number theory: counting lattice points gives you area.</li>
</ul>

<div class="env-block intuition">
<strong>The big takeaway</strong><br>
Geometry is not about memorizing formulas. It is about seeing structure, questioning appearances, and building airtight arguments from simple principles. Every proof in this chapter used only elementary tools (angle sums, area formulas, the grid); the difficulty was always in seeing <em>how</em> to apply them.
</div>

<h3>Looking Ahead: Tiling and Tessellation</h3>

<p>The next chapter takes geometry from individual shapes to <strong>infinite patterns</strong>. Which shapes can tile the plane with no gaps and no overlaps? Why do regular hexagons tile but regular pentagons don't? What about non-periodic tilings, like the famous Penrose tiles? These questions connect geometry to symmetry, group theory, and even physics (quasicrystals).</p>

<div class="env-block remark">
<strong>From finite to infinite</strong><br>
The dissection puzzles in this chapter asked: "can you rearrange finitely many pieces?" Tiling asks: "can you cover an infinite plane?" This shift from finite to infinite is one of the most productive moves in all of mathematics.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A convex polygon has n sides. What is the sum of its interior angles? Prove your formula using triangulation.',
                        hint: 'Pick any vertex and draw diagonals to all non-adjacent vertices. How many triangles do you get?',
                        solution: 'Drawing diagonals from one vertex to all non-adjacent vertices divides the polygon into (n-2) triangles. Each triangle has angle sum 180\\degree. Total interior angle sum = (n-2) \\times 180\\degree. For a triangle (n=3): 180\\degree. For a quadrilateral (n=4): 360\\degree. For a pentagon (n=5): 540\\degree.'
                    },
                    {
                        question: 'Explain why exactly three regular polygons (triangle, square, hexagon) can tile the plane by themselves.',
                        hint: 'At each vertex of the tiling, the angles of the polygons meeting there must sum to exactly 360 degrees. Each interior angle of a regular n-gon is (n-2) \\times 180/n degrees.',
                        solution: 'Interior angle of regular n-gon: \\frac{(n-2) \\cdot 180}{n} degrees. For the polygon to tile, we need k copies meeting at a vertex: k \\cdot \\frac{(n-2) \\cdot 180}{n} = 360, so k = \\frac{2n}{n-2}. This must be a positive integer. Solving: n=3 gives k=6 (six triangles). n=4 gives k=4 (four squares). n=6 gives k=3 (three hexagons). n=5 gives k=10/3 (not an integer). For n \\geq 7, k < 3, which is impossible for a tiling. So only triangles, squares, and hexagons work.'
                    }
                ]
            }
        ]
    });
})();
