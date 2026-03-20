// === Chapter 11: Topology Puzzles ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11-topology',
    number: 11,
    title: 'Topology Puzzles',
    subtitle: 'Rubber sheet geometry: stretching but not tearing',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Why Topology?
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'Why Topology?',
            content: `
<h2>Why Topology?</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>Imagine you have a rubber doughnut. You can stretch it, squeeze it, bend it, and twist it however you like, but you cannot tear it or poke new holes. Can you turn it into a coffee cup?</p>
        <p>Surprisingly, the answer is <strong>yes</strong>. The doughnut's single hole becomes the handle of the cup. To a topologist, a doughnut and a coffee cup are the <em>same shape</em>.</p>
    </div>
</div>

<p>In ordinary geometry, we care about distances, angles, and exact measurements. Topology throws all of that away. Instead, it studies properties that survive <strong>continuous deformation</strong>: stretching and bending, but never tearing or gluing.</p>

<p>This might sound like it leaves nothing interesting behind. In fact, the opposite is true. Topology captures the deepest structural features of shapes: how many holes they have, whether a surface has one side or two, and whether a curve divides a region into "inside" and "outside."</p>

<h3>What Stays the Same?</h3>

<p>When you deform a rubber shape, some things change (lengths, angles, curvature) and some things do not:</p>
<ul>
    <li><strong>Number of holes</strong>: A sphere has 0 holes; a torus (doughnut) has 1. No amount of stretching can add or remove a hole.</li>
    <li><strong>Number of sides</strong>: A cylinder has two sides (inside and outside). A Mobius strip has only one. Stretching does not change this.</li>
    <li><strong>Connectedness</strong>: If a shape is in one piece, stretching keeps it in one piece.</li>
</ul>

<p>Properties that are preserved under continuous deformation are called <strong>topological invariants</strong>. The central question of topology is: given two shapes, are they topologically equivalent (called <em>homeomorphic</em>), or can you prove they are not by finding an invariant that differs?</p>

<div class="env-block definition">
    <div class="env-title">Definition (Homeomorphism)</div>
    <div class="env-body">
        <p>Two shapes are <strong>homeomorphic</strong> (topologically equivalent) if one can be continuously deformed into the other without tearing or gluing. Formally, there exists a continuous bijection between them whose inverse is also continuous.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Topology grew from Euler's 1736 solution of the Konigsberg bridge problem (which we saw in the Graph Theory chapter) and from his polyhedron formula \\(V - E + F = 2\\). The word "topology" comes from the Greek <em>topos</em> (place) and <em>logos</em> (study). It became a major branch of mathematics in the 20th century, with applications in physics, data science, robotics, and biology.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ─────────────────────────────────────────────
        // Section 2: The Mobius Strip
        // ─────────────────────────────────────────────
        {
            id: 'sec-mobius',
            title: 'The Mobius Strip',
            content: `
<h2>The Mobius Strip</h2>

<div class="env-block intuition">
    <div class="env-title">One Side, One Edge</div>
    <div class="env-body">
        <p>Take a strip of paper. Give it a <strong>half twist</strong> (180 degrees), then tape the ends together. You have just made a Mobius strip, one of the most famous objects in all of mathematics.</p>
    </div>
</div>

<p>The Mobius strip was discovered independently by August Ferdinand Mobius and Johann Benedict Listing in 1858. Its remarkable property is that it has <strong>only one side</strong>. If you start drawing a line along the middle of the strip, you will travel along both "sides" and return to your starting point without ever lifting your pen.</p>

<h3>Properties of the Mobius Strip</h3>

<ul>
    <li><strong>One side</strong>: Unlike a cylinder (which has an inside and an outside), the Mobius strip has a single continuous surface.</li>
    <li><strong>One edge</strong>: A cylinder has two circular edges (top and bottom). The Mobius strip has just one long edge that loops around twice.</li>
    <li><strong>Non-orientable</strong>: If you slide a clockwise arrow along the surface, it comes back counterclockwise. There is no consistent way to define "left" and "right" on a Mobius strip.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-mobius-construction"></div>

<h3>Cutting a Mobius Strip</h3>

<p>What happens if you cut a Mobius strip down the middle? You might expect two thinner Mobius strips. Instead, you get <strong>one long strip with two full twists</strong> (which has two sides and two edges). It is no longer a Mobius strip!</p>

<p>If you cut a Mobius strip one-third of the way from the edge, you get <strong>two linked rings</strong>: one is a thinner Mobius strip, and the other is the two-twist strip from before.</p>

