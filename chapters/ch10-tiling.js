// === Chapter 10: Tiling & Tessellation ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: 'Tiling & Tessellation',
    subtitle: 'Covering the plane without gaps or overlaps',
    sections: [
        // ============================================================
        // Section 1: Motivation — Why Tiling?
        // ============================================================
        {
            id: 'sec-motivation',
            title: 'Why Tiling?',
            content: `
<h2>Covering the Plane</h2>

<p>Walk into any bathroom or kitchen and look at the floor. Chances are, it is covered with tiles that fit together perfectly: no gaps between tiles, no tiles overlapping each other. This is a <strong>tessellation</strong>, and it is one of the oldest problems in mathematics.</p>

<div class="env-block intuition">
<strong>The Central Question.</strong> Given a shape, can you cover an infinite flat plane using copies of that shape, with no gaps and no overlaps? If so, which shapes work and which do not?
</div>

<p>Tiling is not merely decorative. It connects to deep mathematics: group theory (the symmetries of tilings), number theory (which rectangles can be tiled by dominoes), computability theory (the undecidability of the general tiling problem), and even physics (quasicrystals).</p>

<p>The ancient Sumerians tiled their floors with regular shapes over 4,000 years ago. Islamic artists created breathtaking geometric tilings in mosques across the medieval world. The Dutch artist M.C. Escher transformed tiling into art, filling planes with interlocking lizards, fish, and birds. And in 2023, David Smith discovered the first true "aperiodic monotile" (nicknamed "the hat"), settling a question that had been open for over 50 years.</p>

<div class="env-block definition">
<strong>Definition (Tessellation).</strong> A <strong>tessellation</strong> (or <strong>tiling</strong>) of the plane is a covering of the entire plane by non-overlapping shapes (called <strong>tiles</strong>) with no gaps. More precisely, the tiles cover every point of the plane, and no two tiles share any interior points.
</div>

<p>We begin with the simplest case: regular polygons.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ============================================================
        // Section 2: Regular Tessellations
        // ============================================================
        {
            id: 'sec-regular',
            title: 'Regular Tessellations',
            content: `
<h2>Regular Tessellations</h2>

<p>A <strong>regular tessellation</strong> uses copies of a single regular polygon, all the same size, fitting together edge-to-edge. Which regular polygons can tile the plane this way?</p>

<div class="env-block theorem">
<strong>Theorem 10.1.</strong> There are exactly three regular tessellations of the plane: by equilateral triangles, by squares, and by regular hexagons.
</div>

<p>The proof is elegant. At every vertex of the tiling, several polygons meet. The angles at that vertex must sum to exactly \\(360°\\). A regular \\(n\\)-gon has interior angles of</p>

\\[\\frac{(n-2) \\cdot 180°}{n}.\\]

<p>If \\(k\\) copies of a regular \\(n\\)-gon meet at a vertex, we need \\(k \\cdot \\frac{(n-2) \\cdot 180}{n} = 360\\), which simplifies to</p>

\\[k = \\frac{2n}{n - 2}.\\]

<p>For \\(k\\) to be a positive integer with \\(k \\geq 3\\) (at least 3 polygons must meet at a vertex), we need \\(n - 2\\) to divide \\(2n\\). Testing values:</p>

<ul>
<li>\\(n = 3\\) (triangle): \\(k = 6\\). Six equilateral triangles meet at each vertex. \\(6 \\times 60° = 360°\\). &#10003;</li>
<li>\\(n = 4\\) (square): \\(k = 4\\). Four squares meet at each vertex. \\(4 \\times 90° = 360°\\). &#10003;</li>
<li>\\(n = 5\\) (pentagon): \\(k = 10/3\\). Not an integer. &#10007;</li>
<li>\\(n = 6\\) (hexagon): \\(k = 3\\). Three hexagons meet at each vertex. \\(3 \\times 120° = 360°\\). &#10003;</li>
<li>\\(n \\geq 7\\): \\(k < 3\\), so fewer than 3 polygons meet, which is impossible for a tiling.</li>
</ul>

<p>Try it yourself: toggle between the three regular tilings below and see how the angles fit perfectly at each vertex.</p>

<div class="viz-placeholder" data-viz="viz-regular-tiling"></div>

<div class="viz-placeholder" data-viz="viz-vertex-angle"></div>
`,
            visualizations: [
                // --- VIZ 1: Regular Tiling Toggle ---
                {
                    id: 'viz-regular-tiling',
                    title: 'The Three Regular Tessellations',
                    description: 'Toggle between equilateral triangles, squares, and regular hexagons. Watch how copies tile the plane without gaps or overlaps.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 40, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var mode = 'square'; // 'triangle', 'square', 'hexagon'
                        var tileColors = ['#58a6ff22', '#3fb9a022', '#f0883e22', '#bc8cff22', '#3fb95022', '#f7811e22'];
                        var strokeColor = '#4a4a7a';

                        VizEngine.createButton(controls, 'Triangles', function() { mode = 'triangle'; draw(); });
                        VizEngine.createButton(controls, 'Squares', function() { mode = 'square'; draw(); });
                        VizEngine.createButton(controls, 'Hexagons', function() { mode = 'hexagon'; draw(); });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);
                            var s = 40; // tile size in pixels

                            if (mode === 'square') {
                                var cols = Math.ceil(w / s) + 1;
                                var rows = Math.ceil(h / s) + 1;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        var x = c * s;
                                        var y = r * s;
                                        ctx.fillStyle = tileColors[(r + c) % 2];
                                        ctx.fillRect(x, y, s, s);
                                        ctx.strokeStyle = strokeColor;
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(x, y, s, s);
                                    }
                                }
                                // Highlight one vertex
                                var vx = Math.floor(w / 2 / s) * s;
                                var vy = Math.floor(h / 2 / s) * s;
                                ctx.fillStyle = '#f8514988';
                                ctx.beginPath(); ctx.arc(vx, vy, 6, 0, Math.PI * 2); ctx.fill();
                                viz.screenText('4 squares, 4 x 90\u00B0 = 360\u00B0', w / 2, h - 20, '#f0f6fc', 13);
                            }

                            if (mode === 'triangle') {
                                var triH = s * Math.sqrt(3) / 2;
                                var rows2 = Math.ceil(h / triH) + 2;
                                var cols2 = Math.ceil(w / s) + 2;
                                for (var r2 = -1; r2 < rows2; r2++) {
                                    for (var c2 = -1; c2 < cols2; c2++) {
                                        // Upward triangle
                                        var x0 = c2 * s + (r2 % 2 === 0 ? 0 : s / 2);
                                        var y0 = r2 * triH;
                                        drawTri(x0, y0, s, triH, true, tileColors[(r2 * cols2 + c2) % 3]);
                                        // Downward triangle
                                        drawTri(x0 + s / 2, y0, s, triH, false, tileColors[(r2 * cols2 + c2 + 1) % 3 + 3]);
                                    }
                                }
                                var tvx = Math.floor(w / 2 / s) * s;
                                var tvy = Math.floor(h / 2 / triH) * triH;
                                ctx.fillStyle = '#f8514988';
                                ctx.beginPath(); ctx.arc(tvx, tvy, 6, 0, Math.PI * 2); ctx.fill();
                                viz.screenText('6 triangles, 6 x 60\u00B0 = 360\u00B0', w / 2, h - 20, '#f0f6fc', 13);
                            }

                            if (mode === 'hexagon') {
                                var R = s * 0.6; // circumradius
                                var hexW = R * Math.sqrt(3);
                                var hexH = R * 2;
                                var cols3 = Math.ceil(w / hexW) + 2;
                                var rows3 = Math.ceil(h / (hexH * 0.75)) + 2;
                                for (var r3 = -1; r3 < rows3; r3++) {
                                    for (var c3 = -1; c3 < cols3; c3++) {
                                        var cx2 = c3 * hexW + (r3 % 2 === 0 ? 0 : hexW / 2);
                                        var cy2 = r3 * hexH * 0.75;
                                        drawHex(cx2, cy2, R, tileColors[(r3 * cols3 + c3) % 3]);
                                    }
                                }
                                var hvx = Math.round(w / 2 / hexW) * hexW;
                                var hvy = Math.round(h / 2 / (hexH * 0.75)) * (hexH * 0.75) - R;
                                ctx.fillStyle = '#f8514988';
                                ctx.beginPath(); ctx.arc(hvx, hvy, 6, 0, Math.PI * 2); ctx.fill();
                                viz.screenText('3 hexagons, 3 x 120\u00B0 = 360\u00B0', w / 2, h - 20, '#f0f6fc', 13);
                            }

                            viz.screenText('Regular Tessellation: ' + mode + 's', w / 2, 18, '#f0f6fc', 15);
                        }

                        function drawTri(x, y, base, height, up, fill) {
                            ctx.beginPath();
                            if (up) {
                                ctx.moveTo(x, y + height);
                                ctx.lineTo(x + base / 2, y);
                                ctx.lineTo(x + base, y + height);
                            } else {
                                ctx.moveTo(x - base / 2, y);
                                ctx.lineTo(x, y + height);
                                ctx.lineTo(x + base / 2, y);
                            }
                            ctx.closePath();
                            ctx.fillStyle = fill; ctx.fill();
                            ctx.strokeStyle = strokeColor; ctx.lineWidth = 1; ctx.stroke();
                        }

                        function drawHex(cx, cy, R, fill) {
                            ctx.beginPath();
                            for (var i = 0; i < 6; i++) {
                                var angle = Math.PI / 6 + i * Math.PI / 3;
                                var px = cx + R * Math.cos(angle);
                                var py = cy + R * Math.sin(angle);
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            ctx.fillStyle = fill; ctx.fill();
                            ctx.strokeStyle = strokeColor; ctx.lineWidth = 1; ctx.stroke();
                        }

                        draw();
                        return viz;
                    }
                },
                // --- VIZ 2: Vertex Angle Proof ---
                {
                    id: 'viz-vertex-angle',
                    title: 'Why Only Three? The Vertex Angle Argument',
                    description: 'Drag the slider to change the number of sides n. See how the interior angle changes and whether copies can fit exactly around a point.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var nSides = 4;

                        VizEngine.createSlider(controls, 'Sides n', 3, 12, nSides, 1, function(v) {
                            nSides = Math.round(v);
                            draw();
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var cx = w * 0.35, cy = h * 0.5;
                            var R = Math.min(w, h) * 0.22;
                            var interiorAngle = (nSides - 2) * 180 / nSides;
                            var k = 360 / interiorAngle;
                            var kInt = Math.round(k);
                            var fits = Math.abs(k - kInt) < 0.01 && kInt >= 3;

                            // Draw polygon
                            ctx.beginPath();
                            for (var i = 0; i < nSides; i++) {
                                var a = -Math.PI / 2 + i * 2 * Math.PI / nSides;
                                var px = cx + R * Math.cos(a);
                                var py = cy + R * Math.sin(a);
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            ctx.fillStyle = fits ? '#58a6ff22' : '#f8514922';
                            ctx.fill();
                            ctx.strokeStyle = fits ? '#58a6ff' : '#f85149';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Draw interior angle arc at top vertex
                            var v0a = -Math.PI / 2;
                            var vx = cx + R * Math.cos(v0a);
                            var vy = cy + R * Math.sin(v0a);
                            // Two adjacent vertices
                            var a1 = -Math.PI / 2 + 2 * Math.PI / nSides;
                            var a2 = -Math.PI / 2 - 2 * Math.PI / nSides;
                            var v1x = cx + R * Math.cos(a1), v1y = cy + R * Math.sin(a1);
                            var v2x = cx + R * Math.cos(a2), v2y = cy + R * Math.sin(a2);

                            // Angle arc
                            var angStart = Math.atan2(v2y - vy, v2x - vx);
                            var angEnd = Math.atan2(v1y - vy, v1x - vx);
                            ctx.beginPath();
                            ctx.arc(vx, vy, 25, angStart, angEnd, false);
                            ctx.strokeStyle = '#f0883e';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Angle label
                            var angMid = (angStart + angEnd) / 2;
                            if (angEnd < angStart) angMid += Math.PI;
                            var lx = vx + 40 * Math.cos(angMid);
                            var ly = vy + 40 * Math.sin(angMid);
                            viz.screenText(interiorAngle.toFixed(1) + '\u00B0', lx, ly, '#f0883e', 13);

                            // Right side info
                            var infoX = w * 0.68, infoY = h * 0.2;
                            var names = {3:'Triangle',4:'Square',5:'Pentagon',6:'Hexagon',7:'Heptagon',8:'Octagon',9:'Nonagon',10:'Decagon',11:'Hendecagon',12:'Dodecagon'};
                            viz.screenText('Regular ' + (names[nSides] || nSides + '-gon'), infoX, infoY, '#f0f6fc', 15);
                            viz.screenText('n = ' + nSides + ' sides', infoX, infoY + 25, '#8b949e', 12);
                            viz.screenText('Interior angle = ' + interiorAngle.toFixed(1) + '\u00B0', infoX, infoY + 50, '#f0883e', 13);
                            viz.screenText('360\u00B0 / ' + interiorAngle.toFixed(1) + '\u00B0 = ' + k.toFixed(3), infoX, infoY + 75, '#8b949e', 12);

                            if (fits) {
                                viz.screenText(kInt + ' polygons fit at each vertex', infoX, infoY + 105, '#3fb950', 13);
                                viz.screenText('TESSELLATION POSSIBLE', infoX, infoY + 135, '#3fb950', 14);
                            } else {
                                viz.screenText('Not an integer! Gaps or overlaps.', infoX, infoY + 105, '#f85149', 13);
                                viz.screenText('TESSELLATION IMPOSSIBLE', infoX, infoY + 135, '#f85149', 14);
                            }

                            // Draw vertex arrangement on right
                            var avx = w * 0.68, avy = h * 0.72;
                            var aR = 50;
                            var nFit = Math.min(kInt, Math.floor(k));
                            if (nFit < 1) nFit = 1;
                            if (nFit > 8) nFit = 8;
                            var angleRad = interiorAngle * Math.PI / 180;
                            var usedAngle = 0;
                            for (var j = 0; j < nFit; j++) {
                                var startA = usedAngle;
                                var endA = usedAngle + angleRad;
                                ctx.beginPath();
                                ctx.moveTo(avx, avy);
                                ctx.lineTo(avx + aR * Math.cos(startA), avy + aR * Math.sin(startA));
                                ctx.arc(avx, avy, aR, startA, endA, false);
                                ctx.closePath();
                                ctx.fillStyle = ['#58a6ff33','#3fb9a033','#f0883e33','#bc8cff33','#3fb95033','#f778ba33','#d2992233','#f8514933'][j % 8];
                                ctx.fill();
                                ctx.strokeStyle = '#4a4a7a';
                                ctx.lineWidth = 1;
                                ctx.stroke();
                                usedAngle = endA;
                            }
                            // Show gap/overlap
                            var remaining = 2 * Math.PI - usedAngle;
                            if (Math.abs(remaining) > 0.02) {
                                ctx.beginPath();
                                ctx.moveTo(avx, avy);
                                ctx.arc(avx, avy, aR, usedAngle, 2 * Math.PI, false);
                                ctx.closePath();
                                ctx.fillStyle = remaining > 0 ? '#f8514944' : '#f8514944';
                                ctx.fill();
                                ctx.strokeStyle = '#f85149';
                                ctx.setLineDash([3, 3]);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                var gapLabel = remaining > 0 ? 'Gap: ' + (remaining * 180 / Math.PI).toFixed(1) + '\u00B0' : 'Overlap: ' + (-remaining * 180 / Math.PI).toFixed(1) + '\u00B0';
                                viz.screenText(gapLabel, avx, avy + aR + 18, '#f85149', 11);
                            } else {
                                viz.screenText('Perfect fit!', avx, avy + aR + 18, '#3fb950', 12);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A regular pentagon has interior angles of 108\u00B0. How many pentagons would need to meet at a vertex to tile the plane? Why does this fail?',
                    hint: 'Compute 360 / 108 and check if it is an integer.',
                    solution: '360 / 108 = 10/3 \\(\\approx\\) 3.33. Since this is not an integer, three pentagons leave a 36\u00B0 gap and four would overlap by 72\u00B0. Neither works, so regular pentagons cannot tile the plane.'
                },
                {
                    question: 'Can you tile the plane with regular octagons alone? What if you are allowed to mix in another regular polygon?',
                    hint: 'A regular octagon has interior angles of 135\u00B0. Try 360/135. For mixed tilings, think about what angle would fill the gap left by two octagons at a vertex.',
                    solution: '360/135 = 8/3, not an integer, so octagons alone cannot tile. Two octagons at a vertex use 270\u00B0, leaving a 90\u00B0 gap, which is exactly the interior angle of a square. This gives the classic octagon-square tiling (one of the Archimedean tilings).'
                }
            ]
        },

        // ============================================================
        // Section 3: Semi-Regular (Archimedean) Tessellations
        // ============================================================
        {
            id: 'sec-semi',
            title: 'Semi-Regular Tessellations',
            content: `
<h2>Semi-Regular (Archimedean) Tessellations</h2>

<p>If we allow <em>more than one type</em> of regular polygon, but still require that every vertex looks the same (the same arrangement of polygons around every vertex), we get the <strong>semi-regular</strong> or <strong>Archimedean</strong> tessellations.</p>

<div class="env-block definition">
<strong>Definition (Archimedean Tessellation).</strong> A tessellation of the plane is <strong>Archimedean</strong> (or semi-regular) if (1) it uses two or more types of regular polygons, edge-to-edge, (2) every vertex has the same cyclic arrangement of polygons, and (3) it is edge-to-edge (every edge is shared by exactly two polygons).
</div>

<p>There are exactly <strong>8</strong> Archimedean tessellations (plus the 3 regular ones, for 11 "uniform" tilings total). They are specified by listing the polygons around each vertex. For example, <strong>(3,6,3,6)</strong> means triangle, hexagon, triangle, hexagon around each vertex.</p>

<p>The 8 Archimedean tessellations are:</p>
<ol>
<li><strong>(3,3,3,3,6)</strong>: four triangles and a hexagon (snub hexagonal)</li>
<li><strong>(3,3,3,4,4)</strong>: three triangles and two squares (snub square)</li>
<li><strong>(3,3,4,3,4)</strong>: elongated triangular</li>
<li><strong>(3,4,6,4)</strong>: triangle, square, hexagon, square</li>
<li><strong>(3,6,3,6)</strong>: trihexagonal (kagome lattice)</li>
<li><strong>(3,12,12)</strong>: triangle and two dodecagons</li>
<li><strong>(4,6,12)</strong>: square, hexagon, dodecagon</li>
<li><strong>(4,8,8)</strong>: square and two octagons</li>
</ol>

<p>Explore them all in the gallery below. Each one satisfies the vertex condition: every vertex sees the same sequence of polygon types.</p>

<div class="viz-placeholder" data-viz="viz-archimedean"></div>
`,
            visualizations: [
                {
                    id: 'viz-archimedean',
                    title: 'Gallery of Archimedean Tessellations',
                    description: 'Click through the 8 Archimedean tilings. Each is specified by its vertex type (the sequence of polygons meeting at every vertex).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var tilings = [
                            { label: '(3,6,3,6)', desc: 'Trihexagonal / Kagome' },
                            { label: '(4,8,8)', desc: 'Truncated Square' },
                            { label: '(3,12,12)', desc: 'Truncated Hexagonal' },
                            { label: '(4,6,12)', desc: 'Great Rhombitrihexagonal' },
                            { label: '(3,4,6,4)', desc: 'Rhombitrihexagonal' },
                            { label: '(3,3,3,3,6)', desc: 'Snub Hexagonal' },
                            { label: '(3,3,3,4,4)', desc: 'Snub Square' },
                            { label: '(3,3,4,3,4)', desc: 'Elongated Triangular' }
                        ];
                        var current = 0;

                        var prevBtn = VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            current = (current - 1 + tilings.length) % tilings.length; draw();
                        });
                        var nextBtn = VizEngine.createButton(controls, 'Next \u25B6', function() {
                            current = (current + 1) % tilings.length; draw();
                        });

                        function regPoly(cx, cy, R, n, startAngle, fill, stroke) {
                            ctx.beginPath();
                            for (var i = 0; i < n; i++) {
                                var a = startAngle + i * 2 * Math.PI / n;
                                var px = cx + R * Math.cos(a);
                                var py = cy + R * Math.sin(a);
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                            ctx.strokeStyle = stroke || '#4a4a7a'; ctx.lineWidth = 1; ctx.stroke();
                        }

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var t = tilings[current];
                            viz.screenText(t.label + '  ' + t.desc, w / 2, 22, '#f0f6fc', 15);
                            viz.screenText((current + 1) + ' / ' + tilings.length, w / 2, h - 16, '#8b949e', 11);

                            var s = 30; // base edge length
                            var ox = w / 2, oy = h / 2;

                            // Draw a representative patch for each tiling type
                            if (current === 0) { // (3,6,3,6) trihexagonal
                                var R6 = s;
                                var hexW = R6 * Math.sqrt(3);
                                var hexH = R6 * 2;
                                for (var row = -4; row <= 4; row++) {
                                    for (var col = -5; col <= 5; col++) {
                                        var hx = ox + col * hexW + (row % 2 !== 0 ? hexW / 2 : 0);
                                        var hy = oy + row * hexH * 0.75;
                                        regPoly(hx, hy, R6, 6, Math.PI / 6, '#58a6ff15', '#58a6ff55');
                                        // Triangles fill the gaps
                                        for (var ti = 0; ti < 6; ti++) {
                                            var a1 = Math.PI / 6 + ti * Math.PI / 3;
                                            var a2 = a1 + Math.PI / 3;
                                            var mx = hx + R6 * Math.cos(a1);
                                            var my = hy + R6 * Math.sin(a1);
                                            var nx = hx + R6 * Math.cos(a2);
                                            var ny = hy + R6 * Math.sin(a2);
                                            var fx = (mx + nx) / 2 + (mx + nx) / 2 - hx;
                                            var fy = (my + ny) / 2 + (my + ny) / 2 - hy;
                                            ctx.beginPath();
                                            ctx.moveTo(mx, my); ctx.lineTo(nx, ny); ctx.lineTo(fx, fy); ctx.closePath();
                                            ctx.fillStyle = '#f0883e15'; ctx.fill();
                                            ctx.strokeStyle = '#f0883e55'; ctx.lineWidth = 1; ctx.stroke();
                                        }
                                    }
                                }
                            } else if (current === 1) { // (4,8,8) truncated square
                                var side = s;
                                var R8 = side / (2 * Math.sin(Math.PI / 8));
                                var spacing = side + 2 * R8 * Math.cos(Math.PI / 8);
                                for (var row2 = -3; row2 <= 3; row2++) {
                                    for (var col2 = -3; col2 <= 3; col2++) {
                                        var ox2 = ox + col2 * spacing;
                                        var oy2 = oy + row2 * spacing;
                                        regPoly(ox2, oy2, R8, 8, Math.PI / 8, '#3fb9a015', '#3fb9a055');
                                    }
                                }
                                // Squares fill the gaps
                                var halfSp = spacing / 2;
                                for (var row3 = -3; row3 <= 3; row3++) {
                                    for (var col3 = -3; col3 <= 3; col3++) {
                                        var sx2 = ox + col3 * spacing + halfSp;
                                        var sy2 = oy + row3 * spacing + halfSp;
                                        var sqR = side / Math.sqrt(2);
                                        regPoly(sx2, sy2, sqR, 4, Math.PI / 4, '#f0883e15', '#f0883e55');
                                    }
                                }
                            } else if (current === 2) { // (3,12,12) truncated hexagonal
                                var R12 = s / (2 * Math.sin(Math.PI / 12));
                                var d12 = R12 * 2 * Math.cos(Math.PI / 12);
                                for (var row4 = -3; row4 <= 3; row4++) {
                                    for (var col4 = -3; col4 <= 3; col4++) {
                                        var dx12 = ox + col4 * d12 * 1.05 + (row4 % 2 !== 0 ? d12 * 0.525 : 0);
                                        var dy12 = oy + row4 * d12 * 0.9;
                                        regPoly(dx12, dy12, R12, 12, Math.PI / 12, '#bc8cff15', '#bc8cff55');
                                    }
                                }
                            } else if (current === 3) { // (4,6,12) great rhombitrihexagonal
                                var R12b = s / (2 * Math.sin(Math.PI / 12));
                                for (var row5 = -2; row5 <= 2; row5++) {
                                    for (var col5 = -2; col5 <= 2; col5++) {
                                        var px5 = ox + col5 * R12b * 3.5 + (row5 % 2 !== 0 ? R12b * 1.75 : 0);
                                        var py5 = oy + row5 * R12b * 3;
                                        regPoly(px5, py5, R12b, 12, Math.PI / 12, '#f778ba15', '#f778ba55');
                                        // Surrounding hexagons
                                        for (var hi = 0; hi < 6; hi++) {
                                            var ha = hi * Math.PI / 3;
                                            var hdist = R12b * 1.9;
                                            regPoly(px5 + hdist * Math.cos(ha), py5 + hdist * Math.sin(ha), s * 0.6, 6, Math.PI / 6, '#3fb95015', '#3fb95055');
                                        }
                                    }
                                }
                            } else if (current === 4) { // (3,4,6,4) rhombitrihexagonal
                                var sR = s;
                                var hexR = sR;
                                var hexW2 = hexR * Math.sqrt(3);
                                for (var row6 = -4; row6 <= 4; row6++) {
                                    for (var col6 = -4; col6 <= 4; col6++) {
                                        var hx2 = ox + col6 * hexW2 + (row6 % 2 !== 0 ? hexW2 / 2 : 0);
                                        var hy2 = oy + row6 * hexR * 1.5;
                                        regPoly(hx2, hy2, hexR * 0.95, 6, Math.PI / 6, '#58a6ff15', '#58a6ff55');
                                        // Squares and triangles around
                                        for (var si = 0; si < 6; si++) {
                                            var sa = Math.PI / 6 + si * Math.PI / 3;
                                            var sdist = hexR * 1.35;
                                            var sqSize = sR * 0.4;
                                            regPoly(hx2 + sdist * Math.cos(sa), hy2 + sdist * Math.sin(sa), sqSize, 4, sa, '#d2992215', '#d2992255');
                                        }
                                    }
                                }
                            } else if (current === 5) { // (3,3,3,3,6) snub hexagonal
                                var shR = s;
                                var shW = shR * Math.sqrt(3);
                                for (var row7 = -4; row7 <= 4; row7++) {
                                    for (var col7 = -5; col7 <= 5; col7++) {
                                        var shx = ox + col7 * shW + (row7 % 2 !== 0 ? shW / 2 : 0);
                                        var shy = oy + row7 * shR * 1.5;
                                        regPoly(shx, shy, shR * 0.9, 6, Math.PI / 6, '#3fb95015', '#3fb95055');
                                        // Surrounding triangles
                                        for (var sti = 0; sti < 6; sti++) {
                                            var sta = sti * Math.PI / 3;
                                            var stx = shx + shR * 1.1 * Math.cos(sta);
                                            var sty = shy + shR * 1.1 * Math.sin(sta);
                                            regPoly(stx, sty, shR * 0.35, 3, sta + Math.PI / 6, '#f0883e15', '#f0883e55');
                                        }
                                    }
                                }
                            } else if (current === 6) { // (3,3,3,4,4) snub square
                                var ssS = s * 1.3;
                                for (var row8 = -5; row8 <= 5; row8++) {
                                    for (var col8 = -5; col8 <= 5; col8++) {
                                        var ssx = ox + col8 * ssS + (row8 % 2 !== 0 ? ssS * 0.5 : 0);
                                        var ssy = oy + row8 * ssS;
                                        var rot = (row8 + col8) % 2 === 0 ? 0 : Math.PI / 6;
                                        regPoly(ssx, ssy, ssS * 0.42, 4, rot, '#bc8cff15', '#bc8cff55');
                                        // Triangles
                                        for (var ssi = 0; ssi < 4; ssi++) {
                                            var ssa = rot + ssi * Math.PI / 2 + Math.PI / 4;
                                            regPoly(ssx + ssS * 0.45 * Math.cos(ssa), ssy + ssS * 0.45 * Math.sin(ssa), ssS * 0.22, 3, ssa, '#58a6ff15', '#58a6ff55');
                                        }
                                    }
                                }
                            } else { // (3,3,4,3,4) elongated triangular
                                var etS = s;
                                var triH2 = etS * Math.sqrt(3) / 2;
                                for (var row9 = -6; row9 <= 6; row9++) {
                                    for (var col9 = -6; col9 <= 6; col9++) {
                                        var etx = ox + col9 * etS;
                                        var ety = oy + row9 * (etS + triH2);
                                        // Square
                                        regPoly(etx, ety, etS * 0.5 * Math.sqrt(2), 4, Math.PI / 4, '#3fb9a015', '#3fb9a055');
                                        // Triangles above and below
                                        regPoly(etx, ety - etS * 0.5 - triH2 * 0.35, etS * 0.4, 3, -Math.PI / 2, '#f0883e15', '#f0883e55');
                                        regPoly(etx, ety + etS * 0.5 + triH2 * 0.35, etS * 0.4, 3, Math.PI / 2, '#f0883e15', '#f0883e55');
                                    }
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The vertex type (4,8,8) means a square and two octagons meet at each vertex. Verify that the angles sum to 360\u00B0.',
                    hint: 'A regular octagon has interior angle (8-2)\u00D7180/8 = 135\u00B0. A square has 90\u00B0.',
                    solution: '90\u00B0 + 135\u00B0 + 135\u00B0 = 360\u00B0. The angles fit perfectly.'
                },
                {
                    question: 'Why is (3,3,3,3,3,3) listed as a regular tessellation (6 triangles) and not an Archimedean one?',
                    hint: 'What is the definition of an Archimedean tessellation?',
                    solution: 'An Archimedean tessellation uses two or more types of regular polygon. The arrangement (3,3,3,3,3,3) uses only triangles, so it is regular, not semi-regular.'
                }
            ]
        },

        // ============================================================
        // Section 4: Domino Tiling
        // ============================================================
        {
            id: 'sec-domino',
            title: 'Domino Tiling',
            content: `
<h2>Domino Tiling</h2>

<p>A <strong>domino</strong> is a \\(1 \\times 2\\) rectangle (or equivalently, two unit squares glued along an edge). Given a region on a grid, can you cover it completely with non-overlapping dominoes?</p>

<div class="env-block definition">
<strong>Definition (Domino Tiling).</strong> A <strong>domino tiling</strong> of a region \\(R\\) is a way to place non-overlapping \\(1 \\times 2\\) dominoes so that every cell of \\(R\\) is covered by exactly one domino.
</div>

<p>A \\(2 \\times n\\) rectangle can always be tiled by dominoes (the number of tilings is the Fibonacci number \\(F_{n+1}\\)). But not all shapes can be tiled. A necessary condition is that the region has an even number of cells (each domino covers exactly 2 cells). Is this sufficient?</p>

<p>No! Consider a \\(2 \\times 2\\) square with two opposite corners removed. It has 2 cells, but they are not adjacent, so no domino can cover both. Coloring gives us a powerful tool for proving impossibility.</p>

<h3>The Coloring Argument</h3>

<p>Color the grid like a chessboard: alternating black and white cells. Each domino, no matter how it is placed, covers exactly one black cell and one white cell. Therefore, any region that can be tiled by dominoes must have <em>equal numbers of black and white cells</em>.</p>

<div class="env-block theorem">
<strong>Theorem 10.2 (Coloring Necessary Condition).</strong> If a region \\(R\\) on the integer grid can be tiled by \\(1 \\times 2\\) dominoes, then \\(R\\) has equally many black and white cells in any checkerboard coloring.
</div>

<p>This is a <em>necessary</em> condition, not a sufficient one, but it is surprisingly powerful. Try tiling the 6\u00D76 board below by dragging dominoes into place.</p>

<div class="viz-placeholder" data-viz="viz-domino-tiling"></div>

<h3>The Mutilated Chessboard</h3>

<p>A classic puzzle: take a standard 8\u00D78 chessboard (64 squares). Remove two diagonally opposite corners. Can you tile the remaining 62 squares with 31 dominoes?</p>

<p>The answer is <strong>no</strong>. The two removed corners are the <em>same color</em> (both white, say). So the remaining board has 32 black and 30 white cells. Since every domino covers one of each color, a tiling would require equal numbers, which is impossible.</p>

<div class="viz-placeholder" data-viz="viz-mutilated-chessboard"></div>
`,
            visualizations: [
                // --- VIZ 4: Interactive Domino Tiling ---
                {
                    id: 'viz-domino-tiling',
                    title: 'Domino Tiling Puzzle',
                    description: 'Click two adjacent cells to place a domino. Try to tile the entire 6\u00D76 board. Click a placed domino to remove it.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var gridSize = 6;
                        var cellSize = Math.min(50, Math.floor((Math.min(w, h) - 80) / gridSize));
                        var gridX = (w - gridSize * cellSize) / 2;
                        var gridY = (h - gridSize * cellSize) / 2 + 10;

                        // Grid state: 0 = empty, >0 = domino id
                        var grid = [];
                        for (var i = 0; i < gridSize; i++) {
                            grid[i] = [];
                            for (var j = 0; j < gridSize; j++) grid[i][j] = 0;
                        }
                        var dominoCount = 0;
                        var nextId = 1;
                        var selectedCell = null;
                        var dominoColors = {};
                        var palette = ['#58a6ff66', '#3fb9a066', '#f0883e66', '#bc8cff66', '#3fb95066', '#f778ba66', '#d2992266'];

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var a = 0; a < gridSize; a++)
                                for (var b = 0; b < gridSize; b++) grid[a][b] = 0;
                            dominoCount = 0; nextId = 1; selectedCell = null; dominoColors = {};
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left - gridX;
                            var my = e.clientY - rect.top - gridY;
                            var col = Math.floor(mx / cellSize);
                            var row = Math.floor(my / cellSize);
                            if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;

                            // If cell has domino, remove it
                            if (grid[row][col] > 0) {
                                var removeId = grid[row][col];
                                for (var a = 0; a < gridSize; a++)
                                    for (var b = 0; b < gridSize; b++)
                                        if (grid[a][b] === removeId) grid[a][b] = 0;
                                dominoCount--;
                                selectedCell = null;
                                draw();
                                return;
                            }

                            if (selectedCell === null) {
                                selectedCell = { r: row, c: col };
                                draw();
                            } else {
                                // Check adjacency
                                var dr = Math.abs(row - selectedCell.r);
                                var dc = Math.abs(col - selectedCell.c);
                                if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                                    if (grid[selectedCell.r][selectedCell.c] === 0 && grid[row][col] === 0) {
                                        grid[selectedCell.r][selectedCell.c] = nextId;
                                        grid[row][col] = nextId;
                                        dominoColors[nextId] = palette[(nextId - 1) % palette.length];
                                        nextId++;
                                        dominoCount++;
                                    }
                                }
                                selectedCell = null;
                                draw();
                            }
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            viz.screenText('Domino Tiling: ' + gridSize + '\u00D7' + gridSize + ' Board', w / 2, 18, '#f0f6fc', 14);

                            for (var r = 0; r < gridSize; r++) {
                                for (var c = 0; c < gridSize; c++) {
                                    var x = gridX + c * cellSize;
                                    var y = gridY + r * cellSize;

                                    // Checkerboard
                                    ctx.fillStyle = (r + c) % 2 === 0 ? '#1a1a40' : '#12122a';
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    // Domino fill
                                    if (grid[r][c] > 0) {
                                        ctx.fillStyle = dominoColors[grid[r][c]] || '#58a6ff44';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    }

                                    // Selected highlight
                                    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                                        ctx.fillStyle = '#f0883e55';
                                        ctx.fillRect(x, y, cellSize, cellSize);
                                    }

                                    ctx.strokeStyle = '#30363d';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);
                                }
                            }

                            // Draw domino borders (thicker lines between same-domino cells)
                            for (var r2 = 0; r2 < gridSize; r2++) {
                                for (var c2 = 0; c2 < gridSize; c2++) {
                                    if (grid[r2][c2] > 0) {
                                        var id = grid[r2][c2];
                                        var x2 = gridX + c2 * cellSize;
                                        var y2 = gridY + r2 * cellSize;
                                        // Remove internal edges
                                        if (r2 > 0 && grid[r2-1][c2] === id) {
                                            ctx.fillStyle = dominoColors[id] || '#58a6ff44';
                                            ctx.fillRect(x2 + 1, y2 - 1, cellSize - 2, 3);
                                        }
                                        if (c2 > 0 && grid[r2][c2-1] === id) {
                                            ctx.fillStyle = dominoColors[id] || '#58a6ff44';
                                            ctx.fillRect(x2 - 1, y2 + 1, 3, cellSize - 2);
                                        }
                                        // Thick outline
                                        ctx.strokeStyle = '#f0f6fc44';
                                        ctx.lineWidth = 2;
                                        // Top
                                        if (r2 === 0 || grid[r2-1][c2] !== id) { ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + cellSize, y2); ctx.stroke(); }
                                        // Bottom
                                        if (r2 === gridSize-1 || grid[r2+1][c2] !== id) { ctx.beginPath(); ctx.moveTo(x2, y2 + cellSize); ctx.lineTo(x2 + cellSize, y2 + cellSize); ctx.stroke(); }
                                        // Left
                                        if (c2 === 0 || grid[r2][c2-1] !== id) { ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2, y2 + cellSize); ctx.stroke(); }
                                        // Right
                                        if (c2 === gridSize-1 || grid[r2][c2+1] !== id) { ctx.beginPath(); ctx.moveTo(x2 + cellSize, y2); ctx.lineTo(x2 + cellSize, y2 + cellSize); ctx.stroke(); }
                                    }
                                }
                            }

                            var total = gridSize * gridSize / 2;
                            viz.screenText('Dominoes placed: ' + dominoCount + ' / ' + total, w / 2, h - 16, dominoCount === total ? '#3fb950' : '#8b949e', 12);
                            if (dominoCount === total) {
                                viz.screenText('Complete tiling!', w / 2, h - 34, '#3fb950', 14);
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                // --- VIZ 5: Mutilated Chessboard ---
                {
                    id: 'viz-mutilated-chessboard',
                    title: 'The Mutilated Chessboard',
                    description: 'An 8\u00D78 chessboard with two diagonally opposite corners removed. Try to tile with dominoes. The coloring argument shows it is impossible: 32 black cells but only 30 white cells.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var gridSize = 8;
                        var cellSize = Math.min(42, Math.floor((Math.min(w, h) - 100) / gridSize));
                        var gridX = (w - gridSize * cellSize) / 2 - 60;
                        var gridY = (h - gridSize * cellSize) / 2 + 10;

                        // Removed corners: top-left (0,0) and bottom-right (7,7)
                        var removed = [[0, 0], [7, 7]];
                        function isRemoved(r, c) {
                            for (var i = 0; i < removed.length; i++) {
                                if (removed[i][0] === r && removed[i][1] === c) return true;
                            }
                            return false;
                        }

                        var grid = [];
                        for (var i = 0; i < gridSize; i++) {
                            grid[i] = [];
                            for (var j = 0; j < gridSize; j++) grid[i][j] = 0;
                        }
                        var dominoCount = 0;
                        var nextId = 1;
                        var selectedCell = null;
                        var dominoColors = {};
                        var palette = ['#58a6ff55', '#3fb9a055', '#f0883e55', '#bc8cff55', '#3fb95055', '#f778ba55', '#d2992255'];
                        var showColoring = false;

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var a = 0; a < gridSize; a++)
                                for (var b = 0; b < gridSize; b++) grid[a][b] = 0;
                            dominoCount = 0; nextId = 1; selectedCell = null; dominoColors = {};
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show Coloring Argument', function() {
                            showColoring = !showColoring; draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left - gridX;
                            var my = e.clientY - rect.top - gridY;
                            var col = Math.floor(mx / cellSize);
                            var row = Math.floor(my / cellSize);
                            if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
                            if (isRemoved(row, col)) return;

                            if (grid[row][col] > 0) {
                                var removeId = grid[row][col];
                                for (var a = 0; a < gridSize; a++)
                                    for (var b = 0; b < gridSize; b++)
                                        if (grid[a][b] === removeId) grid[a][b] = 0;
                                dominoCount--;
                                selectedCell = null;
                                draw();
                                return;
                            }

                            if (selectedCell === null) {
                                selectedCell = { r: row, c: col };
                                draw();
                            } else {
                                var dr = Math.abs(row - selectedCell.r);
                                var dc = Math.abs(col - selectedCell.c);
                                if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                                    if (grid[selectedCell.r][selectedCell.c] === 0 && grid[row][col] === 0) {
                                        grid[selectedCell.r][selectedCell.c] = nextId;
                                        grid[row][col] = nextId;
                                        dominoColors[nextId] = palette[(nextId - 1) % palette.length];
                                        nextId++;
                                        dominoCount++;
                                    }
                                }
                                selectedCell = null;
                                draw();
                            }
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            viz.screenText('Mutilated Chessboard', w / 2, 18, '#f0f6fc', 14);

                            var blackCount = 0, whiteCount = 0;

                            for (var r = 0; r < gridSize; r++) {
                                for (var c = 0; c < gridSize; c++) {
                                    var x = gridX + c * cellSize;
                                    var y = gridY + r * cellSize;

                                    if (isRemoved(r, c)) {
                                        ctx.fillStyle = '#0c0c20';
                                        ctx.fillRect(x, y, cellSize, cellSize);
                                        ctx.strokeStyle = '#f8514955';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y + cellSize);
                                        ctx.moveTo(x + cellSize, y); ctx.lineTo(x, y + cellSize);
                                        ctx.stroke();
                                        continue;
                                    }

                                    var isBlack = (r + c) % 2 === 0;
                                    if (isBlack) blackCount++; else whiteCount++;

                                    if (showColoring) {
                                        ctx.fillStyle = isBlack ? '#2d333b' : '#c9d1d9';
                                    } else {
                                        ctx.fillStyle = isBlack ? '#1a1a40' : '#12122a';
                                    }
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    if (grid[r][c] > 0) {
                                        ctx.fillStyle = dominoColors[grid[r][c]] || '#58a6ff44';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    }

                                    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                                        ctx.fillStyle = '#f0883e55';
                                        ctx.fillRect(x, y, cellSize, cellSize);
                                    }

                                    ctx.strokeStyle = '#30363d';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);
                                }
                            }

                            // Right panel: coloring info
                            var infoX = gridX + gridSize * cellSize + 30;
                            var infoY = gridY + 10;

                            if (showColoring) {
                                viz.screenText('Coloring Argument:', infoX, infoY, '#f0f6fc', 13, 'left');
                                viz.screenText('Dark cells: ' + blackCount, infoX, infoY + 25, '#8b949e', 12, 'left');
                                viz.screenText('Light cells: ' + whiteCount, infoX, infoY + 45, '#c9d1d9', 12, 'left');
                                viz.screenText('Difference: ' + Math.abs(blackCount - whiteCount), infoX, infoY + 70, '#f85149', 13, 'left');
                                viz.screenText('Each domino covers', infoX, infoY + 100, '#8b949e', 11, 'left');
                                viz.screenText('1 dark + 1 light cell.', infoX, infoY + 116, '#8b949e', 11, 'left');
                                viz.screenText('Unequal counts', infoX, infoY + 140, '#f85149', 12, 'left');
                                viz.screenText('\u21D2 Impossible!', infoX, infoY + 158, '#f85149', 13, 'left');
                            }

                            viz.screenText('Dominoes: ' + dominoCount + ' / 31', w / 2, h - 16, '#8b949e', 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A \\(5 \\times 5\\) grid has 25 cells. Can it be tiled by dominoes? Explain without using the coloring argument.',
                    hint: 'Each domino covers exactly 2 cells.',
                    solution: 'No. Each domino covers 2 cells, so any tiling covers an even number of cells. But 25 is odd, so one cell must remain uncovered.'
                },
                {
                    question: 'A \\(6 \\times 6\\) board has two cells removed from the same row, both of the same color. Can the remaining 34 cells be tiled by dominoes?',
                    hint: 'Count the number of black and white cells after removal.',
                    solution: 'Since both removed cells have the same color, the remaining board has, say, 16 white and 18 black cells (or vice versa). Since 16 \\(\\neq\\) 18, the coloring argument shows tiling is impossible.'
                }
            ]
        },

        // ============================================================
        // Section 5: Polyominoes
        // ============================================================
        {
            id: 'sec-polyomino',
            title: 'Polyominoes',
            content: `
<h2>Polyominoes</h2>

<p>A <strong>polyomino</strong> is a plane figure formed by joining unit squares edge-to-edge. The name comes from "domino" (2 squares), extended to any number:</p>

<ul>
<li><strong>Monomino</strong>: 1 square (1 shape)</li>
<li><strong>Domino</strong>: 2 squares (1 shape)</li>
<li><strong>Tromino</strong>: 3 squares (2 shapes: straight and L-shaped)</li>
<li><strong>Tetromino</strong>: 4 squares (5 shapes, familiar from Tetris)</li>
<li><strong>Pentomino</strong>: 5 squares (12 shapes, usually named F, I, L, N, P, T, U, V, W, X, Y, Z)</li>
</ul>

<div class="env-block intuition">
<strong>The Tetris Connection.</strong> The 7 Tetris pieces are the 5 free tetrominoes (counting reflections as the same) with 2 of them having distinct mirror images. Every Tetris player is unknowingly exploring tiling problems!
</div>

<h3>Pentomino Puzzles</h3>

<p>The 12 pentominoes have a total area of \\(12 \\times 5 = 60\\) unit squares. A natural question: can all 12 pentominoes be assembled (without overlaps, no gaps) to fill a \\(6 \\times 10\\) rectangle? The answer is yes, and there are exactly 2,339 distinct solutions.</p>

<p>Other rectangles that work: \\(5 \\times 12\\), \\(4 \\times 15\\), and \\(3 \\times 20\\). The \\(3 \\times 20\\) case has only 2 solutions.</p>

<p>Explore the 12 pentominoes below, then try to fit them into a rectangle.</p>

<div class="viz-placeholder" data-viz="viz-pentomino"></div>
`,
            visualizations: [
                {
                    id: 'viz-pentomino',
                    title: 'The 12 Pentominoes',
                    description: 'All 12 free pentominoes, labeled F through Z. Each covers exactly 5 unit squares. Together they cover 60 squares, perfectly filling a 6\u00D710 rectangle.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        // Pentomino shapes: each is an array of [row, col] offsets
                        var pentominoes = {
                            'F': [[0,1],[1,0],[1,1],[1,2],[2,0]],
                            'I': [[0,0],[0,1],[0,2],[0,3],[0,4]],
                            'L': [[0,0],[1,0],[2,0],[3,0],[3,1]],
                            'N': [[0,0],[1,0],[1,1],[2,1],[3,1]],
                            'P': [[0,0],[0,1],[1,0],[1,1],[2,0]],
                            'T': [[0,0],[0,1],[0,2],[1,1],[2,1]],
                            'U': [[0,0],[0,2],[1,0],[1,1],[1,2]],
                            'V': [[0,0],[1,0],[2,0],[2,1],[2,2]],
                            'W': [[0,0],[1,0],[1,1],[2,1],[2,2]],
                            'X': [[0,1],[1,0],[1,1],[1,2],[2,1]],
                            'Y': [[0,0],[1,0],[1,1],[2,0],[3,0]],
                            'Z': [[0,0],[0,1],[1,1],[2,1],[2,2]]
                        };

                        var names = Object.keys(pentominoes);
                        var colors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950', '#f778ba',
                                      '#d29922', '#f85149', '#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff'];

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            viz.screenText('The 12 Pentominoes', w / 2, 20, '#f0f6fc', 15);

                            var cellSize = 18;
                            var cols = 6; // 6 per row, 2 rows
                            var padding = 14;
                            var blockW = cellSize * 5 + padding;
                            var blockH = cellSize * 5 + padding + 16;
                            var startX = (w - cols * blockW) / 2 + padding;
                            var startY = 45;

                            for (var i = 0; i < names.length; i++) {
                                var name = names[i];
                                var cells = pentominoes[name];
                                var col = i % cols;
                                var row = Math.floor(i / cols);
                                var bx = startX + col * blockW;
                                var by = startY + row * blockH;

                                // Label
                                ctx.fillStyle = colors[i];
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(name, bx + cellSize * 2.5, by + 12);

                                // Draw cells
                                for (var c = 0; c < cells.length; c++) {
                                    var cx2 = bx + cells[c][1] * cellSize;
                                    var cy2 = by + 18 + cells[c][0] * cellSize;
                                    ctx.fillStyle = colors[i] + '55';
                                    ctx.fillRect(cx2, cy2, cellSize - 1, cellSize - 1);
                                    ctx.strokeStyle = colors[i];
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx2, cy2, cellSize - 1, cellSize - 1);
                                }
                            }

                            // Info at bottom
                            viz.screenText('12 pieces \u00D7 5 squares = 60 total squares', w / 2, h - 40, '#8b949e', 12);
                            viz.screenText('Fits exactly in 6\u00D710, 5\u00D712, 4\u00D715, or 3\u00D720 rectangles', w / 2, h - 20, '#8b949e', 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many distinct tetrominoes are there? List them. (Two shapes are "the same" if one can be rotated and/or reflected into the other.)',
                    hint: 'Systematically build all connected arrangements of 4 unit squares.',
                    solution: 'There are 5 free tetrominoes: (1) the straight piece (I), (2) the square (O), (3) the T-shape, (4) the S/Z-shape, and (5) the L/J-shape. Tetris has 7 pieces because it distinguishes S from Z and L from J (mirror images).'
                },
                {
                    question: 'The X pentomino looks like a plus sign (+). Can a rectangle be tiled using only X pentominoes?',
                    hint: 'Think about what happens at the corners of the rectangle.',
                    solution: 'No. The corner cell of any rectangle can only be covered by an X pentomino whose center is at that corner, but then the X extends outside the rectangle. So no rectangle can be tiled by X pentominoes alone.'
                }
            ]
        },

        // ============================================================
        // Section 6: Bridge to the Next Chapter
        // ============================================================
        {
            id: 'sec-bridge',
            title: 'Beyond the Plane',
            content: `
<h2>Beyond the Plane</h2>

<p>We have explored tilings of the flat plane. But the world of tessellation extends far beyond.</p>

<h3>Escher and Artistic Tessellations</h3>

<p>The Dutch artist M.C. Escher (1898-1972) was fascinated by the regular tilings he saw in the Alhambra palace in Granada, Spain. He spent decades creating tessellations where the tiles were not abstract polygons but recognizable figures: lizards, fish, birds, angels and devils. His key insight was that any edge modification to a tile that is compensated by the opposite edge preserves the tiling property.</p>

<div class="viz-placeholder" data-viz="viz-escher"></div>

<h3>Aperiodic Tilings</h3>

<p>All the tilings we have seen so far are <strong>periodic</strong>: they have a repeating pattern that can be generated by translating a fundamental region. In 1966, Robert Berger showed that there exist tile sets that can tile the plane but only <em>non-periodically</em>. Roger Penrose later found a set of just two tiles (the "kite" and "dart") with this property.</p>

<p>The ultimate surprise came in 2023: David Smith, a retired printing technician and amateur mathematician, discovered a single tile (the "hat" or "einstein") that tiles the plane but only aperiodically. This settled a 50-year-old open problem.</p>

<h3>What Comes Next</h3>

<p>Tiling connects to many areas we will explore later:</p>
<ul>
<li><strong>Topology</strong> (Chapter 11): What happens when we tile surfaces that are not flat, like the surface of a sphere or a torus?</li>
<li><strong>Graph Theory</strong> (Chapter 12): Every tiling gives rise to a graph (vertices where tiles meet, edges where tiles share a boundary).</li>
<li><strong>Coloring</strong> (Chapter 13): How many colors do we need to color a tiling so that no two adjacent tiles share a color?</li>
</ul>

<div class="env-block remark">
<strong>Open Problem.</strong> For many simple shapes, we still do not know whether they can tile the plane. It has been proven (by Berger, 1966) that the general tiling problem is <strong>undecidable</strong>: there is no algorithm that can determine, for every possible tile set, whether it can tile the plane. This is one of the deepest connections between geometry and logic.
</div>
`,
            visualizations: [
                {
                    id: 'viz-escher',
                    title: 'Escher-Style Tessellation',
                    description: 'Watch a grid of squares morph into Escher-like interlocking shapes. The animation shows how modifying tile edges while preserving the tiling constraint creates recognizable figures.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var morphT = 0;
                        var animating = true;

                        VizEngine.createButton(controls, 'Play / Pause', function() {
                            animating = !animating;
                            if (animating) viz.animate(frame);
                        });

                        var slider = VizEngine.createSlider(controls, 'Morph', 0, 1, 0, 0.01, function(v) {
                            morphT = v;
                            if (!animating) drawScene(morphT);
                        });

                        // Generate a smooth "lizard-like" edge curve
                        function edgeCurve(t, amplitude) {
                            // t goes 0 to 1 along the edge
                            // Returns perpendicular offset
                            return amplitude * (
                                0.3 * Math.sin(t * Math.PI * 2) +
                                0.2 * Math.sin(t * Math.PI * 4) +
                                0.15 * Math.sin(t * Math.PI * 6 + 0.5) +
                                0.1 * Math.cos(t * Math.PI * 3 + 1)
                            );
                        }

                        // Complementary curve for head/tail shape
                        function headCurve(t, amplitude) {
                            return amplitude * (
                                0.4 * Math.sin(t * Math.PI) +
                                0.2 * Math.sin(t * Math.PI * 3) +
                                0.15 * Math.cos(t * Math.PI * 2 + 0.7)
                            );
                        }

                        var tileSize = 60;

                        function drawScene(morph) {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var cols = Math.ceil(w / tileSize) + 2;
                            var rows = Math.ceil(h / tileSize) + 2;
                            var amp = morph * tileSize * 0.15;
                            var palette = ['#58a6ff33', '#3fb9a033', '#f0883e33', '#bc8cff33'];
                            var strokePalette = ['#58a6ff88', '#3fb9a088', '#f0883e88', '#bc8cff88'];

                            for (var r = -1; r < rows; r++) {
                                for (var c = -1; c < cols; c++) {
                                    var ox = c * tileSize - tileSize / 2;
                                    var oy = r * tileSize - tileSize / 2;
                                    var colorIdx = ((r % 2) + 2) % 2 * 2 + ((c % 2) + 2) % 2;

                                    ctx.beginPath();
                                    // Top edge: modified
                                    var steps = 20;
                                    for (var i = 0; i <= steps; i++) {
                                        var t = i / steps;
                                        var px = ox + t * tileSize;
                                        var py = oy + edgeCurve(t, amp);
                                        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                    }
                                    // Right edge: modified
                                    for (var i2 = 0; i2 <= steps; i2++) {
                                        var t2 = i2 / steps;
                                        var px2 = ox + tileSize + headCurve(t2, amp);
                                        var py2 = oy + t2 * tileSize;
                                        ctx.lineTo(px2, py2);
                                    }
                                    // Bottom edge: same as top (translated) so tiles interlock
                                    for (var i3 = steps; i3 >= 0; i3--) {
                                        var t3 = i3 / steps;
                                        var px3 = ox + t3 * tileSize;
                                        var py3 = oy + tileSize + edgeCurve(t3, amp);
                                        ctx.lineTo(px3, py3);
                                    }
                                    // Left edge: same as right (translated)
                                    for (var i4 = steps; i4 >= 0; i4--) {
                                        var t4 = i4 / steps;
                                        var px4 = ox + headCurve(t4, amp);
                                        var py4 = oy + t4 * tileSize;
                                        ctx.lineTo(px4, py4);
                                    }
                                    ctx.closePath();
                                    ctx.fillStyle = palette[colorIdx];
                                    ctx.fill();
                                    ctx.strokeStyle = strokePalette[colorIdx];
                                    ctx.lineWidth = 1;
                                    ctx.stroke();

                                    // Draw "eye" if morphed enough
                                    if (morph > 0.3) {
                                        var eyeAlpha = Math.min(1, (morph - 0.3) / 0.4);
                                        var eyeX = ox + tileSize * 0.65;
                                        var eyeY = oy + tileSize * 0.3;
                                        ctx.globalAlpha = eyeAlpha;
                                        ctx.fillStyle = '#f0f6fc';
                                        ctx.beginPath();
                                        ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
                                        ctx.fill();
                                        ctx.fillStyle = '#0c0c20';
                                        ctx.beginPath();
                                        ctx.arc(eyeX + 0.5, eyeY, 1.5, 0, Math.PI * 2);
                                        ctx.fill();
                                        ctx.globalAlpha = 1;
                                    }
                                }
                            }

                            var label = morph < 0.1 ? 'Square grid' : morph < 0.5 ? 'Morphing edges...' : morph < 0.9 ? 'Recognizable shapes emerge' : 'Escher-like tessellation';
                            viz.screenText(label, w / 2, h - 16, '#f0f6fc', 13);
                        }

                        function frame(t) {
                            if (!animating) return;
                            morphT = (Math.sin(t / 2000) + 1) / 2;
                            slider.value = morphT;
                            drawScene(morphT);
                        }

                        viz.animate(frame);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In an Escher-style tessellation, you modify the top edge of a square tile with a bump. What must you do to the bottom edge to ensure the tiles still fit together?',
                    hint: 'Think about what happens when you stack two tiles vertically.',
                    solution: 'The bottom edge must have exactly the same modification (translated down by one tile height). When you stack two tiles, the bump on the top of the lower tile fits into the identical bump on the bottom of the upper tile, which is actually a dent when viewed from above. This is translation symmetry: the same curve appears on opposite edges.'
                },
                {
                    question: 'The "hat" aperiodic monotile discovered in 2023 can tile the plane, but only non-periodically. What does "non-periodically" mean in this context?',
                    hint: 'Think about what it means for a tiling pattern to repeat.',
                    solution: 'A tiling is periodic if there exists a nonzero translation vector that maps the entire tiling onto itself (i.e., sliding the whole pattern by some fixed amount in some direction reproduces the same pattern). A non-periodic tiling has no such translation. The hat tile is remarkable because it forces non-periodicity: any tiling of the plane using hat tiles is necessarily non-periodic.'
                }
            ]
        }
    ]
});
})();
