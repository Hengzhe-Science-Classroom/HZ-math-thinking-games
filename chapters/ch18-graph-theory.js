// === Chapter 18: Graph Theory — Euler Paths ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Graph Theory — Euler Paths',
    subtitle: 'Bridges, vertices, edges, and the birth of a new branch of mathematics',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Königsberg's Seven Bridges
        // ─────────────────────────────────────────────
        {
            id: 'sec-konigsberg',
            title: "Königsberg's Seven Bridges",
            content: `
<h2>A Walk Through Königsberg</h2>

<p>In 1736, the Prussian city of Königsberg (now Kaliningrad, Russia) was divided by the Pregel River into four land areas connected by seven bridges. The citizens loved a good puzzle, and they asked a simple question:</p>

<div class="env-block intuition">
<strong>The Königsberg Bridge Problem.</strong> Is it possible to walk through the city, crossing each bridge <em>exactly once</em>, and return to your starting point?
</div>

<p>People tried and tried, but nobody could do it. Some began to suspect it was impossible, but nobody could explain <em>why</em>. Enter Leonhard Euler, one of the greatest mathematicians of all time.</p>

<h3>Euler's Brilliant Insight</h3>

<p>Euler realized that the exact layout of the bridges did not matter. The shapes of the land masses, the lengths of the bridges, the curves of the river: none of it was relevant. All that mattered was <em>which land areas are connected to which</em>. He stripped away every geometric detail and kept only the <strong>connections</strong>.</p>

<p>This was a revolutionary idea. By ignoring distances and shapes, Euler invented an entirely new kind of mathematics: what we now call <strong>graph theory</strong>.</p>

<p>He represented each land area as a <strong>dot</strong> (which we call a <em>vertex</em>) and each bridge as a <strong>line</strong> (which we call an <em>edge</em>). The entire puzzle reduced to a simple diagram with 4 dots and 7 lines.</p>

<div class="viz-placeholder" data-viz="viz-konigsberg"></div>

<p>Try it yourself in the visualization above. Click on the bridges to "cross" them. You will find that you always get stuck with at least one bridge uncrossed. Euler proved this is inevitable, and in doing so, he created graph theory.</p>

<div class="env-block remark">
<strong>Historical note.</strong> Euler's 1736 paper, <em>Solutio problematis ad geometriam situs pertinentis</em> ("Solution of a problem relating to the geometry of position"), is considered the founding document of both graph theory and topology. He was 29 years old.
</div>
`,
            visualizations: [
                {
                    id: 'viz-konigsberg',
                    title: "Königsberg Bridge Problem",
                    description: 'Click a bridge to cross it. Try to cross all 7 bridges exactly once. The vertex labels show each land area. Can you do it?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        // Four land areas as vertices
                        var nodes = [
                            { x: cx, y: cy - h * 0.3, label: 'A' },       // north
                            { x: cx - w * 0.3, y: cy + h * 0.05, label: 'B' }, // west island
                            { x: cx + w * 0.3, y: cy + h * 0.05, label: 'C' }, // east
                            { x: cx, y: cy + h * 0.3, label: 'D' }        // south
                        ];

                        // Seven bridges: [from, to]
                        var bridges = [
                            { a: 0, b: 1, crossed: false, cx: cx - w * 0.2, cy: cy - h * 0.18 },
                            { a: 0, b: 1, crossed: false, cx: cx - w * 0.1, cy: cy - h * 0.10 },
                            { a: 0, b: 2, crossed: false, cx: cx + w * 0.2, cy: cy - h * 0.18 },
                            { a: 0, b: 2, crossed: false, cx: cx + w * 0.1, cy: cy - h * 0.10 },
                            { a: 1, b: 3, crossed: false, cx: cx - w * 0.2, cy: cy + h * 0.22 },
                            { a: 2, b: 3, crossed: false, cx: cx + w * 0.2, cy: cy + h * 0.22 },
                            { a: 1, b: 2, crossed: false, cx: cx, cy: cy + h * 0.05 }
                        ];

                        // Curved bridge control points for drawing
                        function bridgePath(b, idx) {
                            var n1 = nodes[b.a], n2 = nodes[b.b];
                            var mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
                            // offset duplicate bridges
                            var dx = n2.y - n1.y, dy = -(n2.x - n1.x);
                            var len = Math.sqrt(dx * dx + dy * dy) || 1;
                            dx /= len; dy /= len;
                            var offset = 0;
                            if (idx === 0) offset = -20;
                            if (idx === 1) offset = 20;
                            if (idx === 2) offset = -20;
                            if (idx === 3) offset = 20;
                            return { sx: n1.x, sy: n1.y, ex: n2.x, ey: n2.y,
                                     cpx: mx + dx * offset, cpy: my + dy * offset };
                        }

                        var crossCount = 0;
                        var statusMsg = 'Click on bridges to cross them!';

                        function draw() {
                            viz.clear();

                            // Draw river
                            ctx.fillStyle = '#0a1a3a';
                            ctx.fillRect(0, cy - h * 0.06, w, h * 0.12);

                            // Draw bridges
                            for (var i = 0; i < bridges.length; i++) {
                                var b = bridges[i];
                                var bp = bridgePath(b, i);
                                ctx.strokeStyle = b.crossed ? viz.colors.green : viz.colors.orange;
                                ctx.lineWidth = b.crossed ? 5 : 4;
                                ctx.beginPath();
                                ctx.moveTo(bp.sx, bp.sy);
                                ctx.quadraticCurveTo(bp.cpx, bp.cpy, bp.ex, bp.ey);
                                ctx.stroke();
                                // bridge label
                                var tx = 0.25 * bp.sx + 0.5 * bp.cpx + 0.25 * bp.ex;
                                var ty = 0.25 * bp.sy + 0.5 * bp.cpy + 0.25 * bp.ey;
                                ctx.fillStyle = b.crossed ? viz.colors.green : '#ffffff88';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('b' + (i + 1), tx, ty);
                            }

                            // Draw vertices (land areas)
                            for (var j = 0; j < nodes.length; j++) {
                                var n = nodes[j];
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath(); ctx.arc(n.x, n.y, 24, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                                // degree
                                var deg = 0;
                                for (var k = 0; k < bridges.length; k++) {
                                    if (bridges[k].a === j || bridges[k].b === j) deg++;
                                }
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('deg=' + deg, n.x, n.y + 26);
                            }

                            // Status
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(statusMsg, cx, 12);
                            ctx.fillText('Bridges crossed: ' + crossCount + '/7', cx, 30);
                        }

                        function hitTest(mx, my) {
                            for (var i = 0; i < bridges.length; i++) {
                                if (bridges[i].crossed) continue;
                                var bp = bridgePath(bridges[i], i);
                                // sample points along quadratic bezier
                                for (var t = 0; t <= 1; t += 0.05) {
                                    var px = (1 - t) * (1 - t) * bp.sx + 2 * (1 - t) * t * bp.cpx + t * t * bp.ex;
                                    var py = (1 - t) * (1 - t) * bp.sy + 2 * (1 - t) * t * bp.cpy + t * t * bp.ey;
                                    if (Math.sqrt((mx - px) * (mx - px) + (my - py) * (my - py)) < 12) {
                                        return i;
                                    }
                                }
                            }
                            return -1;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var idx = hitTest(mx, my);
                            if (idx >= 0) {
                                bridges[idx].crossed = true;
                                crossCount++;
                                if (crossCount === 7) {
                                    statusMsg = 'All 7 bridges crossed! But Euler proved this path cannot exist as a proper Euler circuit.';
                                } else {
                                    statusMsg = 'Bridge b' + (idx + 1) + ' crossed!';
                                }
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var i = 0; i < bridges.length; i++) bridges[i].crossed = false;
                            crossCount = 0;
                            statusMsg = 'Click on bridges to cross them!';
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the Königsberg bridge problem, what are the degrees of the four vertices A, B, C, D?',
                    hint: 'Count how many bridges touch each land area. A connects to B (twice), C (twice), so how many bridges touch A?',
                    solution: 'A has degree 5 (two bridges to B, two to C, zero to D... wait, let us recount from the actual bridges: A-B, A-B, A-C, A-C, and we need to check the original problem). With the classic layout: A has degree 3, B has degree 5, C has degree 3, D has degree 3. All four vertices have odd degree, which is why no Euler path or circuit exists.'
                },
                {
                    question: 'If the city added an eighth bridge connecting the north bank (A) to the south bank (D), would an Euler path become possible?',
                    hint: 'Adding a bridge increases the degree of both A and D by 1. What would their new degrees be?',
                    solution: 'With the eighth bridge, A goes from degree 3 to degree 4 (even) and D goes from degree 3 to degree 4 (even). B still has degree 5 and C still has degree 3, so exactly two vertices (B and C) have odd degree. By Euler\'s theorem, an Euler <em>path</em> (not circuit) now exists, starting at B and ending at C (or vice versa).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 2: Graphs — Vertices and Edges
        // ─────────────────────────────────────────────
        {
            id: 'sec-graphs',
            title: 'Graphs — Vertices and Edges',
            content: `
<h2>What Is a Graph?</h2>

<p>In everyday language, a "graph" is a chart with an x-axis and a y-axis. In mathematics, a <strong>graph</strong> means something entirely different. It is one of the simplest and most powerful structures in all of mathematics.</p>

<div class="env-block definition">
<strong>Graph.</strong> A <em>graph</em> \\(G = (V, E)\\) consists of:
<ul>
<li>A set \\(V\\) of <em>vertices</em> (also called <em>nodes</em>), and</li>
<li>A set \\(E\\) of <em>edges</em>, where each edge connects two vertices.</li>
</ul>
</div>

<p>That is the entire definition. No coordinates, no distances, no angles. A graph is pure <em>connection</em>.</p>

<h3>Drawing Graphs</h3>

<p>We draw graphs by placing dots for vertices and drawing lines (straight or curved) for edges. The exact positions of the dots do not matter; only the connections do. Two drawings that look completely different can represent the same graph.</p>

<div class="viz-placeholder" data-viz="viz-graph-builder"></div>

<h3>Degree of a Vertex</h3>

<div class="env-block definition">
<strong>Degree.</strong> The <em>degree</em> of a vertex \\(v\\), written \\(\\deg(v)\\), is the number of edges that touch \\(v\\). A vertex with degree 0 (no edges) is called <em>isolated</em>.
</div>

<p>In the Königsberg graph, every vertex had odd degree. That turned out to be exactly why the walk was impossible. The degree of each vertex holds the key to understanding Euler paths.</p>

<h3>Some Famous Graphs</h3>

<p>A few graph families appear over and over in mathematics:</p>
<ul>
<li><strong>Complete graph</strong> \\(K_n\\): every pair of \\(n\\) vertices is connected by an edge. \\(K_3\\) is a triangle, \\(K_4\\) is a tetrahedron-like shape with 6 edges.</li>
<li><strong>Cycle</strong> \\(C_n\\): \\(n\\) vertices arranged in a ring, each connected to its two neighbors. Every vertex has degree 2.</li>
<li><strong>Path</strong> \\(P_n\\): \\(n\\) vertices in a line. The two endpoints have degree 1; all others have degree 2.</li>
<li><strong>Tree</strong>: a connected graph with no cycles. A tree on \\(n\\) vertices always has exactly \\(n - 1\\) edges.</li>
</ul>

<div class="env-block remark">
<strong>Graphs are everywhere.</strong> Social networks (people are vertices, friendships are edges), the internet (web pages and hyperlinks), road maps (intersections and roads), molecular structures (atoms and bonds), and countless other systems are all modeled by graphs.
</div>
`,
            visualizations: [
                {
                    id: 'viz-graph-builder',
                    title: 'Interactive Graph Builder',
                    description: 'Click empty space to add a vertex. Click a vertex then another vertex to add an edge. The degree of each vertex is shown. Switch modes with the buttons.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var vertices = [];
                        var edges = [];
                        var selectedVertex = -1;
                        var mode = 'vertex'; // 'vertex' or 'edge'
                        var nextLabel = 0;

                        function vertexAt(mx, my) {
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 20 * 20) return i;
                            }
                            return -1;
                        }

                        function degree(vi) {
                            var d = 0;
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i][0] === vi || edges[i][1] === vi) d++;
                            }
                            return d;
                        }

                        function hasEdge(a, b) {
                            for (var i = 0; i < edges.length; i++) {
                                if ((edges[i][0] === a && edges[i][1] === b) ||
                                    (edges[i][0] === b && edges[i][1] === a)) return true;
                            }
                            return false;
                        }

                        function draw() {
                            viz.clear();

                            // edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // vertices
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var d = degree(j);
                                var isOdd = d % 2 === 1;
                                var col = j === selectedVertex ? viz.colors.gold :
                                          (isOdd ? viz.colors.orange : viz.colors.blue);
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                                // degree
                                ctx.fillStyle = isOdd ? viz.colors.orange : viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('d=' + d, v.x, v.y + 22);
                            }

                            // info bar
                            var oddCount = 0;
                            for (var k = 0; k < vertices.length; k++) {
                                if (degree(k) % 2 === 1) oddCount++;
                            }
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillText('V=' + vertices.length + '  E=' + edges.length +
                                         '  Odd-degree vertices: ' + oddCount, 10, 10);

                            var eulerMsg = '';
                            if (vertices.length === 0) {
                                eulerMsg = 'Add some vertices to start!';
                            } else if (oddCount === 0 && edges.length > 0) {
                                eulerMsg = 'Euler CIRCUIT possible (0 odd-degree vertices)';
                            } else if (oddCount === 2) {
                                eulerMsg = 'Euler PATH possible (exactly 2 odd-degree vertices)';
                            } else if (oddCount > 0) {
                                eulerMsg = 'No Euler path (' + oddCount + ' odd-degree vertices)';
                            }
                            ctx.fillStyle = oddCount === 0 && edges.length > 0 ? viz.colors.green :
                                           (oddCount === 2 ? viz.colors.teal : viz.colors.orange);
                            ctx.fillText(eulerMsg, 10, 28);

                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'right';
                            ctx.fillText('Mode: ' + mode.toUpperCase(), w - 10, 10);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var hit = vertexAt(mx, my);

                            if (mode === 'vertex') {
                                if (hit < 0) {
                                    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                    vertices.push({ x: mx, y: my, label: labels[nextLabel % 26] });
                                    nextLabel++;
                                }
                            } else { // edge mode
                                if (hit >= 0) {
                                    if (selectedVertex < 0) {
                                        selectedVertex = hit;
                                    } else {
                                        if (hit !== selectedVertex && !hasEdge(selectedVertex, hit)) {
                                            edges.push([selectedVertex, hit]);
                                        }
                                        selectedVertex = -1;
                                    }
                                } else {
                                    selectedVertex = -1;
                                }
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Add Vertex', function() { mode = 'vertex'; selectedVertex = -1; draw(); });
                        VizEngine.createButton(controls, 'Add Edge', function() { mode = 'edge'; selectedVertex = -1; draw(); });
                        VizEngine.createButton(controls, 'Clear', function() {
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0; draw();
                        });

                        // preset: K4
                        VizEngine.createButton(controls, 'Load K\u2084', function() {
                            vertices = [
                                { x: cx, y: cy - 80, label: 'A' },
                                { x: cx - 90, y: cy + 60, label: 'B' },
                                { x: cx + 90, y: cy + 60, label: 'C' },
                                { x: cx, y: cy + 20, label: 'D' }
                            ];
                            var cx2 = w / 2;
                            vertices[0].x = cx2; vertices[0].y = h * 0.2;
                            vertices[1].x = cx2 - w * 0.22; vertices[1].y = h * 0.7;
                            vertices[2].x = cx2 + w * 0.22; vertices[2].y = h * 0.7;
                            vertices[3].x = cx2; vertices[3].y = h * 0.5;
                            edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
                            nextLabel = 4; selectedVertex = -1;
                            draw();
                        });

                        var cx = w / 2;
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw the complete graph \\(K_5\\) (5 vertices, every pair connected). How many edges does it have? What is the degree of each vertex?',
                    hint: 'Each vertex connects to the other 4. But each edge is shared by 2 vertices.',
                    solution: 'Each of the 5 vertices connects to the other 4, giving \\(5 \\times 4 = 20\\) "half-edges," but each edge was counted twice. So \\(|E| = 20 / 2 = 10\\). Each vertex has degree 4. In general, \\(K_n\\) has \\(\\binom{n}{2} = n(n-1)/2\\) edges.'
                },
                {
                    question: 'A tree on 10 vertices has how many edges? Can a tree have a vertex of degree 0?',
                    hint: 'A tree on \\(n\\) vertices always has \\(n-1\\) edges, and it is connected.',
                    solution: 'A tree on 10 vertices has exactly 9 edges. A tree cannot have a vertex of degree 0 (an isolated vertex), because a tree must be connected. Every vertex must be reachable from every other vertex.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Euler Paths and Circuits
        // ─────────────────────────────────────────────
        {
            id: 'sec-euler-paths',
            title: 'Euler Paths and Circuits',
            content: `
<h2>Walking Every Edge</h2>

<p>Euler's analysis of the Königsberg bridges led to one of the most elegant theorems in graph theory. The question is: when can you traverse every edge of a graph exactly once?</p>

<div class="env-block definition">
<strong>Euler Path.</strong> An <em>Euler path</em> in a graph is a path that visits every edge exactly once. The path may start and end at different vertices.
</div>

<div class="env-block definition">
<strong>Euler Circuit.</strong> An <em>Euler circuit</em> is an Euler path that starts and ends at the same vertex, forming a closed loop.
</div>

<p>Note the key distinction: we require every <em>edge</em> to be visited exactly once, but vertices may be visited multiple times. (This is different from a <em>Hamiltonian path</em>, which visits every vertex exactly once.)</p>

<h3>Euler's Theorem</h3>

<div class="env-block theorem">
<strong>Euler's Theorem (1736).</strong> For a connected graph \\(G\\):
<ol>
<li>\\(G\\) has an <strong>Euler circuit</strong> if and only if every vertex has even degree.</li>
<li>\\(G\\) has an <strong>Euler path</strong> (but not a circuit) if and only if exactly 2 vertices have odd degree. The path must start at one odd-degree vertex and end at the other.</li>
<li>If more than 2 vertices have odd degree, \\(G\\) has neither an Euler path nor an Euler circuit.</li>
</ol>
</div>

<h3>Why Does This Work?</h3>

<div class="env-block intuition">
<strong>Intuition.</strong> Every time you visit a vertex in the middle of your walk, you use one edge to enter and one edge to leave. That consumes edges in pairs. So at every intermediate vertex, you need an even number of edges. The only vertices that can have odd degree are the starting and ending vertices (if they are different), because at the start you leave without entering, and at the end you enter without leaving.
</div>

<p>Now apply this to Königsberg: all four vertices have odd degree (3, 5, 3, 3). Since more than 2 vertices have odd degree, no Euler path exists. Case closed.</p>

<div class="viz-placeholder" data-viz="viz-euler-finder"></div>

<p>In the visualization above, you can draw a graph and then watch an algorithm find an Euler path (if one exists). The algorithm uses Hierholzer's method: start at a valid vertex, follow edges until you get stuck, then splice in unused edges from intermediate vertices.</p>

<div class="env-block example">
<strong>Example.</strong> Consider a graph with vertices A, B, C, D and edges A-B, B-C, C-D, D-A, A-C. The degrees are: A=3, B=2, C=3, D=2. Exactly two vertices (A and C) have odd degree, so an Euler path exists from A to C (or C to A). One such path: A-B-C-D-A-C.
</div>
`,
            visualizations: [
                {
                    id: 'viz-euler-finder',
                    title: 'Euler Path Finder',
                    description: 'Build a graph, then click "Find Euler Path" to watch the algorithm trace an Euler path (if one exists). Odd-degree vertices are highlighted in orange.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var vertices = [];
                        var edges = [];
                        var mode = 'vertex';
                        var selectedVertex = -1;
                        var nextLabel = 0;
                        var animPath = null;
                        var animStep = 0;
                        var animTimer = null;

                        function degree(vi) {
                            var d = 0;
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i][0] === vi || edges[i][1] === vi) d++;
                            }
                            return d;
                        }

                        function hasEdge(a, b) {
                            for (var i = 0; i < edges.length; i++) {
                                if ((edges[i][0] === a && edges[i][1] === b) ||
                                    (edges[i][0] === b && edges[i][1] === a)) return true;
                            }
                            return false;
                        }

                        function vertexAt(mx, my) {
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 20 * 20) return i;
                            }
                            return -1;
                        }

                        // Hierholzer's algorithm to find Euler path/circuit
                        function findEulerPath() {
                            if (vertices.length === 0 || edges.length === 0) return null;
                            var oddVerts = [];
                            for (var i = 0; i < vertices.length; i++) {
                                if (degree(i) % 2 === 1) oddVerts.push(i);
                            }
                            if (oddVerts.length !== 0 && oddVerts.length !== 2) return null;

                            // Build adjacency list with edge indices
                            var adj = [];
                            for (var v = 0; v < vertices.length; v++) adj.push([]);
                            var usedEdge = [];
                            for (var e = 0; e < edges.length; e++) {
                                adj[edges[e][0]].push({ to: edges[e][1], ei: e });
                                adj[edges[e][1]].push({ to: edges[e][0], ei: e });
                                usedEdge.push(false);
                            }

                            var start = oddVerts.length === 2 ? oddVerts[0] : 0;
                            var stack = [start];
                            var circuit = [];
                            var adjPtr = [];
                            for (var p = 0; p < vertices.length; p++) adjPtr.push(0);

                            while (stack.length > 0) {
                                var cur = stack[stack.length - 1];
                                var found = false;
                                while (adjPtr[cur] < adj[cur].length) {
                                    var ne = adj[cur][adjPtr[cur]];
                                    adjPtr[cur]++;
                                    if (!usedEdge[ne.ei]) {
                                        usedEdge[ne.ei] = true;
                                        stack.push(ne.to);
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    circuit.push(stack.pop());
                                }
                            }

                            // Check all edges used
                            for (var ue = 0; ue < usedEdge.length; ue++) {
                                if (!usedEdge[ue]) return null; // not connected
                            }

                            circuit.reverse();
                            return circuit;
                        }

                        function draw() {
                            viz.clear();

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                var highlighted = false;
                                if (animPath && animStep > 0) {
                                    for (var s = 0; s < animStep && s < animPath.length - 1; s++) {
                                        if ((animPath[s] === edges[i][0] && animPath[s + 1] === edges[i][1]) ||
                                            (animPath[s] === edges[i][1] && animPath[s + 1] === edges[i][0])) {
                                            highlighted = true; break;
                                        }
                                    }
                                }
                                ctx.strokeStyle = highlighted ? viz.colors.green : viz.colors.teal + '88';
                                ctx.lineWidth = highlighted ? 4 : 2;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Draw animation current edge
                            if (animPath && animStep > 0 && animStep < animPath.length) {
                                var from = vertices[animPath[animStep - 1]];
                                var to = vertices[animPath[animStep]];
                                ctx.strokeStyle = viz.colors.gold;
                                ctx.lineWidth = 5;
                                ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
                            }

                            // Draw vertices
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var d = degree(j);
                                var isOdd = d % 2 === 1;
                                var isActive = animPath && animStep < animPath.length && animPath[animStep] === j;
                                var col = isActive ? viz.colors.gold :
                                          (j === selectedVertex ? viz.colors.gold :
                                          (isOdd ? viz.colors.orange : viz.colors.blue));
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                                ctx.fillStyle = isOdd ? viz.colors.orange : viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('d=' + d, v.x, v.y + 22);
                            }

                            // Status
                            if (animPath) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                var pathStr = '';
                                for (var ps = 0; ps <= animStep && ps < animPath.length; ps++) {
                                    pathStr += (ps > 0 ? ' \u2192 ' : '') + vertices[animPath[ps]].label;
                                }
                                ctx.fillText('Path: ' + pathStr, 10, 10);
                                ctx.fillText('Step ' + animStep + '/' + (animPath.length - 1), 10, 28);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (animTimer) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var hit = vertexAt(mx, my);

                            if (mode === 'vertex') {
                                if (hit < 0) {
                                    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                    vertices.push({ x: mx, y: my, label: labels[nextLabel % 26] });
                                    nextLabel++;
                                }
                            } else {
                                if (hit >= 0) {
                                    if (selectedVertex < 0) {
                                        selectedVertex = hit;
                                    } else {
                                        if (hit !== selectedVertex && !hasEdge(selectedVertex, hit)) {
                                            edges.push([selectedVertex, hit]);
                                        }
                                        selectedVertex = -1;
                                    }
                                } else {
                                    selectedVertex = -1;
                                }
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Vertex', function() { mode = 'vertex'; selectedVertex = -1; draw(); });
                        VizEngine.createButton(controls, 'Edge', function() { mode = 'edge'; selectedVertex = -1; draw(); });

                        VizEngine.createButton(controls, 'Find Euler Path', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            animPath = findEulerPath();
                            animStep = 0;
                            if (!animPath) {
                                draw();
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('No Euler path exists!', w / 2, h / 2);
                                return;
                            }
                            draw();
                            animTimer = setInterval(function() {
                                animStep++;
                                draw();
                                if (animStep >= animPath.length - 1) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                            }, 600);
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0;
                            animPath = null; animStep = 0;
                            draw();
                        });

                        // Load a sample graph with Euler path
                        VizEngine.createButton(controls, 'Sample', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            var cx2 = w / 2, cy2 = h / 2;
                            vertices = [
                                { x: cx2 - 100, y: cy2 - 60, label: 'A' },
                                { x: cx2 + 100, y: cy2 - 60, label: 'B' },
                                { x: cx2 + 100, y: cy2 + 60, label: 'C' },
                                { x: cx2 - 100, y: cy2 + 60, label: 'D' },
                                { x: cx2, y: cy2, label: 'E' }
                            ];
                            edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[2,4]];
                            nextLabel = 5; selectedVertex = -1;
                            animPath = null; animStep = 0;
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Does the cycle \\(C_5\\) (a pentagon) have an Euler circuit? What about the path \\(P_4\\) (4 vertices in a line)?',
                    hint: 'In \\(C_5\\), every vertex has degree 2. In \\(P_4\\), the two endpoints have degree 1 and the middle vertices have degree 2.',
                    solution: '\\(C_5\\): every vertex has degree 2 (even), so an Euler circuit exists. In fact, just walking around the pentagon does the job. \\(P_4\\): the two endpoints have degree 1 (odd), so an Euler path exists from one end to the other, but no Euler circuit. The path itself IS the Euler path.'
                },
                {
                    question: 'Can you draw a connected graph on 5 vertices with exactly 3 vertices of odd degree? Why or why not?',
                    hint: 'Think about the handshaking lemma (next section). What does it say about the total number of odd-degree vertices?',
                    solution: 'No! The handshaking lemma implies that the number of odd-degree vertices must be even. Since 3 is odd, no such graph exists. This is true for any graph, not just connected ones.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: The Handshaking Lemma
        // ─────────────────────────────────────────────
        {
            id: 'sec-handshaking',
            title: 'The Handshaking Lemma',
            content: `
<h2>Counting Handshakes</h2>

<p>Imagine a party where some people shake hands. If you ask every person how many handshakes they participated in, and add up all those numbers, what do you get?</p>

<p>Each handshake involves exactly two people. So each handshake is counted twice in the sum: once by each participant. Therefore:</p>

<div class="env-block theorem">
<strong>The Handshaking Lemma.</strong> In any graph \\(G = (V, E)\\),
\\[
\\sum_{v \\in V} \\deg(v) = 2|E|.
\\]
The sum of all vertex degrees equals twice the number of edges.
</div>

<p>This is one of the simplest and most useful results in graph theory. Despite being easy to prove, it has surprisingly powerful consequences.</p>

<h3>An Immediate Corollary</h3>

<div class="env-block theorem">
<strong>Corollary.</strong> In any graph, the number of vertices with odd degree is even.
</div>

<p><strong>Proof.</strong> The sum of all degrees equals \\(2|E|\\), which is even. If we split the vertices into those with even degree and those with odd degree, the even-degree vertices contribute an even total. So the odd-degree vertices must also contribute an even total. A sum of odd numbers is even only if there is an even count of them. \\(\\square\\)</p>

<p>This corollary is what makes Euler's theorem work. It is impossible to have exactly 1 or 3 or 5 odd-degree vertices, which is why the conditions for Euler paths are so clean.</p>

<div class="viz-placeholder" data-viz="viz-handshaking"></div>

<div class="env-block example">
<strong>Example: The party problem.</strong> At a party of 6 people, is it possible that each person shakes hands with exactly 3 others? Check: the sum of degrees would be \\(6 \\times 3 = 18 = 2|E|\\), so \\(|E| = 9\\). The sum is even, so this is not ruled out by the handshaking lemma. In fact, such a graph exists: it is the complete bipartite graph \\(K_{3,3}\\) (divide the 6 people into two groups of 3, with each person shaking hands with everyone in the other group).
</div>

<div class="env-block example">
<strong>Example: An impossible party.</strong> At a party of 5 people, is it possible that everyone shakes hands with exactly 3 others? Sum of degrees would be \\(5 \\times 3 = 15\\), which is odd. But \\(2|E|\\) must be even. Contradiction! So this is impossible.
</div>

<h3>A Practical Application: Error Checking</h3>

<p>The handshaking lemma gives a quick sanity check. If someone claims a network has 10 nodes and 8 edges, and lists degrees 3, 2, 2, 1, 3, 2, 1, 2, 1, 1, you can check: the sum is \\(3+2+2+1+3+2+1+2+1+1 = 18\\), and \\(2 \\times 8 = 16\\). Since \\(18 \\neq 16\\), there is a mistake somewhere.</p>
`,
            visualizations: [
                {
                    id: 'viz-handshaking',
                    title: 'The Handshaking Lemma in Action',
                    description: 'Click to build a graph. The sum of degrees and 2|E| are shown, always equal. Odd-degree vertices are highlighted in orange.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var vertices = [];
                        var edges = [];
                        var mode = 'vertex';
                        var selectedVertex = -1;
                        var nextLabel = 0;

                        function degree(vi) {
                            var d = 0;
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i][0] === vi || edges[i][1] === vi) d++;
                            }
                            return d;
                        }

                        function hasEdge(a, b) {
                            for (var i = 0; i < edges.length; i++) {
                                if ((edges[i][0] === a && edges[i][1] === b) ||
                                    (edges[i][0] === b && edges[i][1] === a)) return true;
                            }
                            return false;
                        }

                        function vertexAt(mx, my) {
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 20 * 20) return i;
                            }
                            return -1;
                        }

                        function draw() {
                            viz.clear();

                            // edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // vertices
                            var degSum = 0;
                            var oddCount = 0;
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var d = degree(j);
                                degSum += d;
                                if (d % 2 === 1) oddCount++;
                                var isOdd = d % 2 === 1;
                                var col = j === selectedVertex ? viz.colors.gold :
                                          (isOdd ? viz.colors.orange : viz.colors.blue);
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                                ctx.fillStyle = isOdd ? viz.colors.orange : viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('d=' + d, v.x, v.y + 22);
                            }

                            // Handshaking display
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03A3 deg(v) = ' + degSum + '     2|E| = ' + (2 * edges.length) +
                                         '     Equal? ' + (degSum === 2 * edges.length ? 'YES \u2714' : 'NO'), w / 2, 12);

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Odd-degree vertices: ' + oddCount + ' (' + (oddCount % 2 === 0 ? 'even, as expected' : '???') + ')', w / 2, 32);

                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'right';
                            ctx.fillText('Mode: ' + mode.toUpperCase(), w - 10, 12);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var hit = vertexAt(mx, my);

                            if (mode === 'vertex') {
                                if (hit < 0) {
                                    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                    vertices.push({ x: mx, y: my, label: labels[nextLabel % 26] });
                                    nextLabel++;
                                }
                            } else {
                                if (hit >= 0) {
                                    if (selectedVertex < 0) {
                                        selectedVertex = hit;
                                    } else {
                                        if (hit !== selectedVertex && !hasEdge(selectedVertex, hit)) {
                                            edges.push([selectedVertex, hit]);
                                        }
                                        selectedVertex = -1;
                                    }
                                } else {
                                    selectedVertex = -1;
                                }
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Vertex', function() { mode = 'vertex'; selectedVertex = -1; draw(); });
                        VizEngine.createButton(controls, 'Edge', function() { mode = 'edge'; selectedVertex = -1; draw(); });
                        VizEngine.createButton(controls, 'Clear', function() {
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0; draw();
                        });

                        // Preload interesting example
                        VizEngine.createButton(controls, 'Party of 6', function() {
                            var cx2 = w / 2, cy2 = h / 2, r = Math.min(w, h) * 0.28;
                            vertices = [];
                            for (var i = 0; i < 6; i++) {
                                var angle = -Math.PI / 2 + i * Math.PI * 2 / 6;
                                vertices.push({
                                    x: cx2 + r * Math.cos(angle),
                                    y: cy2 + r * Math.sin(angle) + 15,
                                    label: String.fromCharCode(65 + i)
                                });
                            }
                            // K_{3,3}: group {0,2,4} connects to {1,3,5}
                            edges = [[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]];
                            nextLabel = 6; selectedVertex = -1;
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'A graph has 7 vertices with degrees 4, 3, 3, 2, 2, 2, 1. How many edges does it have? Does it have an Euler path?',
                    hint: 'Use the handshaking lemma: \\(|E| = \\frac{1}{2}\\sum \\deg(v)\\). Then count odd-degree vertices.',
                    solution: 'Sum of degrees = 4+3+3+2+2+2+1 = 17. But this is odd, so \\(2|E| = 17\\) has no integer solution! This degree sequence is <em>impossible</em>. No such graph exists. The handshaking lemma catches the error immediately.'
                },
                {
                    question: 'Prove that in any group of people, the number of people who have shaken hands with an odd number of others is always even.',
                    hint: 'Model the situation as a graph. Each person is a vertex, each handshake is an edge.',
                    solution: 'Model the group as a graph where vertices are people and edges are handshakes. The degree of each vertex is the number of handshakes that person participated in. By the handshaking lemma, \\(\\sum \\deg(v) = 2|E|\\), which is even. The vertices with even degree contribute an even sum, so the vertices with odd degree must also contribute an even sum. A sum of odd numbers is even only if there is an even count of them. Therefore, the number of people with an odd number of handshakes is even.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Graph Coloring Preview
        // ─────────────────────────────────────────────
        {
            id: 'sec-graph-coloring',
            title: 'Graph Coloring Preview',
            content: `
<h2>Coloring Vertices</h2>

<p>Euler paths ask: can you walk every edge? Graph coloring asks a different question: can you color the vertices so that no two adjacent vertices share the same color?</p>

<div class="env-block definition">
<strong>Proper Coloring.</strong> A <em>proper coloring</em> of a graph assigns a color to each vertex so that no two adjacent vertices (connected by an edge) have the same color. The <em>chromatic number</em> \\(\\chi(G)\\) is the minimum number of colors needed.
</div>

<p>This connects to the famous Four Color Theorem: every planar graph (a graph you can draw on paper without edge crossings) has \\(\\chi(G) \\leq 4\\). But graph coloring goes far beyond maps.</p>

<h3>Simple Cases</h3>

<p>Some chromatic numbers are easy to determine:</p>
<ul>
<li>A graph with no edges: \\(\\chi = 1\\) (one color suffices).</li>
<li>A path \\(P_n\\) or even cycle \\(C_{2k}\\): \\(\\chi = 2\\) (just alternate two colors).</li>
<li>An odd cycle \\(C_{2k+1}\\): \\(\\chi = 3\\). You cannot alternate two colors around an odd cycle without a conflict at the last vertex.</li>
<li>The complete graph \\(K_n\\): \\(\\chi = n\\). Every vertex is adjacent to every other, so every vertex needs a different color.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-graph-coloring"></div>

<h3>Why Coloring Matters</h3>

<p>Graph coloring solves real-world problems:</p>
<ul>
<li><strong>Scheduling.</strong> You need to assign time slots to exams so that no student has two exams at the same time. Model exams as vertices, connect two exams if a student is enrolled in both, and find a proper coloring. The colors are the time slots.</li>
<li><strong>Register allocation.</strong> In computer science, compilers assign variables to CPU registers. Two variables that are used at the same time cannot share a register. This is a graph coloring problem.</li>
<li><strong>Map coloring.</strong> Color regions of a map so that no two adjacent regions share a color. This was the original motivation for the Four Color Theorem.</li>
<li><strong>Sudoku!</strong> As we will see in the next chapter, Sudoku is a graph coloring problem in disguise.</li>
</ul>

<div class="env-block intuition">
<strong>A bridge to the next chapter.</strong> A Sudoku grid is actually a graph with 81 vertices (the cells). Two cells are connected by an edge if they share a row, column, or 3\\(\\times\\)3 box. Solving Sudoku means finding a proper 9-coloring of this graph (where the "colors" are the digits 1 through 9). Graph coloring ties together Euler paths, map coloring, and Sudoku into one beautiful theory.
</div>

<div class="env-block remark">
<strong>Looking ahead.</strong> Graph theory is vast. We have barely scratched the surface. Trees, shortest paths (Dijkstra's algorithm), network flows, planar graphs, Ramsey theory, random graphs, and much more await. The key insight of this chapter is that by stripping away geometry and keeping only connections, we reveal deep structural truths that apply everywhere.
</div>
`,
            visualizations: [
                {
                    id: 'viz-graph-coloring',
                    title: 'Graph Coloring Explorer',
                    description: 'Click a vertex to cycle its color. Try to find a proper coloring using the fewest colors. Conflicting edges (same color on both endpoints) are shown in red.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var palette = ['none', viz.colors.blue, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.pink];
                        var paletteNames = ['(none)', 'Blue', 'Orange', 'Green', 'Purple', 'Pink'];
                        var numColors = palette.length;

                        var cx2 = w / 2, cy2 = h / 2;

                        // Petersen graph-like structure
                        var vertices = [];
                        var vertexColors = [];
                        var edges = [];

                        function loadGraph(type) {
                            vertices = []; vertexColors = []; edges = [];
                            if (type === 'cycle5') {
                                var r = Math.min(w, h) * 0.3;
                                for (var i = 0; i < 5; i++) {
                                    var angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
                                    vertices.push({ x: cx2 + r * Math.cos(angle), y: cy2 + r * Math.sin(angle) + 10, label: String.fromCharCode(65 + i) });
                                    vertexColors.push(0);
                                }
                                edges = [[0,1],[1,2],[2,3],[3,4],[4,0]];
                            } else if (type === 'k4') {
                                vertices = [
                                    { x: cx2, y: cy2 - 90, label: 'A' },
                                    { x: cx2 - 100, y: cy2 + 60, label: 'B' },
                                    { x: cx2 + 100, y: cy2 + 60, label: 'C' },
                                    { x: cx2, y: cy2 + 10, label: 'D' }
                                ];
                                vertexColors = [0, 0, 0, 0];
                                edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
                            } else if (type === 'bipartite') {
                                vertices = [
                                    { x: cx2 - 80, y: cy2 - 70, label: 'A' },
                                    { x: cx2 - 80, y: cy2, label: 'B' },
                                    { x: cx2 - 80, y: cy2 + 70, label: 'C' },
                                    { x: cx2 + 80, y: cy2 - 70, label: 'D' },
                                    { x: cx2 + 80, y: cy2, label: 'E' },
                                    { x: cx2 + 80, y: cy2 + 70, label: 'F' }
                                ];
                                vertexColors = [0, 0, 0, 0, 0, 0];
                                edges = [[0,3],[0,4],[1,3],[1,5],[2,4],[2,5]];
                            }
                        }

                        function draw() {
                            viz.clear();

                            // edges
                            var conflicts = 0;
                            for (var i = 0; i < edges.length; i++) {
                                var ai = edges[i][0], bi = edges[i][1];
                                var conflict = vertexColors[ai] > 0 && vertexColors[ai] === vertexColors[bi];
                                if (conflict) conflicts++;
                                ctx.strokeStyle = conflict ? viz.colors.red : viz.colors.teal + '66';
                                ctx.lineWidth = conflict ? 3 : 2;
                                ctx.beginPath();
                                ctx.moveTo(vertices[ai].x, vertices[ai].y);
                                ctx.lineTo(vertices[bi].x, vertices[bi].y);
                                ctx.stroke();
                            }

                            // vertices
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var c = vertexColors[j];
                                var col = c > 0 ? palette[c] : '#333355';
                                ctx.fillStyle = c > 0 ? col + '44' : '#222244';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                            }

                            // status
                            var colorsUsed = {};
                            var allColored = true;
                            for (var k = 0; k < vertexColors.length; k++) {
                                if (vertexColors[k] > 0) colorsUsed[vertexColors[k]] = true;
                                else allColored = false;
                            }
                            var nUsed = Object.keys(colorsUsed).length;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Colors used: ' + nUsed + '   Conflicts: ' + conflicts, w / 2, 10);

                            if (allColored && conflicts === 0) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText('Proper ' + nUsed + '-coloring found!', w / 2, 30);
                            } else if (allColored && conflicts > 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('Not proper. Fix the red edges.', w / 2, 30);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 22 * 22) {
                                    vertexColors[i] = (vertexColors[i] + 1) % numColors;
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'C\u2085 Cycle', function() { loadGraph('cycle5'); draw(); });
                        VizEngine.createButton(controls, 'K\u2084', function() { loadGraph('k4'); draw(); });
                        VizEngine.createButton(controls, 'Bipartite', function() { loadGraph('bipartite'); draw(); });
                        VizEngine.createButton(controls, 'Reset Colors', function() {
                            for (var i = 0; i < vertexColors.length; i++) vertexColors[i] = 0;
                            draw();
                        });

                        loadGraph('cycle5');
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the chromatic number of the cycle \\(C_6\\)? What about \\(C_7\\)?',
                    hint: 'Even cycles can be 2-colored by alternating. Odd cycles need at least 3.',
                    solution: '\\(\\chi(C_6) = 2\\). Since 6 is even, you can alternate two colors around the cycle: A-B-A-B-A-B. \\(\\chi(C_7) = 3\\). Since 7 is odd, alternating two colors fails at the last vertex (it would be the same color as its neighbor). You need a third color for one vertex.'
                },
                {
                    question: 'A Sudoku puzzle is a graph coloring problem. How many vertices does the Sudoku graph have? How many edges?',
                    hint: 'Each cell is a vertex. Two cells are connected if they share a row, column, or 3\\(\\times\\)3 box. Each cell shares a row with 8 others, a column with 8 others, and a box with (some overlapping) others.',
                    solution: 'The Sudoku graph has 81 vertices (one per cell). Each vertex is adjacent to 20 others: 8 in the same row, 8 in the same column, and 4 more in the same 3\\(\\times\\)3 box (not already counted from the row or column). The total number of edges is \\(81 \\times 20 / 2 = 810\\). The chromatic number is exactly 9 (the 9 digits).'
                }
            ]
        }
    ]
});
})();