<div class="env-block remark">
    <div class="env-title">Applications</div>
    <div class="env-body">
        <p>Mobius strips have practical uses. Industrial conveyor belts are sometimes given a half twist so that both "sides" of the belt wear evenly, doubling the belt's lifespan. The recycling symbol (three chasing arrows) forms a Mobius-like loop.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-mobius-construction',
                    title: 'Building a Mobius Strip',
                    description: 'Watch a paper strip receive a half twist and join its ends. Use the slider to control the twist angle.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var twistAngle = 0;
                        var joinProgress = 0;

                        VizEngine.createSlider(controls, 'Twist', 0, 180, 0, 1, function(v) {
                            twistAngle = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Join', 0, 100, 0, 1, function(v) {
                            joinProgress = v / 100;
                            draw();
                        });

                        function draw() {
                            viz.clear();

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Mobius Strip Construction', cx, 10);

                            var twistRad = twistAngle * Math.PI / 180;
                            var stripLen = 300;
                            var stripHalfW = 25;
                            var numSegments = 80;
                            var radius = stripLen / (2 * Math.PI);
                            var bendAmount = joinProgress;

                            // Draw the strip as a series of segments
                            for (var i = 0; i < numSegments; i++) {
                                var t = i / numSegments;
                                var tNext = (i + 1) / numSegments;

                                // Parametric position along the strip
                                // When bendAmount = 0, strip is flat; when 1, it's a full loop
                                var angle1 = t * 2 * Math.PI * bendAmount;
                                var angle2 = tNext * 2 * Math.PI * bendAmount;

                                var localTwist1 = t * twistRad;
                                var localTwist2 = tNext * twistRad;

                                var x1, y1, x2, y2;
                                if (bendAmount < 0.01) {
                                    // Flat strip
                                    x1 = cx - stripLen / 2 + t * stripLen;
                                    y1 = cy;
                                    x2 = cx - stripLen / 2 + tNext * stripLen;
                                    y2 = cy;
                                } else {
                                    var r = radius / bendAmount;
                                    x1 = cx + r * Math.cos(angle1 - Math.PI);
                                    y1 = cy + r * Math.sin(angle1 - Math.PI) * 0.5;
                                    x2 = cx + r * Math.cos(angle2 - Math.PI);
                                    y2 = cy + r * Math.sin(angle2 - Math.PI) * 0.5;
                                }

                                // Width modulated by local twist
                                var cos1 = Math.cos(localTwist1);
                                var cos2 = Math.cos(localTwist2);

                                // Perpendicular direction
                                var dx = x2 - x1, dy = y2 - y1;
                                var len = Math.sqrt(dx * dx + dy * dy) || 1;
                                var nx = -dy / len, ny = dx / len;

                                var halfW1 = stripHalfW * Math.abs(cos1);
                                var halfW2 = stripHalfW * Math.abs(cos2);

                                // Color based on which "side" faces up
                                var side1 = cos1 >= 0;
                                var side2 = cos2 >= 0;

                                var topColor = side1 ? viz.colors.blue : viz.colors.orange;
                                var alpha = '99';

                                ctx.fillStyle = topColor + alpha;
                                ctx.beginPath();
                                ctx.moveTo(x1 + nx * halfW1, y1 + ny * halfW1);
                                ctx.lineTo(x2 + nx * halfW2, y2 + ny * halfW2);
                                ctx.lineTo(x2 - nx * halfW2, y2 - ny * halfW2);
                                ctx.lineTo(x1 - nx * halfW1, y1 - ny * halfW1);
                                ctx.closePath();
                                ctx.fill();

                                // Edge lines
                                ctx.strokeStyle = viz.colors.white + '44';
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(x1 + nx * halfW1, y1 + ny * halfW1);
                                ctx.lineTo(x2 + nx * halfW2, y2 + ny * halfW2);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(x1 - nx * halfW1, y1 - ny * halfW1);
                                ctx.lineTo(x2 - nx * halfW2, y2 - ny * halfW2);
                                ctx.stroke();
                            }

                            // Labels
                            var infoY = h - 50;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var sides = twistAngle >= 170 ? '1 side' : '2 sides';
                            var edges = twistAngle >= 170 ? '1 edge' : '2 edges';
                            ctx.fillText('Twist: ' + Math.round(twistAngle) + '\u00B0   |   Sides: ' + sides + '   |   Edges: ' + edges, cx, infoY);

                            if (twistAngle >= 170 && joinProgress > 0.9) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillText('Mobius strip complete! One side, one edge.', cx, infoY + 20);
                            }

                            // Side color legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(cx - 100, infoY - 25, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'left';
                            ctx.fillText('Side A', cx - 84, infoY - 15);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(cx + 30, infoY - 25, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Side B', cx + 46, infoY - 15);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A cylinder is made by taping a strip of paper into a loop with no twist. How many sides and edges does it have?',
                    hint: 'Put your finger on the outside. Can you reach the inside without crossing an edge?',
                    solution: 'A cylinder has <strong>2 sides</strong> (inside and outside) and <strong>2 edges</strong> (the two circular rims at top and bottom). This contrasts with the Mobius strip, which has 1 side and 1 edge.'
                },
                {
                    question: 'If you cut a Mobius strip down the center line, how many pieces do you get? Is the result a Mobius strip?',
                    hint: 'Try it with actual paper! The result may surprise you.',
                    solution: 'You get <strong>1 piece</strong> (not two!). The result is a single longer strip with <strong>2 full twists</strong>. It has 2 sides and 2 edges, so it is NOT a Mobius strip. It is orientable.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: The Donut and the Coffee Cup
        // ─────────────────────────────────────────────
        {
            id: 'sec-donut',
            title: 'The Donut and the Coffee Cup',
            content: `
<h2>The Donut and the Coffee Cup</h2>

<div class="env-block intuition">
    <div class="env-title">Topological Equivalence</div>
    <div class="env-body">
        <p>A topologist is someone who cannot tell the difference between a donut and a coffee cup. This is the oldest topology joke, and it captures the key idea: two shapes are "the same" in topology if one can be continuously deformed into the other.</p>
    </div>
</div>

<p>The donut (mathematically, a <strong>torus</strong>) and a coffee cup with a handle are topologically equivalent. Both have exactly <strong>one hole</strong>. The donut's hole is obvious; the coffee cup's hole is the handle. You can imagine the donut made of clay: push one side in to form the cup's bowl, and the remaining hole becomes the handle.</p>

<div class="viz-placeholder" data-viz="viz-donut-cup"></div>

<h3>The Euler Characteristic</h3>

<p>One of the most powerful topological invariants is the <strong>Euler characteristic</strong>, denoted \\(\\chi\\). For any surface that can be divided into vertices (V), edges (E), and faces (F):</p>

\\[
\\chi = V - E + F
\\]

<p>Euler discovered that for any convex polyhedron (a surface topologically equivalent to a sphere), \\(\\chi = 2\\). This is his famous polyhedron formula. Remarkably, the Euler characteristic does not depend on how you divide the surface into faces, only on the topology of the surface.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Euler Characteristic of Surfaces)</div>
    <div class="env-body">
        <p>The Euler characteristic \\(\\chi = V - E + F\\) is a topological invariant:</p>
        <ul>
            <li>Sphere: \\(\\chi = 2\\)</li>
            <li>Torus (donut): \\(\\chi = 0\\)</li>
            <li>Double torus (pretzel): \\(\\chi = -2\\)</li>
            <li>In general, a surface with \\(g\\) holes: \\(\\chi = 2 - 2g\\)</li>
        </ul>
        <p>If two surfaces have different Euler characteristics, they are <strong>not</strong> topologically equivalent.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-characteristic"></div>

<div class="env-block example">
    <div class="env-title">Example: Verifying Euler's Formula</div>
    <div class="env-body">
        <p>A cube has \\(V = 8\\), \\(E = 12\\), \\(F = 6\\), so \\(\\chi = 8 - 12 + 6 = 2\\). A tetrahedron has \\(V = 4\\), \\(E = 6\\), \\(F = 4\\), so \\(\\chi = 4 - 6 + 4 = 2\\). Both are topologically spheres, so both give \\(\\chi = 2\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-donut-cup',
                    title: 'Donut to Coffee Cup Morph',
                    description: 'Watch a torus continuously deform into a coffee cup. Use the slider to control the transformation.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var morphT = 0;

                        VizEngine.createSlider(controls, 'Morph', 0, 100, 0, 1, function(v) {
                            morphT = v / 100;
                            draw();
                        });

                        var animating = false;
                        var animDir = 1;
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) {
                                viz.stopAnimation();
                                animating = false;
                                return;
                            }
                            animating = true;
                            viz.animate(function(time) {
                                morphT += animDir * 0.005;
                                if (morphT >= 1) { morphT = 1; animDir = -1; }
                                if (morphT <= 0) { morphT = 0; animDir = 1; }
                                draw();
                            });
                        });

                        function draw() {
                            viz.clear();

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Torus \u2194 Coffee Cup', cx, 10);

                            var t = morphT;
                            // Draw a simplified 2D cross-section morph
                            // Stage 1 (0-0.4): torus shrinks one side to form bowl
                            // Stage 2 (0.4-0.7): bowl deepens
                            // Stage 3 (0.7-1): handle narrows

                            var torusR = 80;  // major radius
                            var tubeR = 30;    // tube radius

                            if (t < 0.01) {
                                // Pure torus (2D projection: two concentric ellipses)
                                drawTorus(cx, cy, torusR, tubeR, 0);
                            } else if (t < 0.5) {
                                // Morphing: torus to intermediate
                                var s = t / 0.5;
                                drawTorus(cx - s * 40, cy, torusR, tubeR, s);
                            } else {
                                // Morphing: intermediate to cup
                                var s = (t - 0.5) / 0.5;
                                drawCup(cx, cy, s);
                            }

                            // Label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var label = t < 0.25 ? 'Torus (donut)' :
                                        t < 0.75 ? 'Deforming...' : 'Coffee cup';
                            ctx.fillText(label, cx, h - 40);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Both have exactly 1 hole \u2192 \u03C7 = 0', cx, h - 20);
                        }

                        function drawTorus(x, y, R, r, squeeze) {
                            // 2D torus projection as two ellipses with connecting arcs
                            var outerRx = R + r;
                            var outerRy = (R + r) * 0.4;
                            var innerRx = Math.max(5, (R - r) * (1 - squeeze * 0.8));
                            var innerRy = Math.max(3, (R - r) * 0.4 * (1 - squeeze * 0.8));

                            // Outer ellipse
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.ellipse(x, y, outerRx, outerRy, 0, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fill();
                            ctx.stroke();

                            // Inner hole
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(x, y, innerRx, innerRy, 0, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fill();
                            ctx.stroke();

                            // Hole label
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('hole', x, y);
                        }

                        function drawCup(x, y, s) {
                            // Draw a coffee cup shape
                            var cupW = 80 + s * 20;
                            var cupH = 80 + s * 30;
                            var handleW = 25 + s * 10;
                            var handleH = 40 + s * 15;

                            // Cup body
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 3;
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.beginPath();
                            ctx.moveTo(x - cupW / 2, y - cupH / 2);
                            ctx.lineTo(x - cupW / 2 + 10, y + cupH / 2);
                            ctx.quadraticCurveTo(x, y + cupH / 2 + 15, x + cupW / 2 - 10, y + cupH / 2);
                            ctx.lineTo(x + cupW / 2, y - cupH / 2);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();

                            // Cup rim
                            ctx.beginPath();
                            ctx.ellipse(x, y - cupH / 2, cupW / 2, 10, 0, 0, Math.PI * 2);
                            ctx.stroke();

                            // Handle (the hole!)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.ellipse(x + cupW / 2 + handleW / 2, y, handleW / 2, handleH / 2, 0, 0, Math.PI * 2);
                            ctx.stroke();

                            // Label the handle hole
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('hole', x + cupW / 2 + handleW / 2, y);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-euler-characteristic',
                    title: 'Euler Characteristic: V - E + F',
                    description: 'Explore the Euler characteristic for different polyhedra. Click through shapes to see that V - E + F always equals 2 for sphere-like shapes and 0 for the torus.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var shapes = [
                            { name: 'Tetrahedron', V: 4, E: 6, F: 4, chi: 2, topo: 'Sphere', color: '#58a6ff',
                              verts: [[0,-1.2],[-.9,.7],[.9,.7],[0,.1]], edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] },
                            { name: 'Cube', V: 8, E: 12, F: 6, chi: 2, topo: 'Sphere', color: '#3fb950',
                              verts: [[-.6,-.6],[.6,-.6],[.6,.6],[-.6,.6],[-.3,-.3],[.9,-.3],[.9,.9],[-.3,.9]],
                              edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] },
                            { name: 'Octahedron', V: 6, E: 12, F: 8, chi: 2, topo: 'Sphere', color: '#bc8cff',
                              verts: [[0,-1.2],[1,0],[0,1.2],[-1,0],[0.3,-0.3],[-0.3,0.3]],
                              edges: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5],[3,5]] },
                            { name: 'Icosahedron', V: 12, E: 30, F: 20, chi: 2, topo: 'Sphere', color: '#f0883e' },
                            { name: 'Torus mesh', V: 9, E: 18, F: 9, chi: 0, topo: 'Torus', color: '#f778ba' }
                        ];

                        var currentShape = 0;

                        VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            currentShape = (currentShape - 1 + shapes.length) % shapes.length;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next \u25B6', function() {
                            currentShape = (currentShape + 1) % shapes.length;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var s = shapes[currentShape];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(s.name, cx, 12);

                            // Shape drawing area
                            var shapeCx = cx - 80;
                            var shapeCy = cy;
                            var shapeScale = 70;

                            if (s.verts && s.edges) {
                                // Draw edges
                                ctx.strokeStyle = s.color + '88';
                                ctx.lineWidth = 2;
                                for (var i = 0; i < s.edges.length; i++) {
                                    var a = s.verts[s.edges[i][0]];
                                    var b = s.verts[s.edges[i][1]];
                                    ctx.beginPath();
                                    ctx.moveTo(shapeCx + a[0] * shapeScale, shapeCy + a[1] * shapeScale);
                                    ctx.lineTo(shapeCx + b[0] * shapeScale, shapeCy + b[1] * shapeScale);
                                    ctx.stroke();
                                }
                                // Draw vertices
                                for (var j = 0; j < s.verts.length; j++) {
                                    var vx = shapeCx + s.verts[j][0] * shapeScale;
                                    var vy = shapeCy + s.verts[j][1] * shapeScale;
                                    ctx.fillStyle = s.color;
                                    ctx.beginPath();
                                    ctx.arc(vx, vy, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            } else {
                                // Generic representation
                                ctx.strokeStyle = s.color;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                var sides = s.name === 'Icosahedron' ? 12 : 6;
                                for (var k = 0; k <= sides; k++) {
                                    var a2 = k * 2 * Math.PI / sides;
                                    var px = shapeCx + Math.cos(a2) * shapeScale;
                                    var py = shapeCy + Math.sin(a2) * shapeScale;
                                    k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                // Cross lines
                                for (var m = 0; m < sides; m++) {
                                    for (var n = m + 2; n < sides; n++) {
                                        if (Math.random() < 0.3) continue;
                                        var a3 = m * 2 * Math.PI / sides;
                                        var a4 = n * 2 * Math.PI / sides;
                                        ctx.strokeStyle = s.color + '44';
                                        ctx.lineWidth = 1;
                                        ctx.beginPath();
                                        ctx.moveTo(shapeCx + Math.cos(a3) * shapeScale, shapeCy + Math.sin(a3) * shapeScale);
                                        ctx.lineTo(shapeCx + Math.cos(a4) * shapeScale, shapeCy + Math.sin(a4) * shapeScale);
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Info panel on the right
                            var infoX = cx + 80;
                            var infoY = cy - 80;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillText('Vertices (V) = ' + s.V, infoX, infoY);
                            ctx.fillText('Edges (E) = ' + s.E, infoX, infoY + 25);
                            ctx.fillText('Faces (F) = ' + s.F, infoX, infoY + 50);

                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(infoX, infoY + 65);
                            ctx.lineTo(infoX + 160, infoY + 65);
                            ctx.stroke();

                            ctx.fillStyle = s.chi === 2 ? viz.colors.green : viz.colors.orange;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.fillText('\u03C7 = V - E + F = ' + s.V + ' - ' + s.E + ' + ' + s.F + ' = ' + s.chi, infoX, infoY + 85);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Topologically: ' + s.topo, infoX, infoY + 115);

                            // Bottom note
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('All convex polyhedra have \u03C7 = 2 (sphere). The torus has \u03C7 = 0.', cx, h - 15);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A dodecahedron has 20 vertices, 30 edges, and 12 faces. What is its Euler characteristic? Is it topologically a sphere or a torus?',
                    hint: 'Compute \\(V - E + F\\) and compare with the known values: sphere has \\(\\chi = 2\\), torus has \\(\\chi = 0\\).',
                    solution: '\\(\\chi = 20 - 30 + 12 = 2\\). Since \\(\\chi = 2\\), the dodecahedron is topologically a sphere. All convex polyhedra are topologically equivalent to a sphere.'
                },
                {
                    question: 'A surface has Euler characteristic \\(\\chi = -4\\). How many holes (genus) does it have?',
                    hint: 'Use the formula \\(\\chi = 2 - 2g\\) where \\(g\\) is the genus (number of holes).',
                    solution: 'From \\(\\chi = 2 - 2g\\), we get \\(-4 = 2 - 2g\\), so \\(2g = 6\\) and \\(g = 3\\). The surface has 3 holes (genus 3), like a pretzel with three loops.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: Knots & Links
        // ─────────────────────────────────────────────
        {
            id: 'sec-knots',
            title: 'Knots & Links',
            content: `
<h2>Knots & Links</h2>

<div class="env-block intuition">
    <div class="env-title">Tangled Up</div>
    <div class="env-body">
        <p>Tie a knot in a piece of string, then glue the ends together. The result is a <strong>mathematical knot</strong>: a closed loop in space that may or may not be tangled. The central question of knot theory is deceptively simple: given two knots, can you deform one into the other without cutting?</p>
    </div>
</div>

<p>In knot theory, a <strong>knot</strong> is a closed loop embedded in three-dimensional space. The simplest knot is the <strong>unknot</strong> (or trivial knot): a plain circle with no crossings. The simplest non-trivial knot is the <strong>trefoil</strong>, which has exactly 3 crossings.</p>

<h3>Knot Diagrams</h3>

<p>We usually represent knots as <strong>knot diagrams</strong>: pictures where the string crosses over or under itself at each crossing point. At each crossing, one strand passes over (drawn as a continuous line) and one passes under (drawn with a break).</p>

<div class="viz-placeholder" data-viz="viz-knot-gallery"></div>

<h3>Knot Invariants</h3>

<p>To prove two knots are different, we need <strong>knot invariants</strong>: quantities that do not change when we deform a knot (without cutting it). If two knots have different invariants, they must be different knots.</p>

<ul>
    <li><strong>Crossing number</strong>: The minimum number of crossings in any diagram of the knot. The unknot has crossing number 0; the trefoil has crossing number 3.</li>
    <li><strong>Tricolorability</strong>: A knot is <em>tricolorable</em> if its arcs can be colored with 3 colors such that at each crossing, either all three colors meet or only one color is used. The trefoil is tricolorable; the unknot is not.</li>
</ul>

<h3>Links</h3>

<p>A <strong>link</strong> is a collection of knots that may be tangled with each other. The simplest non-trivial link is the <strong>Hopf link</strong>: two circles that pass through each other once. The <strong>Borromean rings</strong> are three circles: no two are linked, but all three together cannot be separated.</p>

<div class="env-block remark">
    <div class="env-title">Why Knots Matter</div>
    <div class="env-body">
        <p>Knot theory has surprising applications: DNA can form knots, and enzymes called topoisomerases must untangle it. In chemistry, molecular knots have been synthesized. In physics, knot invariants appear in quantum field theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-knot-gallery',
                    title: 'Knot Gallery',
                    description: 'Explore famous knots. The trefoil and figure-eight knots cannot be untangled into a simple circle (unknot). Click through to see each knot and its properties.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2 - 20;

                        var knots = [
                            { name: 'Unknot', crossings: 0, tricolorable: false, desc: 'A simple circle. No crossings.' },
                            { name: 'Trefoil', crossings: 3, tricolorable: true, desc: 'The simplest non-trivial knot.' },
                            { name: 'Figure-Eight', crossings: 4, tricolorable: false, desc: 'The second simplest knot. Not tricolorable.' },
                            { name: 'Hopf Link', crossings: 2, tricolorable: false, desc: 'Two linked circles.' }
                        ];

                        var currentKnot = 0;

                        VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            currentKnot = (currentKnot - 1 + knots.length) % knots.length;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next \u25B6', function() {
                            currentKnot = (currentKnot + 1) % knots.length;
                            draw();
                        });

                        function drawUnknot(cx, cy, r) {
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 5;
                            ctx.beginPath();
                            ctx.arc(cx, cy, r, 0, Math.PI * 2);
                            ctx.stroke();
                        }

                        function drawTrefoil(cx, cy, scale) {
                            // Parametric trefoil knot projection
                            var colors = [viz.colors.blue, viz.colors.orange, viz.colors.green];
                            var points = [];
                            var N = 300;
                            for (var i = 0; i <= N; i++) {
                                var t = i * 2 * Math.PI / N;
                                var r2 = Math.cos(3 * t) * 0.4 + 1.0;
                                var x = cx + r2 * Math.cos(t) * scale;
                                var y = cy + r2 * Math.sin(t) * scale;
                                points.push([x, y, t]);
                            }

                            // Determine crossing regions (approximate)
                            var crossingTs = [Math.PI / 3, Math.PI, 5 * Math.PI / 3];
                            var crossingWidth = 0.15;

                            // Draw in segments, leaving gaps at undercrossings
                            ctx.lineWidth = 5;
                            for (var seg = 0; seg < N; seg++) {
                                var t2 = points[seg][2];
                                var isUnder = false;
                                for (var c = 0; c < crossingTs.length; c++) {
                                    var diff = Math.abs(t2 - crossingTs[c]);
                                    if (diff > Math.PI) diff = 2 * Math.PI - diff;
                                    if (diff < crossingWidth) { isUnder = true; break; }
                                }

                                if (isUnder) continue;

                                var colorIdx = Math.floor(t2 / (2 * Math.PI / 3)) % 3;
                                ctx.strokeStyle = colors[colorIdx];
                                ctx.beginPath();
                                ctx.moveTo(points[seg][0], points[seg][1]);
                                ctx.lineTo(points[seg + 1][0], points[seg + 1][1]);
                                ctx.stroke();
                            }
                        }

                        function drawFigureEight(cx, cy, scale) {
                            var points = [];
                            var N = 300;
                            for (var i = 0; i <= N; i++) {
                                var t = i * 2 * Math.PI / N;
                                // Lissajous-like figure-eight knot projection
                                var x = cx + (Math.sin(t) + 0.5 * Math.sin(3 * t)) * scale * 0.7;
                                var y = cy + (Math.cos(t) - 0.5 * Math.cos(3 * t)) * scale * 0.7;
                                points.push([x, y, t]);
                            }

                            var crossingTs = [0.7, 1.85, 3.6, 4.75];
                            var crossingWidth = 0.12;

                            ctx.lineWidth = 5;
                            for (var seg = 0; seg < N; seg++) {
                                var t2 = points[seg][2];
                                var isUnder = false;
                                for (var c = 0; c < crossingTs.length; c++) {
                                    var diff = Math.abs(t2 - crossingTs[c]);
                                    if (diff > Math.PI) diff = 2 * Math.PI - diff;
                                    if (diff < crossingWidth) { isUnder = true; break; }
                                }
                                if (isUnder) continue;

                                ctx.strokeStyle = viz.colors.purple;
                                ctx.beginPath();
                                ctx.moveTo(points[seg][0], points[seg][1]);
                                ctx.lineTo(points[seg + 1][0], points[seg + 1][1]);
                                ctx.stroke();
                            }
                        }

                        function drawHopfLink(cx, cy, scale) {
                            // Two linked circles at slight angle
                            ctx.lineWidth = 5;

                            // Circle 1
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.ellipse(cx - scale * 0.3, cy, scale * 0.6, scale * 0.45, 0, 0, Math.PI);
                            ctx.stroke();

                            // Circle 2 (behind part)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.ellipse(cx + scale * 0.3, cy, scale * 0.6, scale * 0.45, 0, 0, Math.PI);
                            ctx.stroke();

                            // Circle 2 (front part, drawn on top)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.ellipse(cx + scale * 0.3, cy, scale * 0.6, scale * 0.45, 0, Math.PI, 2 * Math.PI);
                            ctx.stroke();

                            // Circle 1 (front part, drawn on top)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.ellipse(cx - scale * 0.3, cy, scale * 0.6, scale * 0.45, 0, Math.PI, 2 * Math.PI);
                            ctx.stroke();
                        }

                        function draw() {
                            viz.clear();
                            var k = knots[currentKnot];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(k.name, cx, 12);

                            // Draw the knot
                            var knotScale = 80;
                            if (currentKnot === 0) drawUnknot(cx, cy, knotScale);
                            else if (currentKnot === 1) drawTrefoil(cx, cy, knotScale);
                            else if (currentKnot === 2) drawFigureEight(cx, cy, knotScale);
                            else if (currentKnot === 3) drawHopfLink(cx, cy, knotScale);

                            // Info
                            var infoY = h - 70;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(k.desc, cx, infoY);
                            ctx.fillText('Min crossings: ' + k.crossings + '   |   Tricolorable: ' + (k.tricolorable ? 'Yes' : 'No'), cx, infoY + 20);

                            ctx.fillStyle = viz.colors.text + '88';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('(' + (currentKnot + 1) + '/' + knots.length + ') Use buttons to browse', cx, infoY + 42);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why is the unknot not tricolorable?',
                    hint: 'Tricolorability requires that at each crossing, either all three colors meet or only one color is used. An unknot diagram with zero crossings has how many arcs?',
                    solution: 'An unknot with zero crossings has exactly one arc, so it can only use one color. Tricolorability requires that <strong>at least two colors</strong> are used in total. Since only one color appears, the unknot is not tricolorable. This proves the trefoil (which is tricolorable) is genuinely different from the unknot.'
                },
                {
                    question: 'The Borromean rings consist of three linked circles. If you remove any one ring, the other two fall apart (are unlinked). Can you describe a real-world object with this property?',
                    hint: 'Think about rings, chains, or puzzles where removing one part frees the rest.',
                    solution: 'Several examples: (1) Some coat-of-arms designs use interlocking rings with this property. (2) A molecular Borromean ring was synthesized in 2004. (3) The Valknut symbol in Norse art has this structure. The key property is that no pair is linked, but the triple is inseparable.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Inside vs Outside (Jordan Curve Theorem)
        // ─────────────────────────────────────────────
        {
            id: 'sec-jordan',
            title: 'Inside vs Outside',
            content: `
<h2>Inside vs Outside</h2>

<div class="env-block intuition">
    <div class="env-title">A Deceptively Simple Fact</div>
    <div class="env-body">
        <p>Draw any closed curve on a piece of paper (it can be as wiggly and complicated as you like, as long as it does not cross itself). The curve divides the paper into exactly two regions: an <strong>inside</strong> and an <strong>outside</strong>.</p>
        <p>This seems obvious. But proving it rigorously is one of the most famously difficult results in topology.</p>
    </div>
</div>

<h3>The Jordan Curve Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Jordan Curve Theorem)</div>
    <div class="env-body">
        <p>Every simple (non-self-intersecting) closed curve in the plane divides the plane into exactly two connected regions: a bounded <strong>interior</strong> and an unbounded <strong>exterior</strong>. The curve is the boundary of each region.</p>
    </div>
</div>

<p>This theorem was stated by Camille Jordan in 1887. His original proof had gaps, and the first rigorous proof was given by Oswald Veblen in 1905. The difficulty lies not with simple curves like circles or rectangles, but with extremely complicated, space-filling-like curves where "inside" and "outside" become hard to tell apart visually.</p>

<div class="viz-placeholder" data-viz="viz-jordan-curve"></div>

<h3>The Crossing Number Test</h3>

<p>There is a practical way to determine if a point is inside or outside a simple closed curve: draw a ray from the point in any direction and count how many times it crosses the curve.</p>

<ul>
    <li><strong>Odd crossings</strong>: the point is inside.</li>
    <li><strong>Even crossings</strong>: the point is outside.</li>
</ul>

<p>This works because every time you cross the curve, you switch between inside and outside. Starting from far away (definitely outside), an odd number of crossings puts you inside.</p>

<div class="env-block example">
    <div class="env-title">Example: Maze Solving</div>
    <div class="env-body">
        <p>The crossing number test gives a quick way to solve certain maze puzzles. If the maze boundary is a simple closed curve, you can determine whether the goal is on the same side as the start by counting crossings along a straight line between them.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-jordan-curve',
                    title: 'Jordan Curve: Inside or Outside?',
                    description: 'A wiggly closed curve is drawn. Click anywhere to test whether that point is inside or outside the curve, using the ray-crossing method.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        // Generate a wiggly closed curve
                        var curvePoints = [];
                        var nPts = 200;
                        var baseR = Math.min(w, h) * 0.3;

                        function generateCurve() {
                            curvePoints = [];
                            // Random wobble frequencies
                            var freq1 = 2 + Math.floor(Math.random() * 4);
                            var freq2 = 3 + Math.floor(Math.random() * 5);
                            var amp1 = baseR * (0.1 + Math.random() * 0.2);
                            var amp2 = baseR * (0.05 + Math.random() * 0.15);
                            var phase1 = Math.random() * Math.PI * 2;
                            var phase2 = Math.random() * Math.PI * 2;

                            for (var i = 0; i < nPts; i++) {
                                var t = i * 2 * Math.PI / nPts;
                                var r = baseR + amp1 * Math.sin(freq1 * t + phase1) + amp2 * Math.cos(freq2 * t + phase2);
                                curvePoints.push([
                                    cx + r * Math.cos(t),
                                    cy + r * Math.sin(t)
                                ]);
                            }
                        }

                        var testPoints = [];

                        function isInside(px, py) {
                            // Ray casting algorithm: cast ray to the right
                            var crossings = 0;
                            for (var i = 0; i < curvePoints.length; i++) {
                                var a = curvePoints[i];
                                var b = curvePoints[(i + 1) % curvePoints.length];
                                // Check if ray from (px,py) going right crosses segment a-b
                                if ((a[1] > py) !== (b[1] > py)) {
                                    var xInt = a[0] + (py - a[1]) / (b[1] - a[1]) * (b[0] - a[0]);
                                    if (px < xInt) crossings++;
                                }
                            }
                            return crossings % 2 === 1;
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Click to test: Inside or Outside?', cx, 8);

                            // Draw the curve
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(curvePoints[0][0], curvePoints[0][1]);
                            for (var i = 1; i < curvePoints.length; i++) {
                                ctx.lineTo(curvePoints[i][0], curvePoints[i][1]);
                            }
                            ctx.closePath();
                            ctx.stroke();

                            // Light fill for interior
                            ctx.fillStyle = viz.colors.blue + '11';
                            ctx.fill();

                            // Draw test points
                            for (var j = 0; j < testPoints.length; j++) {
                                var p = testPoints[j];
                                var inside = p[2];
                                ctx.fillStyle = inside ? viz.colors.green : viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(p[0], p[1], 6, 0, Math.PI * 2);
                                ctx.fill();

                                // Draw ray to the right
                                ctx.strokeStyle = (inside ? viz.colors.green : viz.colors.red) + '44';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(p[0], p[1]);
                                ctx.lineTo(w, p[1]);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Label
                                ctx.fillStyle = inside ? viz.colors.green : viz.colors.red;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(inside ? 'INSIDE' : 'OUTSIDE', p[0] + 10, p[1]);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Green = inside (odd crossings)  |  Red = outside (even crossings)', cx, h - 12);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var inside = isInside(mx, my);
                            testPoints.push([mx, my, inside]);
                            if (testPoints.length > 15) testPoints.shift();
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Curve', function() {
                            generateCurve();
                            testPoints = [];
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear Points', function() {
                            testPoints = [];
                            draw();
                        });

                        generateCurve();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the crossing number test, determine if a point is inside a square. Draw a ray from the center of the square going right. How many times does it cross the boundary?',
                    hint: 'A ray going right from the center of a square will cross the right side of the square exactly once.',
                    solution: 'The ray crosses the boundary exactly <strong>1 time</strong> (through the right side). Since 1 is odd, the center is inside the square. This confirms what we already know, but the method works even for extremely complicated curves where visual intuition fails.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Bridging to the Next Topic
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'Surfaces and Beyond',
            content: `
<h2>Surfaces and Beyond</h2>

<div class="viz-placeholder" data-viz="viz-classification"></div>

<h3>The Classification of Surfaces</h3>

<p>One of the great achievements of topology is the complete classification of closed surfaces. Every closed (compact, without boundary) surface is topologically equivalent to exactly one of the following:</p>

<ol>
    <li><strong>Orientable surfaces</strong>: the sphere, torus, double torus, triple torus, and so on. These are classified by their <strong>genus</strong> (number of holes): \\(g = 0, 1, 2, 3, \\ldots\\)</li>
    <li><strong>Non-orientable surfaces</strong>: the projective plane, Klein bottle, and their connected sums. These cannot be embedded in ordinary 3D space without self-intersection.</li>
</ol>

<div class="env-block definition">
    <div class="env-title">Definition (Orientable vs Non-orientable)</div>
    <div class="env-body">
        <p>A surface is <strong>orientable</strong> if you can consistently define "clockwise" at every point. Equivalently, it does not contain a Mobius strip as a subregion. The sphere and torus are orientable. The Mobius strip and Klein bottle are non-orientable.</p>
    </div>
</div>

<h3>The Klein Bottle</h3>

<p>The <strong>Klein bottle</strong> is a non-orientable surface with no boundary and no inside or outside. To construct one, take a cylinder, then pass one end through the side and glue it to the other end in reverse. This requires the surface to cross through itself, which is only possible in 4D (or with a self-intersection in 3D).</p>

<p>The Klein bottle has Euler characteristic \\(\\chi = 0\\), the same as the torus. But it is not homeomorphic to the torus because the torus is orientable and the Klein bottle is not.</p>

<h3>What Topology Teaches Us</h3>

<p>Topology teaches a profound lesson: some of the most important properties of shapes have nothing to do with size, distance, or angle. They come from <strong>connectivity</strong>: how many pieces, how many holes, whether a surface has one side or two. These are the features that survive when you throw away all the geometric details.</p>

<p>This perspective has transformed mathematics and science. Topological ideas appear in:</p>
<ul>
    <li><strong>Data science</strong>: Topological data analysis (TDA) uses holes in data to discover shape and structure.</li>
    <li><strong>Physics</strong>: Topological phases of matter won the 2016 Nobel Prize in Physics.</li>
    <li><strong>Robotics</strong>: Configuration spaces of robots are topological objects, and their holes correspond to obstacles.</li>
    <li><strong>Biology</strong>: DNA knotting and protein folding involve topological constraints.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>We have only scratched the surface (pun intended) of topology. There is algebraic topology (using groups and algebra to study spaces), differential topology (combining calculus with topology), and much more. The key takeaway: shape is about more than measurement. Connectivity, holes, and orientability are deep structural features that geometry alone cannot capture.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-classification',
                    title: 'Gallery of Surfaces',
                    description: 'Browse through the fundamental surfaces: sphere, torus, Klein bottle, and projective plane. See their key topological invariants.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2 - 10;

                        var surfaces = [
                            { name: 'Sphere', genus: 0, chi: 2, orientable: true, boundary: false,
                              desc: 'No holes. The simplest closed surface.' },
                            { name: 'Torus', genus: 1, chi: 0, orientable: true, boundary: false,
                              desc: 'One hole (genus 1). A donut shape.' },
                            { name: 'Double Torus', genus: 2, chi: -2, orientable: true, boundary: false,
                              desc: 'Two holes (genus 2). Like a figure-eight pretzel.' },
                            { name: 'Klein Bottle', genus: -1, chi: 0, orientable: false, boundary: false,
                              desc: 'Non-orientable, no boundary. Cannot exist in 3D without self-intersection.' },
                            { name: 'Projective Plane', genus: -1, chi: 1, orientable: false, boundary: false,
                              desc: 'Non-orientable. Obtained by identifying opposite points of a sphere.' }
                        ];

                        var currentSurface = 0;

                        VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            currentSurface = (currentSurface - 1 + surfaces.length) % surfaces.length;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next \u25B6', function() {
                            currentSurface = (currentSurface + 1) % surfaces.length;
                            draw();
                        });

                        function drawSphere(cx, cy, r) {
                            // Sphere: circle with shading
                            var grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
                            grad.addColorStop(0, viz.colors.blue + 'aa');
                            grad.addColorStop(1, viz.colors.blue + '22');
                            ctx.fillStyle = grad;
                            ctx.beginPath();
                            ctx.arc(cx, cy, r, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            // Equator
                            ctx.strokeStyle = viz.colors.blue + '66';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
                            ctx.stroke();
                        }

                        function drawTorusShape(cx, cy, R, r) {
                            // 2D torus: outer ellipse + inner hole
                            ctx.fillStyle = viz.colors.teal + '33';
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.ellipse(cx, cy, R + r, (R + r) * 0.4, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            // Hole
                            ctx.fillStyle = viz.colors.bg;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(cx, cy, R - r, (R - r) * 0.4, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            // Tube suggestion
                            ctx.strokeStyle = viz.colors.teal + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.ellipse(cx, cy - (R) * 0.2, r, r * 0.6, 0, 0, Math.PI * 2);
                            ctx.stroke();
                        }

                        function drawDoubleTorus(cx, cy, scale) {
                            // Two connected tori side by side
                            var R = scale * 0.45;
                            var r = scale * 0.2;
                            var offset = scale * 0.5;

                            for (var side = -1; side <= 1; side += 2) {
                                var ox = cx + side * offset;
                                ctx.fillStyle = viz.colors.purple + '33';
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.ellipse(ox, cy, R + r, (R + r) * 0.4, 0, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();
                                // Hole
                                ctx.fillStyle = viz.colors.bg;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.ellipse(ox, cy, R - r, Math.max(3, (R - r) * 0.4), 0, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();
                            }
                        }

                        function drawKleinBottle(cx, cy, scale) {
                            // Stylized Klein bottle (2D representation)
                            ctx.strokeStyle = viz.colors.pink;
                            ctx.lineWidth = 3;

                            // Main body
                            ctx.beginPath();
                            ctx.ellipse(cx, cy + scale * 0.15, scale * 0.4, scale * 0.7, 0, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.pink + '22';
                            ctx.fill();
                            ctx.stroke();

                            // Neck goes up, loops back, passes through body
                            ctx.strokeStyle = viz.colors.pink;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(cx + scale * 0.15, cy - scale * 0.55);
                            ctx.quadraticCurveTo(cx + scale * 0.15, cy - scale * 0.9, cx + scale * 0.5, cy - scale * 0.7);
                            ctx.quadraticCurveTo(cx + scale * 0.8, cy - scale * 0.5, cx + scale * 0.5, cy - scale * 0.1);
                            ctx.quadraticCurveTo(cx + scale * 0.3, cy + scale * 0.15, cx + scale * 0.15, cy + scale * 0.1);
                            ctx.stroke();

                            // Self-intersection indicator
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('self-intersection', cx + scale * 0.4, cy + scale * 0.35);
                            ctx.fillText('(needs 4D!)', cx + scale * 0.4, cy + scale * 0.5);
                        }

                        function drawProjectivePlane(cx, cy, scale) {
                            // Show as disk with opposite edge identification
                            ctx.fillStyle = viz.colors.yellow + '22';
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(cx, cy, scale * 0.7, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();

                            // Arrows showing identification
                            var r = scale * 0.7;
                            var arrowLen = 0.3;
                            for (var i = 0; i < 4; i++) {
                                var angle = i * Math.PI / 2;
                                var x1 = cx + r * Math.cos(angle - arrowLen);
                                var y1 = cy + r * Math.sin(angle - arrowLen);
                                var x2 = cx + r * Math.cos(angle + arrowLen);
                                var y2 = cy + r * Math.sin(angle + arrowLen);

                                ctx.strokeStyle = i % 2 === 0 ? viz.colors.orange : viz.colors.green;
                                ctx.lineWidth = 4;
                                ctx.beginPath();
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.stroke();

                                // Arrow head
                                var dir = (i < 2) ? 1 : -1;
                                var ax = x2, ay = y2;
                                var dx = Math.cos(angle + arrowLen) * dir;
                                var dy = Math.sin(angle + arrowLen) * dir;
                                var px = -dy, py = dx;
                                ctx.fillStyle = i % 2 === 0 ? viz.colors.orange : viz.colors.green;
                                ctx.beginPath();
                                ctx.moveTo(ax, ay);
                                ctx.lineTo(ax - 8 * dx + 4 * px, ay - 8 * dy + 4 * py);
                                ctx.lineTo(ax - 8 * dx - 4 * px, ay - 8 * dy - 4 * py);
                                ctx.closePath();
                                ctx.fill();
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Opposite points identified', cx, cy + scale * 0.7 + 18);
                            ctx.fillText('(arrows show gluing direction)', cx, cy + scale * 0.7 + 33);
                        }

                        function draw() {
                            viz.clear();
                            var s = surfaces[currentSurface];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(s.name, cx, 12);

                            // Draw surface
                            var drawScale = 90;
                            if (currentSurface === 0) drawSphere(cx, cy, drawScale);
                            else if (currentSurface === 1) drawTorusShape(cx, cy, drawScale * 0.7, drawScale * 0.3);
                            else if (currentSurface === 2) drawDoubleTorus(cx, cy, drawScale);
                            else if (currentSurface === 3) drawKleinBottle(cx, cy, drawScale);
                            else if (currentSurface === 4) drawProjectivePlane(cx, cy, drawScale);

                            // Info panel
                            var infoY = h - 80;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(s.desc, cx, infoY);

                            var propLine = '\u03C7 = ' + s.chi +
                                '   |   Orientable: ' + (s.orientable ? 'Yes' : 'No') +
                                '   |   Boundary: ' + (s.boundary ? 'Yes' : 'No');
                            ctx.fillText(propLine, cx, infoY + 22);

                            ctx.fillStyle = viz.colors.text + '88';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('(' + (currentSurface + 1) + '/' + surfaces.length + ') Use buttons to browse', cx, infoY + 44);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Can you embed a Klein bottle in 3-dimensional space without self-intersection?',
                    hint: 'Think about what happens when the "neck" of the Klein bottle must pass through the body.',
                    solution: 'No. A Klein bottle <strong>cannot</strong> be embedded in \\(\\mathbb{R}^3\\) without self-intersection. It requires 4 dimensions for a true embedding. Any 3D representation must have the surface pass through itself. This is analogous to how a Mobius strip has a boundary in 3D, but the Klein bottle (which is a closed surface) needs an extra dimension.'
                }
            ]
        }
    ]
});
})();
