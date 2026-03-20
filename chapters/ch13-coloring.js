// === Chapter 13: Map Coloring ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13-coloring',
    number: 13,
    title: 'Map Coloring',
    subtitle: 'How many colors do you need?',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Motivation
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'Why Color Maps?',
            content: `
<h2>The Problem That Stumped Mathematicians for a Century</h2>

<p>In 1852, a young man named Francis Guthrie was coloring a map of the counties of England. He noticed that he never seemed to need more than four colors to ensure that no two adjacent counties shared the same color. He asked his brother Frederick, who asked the famous mathematician Augustus De Morgan, who asked everyone he knew. The question was simple:</p>

<div class="env-block intuition">
<strong>The Four Color Question.</strong> Can every map be colored with at most four colors, so that no two regions sharing a border receive the same color?
</div>

<p>It took 124 years to settle this question. The answer is <em>yes</em>, but the proof (by Appel and Haken in 1976) required a computer to check nearly 2,000 configurations. It remains one of the most famous results in all of mathematics.</p>

<p>Map coloring is really a problem about <strong>graphs</strong>. Each region becomes a vertex, and two vertices are connected by an edge if the corresponding regions share a border. Coloring the map is the same as coloring the vertices of the graph so that no two adjacent vertices share a color. This is called a <strong>proper coloring</strong>.</p>

<div class="env-block definition">
<strong>Graph Coloring.</strong> A <em>proper \\(k\\)-coloring</em> of a graph \\(G\\) is an assignment of one of \\(k\\) colors to each vertex, such that no edge connects two vertices of the same color. The <em>chromatic number</em> \\(\\chi(G)\\) is the smallest \\(k\\) for which a proper \\(k\\)-coloring exists.
</div>

<p>The Four Color Theorem says that every planar graph (a graph that can be drawn in the plane without edge crossings) has \\(\\chi(G) \\le 4\\). But for specific graphs, the chromatic number can be 1, 2, 3, or 4. Understanding when each case arises is a rich and beautiful part of combinatorics.</p>

<div class="viz-placeholder" data-viz="viz-map-coloring"></div>

<p>Try the interactive map above. Click a region to cycle through colors, and watch whether your coloring is valid. The challenge: can you always get away with just four colors?</p>
`,
            visualizations: [
                {
                    id: 'viz-map-coloring',
                    title: 'Interactive Map Coloring',
                    description: 'Click on regions to assign colors. The display shows conflicts (adjacent regions with the same color). Try to color the map with as few colors as possible.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        // Define a planar map as polygonal regions
                        var palette = ['#58a6ff', '#f0883e', '#3fb950', '#f85149', '#bc8cff'];
                        var paletteNames = ['Blue', 'Orange', 'Green', 'Red', 'Purple'];
                        var uncolored = '#2a2a4a';

                        // Simple planar map: 8 regions as polygons (in pixel coords)
                        var regions = [
                            { pts: [[50,50],[250,50],[250,150],[50,150]], color: -1, label: 'A' },
                            { pts: [[250,50],[450,50],[450,150],[250,150]], color: -1, label: 'B' },
                            { pts: [[450,50],[w-30,50],[w-30,150],[450,150]], color: -1, label: 'C' },
                            { pts: [[50,150],[200,150],[200,280],[50,280]], color: -1, label: 'D' },
                            { pts: [[200,150],[350,150],[350,280],[200,280]], color: -1, label: 'E' },
                            { pts: [[350,150],[w-30,150],[w-30,280],[350,280]], color: -1, label: 'F' },
                            { pts: [[50,280],[280,280],[280,h-30],[50,h-30]], color: -1, label: 'G' },
                            { pts: [[280,280],[w-30,280],[w-30,h-30],[280,h-30]], color: -1, label: 'H' }
                        ];

                        // Adjacency: regions sharing an edge
                        var adj = [
                            [0,1],[1,2],[0,3],[0,4],[1,4],[1,5],[2,5],
                            [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],[6,7]
                        ];

                        function pointInPolygon(px, py, pts) {
                            var inside = false;
                            for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
                                var xi = pts[i][0], yi = pts[i][1];
                                var xj = pts[j][0], yj = pts[j][1];
                                if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
                                    inside = !inside;
                                }
                            }
                            return inside;
                        }

                        function getConflicts() {
                            var conflicts = [];
                            for (var i = 0; i < adj.length; i++) {
                                var a = adj[i][0], b = adj[i][1];
                                if (regions[a].color >= 0 && regions[a].color === regions[b].color) {
                                    conflicts.push(adj[i]);
                                }
                            }
                            return conflicts;
                        }

                        function colorsUsed() {
                            var used = {};
                            for (var i = 0; i < regions.length; i++) {
                                if (regions[i].color >= 0) used[regions[i].color] = true;
                            }
                            return Object.keys(used).length;
                        }

                        function draw() {
                            viz.clear();
                            var conflicts = getConflicts();

                            // Draw regions
                            for (var i = 0; i < regions.length; i++) {
                                var r = regions[i];
                                ctx.beginPath();
                                ctx.moveTo(r.pts[0][0], r.pts[0][1]);
                                for (var j = 1; j < r.pts.length; j++) {
                                    ctx.lineTo(r.pts[j][0], r.pts[j][1]);
                                }
                                ctx.closePath();
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] + '55' : uncolored;
                                ctx.fill();
                                ctx.strokeStyle = r.color >= 0 ? palette[r.color] : '#4a4a7a';
                                ctx.lineWidth = 2;
                                ctx.stroke();

                                // Label
                                var cx = 0, cy = 0;
                                for (var k = 0; k < r.pts.length; k++) { cx += r.pts[k][0]; cy += r.pts[k][1]; }
                                cx /= r.pts.length; cy /= r.pts.length;
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] : viz.colors.text;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(r.label, cx, cy);
                            }

                            // Highlight conflicts
                            for (var c = 0; c < conflicts.length; c++) {
                                var ra = regions[conflicts[c][0]], rb = regions[conflicts[c][1]];
                                var ax = 0, ay = 0, bx = 0, by = 0;
                                for (var m = 0; m < ra.pts.length; m++) { ax += ra.pts[m][0]; ay += ra.pts[m][1]; }
                                ax /= ra.pts.length; ay /= ra.pts.length;
                                for (var m2 = 0; m2 < rb.pts.length; m2++) { bx += rb.pts[m2][0]; by += rb.pts[m2][1]; }
                                bx /= rb.pts.length; by /= rb.pts.length;
                                ctx.strokeStyle = '#ff0000';
                                ctx.lineWidth = 3;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Status
                            var nUsed = colorsUsed();
                            var allColored = regions.every(function(r) { return r.color >= 0; });
                            var msg = '';
                            if (!allColored) {
                                msg = 'Click regions to color them. Colors used: ' + nUsed;
                            } else if (conflicts.length > 0) {
                                msg = conflicts.length + ' conflict(s)! Colors used: ' + nUsed;
                            } else {
                                msg = 'Valid coloring with ' + nUsed + ' color(s)!';
                            }
                            ctx.fillStyle = conflicts.length > 0 && allColored ? viz.colors.red : viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(msg, w / 2, 10);

                            // Color palette legend
                            for (var p = 0; p < palette.length; p++) {
                                ctx.fillStyle = palette[p];
                                ctx.fillRect(w - 120, h - 30 * palette.length + p * 28 - 10, 14, 14);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(paletteNames[p], w - 100, h - 30 * palette.length + p * 28 - 3);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < regions.length; i++) {
                                if (pointInPolygon(mx, my, regions[i].pts)) {
                                    regions[i].color = (regions[i].color + 2) % (palette.length + 1) - 1;
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var i = 0; i < regions.length; i++) regions[i].color = -1;
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw a simple map with 5 regions and determine its chromatic number. How few colors do you need?',
                    hint: 'Try drawing 5 regions where some pairs share a border. The chromatic number depends on the adjacency pattern, not the number of regions.',
                    solution: 'Answers vary by map. For example, 5 regions in a "pinwheel" (each sharing a border with a central region and one neighbor) can be colored with 3 colors: the center gets one color, and the four surrounding regions alternate between two colors. But if every region borders every other, you would need 5 colors (though such a map cannot be planar).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 2: Two-Colorable Maps
        // ─────────────────────────────────────────────
        {
            id: 'sec-two-color',
            title: 'Two-Colorable Maps',
            content: `
<h2>Two Colors: Bipartite Graphs</h2>

<p>Some maps need only two colors. Think of a chessboard: color the squares black and white, and no two adjacent squares share a color. What property makes this possible?</p>

<div class="env-block theorem">
<strong>Theorem (Two-Colorability).</strong> A graph is 2-colorable (i.e., \\(\\chi(G) = 2\\), assuming \\(G\\) has at least one edge) if and only if it contains no odd cycle. Equivalently, \\(G\\) is <em>bipartite</em>: its vertices can be split into two sets \\(A\\) and \\(B\\) such that every edge goes from \\(A\\) to \\(B\\).
</div>

<p>The proof uses a simple algorithm. Pick any vertex and color it blue. Color all its neighbors red. Color all their uncolored neighbors blue, and so on (this is BFS, breadth-first search). If you ever need to color a vertex that already has a color, check: does it match? If yes, continue. If no, you have found an odd cycle, and 2 colors are not enough.</p>

<div class="env-block example">
<strong>Example: The Chessboard.</strong> An \\(n \\times n\\) chessboard is 2-colorable because every cycle on the grid has even length. Moving right adds 1, moving up adds 1, moving left subtracts 1, moving down subtracts 1. Any closed path must make an equal number of moves in each direction, so the total steps are even.
</div>

<div class="env-block example">
<strong>Example: A Triangle.</strong> The triangle \\(K_3\\) is <em>not</em> 2-colorable. If vertex A is blue and vertex B is red, then vertex C is adjacent to both, so it cannot be blue (adjacent to A) or red (adjacent to B). We need a third color.
</div>

<div class="viz-placeholder" data-viz="viz-two-colorable"></div>

<p>The visualization above lets you test graphs for 2-colorability. Watch the BFS algorithm attempt to assign two colors. If it succeeds, the graph is bipartite. If it fails, it highlights the odd cycle it found.</p>
`,
            visualizations: [
                {
                    id: 'viz-two-colorable',
                    title: 'Two-Colorability Test',
                    description: 'Select a graph type and watch the BFS algorithm try to 2-color it. Bipartite graphs succeed; graphs with odd cycles fail.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var graphType = 'cycle-even';
                        var animStep = -1;
                        var animTimer = null;
                        var nodes = [];
                        var edges = [];
                        var colorAssign = [];
                        var animQueue = [];
                        var animIdx = 0;
                        var failEdge = null;

                        function buildGraph(type) {
                            nodes = []; edges = []; colorAssign = []; failEdge = null;
                            animStep = -1; animIdx = 0; animQueue = [];
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }

                            if (type === 'cycle-even') {
                                var n = 6;
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                                    nodes.push({ x: cx + 120 * Math.cos(angle), y: cy + 120 * Math.sin(angle) });
                                    colorAssign.push(-1);
                                }
                                for (var j = 0; j < n; j++) edges.push([j, (j + 1) % n]);
                            } else if (type === 'cycle-odd') {
                                var n2 = 5;
                                for (var i2 = 0; i2 < n2; i2++) {
                                    var a2 = -Math.PI / 2 + (2 * Math.PI * i2) / n2;
                                    nodes.push({ x: cx + 120 * Math.cos(a2), y: cy + 120 * Math.sin(a2) });
                                    colorAssign.push(-1);
                                }
                                for (var j2 = 0; j2 < n2; j2++) edges.push([j2, (j2 + 1) % n2]);
                            } else if (type === 'grid') {
                                var rows = 3, cols = 4;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        nodes.push({ x: cx - 90 + c * 60, y: cy - 60 + r * 60 });
                                        colorAssign.push(-1);
                                    }
                                }
                                for (var r2 = 0; r2 < rows; r2++) {
                                    for (var c2 = 0; c2 < cols; c2++) {
                                        var idx = r2 * cols + c2;
                                        if (c2 < cols - 1) edges.push([idx, idx + 1]);
                                        if (r2 < rows - 1) edges.push([idx, idx + cols]);
                                    }
                                }
                            } else if (type === 'petersen') {
                                // Petersen graph: 10 vertices, not bipartite (has odd cycles)
                                for (var i3 = 0; i3 < 5; i3++) {
                                    var a3 = -Math.PI / 2 + (2 * Math.PI * i3) / 5;
                                    nodes.push({ x: cx + 130 * Math.cos(a3), y: cy + 130 * Math.sin(a3) });
                                    colorAssign.push(-1);
                                }
                                for (var i4 = 0; i4 < 5; i4++) {
                                    var a4 = -Math.PI / 2 + (2 * Math.PI * i4) / 5;
                                    nodes.push({ x: cx + 55 * Math.cos(a4), y: cy + 55 * Math.sin(a4) });
                                    colorAssign.push(-1);
                                }
                                // Outer cycle
                                for (var j3 = 0; j3 < 5; j3++) edges.push([j3, (j3 + 1) % 5]);
                                // Inner star
                                for (var j4 = 0; j4 < 5; j4++) edges.push([5 + j4, 5 + (j4 + 2) % 5]);
                                // Spokes
                                for (var j5 = 0; j5 < 5; j5++) edges.push([j5, j5 + 5]);
                            }
                        }

                        function bfsColor() {
                            // BFS-based 2-coloring attempt
                            animQueue = [];
                            for (var i = 0; i < nodes.length; i++) colorAssign[i] = -1;
                            failEdge = null;

                            var adjList = [];
                            for (var v = 0; v < nodes.length; v++) adjList.push([]);
                            for (var e = 0; e < edges.length; e++) {
                                adjList[edges[e][0]].push(edges[e][1]);
                                adjList[edges[e][1]].push(edges[e][0]);
                            }

                            var visited = new Array(nodes.length).fill(false);
                            var queue = [0];
                            colorAssign[0] = 0;
                            visited[0] = true;
                            animQueue.push({ type: 'color', node: 0, color: 0 });

                            var failed = false;
                            while (queue.length > 0 && !failed) {
                                var u = queue.shift();
                                for (var ni = 0; ni < adjList[u].length; ni++) {
                                    var v2 = adjList[u][ni];
                                    if (colorAssign[v2] === -1) {
                                        colorAssign[v2] = 1 - colorAssign[u];
                                        visited[v2] = true;
                                        queue.push(v2);
                                        animQueue.push({ type: 'color', node: v2, color: colorAssign[v2] });
                                    } else if (colorAssign[v2] === colorAssign[u]) {
                                        animQueue.push({ type: 'fail', edge: [u, v2] });
                                        failed = true;
                                        break;
                                    }
                                }
                            }
                            if (!failed) {
                                animQueue.push({ type: 'success' });
                            }
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            var title = graphType === 'cycle-even' ? 'Even Cycle (C6)' :
                                        graphType === 'cycle-odd' ? 'Odd Cycle (C5)' :
                                        graphType === 'grid' ? '3x4 Grid' : 'Petersen Graph';
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(title, cx, 10);

                            // Draw edges
                            for (var e = 0; e < edges.length; e++) {
                                var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
                                var isFail = failEdge && failEdge[0] === edges[e][0] && failEdge[1] === edges[e][1];
                                ctx.strokeStyle = isFail ? viz.colors.red : viz.colors.axis;
                                ctx.lineWidth = isFail ? 3 : 1.5;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Draw nodes
                            var colorPalette = [viz.colors.blue, viz.colors.orange];
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                var col = colorAssign[i] >= 0 ? colorPalette[colorAssign[i]] : '#555577';
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), nd.x, nd.y);
                            }

                            // Status message
                            if (animIdx > 0 && animIdx <= animQueue.length) {
                                var last = animQueue[animIdx - 1];
                                var msg = '';
                                if (last.type === 'success') {
                                    msg = 'Bipartite! 2-coloring found.';
                                    ctx.fillStyle = viz.colors.green;
                                } else if (last.type === 'fail') {
                                    msg = 'Not bipartite! Conflict at edge ' + last.edge[0] + '-' + last.edge[1];
                                    ctx.fillStyle = viz.colors.red;
                                } else {
                                    msg = 'Coloring vertex ' + last.node + '...';
                                    ctx.fillStyle = viz.colors.text;
                                }
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText(msg, cx, h - 10);
                            }
                        }

                        function runAnimation() {
                            if (animTimer) clearInterval(animTimer);
                            // Reset colors
                            for (var i = 0; i < nodes.length; i++) colorAssign[i] = -1;
                            failEdge = null;
                            bfsColor();
                            // Reset colors for animation
                            for (var j = 0; j < nodes.length; j++) colorAssign[j] = -1;
                            animIdx = 0;
                            draw();

                            animTimer = setInterval(function() {
                                if (animIdx >= animQueue.length) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                    return;
                                }
                                var step = animQueue[animIdx];
                                if (step.type === 'color') {
                                    colorAssign[step.node] = step.color;
                                } else if (step.type === 'fail') {
                                    failEdge = step.edge;
                                }
                                animIdx++;
                                draw();
                            }, 400);
                        }

                        var types = ['cycle-even', 'cycle-odd', 'grid', 'petersen'];
                        var typeLabels = ['Even Cycle', 'Odd Cycle', 'Grid', 'Petersen'];
                        for (var t = 0; t < types.length; t++) {
                            (function(tp) {
                                VizEngine.createButton(controls, typeLabels[types.indexOf(tp)], function() {
                                    graphType = tp;
                                    buildGraph(tp);
                                    draw();
                                });
                            })(types[t]);
                        }

                        VizEngine.createButton(controls, 'Run BFS', function() {
                            runAnimation();
                        });

                        buildGraph(graphType);
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that every tree is 2-colorable.',
                    hint: 'A tree has no cycles at all. BFS from the root, alternating colors at each level.',
                    solution: 'Root the tree at any vertex and color it blue. Color all vertices at even depth blue and all vertices at odd depth red. Since a tree has no cycles, every edge connects a parent to a child (adjacent levels), so the endpoints always get different colors. Therefore \\(\\chi(T) \\le 2\\) for any tree \\(T\\) with at least one edge.'
                },
                {
                    question: 'Show that the cycle \\(C_n\\) is 2-colorable if and only if \\(n\\) is even.',
                    hint: 'Label the vertices \\(0, 1, \\ldots, n-1\\) around the cycle. If vertex 0 is blue, vertex 1 must be red, vertex 2 blue, etc.',
                    solution: 'Alternating colors around the cycle forces vertex \\(i\\) to have color \\(i \\bmod 2\\). The last edge connects vertex \\(n-1\\) to vertex 0. Vertex 0 has color 0 and vertex \\(n-1\\) has color \\((n-1) \\bmod 2\\). These differ if and only if \\(n-1\\) is odd, i.e., \\(n\\) is even. For odd \\(n\\), the last edge creates a conflict.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: When Three Colors Suffice
        // ─────────────────────────────────────────────
        {
            id: 'sec-three',
            title: 'When Three Colors Suffice',
            content: `
<h2>Three Colors</h2>

<p>Many graphs need exactly three colors. The simplest example is the triangle \\(K_3\\): three vertices, each adjacent to the other two. Two colors are not enough (we proved this above), but three suffice.</p>

<div class="env-block theorem">
<strong>Brooks' Theorem (1941).</strong> If \\(G\\) is a connected graph that is neither a complete graph nor an odd cycle, then \\(\\chi(G) \\le \\Delta(G)\\), where \\(\\Delta(G)\\) is the maximum degree of any vertex in \\(G\\).
</div>

<p>Brooks' theorem tells us that for most graphs, the chromatic number is at most equal to the maximum degree. The complete graph \\(K_n\\) and odd cycles are the only exceptions (they need \\(\\Delta + 1\\) colors).</p>

<h3>Greedy Coloring</h3>

<p>A simple algorithm for coloring any graph is the <em>greedy algorithm</em>:</p>
<ol>
<li>Order the vertices \\(v_1, v_2, \\ldots, v_n\\).</li>
<li>For each vertex in order, assign it the smallest color not used by any already-colored neighbor.</li>
</ol>

<p>The greedy algorithm always uses at most \\(\\Delta(G) + 1\\) colors (since each vertex has at most \\(\\Delta\\) neighbors, at most \\(\\Delta\\) colors are forbidden, so color \\(\\Delta + 1\\) or smaller is always available). But it might not find the optimal coloring; the result depends on the vertex ordering.</p>

<div class="env-block example">
<strong>Example: Wheel Graph \\(W_5\\).</strong> Take a cycle \\(C_5\\) (5 vertices in a ring) and add a central vertex connected to all five. The central vertex has degree 5, and each rim vertex has degree 3. Since \\(C_5\\) is an odd cycle (needing 3 colors), and the center is adjacent to all rim vertices, we need a 4th color for the center. So \\(\\chi(W_5) = 4\\).
</div>

<div class="env-block remark">
<strong>3-colorability is hard.</strong> Deciding whether a given graph is 3-colorable is NP-complete. Unlike 2-colorability (which BFS solves in linear time), there is no known efficient algorithm for 3-coloring. This is one of the classic NP-complete problems in computer science.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Apply the greedy coloring algorithm to the Petersen graph (look it up if needed). How many colors does greedy use? Is this optimal?',
                    hint: 'The Petersen graph is 3-colorable. But greedy coloring might use more colors depending on the vertex ordering.',
                    solution: 'The Petersen graph has \\(\\chi = 3\\) (it has odd cycles but is 3-colorable). A good vertex ordering lets greedy use exactly 3 colors. A bad ordering could use 4. The chromatic number is 3 because the graph has triangles (needing 3) and a valid 3-coloring exists by construction.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: The Four Color Theorem
        // ─────────────────────────────────────────────
        {
            id: 'sec-four',
            title: 'The Four Color Theorem',
            content: `
<h2>Any Map Needs At Most Four Colors!</h2>

<p>We arrive at the crown jewel of graph coloring theory.</p>

<div class="env-block theorem">
<strong>The Four Color Theorem.</strong> Every planar graph is 4-colorable. Equivalently, every map (where regions are connected) can be colored with at most 4 colors so that no two adjacent regions share a color.
</div>

<p>The theorem was conjectured by Francis Guthrie in 1852 and proved by Kenneth Appel and Wolfgang Haken in 1976. Their proof was the first major theorem to rely essentially on computer verification: they reduced the infinite family of planar graphs to 1,936 "unavoidable configurations" and checked each one by computer. A simplified proof was given by Robertson, Sanders, Seymour, and Thomas in 1997, using 633 configurations.</p>

<h3>Why Not Five?</h3>

<p>There exist planar graphs that require exactly 4 colors. The simplest is the graph of the octahedron (or equivalently, a "map" with 4 mutually adjacent regions). Any three of the four faces of a tetrahedron are mutually adjacent, so 4 colors are needed.</p>

<h3>The Five Color Theorem Is Easier</h3>

<p>While the Four Color Theorem is notoriously hard, the <strong>Five Color Theorem</strong> (every planar graph is 5-colorable) has a clean inductive proof that fits on one page. The key ingredients are:</p>
<ol>
<li><strong>Euler's formula:</strong> For a connected planar graph, \\(V - E + F = 2\\).</li>
<li><strong>A density bound:</strong> Every planar graph has a vertex with degree at most 5.</li>
<li><strong>Induction:</strong> Remove a low-degree vertex, color the rest by induction, then put it back. If fewer than 5 colors appear among its neighbors, we can color it. If all 5 appear, a Kempe-chain argument frees up a color.</li>
</ol>

<p>Going from 5 to 4 is where the difficulty lies, and why a computer was needed.</p>

<div class="viz-placeholder" data-viz="viz-four-color-challenge"></div>

<p>Try the challenge above: color a complex planar map using only 4 colors. It is always possible, but finding the right coloring takes thought!</p>

<div class="env-block remark">
<strong>Philosophical note.</strong> The computer-assisted proof of the Four Color Theorem was controversial when it was announced. Many mathematicians felt that a proof should be humanly verifiable. Appel reportedly said: "Most mathematicians who were educated prior to 1976 consider it to be a legitimate proof only with great reluctance." Today, formal verification (e.g., in Coq) has settled much of the debate.
</div>
`,
            visualizations: [
                {
                    id: 'viz-four-color-challenge',
                    title: 'Four-Color Challenge',
                    description: 'Color this complex planar map using only 4 colors. Click a region to cycle its color. Can you eliminate all conflicts?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var palette = ['#58a6ff', '#f0883e', '#3fb950', '#f85149'];
                        var pNames = ['Blue', 'Orange', 'Green', 'Red'];

                        // 12-region complex planar map
                        var rw = w - 60, rh = h - 80;
                        var ox = 30, oy = 40;
                        var c3 = rw / 3, c4 = rw / 4;
                        var r3 = rh / 3, r4 = rh / 4;

                        var regions = [
                            { pts: [[ox,oy],[ox+c3,oy],[ox+c3,oy+r3],[ox,oy+r3]], color: -1, label: '1' },
                            { pts: [[ox+c3,oy],[ox+2*c3,oy],[ox+2*c3,oy+r3],[ox+c3,oy+r3]], color: -1, label: '2' },
                            { pts: [[ox+2*c3,oy],[ox+rw,oy],[ox+rw,oy+r3],[ox+2*c3,oy+r3]], color: -1, label: '3' },
                            { pts: [[ox,oy+r3],[ox+c4,oy+r3],[ox+c4,oy+2*r3],[ox,oy+2*r3]], color: -1, label: '4' },
                            { pts: [[ox+c4,oy+r3],[ox+2*c4,oy+r3],[ox+2*c4,oy+2*r3],[ox+c4,oy+2*r3]], color: -1, label: '5' },
                            { pts: [[ox+2*c4,oy+r3],[ox+3*c4,oy+r3],[ox+3*c4,oy+2*r3],[ox+2*c4,oy+2*r3]], color: -1, label: '6' },
                            { pts: [[ox+3*c4,oy+r3],[ox+rw,oy+r3],[ox+rw,oy+2*r3],[ox+3*c4,oy+2*r3]], color: -1, label: '7' },
                            { pts: [[ox,oy+2*r3],[ox+c3,oy+2*r3],[ox+c3,oy+rh],[ox,oy+rh]], color: -1, label: '8' },
                            { pts: [[ox+c3,oy+2*r3],[ox+rw/2,oy+2*r3],[ox+rw/2,oy+rh],[ox+c3,oy+rh]], color: -1, label: '9' },
                            { pts: [[ox+rw/2,oy+2*r3],[ox+2*c3,oy+2*r3],[ox+2*c3,oy+rh],[ox+rw/2,oy+rh]], color: -1, label: '10' },
                            { pts: [[ox+2*c3,oy+2*r3],[ox+rw,oy+2*r3],[ox+rw,oy+rh],[ox+2*c3,oy+rh]], color: -1, label: '11' }
                        ];

                        // Adjacency determined by shared edges
                        var adj = [
                            [0,1],[1,2],
                            [0,3],[0,4],[1,4],[1,5],[2,5],[2,6],
                            [3,4],[4,5],[5,6],
                            [3,7],[4,7],[4,8],[5,8],[5,9],[6,9],[6,10],
                            [7,8],[8,9],[9,10]
                        ];

                        function centroid(pts) {
                            var sx = 0, sy = 0;
                            for (var i = 0; i < pts.length; i++) { sx += pts[i][0]; sy += pts[i][1]; }
                            return [sx / pts.length, sy / pts.length];
                        }

                        function pointInPoly(px, py, pts) {
                            var inside = false;
                            for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
                                var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
                                if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
                            }
                            return inside;
                        }

                        function getConflicts() {
                            var c = [];
                            for (var i = 0; i < adj.length; i++) {
                                var a = adj[i][0], b = adj[i][1];
                                if (regions[a].color >= 0 && regions[a].color === regions[b].color) c.push(adj[i]);
                            }
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var conflicts = getConflicts();

                            for (var i = 0; i < regions.length; i++) {
                                var r = regions[i];
                                ctx.beginPath();
                                ctx.moveTo(r.pts[0][0], r.pts[0][1]);
                                for (var j = 1; j < r.pts.length; j++) ctx.lineTo(r.pts[j][0], r.pts[j][1]);
                                ctx.closePath();
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] + '44' : '#1a1a40';
                                ctx.fill();
                                ctx.strokeStyle = r.color >= 0 ? palette[r.color] : viz.colors.axis;
                                ctx.lineWidth = 2; ctx.stroke();

                                var ctr = centroid(r.pts);
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] : viz.colors.text;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(r.label, ctr[0], ctr[1]);
                            }

                            // Conflict lines
                            for (var ci = 0; ci < conflicts.length; ci++) {
                                var ca = centroid(regions[conflicts[ci][0]].pts);
                                var cb = centroid(regions[conflicts[ci][1]].pts);
                                ctx.strokeStyle = '#ff000088'; ctx.lineWidth = 2;
                                ctx.setLineDash([4,3]);
                                ctx.beginPath(); ctx.moveTo(ca[0], ca[1]); ctx.lineTo(cb[0], cb[1]); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            var allColored = regions.every(function(r) { return r.color >= 0; });
                            var nColors = {};
                            regions.forEach(function(r) { if (r.color >= 0) nColors[r.color] = 1; });
                            var nc = Object.keys(nColors).length;

                            var msg = '';
                            if (!allColored) msg = 'Click to color (only 4 colors!). ' + nc + ' used so far.';
                            else if (conflicts.length > 0) msg = 'Almost! ' + conflicts.length + ' conflict(s) remain.';
                            else msg = 'Perfect! Valid 4-coloring with ' + nc + ' colors!';

                            ctx.fillStyle = (allColored && conflicts.length === 0) ? viz.colors.green : viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(msg, w / 2, 8);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < regions.length; i++) {
                                if (pointInPoly(mx, my, regions[i].pts)) {
                                    regions[i].color = (regions[i].color + 2) % (palette.length + 1) - 1;
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            regions.forEach(function(r) { r.color = -1; });
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Euler\'s formula \\(V - E + F = 2\\) to show that every planar graph has a vertex of degree at most 5.',
                    hint: 'Every face is bounded by at least 3 edges, and each edge borders 2 faces. So \\(2E \\ge 3F\\), giving \\(F \\le 2E/3\\).',
                    solution: 'From Euler\'s formula: \\(F = 2 - V + E\\). Since every face has at least 3 edges and each edge borders 2 faces, \\(3F \\le 2E\\), so \\(F \\le 2E/3\\). Substituting: \\(2 - V + E \\le 2E/3\\), giving \\(E \\le 3V - 6\\). If every vertex had degree at least 6, then \\(2E = \\sum \\deg(v) \\ge 6V\\), so \\(E \\ge 3V\\), contradicting \\(E \\le 3V - 6\\). Therefore some vertex has degree \\(\\le 5\\).'
                },
                {
                    question: 'Explain why \\(K_5\\) (the complete graph on 5 vertices) is not planar, and why this is relevant to the Four Color Theorem.',
                    hint: 'For \\(K_5\\): \\(V=5, E=10\\). Check whether \\(E \\le 3V - 6\\) holds.',
                    solution: 'For \\(K_5\\): \\(V=5, E=10\\). The bound \\(E \\le 3V-6 = 9\\) is violated, so \\(K_5\\) is not planar (by Kuratowski\'s theorem, this is a necessary condition). Since \\(K_5\\) requires 5 colors (\\(\\chi(K_5) = 5\\)) but is not planar, it does not contradict the Four Color Theorem, which only applies to planar graphs.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: The Coloring Game
        // ─────────────────────────────────────────────
        {
            id: 'sec-game',
            title: 'The Coloring Game',
            content: `
<h2>You vs. the Adversary</h2>

<p>The <em>graph coloring game</em> is a two-player game that reveals how much harder coloring becomes when you do not control everything.</p>

<div class="env-block definition">
<strong>The Graph Coloring Game.</strong> Two players, Alice and Bob, take turns coloring vertices of a graph \\(G\\) using a set of \\(k\\) colors. On each turn, the current player must color an uncolored vertex with a color not used by any of its already-colored neighbors. Alice wants to succeed (color the entire graph); Bob wants to force a failure (create a situation where some uncolored vertex has all \\(k\\) colors among its neighbors). Alice goes first.
</div>

<p>The <em>game chromatic number</em> \\(\\chi_g(G)\\) is the smallest \\(k\\) for which Alice has a winning strategy. It is always at least \\(\\chi(G)\\) (since the game is harder for Alice than coloring alone), but it can be much larger.</p>

<div class="env-block example">
<strong>Example: Forest.</strong> Every forest (acyclic graph) has \\(\\chi(G) = 2\\), but the game chromatic number can be as large as 4. Even on a tree, Bob's adversarial vertex choices can force Alice to use more colors.
</div>

<div class="env-block theorem">
<strong>Theorem.</strong> For planar graphs, \\(\\chi_g(G) \\le 17\\). (The exact bound is conjectured to be much lower, perhaps 5 or 6, but this is open.)
</div>

<p>In the visualization below, you play as Alice. The computer plays as Bob (adversarially choosing which vertex to color next). Can you color the graph with \\(k\\) colors?</p>

<div class="viz-placeholder" data-viz="viz-coloring-game"></div>
`,
            visualizations: [
                {
                    id: 'viz-coloring-game',
                    title: 'The Coloring Game',
                    description: 'You (Alice) and the computer (Bob) take turns. You pick a vertex and a color; Bob picks a vertex and a valid color adversarially. Try to color the whole graph with k colors!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var palette = ['#58a6ff', '#f0883e', '#3fb950', '#f85149', '#bc8cff'];
                        var kColors = 3;

                        // Simple graph: C5 with extra edges
                        var nodes = [];
                        var edges = [];
                        var colors = [];
                        var turn = 'alice'; // 'alice' or 'bob'
                        var gameOver = false;
                        var gameMsg = 'Your turn (Alice). Click a vertex, then pick a color.';
                        var selectedNode = -1;

                        function buildGame() {
                            nodes = []; edges = []; colors = [];
                            turn = 'alice'; gameOver = false; selectedNode = -1;
                            gameMsg = 'Your turn (Alice). Click a vertex, then pick a color.';

                            // Build a small graph: 7 vertices
                            var positions = [
                                [cx, cy - 100],
                                [cx - 110, cy - 30],
                                [cx + 110, cy - 30],
                                [cx - 70, cy + 80],
                                [cx + 70, cy + 80],
                                [cx - 140, cy + 50],
                                [cx + 140, cy + 50]
                            ];
                            for (var i = 0; i < positions.length; i++) {
                                nodes.push({ x: positions[i][0], y: positions[i][1] });
                                colors.push(-1);
                            }
                            edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[1,5],[3,5],[2,6],[4,6]];
                        }

                        function neighbors(v) {
                            var nbrs = [];
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i][0] === v) nbrs.push(edges[i][1]);
                                if (edges[i][1] === v) nbrs.push(edges[i][0]);
                            }
                            return nbrs;
                        }

                        function validColors(v) {
                            var nbrs = neighbors(v);
                            var used = {};
                            for (var i = 0; i < nbrs.length; i++) {
                                if (colors[nbrs[i]] >= 0) used[colors[nbrs[i]]] = true;
                            }
                            var valid = [];
                            for (var c = 0; c < kColors; c++) {
                                if (!used[c]) valid.push(c);
                            }
                            return valid;
                        }

                        function uncoloredVertices() {
                            var uc = [];
                            for (var i = 0; i < nodes.length; i++) {
                                if (colors[i] < 0) uc.push(i);
                            }
                            return uc;
                        }

                        function checkStuck() {
                            var uc = uncoloredVertices();
                            for (var i = 0; i < uc.length; i++) {
                                if (validColors(uc[i]).length === 0) return true;
                            }
                            return false;
                        }

                        function bobMove() {
                            // Bob picks the uncolored vertex with the fewest valid colors (adversarial)
                            var uc = uncoloredVertices();
                            if (uc.length === 0) return;

                            var bestV = -1, bestScore = 999;
                            for (var i = 0; i < uc.length; i++) {
                                var vc = validColors(uc[i]);
                                if (vc.length < bestScore) {
                                    bestScore = vc.length; bestV = uc[i];
                                }
                            }
                            if (bestV >= 0 && bestScore > 0) {
                                // Pick the color that constrains Alice the most
                                var vc2 = validColors(bestV);
                                // For each valid color, count how many neighbor's valid-color-sets it shrinks
                                var bestC = vc2[0], bestDamage = -1;
                                for (var ci = 0; ci < vc2.length; ci++) {
                                    var damage = 0;
                                    var nbrs = neighbors(bestV);
                                    for (var ni = 0; ni < nbrs.length; ni++) {
                                        if (colors[nbrs[ni]] < 0) {
                                            var before = validColors(nbrs[ni]).length;
                                            colors[bestV] = vc2[ci];
                                            var after = validColors(nbrs[ni]).length;
                                            colors[bestV] = -1;
                                            damage += (before - after);
                                        }
                                    }
                                    if (damage > bestDamage) { bestDamage = damage; bestC = vc2[ci]; }
                                }
                                colors[bestV] = bestC;
                                gameMsg = 'Bob colored vertex ' + bestV + '. Your turn!';
                            }

                            if (uncoloredVertices().length === 0) {
                                gameOver = true;
                                gameMsg = 'All colored! Alice wins!';
                            } else if (checkStuck()) {
                                gameOver = true;
                                gameMsg = 'A vertex is stuck! Bob wins!';
                            }
                            turn = 'alice';
                        }

                        function draw() {
                            viz.clear();

                            // Edges
                            for (var e = 0; e < edges.length; e++) {
                                var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Nodes
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                var col = colors[i] >= 0 ? palette[colors[i]] : '#555577';
                                var isSelected = (i === selectedNode);
                                ctx.fillStyle = col + (isSelected ? '88' : '44');
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, isSelected ? 24 : 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), nd.x, nd.y);
                            }

                            // Color palette for Alice to pick from
                            if (selectedNode >= 0 && !gameOver) {
                                var vc = validColors(selectedNode);
                                var palY = h - 50;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('Pick color for vertex ' + selectedNode + ':', w / 2, palY - 15);
                                for (var pi = 0; pi < vc.length; pi++) {
                                    var px = w / 2 - (vc.length - 1) * 20 + pi * 40;
                                    ctx.fillStyle = palette[vc[pi]];
                                    ctx.beginPath(); ctx.arc(px, palY + 10, 14, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(vc[pi] + 1, px, palY + 10);
                                }
                            }

                            // Status
                            ctx.fillStyle = gameOver ? (gameMsg.indexOf('Alice') >= 0 ? viz.colors.green : viz.colors.red) : viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(gameMsg, w / 2, 8);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Colors available: ' + kColors + '  |  Turn: ' + turn, w / 2, 26);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver || turn !== 'alice') return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;

                            // Check if clicking a color swatch
                            if (selectedNode >= 0) {
                                var vc = validColors(selectedNode);
                                var palY = h - 50 + 10;
                                for (var pi = 0; pi < vc.length; pi++) {
                                    var px = w / 2 - (vc.length - 1) * 20 + pi * 40;
                                    if (Math.sqrt((mx - px) * (mx - px) + (my - palY) * (my - palY)) < 16) {
                                        colors[selectedNode] = vc[pi];
                                        selectedNode = -1;
                                        if (uncoloredVertices().length === 0) {
                                            gameOver = true;
                                            gameMsg = 'All colored! Alice wins!';
                                        } else if (checkStuck()) {
                                            gameOver = true;
                                            gameMsg = 'A vertex is stuck! Bob wins!';
                                        } else {
                                            turn = 'bob';
                                            draw();
                                            setTimeout(function() { bobMove(); draw(); }, 600);
                                            return;
                                        }
                                        draw();
                                        return;
                                    }
                                }
                            }

                            // Check if clicking a vertex
                            for (var i = 0; i < nodes.length; i++) {
                                if (colors[i] >= 0) continue;
                                var dx = mx - nodes[i].x, dy = my - nodes[i].y;
                                if (Math.sqrt(dx * dx + dy * dy) < 22) {
                                    selectedNode = i;
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createSlider(controls, 'Colors k', 2, 5, kColors, 1, function(v) {
                            kColors = Math.round(v);
                            buildGame();
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Game', function() {
                            buildGame();
                            draw();
                        });

                        buildGame();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the coloring game on a path graph \\(P_n\\) (a line of \\(n\\) vertices), how many colors does Alice need to guarantee a win?',
                    hint: 'A path is bipartite (\\(\\chi = 2\\)). Can Alice always win with 2 colors, even against an adversarial Bob?',
                    solution: 'Alice can always win with 2 colors on a path. Strategy: Alice always colors the vertex adjacent to the most recently colored vertex, using the opposite color. Bob cannot force a conflict because the path has no odd cycles, and Alice can always extend the coloring. The game chromatic number of \\(P_n\\) is 2 for \\(n \\ge 2\\).'
                },
                {
                    question: 'Show that the game chromatic number satisfies \\(\\chi(G) \\le \\chi_g(G) \\le 2\\chi(G)\\).',
                    hint: 'The lower bound is obvious (Alice has to use at least \\(\\chi(G)\\) colors). For the upper bound, think about what happens if Alice has \\(2\\chi(G)\\) colors available.',
                    solution: 'Lower bound: if \\(k < \\chi(G)\\), no proper \\(k\\)-coloring exists, so Alice certainly cannot succeed. Upper bound: this is non-trivial and actually the bound \\(\\chi_g(G) \\le 2\\chi(G)\\) does NOT hold in general; the true bound is more subtle. The point of the question is to explore: the game chromatic number can be significantly larger than the chromatic number, and tight general bounds are an open problem.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Bridge to Further Topics
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'Beyond Four Colors',
            content: `
<h2>Coloring in the Wild</h2>

<p>Graph coloring is not just an abstract puzzle. It appears throughout computer science, operations research, and even physics.</p>

<h3>Scheduling and Register Allocation</h3>

<p>Suppose you need to schedule final exams so that no student has two exams at the same time. Build a graph where each exam is a vertex, and connect two exams if some student is enrolled in both. A proper coloring assigns time slots; the chromatic number gives the minimum number of slots needed. This is why coloring is a core topic in algorithm design.</p>

<p>In compilers, <strong>register allocation</strong> uses the same idea. Variables are vertices, and two variables that are "live" at the same time are connected by an edge. Coloring the graph with \\(k\\) colors means fitting the variables into \\(k\\) processor registers.</p>

<h3>The Chromatic Polynomial</h3>

<div class="env-block definition">
<strong>The Chromatic Polynomial.</strong> For a graph \\(G\\) and a positive integer \\(k\\), the chromatic polynomial \\(P(G, k)\\) counts the number of proper \\(k\\)-colorings of \\(G\\). It is always a polynomial in \\(k\\).
</div>

<p>For example:</p>
<ul>
<li>For the complete graph \\(K_n\\): \\(P(K_n, k) = k(k-1)(k-2)\\cdots(k-n+1)\\).</li>
<li>For a tree on \\(n\\) vertices: \\(P(T_n, k) = k(k-1)^{n-1}\\).</li>
<li>For the cycle \\(C_n\\): \\(P(C_n, k) = (k-1)^n + (-1)^n(k-1)\\).</li>
</ul>

<p>The chromatic polynomial encodes deep information about the graph's structure. Its roots, coefficients, and algebraic properties are an active area of research.</p>

<div class="viz-placeholder" data-viz="viz-chromatic-number"></div>

<div class="viz-placeholder" data-viz="viz-world-map"></div>

<h3>Where to Go Next</h3>

<p>Map coloring connects to many other topics in this book and beyond:</p>
<ul>
<li><strong>Graph theory</strong> (Chapter 18): coloring is one of the central problems of graph theory.</li>
<li><strong>Combinatorial game theory</strong> (Chapters 13-15): the coloring game is a combinatorial game.</li>
<li><strong>Algorithms and complexity</strong>: graph coloring is a key example in the theory of NP-completeness.</li>
<li><strong>Topology</strong>: the Four Color Theorem is really a statement about surfaces. On a torus, the answer changes to 7 colors!</li>
</ul>

<div class="env-block remark">
<strong>The Heawood conjecture.</strong> On a surface of genus \\(g > 0\\) (a surface with \\(g\\) "handles"), the maximum chromatic number is \\(\\lfloor (7 + \\sqrt{1 + 48g})/2 \\rfloor\\). This was proved in 1968 by Ringel and Youngs (for all \\(g \\ge 1\\)). For the torus (\\(g = 1\\)), this gives 7. For the Klein bottle, 6. The sphere (\\(g = 0\\)) is the special case covered by the Four Color Theorem.
</div>
`,
            visualizations: [
                {
                    id: 'viz-chromatic-number',
                    title: 'Chromatic Number Explorer',
                    description: 'Try to color various graphs with the minimum number of colors. The display tells you the chromatic number and whether your coloring is optimal.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var palette = ['#58a6ff', '#f0883e', '#3fb950', '#f85149', '#bc8cff', '#d29922'];

                        var graphName = 'K4';
                        var nodes = [], edges = [], nodeColors = [];
                        var chromatic = 4;

                        function buildGraph(name) {
                            nodes = []; edges = []; nodeColors = [];
                            if (name === 'K4') {
                                chromatic = 4;
                                var pos = [
                                    [cx, cy - 100], [cx - 100, cy + 60],
                                    [cx + 100, cy + 60], [cx, cy + 20]
                                ];
                                for (var i = 0; i < 4; i++) { nodes.push({ x: pos[i][0], y: pos[i][1] }); nodeColors.push(-1); }
                                for (var a = 0; a < 4; a++) for (var b = a + 1; b < 4; b++) edges.push([a, b]);
                            } else if (name === 'C5') {
                                chromatic = 3;
                                for (var i2 = 0; i2 < 5; i2++) {
                                    var ang = -Math.PI / 2 + 2 * Math.PI * i2 / 5;
                                    nodes.push({ x: cx + 110 * Math.cos(ang), y: cy + 110 * Math.sin(ang) });
                                    nodeColors.push(-1);
                                }
                                for (var j = 0; j < 5; j++) edges.push([j, (j + 1) % 5]);
                            } else if (name === 'Petersen') {
                                chromatic = 3;
                                for (var i3 = 0; i3 < 5; i3++) {
                                    var a3 = -Math.PI / 2 + 2 * Math.PI * i3 / 5;
                                    nodes.push({ x: cx + 120 * Math.cos(a3), y: cy + 120 * Math.sin(a3) });
                                    nodeColors.push(-1);
                                }
                                for (var i4 = 0; i4 < 5; i4++) {
                                    var a4 = -Math.PI / 2 + 2 * Math.PI * i4 / 5;
                                    nodes.push({ x: cx + 50 * Math.cos(a4), y: cy + 50 * Math.sin(a4) });
                                    nodeColors.push(-1);
                                }
                                for (var j2 = 0; j2 < 5; j2++) edges.push([j2, (j2 + 1) % 5]);
                                for (var j3 = 0; j3 < 5; j3++) edges.push([5 + j3, 5 + (j3 + 2) % 5]);
                                for (var j4 = 0; j4 < 5; j4++) edges.push([j4, j4 + 5]);
                            } else if (name === 'Bipartite') {
                                chromatic = 2;
                                var left = [[cx - 80, cy - 80], [cx - 80, cy], [cx - 80, cy + 80]];
                                var right = [[cx + 80, cy - 80], [cx + 80, cy], [cx + 80, cy + 80]];
                                for (var l = 0; l < 3; l++) { nodes.push({ x: left[l][0], y: left[l][1] }); nodeColors.push(-1); }
                                for (var r = 0; r < 3; r++) { nodes.push({ x: right[r][0], y: right[r][1] }); nodeColors.push(-1); }
                                edges = [[0,3],[0,4],[1,3],[1,5],[2,4],[2,5]];
                            }
                        }

                        function getConflicts() {
                            var c = [];
                            for (var i = 0; i < edges.length; i++) {
                                if (nodeColors[edges[i][0]] >= 0 && nodeColors[edges[i][0]] === nodeColors[edges[i][1]]) c.push(edges[i]);
                            }
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var conflicts = getConflicts();

                            // Edges
                            for (var e = 0; e < edges.length; e++) {
                                var na = nodes[edges[e][0]], nb = nodes[edges[e][1]];
                                var isConf = false;
                                for (var ci = 0; ci < conflicts.length; ci++) {
                                    if (conflicts[ci][0] === edges[e][0] && conflicts[ci][1] === edges[e][1]) isConf = true;
                                }
                                ctx.strokeStyle = isConf ? viz.colors.red : viz.colors.axis;
                                ctx.lineWidth = isConf ? 2.5 : 1.5;
                                ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
                            }

                            // Nodes
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                var col = nodeColors[i] >= 0 ? palette[nodeColors[i]] : '#555577';
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, 20, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), nd.x, nd.y);
                            }

                            // Status
                            var allColored = nodeColors.every(function(c) { return c >= 0; });
                            var nUsed = {};
                            nodeColors.forEach(function(c) { if (c >= 0) nUsed[c] = 1; });
                            var nc = Object.keys(nUsed).length;

                            var msg = graphName + ' (chromatic number = ' + chromatic + ')  |  ';
                            if (!allColored) msg += 'Click vertices to color. ' + nc + ' color(s) used.';
                            else if (conflicts.length > 0) msg += conflicts.length + ' conflict(s)!';
                            else if (nc === chromatic) msg += 'Optimal coloring with ' + nc + ' colors!';
                            else msg += 'Valid but uses ' + nc + ' (optimal is ' + chromatic + ')';

                            ctx.fillStyle = (allColored && conflicts.length === 0 && nc === chromatic) ? viz.colors.green : viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(msg, w / 2, 8);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < nodes.length; i++) {
                                var dx = mx - nodes[i].x, dy = my - nodes[i].y;
                                if (Math.sqrt(dx * dx + dy * dy) < 22) {
                                    nodeColors[i] = (nodeColors[i] + 2) % (palette.length + 1) - 1;
                                    draw();
                                    return;
                                }
                            }
                        });

                        var graphTypes = ['K4', 'C5', 'Petersen', 'Bipartite'];
                        for (var gi = 0; gi < graphTypes.length; gi++) {
                            (function(gn) {
                                VizEngine.createButton(controls, gn, function() {
                                    graphName = gn;
                                    buildGraph(gn);
                                    draw();
                                });
                            })(graphTypes[gi]);
                        }

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var i = 0; i < nodeColors.length; i++) nodeColors[i] = -1;
                            draw();
                        });

                        buildGraph(graphName);
                        draw();
                    }
                },
                {
                    id: 'viz-world-map',
                    title: 'Color the World Map',
                    description: 'A simplified world map with continents as regions. Color it with just 4 colors! Click a region to change its color.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var palette = ['#58a6ff', '#f0883e', '#3fb950', '#f85149'];
                        var pNames = ['Blue', 'Orange', 'Green', 'Red'];

                        // Simplified world map: 10 major regions as rough polygons
                        var regions = [
                            { label: 'N. America', pts: [[40,60],[200,50],[220,110],[180,180],[100,200],[40,140]], color: -1 },
                            { label: 'C. America', pts: [[100,200],[180,180],[170,230],[110,240]], color: -1 },
                            { label: 'S. America', pts: [[110,240],[170,230],[190,300],[170,370],[120,380],[100,320]], color: -1 },
                            { label: 'Europe', pts: [[270,50],[360,50],[370,100],[350,140],[280,130],[260,90]], color: -1 },
                            { label: 'Africa', pts: [[260,150],[350,140],[380,200],[370,310],[310,330],[260,280],[250,200]], color: -1 },
                            { label: 'Russia', pts: [[360,50],[520,40],[540,80],[520,120],[400,110],[370,100]], color: -1 },
                            { label: 'M. East', pts: [[350,140],[400,110],[430,130],[420,180],[380,200]], color: -1 },
                            { label: 'S. Asia', pts: [[420,180],[430,130],[490,130],[500,180],[480,220],[440,220]], color: -1 },
                            { label: 'E. Asia', pts: [[490,130],[520,120],[540,80],[w-40,80],[w-40,200],[520,210],[500,180]], color: -1 },
                            { label: 'Australia', pts: [[460,280],[540,270],[w-40,300],[w-40,360],[500,360],[460,330]], color: -1 }
                        ];

                        // Adjacency (shared borders / proximity)
                        var adj = [
                            [0,1],    // N.Am - C.Am
                            [1,2],    // C.Am - S.Am
                            [3,4],    // Europe - Africa
                            [3,5],    // Europe - Russia
                            [4,6],    // Africa - M.East
                            [5,6],    // Russia - M.East
                            [5,8],    // Russia - E.Asia
                            [6,7],    // M.East - S.Asia
                            [7,8],    // S.Asia - E.Asia
                            [3,6],    // Europe - M.East
                        ];

                        function centroid(pts) {
                            var sx = 0, sy = 0;
                            for (var i = 0; i < pts.length; i++) { sx += pts[i][0]; sy += pts[i][1]; }
                            return [sx / pts.length, sy / pts.length];
                        }

                        function pointInPoly(px, py, pts) {
                            var inside = false;
                            for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
                                var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
                                if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
                            }
                            return inside;
                        }

                        function getConflicts() {
                            var c = [];
                            for (var i = 0; i < adj.length; i++) {
                                var a = adj[i][0], b = adj[i][1];
                                if (regions[a].color >= 0 && regions[a].color === regions[b].color) c.push(adj[i]);
                            }
                            return c;
                        }

                        function draw() {
                            viz.clear();

                            // Ocean background
                            ctx.fillStyle = '#0a1530';
                            ctx.fillRect(0, 0, w, h);

                            var conflicts = getConflicts();

                            // Draw regions
                            for (var i = 0; i < regions.length; i++) {
                                var r = regions[i];
                                ctx.beginPath();
                                ctx.moveTo(r.pts[0][0], r.pts[0][1]);
                                for (var j = 1; j < r.pts.length; j++) ctx.lineTo(r.pts[j][0], r.pts[j][1]);
                                ctx.closePath();
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] + '55' : '#1a2a3a';
                                ctx.fill();
                                ctx.strokeStyle = r.color >= 0 ? palette[r.color] : '#3a4a5a';
                                ctx.lineWidth = 2;
                                ctx.stroke();

                                var ctr = centroid(r.pts);
                                ctx.fillStyle = r.color >= 0 ? palette[r.color] : '#8899aa';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(r.label, ctr[0], ctr[1]);
                            }

                            // Conflicts
                            for (var ci = 0; ci < conflicts.length; ci++) {
                                var ca = centroid(regions[conflicts[ci][0]].pts);
                                var cb = centroid(regions[conflicts[ci][1]].pts);
                                ctx.strokeStyle = '#ff000088'; ctx.lineWidth = 2;
                                ctx.setLineDash([5,3]);
                                ctx.beginPath(); ctx.moveTo(ca[0], ca[1]); ctx.lineTo(cb[0], cb[1]); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            var allColored = regions.every(function(r) { return r.color >= 0; });
                            var msg = '';
                            if (!allColored) msg = 'Click regions to color the world with 4 colors!';
                            else if (conflicts.length > 0) msg = conflicts.length + ' border conflict(s)!';
                            else msg = 'The world is properly colored!';

                            ctx.fillStyle = (allColored && conflicts.length === 0) ? viz.colors.green : viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(msg, w / 2, 8);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < regions.length; i++) {
                                if (pointInPoly(mx, my, regions[i].pts)) {
                                    regions[i].color = (regions[i].color + 2) % (palette.length + 1) - 1;
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            regions.forEach(function(r) { r.color = -1; });
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the chromatic polynomial of the triangle \\(K_3\\). How many proper \\(k\\)-colorings does it have?',
                    hint: 'Color vertex 1 in \\(k\\) ways. Vertex 2 must differ from vertex 1. Vertex 3 must differ from both.',
                    solution: 'Vertex 1: \\(k\\) choices. Vertex 2 (adjacent to 1): \\(k-1\\) choices. Vertex 3 (adjacent to both): \\(k-2\\) choices. So \\(P(K_3, k) = k(k-1)(k-2)\\). For \\(k=3\\): \\(3 \\cdot 2 \\cdot 1 = 6\\) proper colorings. For \\(k=4\\): \\(4 \\cdot 3 \\cdot 2 = 24\\).'
                },
                {
                    question: 'Why does the Four Color Theorem not apply to a map drawn on the surface of a donut (torus)?',
                    hint: 'The Four Color Theorem applies specifically to planar graphs. A torus is a different surface. What happens to Euler\'s formula on a torus?',
                    solution: 'The Four Color Theorem applies to graphs embeddable in the plane (or equivalently, the sphere). The torus is a surface of genus 1, and the Heawood formula gives \\(\\lfloor (7 + \\sqrt{49})/2 \\rfloor = 7\\) as the maximum chromatic number. Indeed, \\(K_7\\) can be embedded on the torus, requiring 7 colors. The key difference: on a torus, Euler\'s formula becomes \\(V - E + F = 0\\), weakening the density bound that limits the chromatic number on the sphere.'
                },
                {
                    question: 'Show that the chromatic polynomial of a tree on \\(n\\) vertices is \\(P(T, k) = k(k-1)^{n-1}\\).',
                    hint: 'Root the tree. The root has \\(k\\) color choices. Every other vertex must differ only from its parent.',
                    solution: 'Root the tree at any vertex. The root has \\(k\\) color choices. Each subsequent vertex (in BFS/DFS order) has exactly one already-colored neighbor (its parent), so it has \\(k-1\\) valid colors. There are \\(n-1\\) such vertices. By the multiplication rule: \\(P(T, k) = k \\cdot (k-1)^{n-1}\\).'
                }
            ]
        }
    ]
});
})();
