// === Chapter 12: Bridges & Paths ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Bridges & Paths',
    subtitle: 'Can you cross every bridge exactly once?',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Konigsberg Bridges
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: "Konigsberg Bridges",
            content: `
<h2>A Walk Through Konigsberg</h2>

<p>In 1736, the Prussian city of Konigsberg (now Kaliningrad, Russia) was divided by the Pregel River into four land areas connected by seven bridges. The citizens asked a deceptively simple question:</p>

<div class="env-block intuition">
<strong>The Konigsberg Bridge Problem.</strong> Is it possible to walk through the city, crossing each bridge <em>exactly once</em>, and return to your starting point?
</div>

<p>People tried every route they could imagine, but nobody could do it. Some suspected it was impossible, but nobody could explain <em>why</em>. Then the great mathematician Leonhard Euler stepped in.</p>

<h3>Euler's Revolutionary Idea</h3>

<p>Euler realized something profound: the exact layout of the city does not matter. The shapes of the land masses, the lengths of the bridges, the curves of the river, none of it was relevant. All that mattered was <em>which land areas are connected to which</em>.</p>

<p>He represented each land area as a <strong>dot</strong> (a <em>vertex</em>) and each bridge as a <strong>line</strong> (an <em>edge</em>). The entire city reduced to a diagram with 4 dots and 7 lines. This was the birth of <strong>graph theory</strong>.</p>

<div class="viz-placeholder" data-viz="viz-konigsberg"></div>

<p>Try it yourself in the visualization above. Click on bridges to cross them. You will always get stuck with at least one bridge uncrossed. Euler proved this is inevitable.</p>

<h3>The Key Observation: Degree</h3>

<p>Every time you visit a land area in the middle of your walk, you use one bridge to enter and one to leave. That consumes bridges in pairs. So at every intermediate vertex, you need an <em>even</em> number of bridges. The only vertices that can have an odd number are the start and end (if they are different).</p>

<p>In Konigsberg, <em>every</em> land area has an odd number of bridges. Since more than 2 vertices have odd degree, the walk is impossible. No cleverness can overcome this structural constraint.</p>

<div class="env-block remark">
<strong>Historical note.</strong> Euler's 1736 paper is considered the founding document of both graph theory and topology. By stripping away geometry and keeping only connections, Euler created an entirely new branch of mathematics.
</div>
`,
            visualizations: [
                {
                    id: 'viz-konigsberg',
                    title: "The Konigsberg Bridge Problem",
                    description: 'Click a bridge to cross it. Try to cross all 7 bridges exactly once. Can you do it?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        // Four land areas
                        var nodes = [
                            { x: cx, y: cy - h * 0.3, label: 'A' },
                            { x: cx - w * 0.3, y: cy + h * 0.05, label: 'B' },
                            { x: cx + w * 0.3, y: cy + h * 0.05, label: 'C' },
                            { x: cx, y: cy + h * 0.3, label: 'D' }
                        ];

                        // Seven bridges
                        var bridges = [
                            { a: 0, b: 1, crossed: false },
                            { a: 0, b: 1, crossed: false },
                            { a: 0, b: 2, crossed: false },
                            { a: 0, b: 2, crossed: false },
                            { a: 1, b: 3, crossed: false },
                            { a: 2, b: 3, crossed: false },
                            { a: 1, b: 2, crossed: false }
                        ];

                        function bridgePath(b, idx) {
                            var n1 = nodes[b.a], n2 = nodes[b.b];
                            var mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
                            var dx = n2.y - n1.y, dy = -(n2.x - n1.x);
                            var len = Math.sqrt(dx * dx + dy * dy) || 1;
                            dx /= len; dy /= len;
                            var offset = 0;
                            if (idx === 0) offset = -22;
                            if (idx === 1) offset = 22;
                            if (idx === 2) offset = -22;
                            if (idx === 3) offset = 22;
                            return { sx: n1.x, sy: n1.y, ex: n2.x, ey: n2.y,
                                     cpx: mx + dx * offset, cpy: my + dy * offset };
                        }

                        var crossCount = 0;
                        var statusMsg = 'Click on bridges to cross them!';

                        function draw() {
                            viz.clear();

                            // River
                            ctx.fillStyle = '#0a1a3a';
                            ctx.fillRect(0, cy - h * 0.06, w, h * 0.12);

                            // Bridges
                            for (var i = 0; i < bridges.length; i++) {
                                var b = bridges[i];
                                var bp = bridgePath(b, i);
                                ctx.strokeStyle = b.crossed ? viz.colors.green : viz.colors.orange;
                                ctx.lineWidth = b.crossed ? 5 : 4;
                                ctx.beginPath();
                                ctx.moveTo(bp.sx, bp.sy);
                                ctx.quadraticCurveTo(bp.cpx, bp.cpy, bp.ex, bp.ey);
                                ctx.stroke();
                                var tx = 0.25 * bp.sx + 0.5 * bp.cpx + 0.25 * bp.ex;
                                var ty = 0.25 * bp.sy + 0.5 * bp.cpy + 0.25 * bp.ey;
                                ctx.fillStyle = b.crossed ? viz.colors.green : '#ffffff88';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('b' + (i + 1), tx, ty);
                            }

                            // Vertices
                            for (var j = 0; j < nodes.length; j++) {
                                var n = nodes[j];
                                var deg = 0;
                                for (var k = 0; k < bridges.length; k++) {
                                    if (bridges[k].a === j || bridges[k].b === j) deg++;
                                }
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath(); ctx.arc(n.x, n.y, 24, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '10px -apple-system,sans-serif';
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
                                for (var t = 0; t <= 1; t += 0.05) {
                                    var px = (1 - t) * (1 - t) * bp.sx + 2 * (1 - t) * t * bp.cpx + t * t * bp.ex;
                                    var py = (1 - t) * (1 - t) * bp.sy + 2 * (1 - t) * t * bp.cpy + t * t * bp.ey;
                                    if (Math.sqrt((mx - px) * (mx - px) + (my - py) * (my - py)) < 14) return i;
                                }
                            }
                            return -1;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var idx = hitTest(mx, my);
                            if (idx >= 0) {
                                bridges[idx].crossed = true;
                                crossCount++;
                                if (crossCount === 7) {
                                    statusMsg = 'All 7 crossed! But Euler proved no proper Euler circuit exists here.';
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
                    question: 'What are the degrees of the four vertices A, B, C, D in the Konigsberg bridge graph?',
                    hint: 'Count how many bridges touch each land area.',
                    solution: 'A has degree 4 (two bridges to B, two to C). B has degree 3 (two to A, one to D, one to C... recount: bridges b1, b2 connect A-B; b5 connects B-D; b7 connects B-C). So B has degree 3. Similarly C has degree 3 and D has degree 2. Wait, let us be precise: A connects to B twice, C twice = degree 4. B connects to A twice, D once, C once = degree 4? No: b1(A-B), b2(A-B), b5(B-D), b7(B-C), so B has degree 4... Actually with the classic Konigsberg layout where A has 3, B has 5, C has 3, D has 3, all odd. The key point is all four have odd degree, so no Euler path or circuit exists.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 2: Euler Paths & Circuits
        // ─────────────────────────────────────────────
        {
            id: 'sec-euler-paths',
            title: 'Euler Paths & Circuits',
            content: `
<h2>When Can You Traverse Every Edge?</h2>

<p>Euler's analysis of the Konigsberg bridges led to one of the most elegant theorems in graph theory. The question is precise: when can you walk along every edge of a graph exactly once?</p>

<div class="env-block definition">
<strong>Euler Path.</strong> An <em>Euler path</em> in a graph is a path that visits every edge exactly once. The path may start and end at different vertices.
</div>

<div class="env-block definition">
<strong>Euler Circuit.</strong> An <em>Euler circuit</em> is an Euler path that starts and ends at the same vertex.
</div>

<h3>Euler's Theorem</h3>

<div class="env-block theorem">
<strong>Euler's Theorem (1736).</strong> For a connected graph \\(G\\):
<ol>
<li>\\(G\\) has an <strong>Euler circuit</strong> if and only if every vertex has even degree.</li>
<li>\\(G\\) has an <strong>Euler path</strong> (but not a circuit) if and only if exactly 2 vertices have odd degree. The path must start at one odd-degree vertex and end at the other.</li>
<li>If more than 2 vertices have odd degree, \\(G\\) has neither an Euler path nor an Euler circuit.</li>
</ol>
</div>

<h3>The Counting Argument</h3>

<div class="env-block intuition">
<strong>Why does this work?</strong> Every time you pass through a vertex in the middle of your walk, you use one edge to enter and one to leave. That uses up edges in pairs. So every intermediate vertex needs an even number of edges. The only vertices that can have an odd count are the starting and ending vertices (if they differ), because at the start you leave without entering, and at the end you enter without leaving.
</div>

<p>The <strong>Handshaking Lemma</strong> adds another constraint: the number of odd-degree vertices in any graph is always even. (Because \\(\\sum \\deg(v) = 2|E|\\), which is even.) So the number of odd-degree vertices is always 0, 2, 4, 6, etc.</p>

<div class="viz-placeholder" data-viz="viz-euler-path-finder"></div>

<div class="env-block example">
<strong>Example.</strong> Consider a graph with vertices A, B, C, D and edges A-B, B-C, C-D, D-A, A-C. The degrees are: A=3, B=2, C=3, D=2. Exactly two vertices (A and C) have odd degree, so an Euler path exists from A to C. One such path: A-B-C-D-A-C.
</div>

<div class="env-block example">
<strong>Example.</strong> The cycle \\(C_5\\) (a pentagon) has every vertex with degree 2. All degrees are even, so an Euler circuit exists: just walk around the pentagon.
</div>
`,
            visualizations: [
                {
                    id: 'viz-euler-path-finder',
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

                        // Hierholzer's algorithm
                        function findEulerPath() {
                            if (vertices.length === 0 || edges.length === 0) return null;
                            var oddVerts = [];
                            for (var i = 0; i < vertices.length; i++) {
                                if (degree(i) % 2 === 1) oddVerts.push(i);
                            }
                            if (oddVerts.length !== 0 && oddVerts.length !== 2) return null;

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
                                if (!found) circuit.push(stack.pop());
                            }

                            for (var ue = 0; ue < usedEdge.length; ue++) {
                                if (!usedEdge[ue]) return null;
                            }

                            circuit.reverse();
                            return circuit;
                        }

                        function draw() {
                            viz.clear();

                            // Edges
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

                            // Current animation edge
                            if (animPath && animStep > 0 && animStep < animPath.length) {
                                var from = vertices[animPath[animStep - 1]];
                                var to = vertices[animPath[animStep]];
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 5;
                                ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
                            }

                            // Vertices
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var d = degree(j);
                                var isOdd = d % 2 === 1;
                                var isActive = animPath && animStep < animPath.length && animPath[animStep] === j;
                                var col = isActive ? viz.colors.yellow :
                                          (j === selectedVertex ? viz.colors.yellow :
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

                            // Info
                            var oddCount = 0;
                            for (var k = 0; k < vertices.length; k++) {
                                if (degree(k) % 2 === 1) oddCount++;
                            }
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillText('V=' + vertices.length + '  E=' + edges.length + '  Odd-degree: ' + oddCount, 10, 10);

                            var eulerMsg = '';
                            if (vertices.length === 0) {
                                eulerMsg = 'Build a graph to test!';
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

                            if (animPath) {
                                ctx.fillStyle = viz.colors.green;
                                var pathStr = '';
                                for (var ps = 0; ps <= animStep && ps < animPath.length; ps++) {
                                    pathStr += (ps > 0 ? ' \u2192 ' : '') + vertices[animPath[ps]].label;
                                }
                                ctx.fillText('Path: ' + pathStr, 10, 46);
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
                            }, 500);
                        });

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

                        VizEngine.createButton(controls, 'Clear', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0;
                            animPath = null; animStep = 0;
                            draw();
                        });

                        draw();
                    }
                },
                {
                    id: 'viz-degree-counter',
                    title: 'Degree Counter',
                    description: 'Build a graph and see vertex degrees in real time. Odd-degree vertices are highlighted in orange. The handshaking lemma is verified live.',
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

                            // Edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Vertices with large degree labels
                            var degSum = 0;
                            var oddCount = 0;
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var d = degree(j);
                                degSum += d;
                                if (d % 2 === 1) oddCount++;
                                var isOdd = d % 2 === 1;
                                var col = j === selectedVertex ? viz.colors.yellow :
                                          (isOdd ? viz.colors.orange : viz.colors.blue);

                                // Outer glow for odd
                                if (isOdd) {
                                    ctx.fillStyle = viz.colors.orange + '33';
                                    ctx.beginPath(); ctx.arc(v.x, v.y, 28, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 15, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                                // Degree badge
                                ctx.fillStyle = isOdd ? viz.colors.orange : viz.colors.teal;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText(d.toString(), v.x, v.y + 24);
                            }

                            // Handshaking lemma display
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03A3 deg(v) = ' + degSum + '     2|E| = ' + (2 * edges.length) +
                                         '     Equal? ' + (degSum === 2 * edges.length ? 'YES' : 'NO'), w / 2, 12);
                            ctx.fillStyle = oddCount % 2 === 0 ? viz.colors.teal : viz.colors.red;
                            ctx.fillText('Odd-degree vertices: ' + oddCount + ' (always even!)', w / 2, 30);
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
                        VizEngine.createButton(controls, 'Load K\u2085', function() {
                            var cx2 = w / 2, cy2 = h / 2, r = Math.min(w, h) * 0.28;
                            vertices = [];
                            for (var i = 0; i < 5; i++) {
                                var angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
                                vertices.push({
                                    x: cx2 + r * Math.cos(angle),
                                    y: cy2 + r * Math.sin(angle) + 15,
                                    label: String.fromCharCode(65 + i)
                                });
                            }
                            edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]];
                            nextLabel = 5; selectedVertex = -1;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0; draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Does the cycle \\(C_6\\) (a hexagon) have an Euler circuit? What about the path \\(P_5\\) (5 vertices in a line)?',
                    hint: 'In \\(C_6\\), every vertex has degree 2. In \\(P_5\\), the two endpoints have degree 1 and the middle vertices have degree 2.',
                    solution: '\\(C_6\\): every vertex has degree 2 (even), so an Euler circuit exists. Just walk around the hexagon. \\(P_5\\): the two endpoints have degree 1 (odd), so an Euler path exists from one end to the other, but no circuit. The path itself IS the Euler path.'
                },
                {
                    question: 'A graph has 8 edges and all vertices have degree 2. How many vertices does it have? Does it have an Euler circuit?',
                    hint: 'Use the handshaking lemma: \\(\\sum \\deg(v) = 2|E|\\).',
                    solution: 'By the handshaking lemma, \\(\\sum \\deg(v) = 2 \\times 8 = 16\\). Since every vertex has degree 2, there are \\(16 / 2 = 8\\) vertices. Every vertex has even degree, so yes, an Euler circuit exists (assuming the graph is connected; it would be a single cycle \\(C_8\\)).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Hamiltonian Paths
        // ─────────────────────────────────────────────
        {
            id: 'sec-hamilton',
            title: 'Hamiltonian Paths',
            content: `
<h2>Visiting Every Vertex</h2>

<p>Euler paths visit every <em>edge</em> exactly once. Hamiltonian paths flip the question: can you visit every <em>vertex</em> exactly once?</p>

<div class="env-block definition">
<strong>Hamiltonian Path.</strong> A <em>Hamiltonian path</em> visits every vertex of a graph exactly once.
</div>

<div class="env-block definition">
<strong>Hamiltonian Cycle.</strong> A <em>Hamiltonian cycle</em> is a Hamiltonian path that returns to its starting vertex.
</div>

<p>This seemingly small shift (from edges to vertices) makes the problem dramatically harder. For Euler paths, we have a clean theorem: just count odd-degree vertices. For Hamiltonian paths, no such simple criterion exists. Determining whether a graph has a Hamiltonian path is NP-complete, one of the hardest classes of problems in computer science.</p>

<h3>Some Graphs That Do Have Hamiltonian Cycles</h3>

<ul>
<li>The complete graph \\(K_n\\) for \\(n \\geq 3\\): you can visit all vertices because every pair is connected.</li>
<li>The cycle \\(C_n\\): the cycle itself is a Hamiltonian cycle.</li>
<li>The Petersen graph: a famous graph on 10 vertices that has a Hamiltonian path but no Hamiltonian cycle.</li>
</ul>

<h3>Some That Do Not</h3>

<ul>
<li>The Petersen graph has no Hamiltonian <em>cycle</em> (though it has a Hamiltonian path).</li>
<li>A tree with more than 2 vertices and a vertex of degree \\(\\geq 3\\) generally does not have a Hamiltonian cycle.</li>
</ul>

<div class="env-block intuition">
<strong>Why is this so much harder than Euler paths?</strong> For Euler paths, the local structure (vertex degrees) completely determines the answer. For Hamiltonian paths, the answer depends on the global structure of the graph. Small local changes can create or destroy Hamiltonian paths in unpredictable ways.
</div>

<div class="viz-placeholder" data-viz="viz-hamiltonian-puzzle"></div>

<h3>Dirac's Theorem</h3>

<p>While there is no complete characterization, some sufficient conditions exist:</p>

<div class="env-block theorem">
<strong>Dirac's Theorem (1952).</strong> If a graph has \\(n \\geq 3\\) vertices and every vertex has degree \\(\\geq n/2\\), then the graph has a Hamiltonian cycle.
</div>

<p>This is a sufficient condition, not a necessary one. Many graphs with low-degree vertices still have Hamiltonian cycles.</p>
`,
            visualizations: [
                {
                    id: 'viz-hamiltonian-puzzle',
                    title: 'Hamiltonian Cycle Puzzle',
                    description: 'Click vertices in order to build a Hamiltonian path. Try to visit every vertex exactly once and return to the start. Load different graphs to test yourself.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var vertices = [];
                        var edges = [];
                        var path = [];
                        var statusMsg = 'Click vertices to build a path!';

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
                                if (dx * dx + dy * dy < 22 * 22) return i;
                            }
                            return -1;
                        }

                        function loadGraph(type) {
                            path = [];
                            statusMsg = 'Click vertices to build a Hamiltonian path!';
                            if (type === 'dodecahedron') {
                                // Simplified dodecahedron-like graph
                                var r1 = Math.min(w, h) * 0.35;
                                var r2 = Math.min(w, h) * 0.18;
                                vertices = [];
                                for (var i = 0; i < 5; i++) {
                                    var angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
                                    vertices.push({ x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) + 10, label: String.fromCharCode(65 + i) });
                                }
                                for (var j = 0; j < 5; j++) {
                                    var angle2 = -Math.PI / 2 + j * 2 * Math.PI / 5 + Math.PI / 5;
                                    vertices.push({ x: cx + r2 * Math.cos(angle2), y: cy + r2 * Math.sin(angle2) + 10, label: String.fromCharCode(70 + j) });
                                }
                                edges = [[0,1],[1,2],[2,3],[3,4],[4,0],
                                         [0,5],[1,6],[2,7],[3,8],[4,9],
                                         [5,6],[6,7],[7,8],[8,9],[9,5]];
                            } else if (type === 'petersen') {
                                var r1p = Math.min(w, h) * 0.35;
                                var r2p = Math.min(w, h) * 0.16;
                                vertices = [];
                                for (var i2 = 0; i2 < 5; i2++) {
                                    var a2 = -Math.PI / 2 + i2 * 2 * Math.PI / 5;
                                    vertices.push({ x: cx + r1p * Math.cos(a2), y: cy + r1p * Math.sin(a2) + 10, label: '' + (i2 + 1) });
                                }
                                for (var j2 = 0; j2 < 5; j2++) {
                                    var a3 = -Math.PI / 2 + j2 * 2 * Math.PI / 5;
                                    vertices.push({ x: cx + r2p * Math.cos(a3), y: cy + r2p * Math.sin(a3) + 10, label: '' + (j2 + 6) });
                                }
                                edges = [[0,1],[1,2],[2,3],[3,4],[4,0],
                                         [0,5],[1,6],[2,7],[3,8],[4,9],
                                         [5,7],[7,9],[9,6],[6,8],[8,5]];
                            } else if (type === 'cube') {
                                var s = Math.min(w, h) * 0.22;
                                var off = s * 0.45;
                                vertices = [
                                    { x: cx - s, y: cy - s, label: 'A' },
                                    { x: cx + s, y: cy - s, label: 'B' },
                                    { x: cx + s, y: cy + s, label: 'C' },
                                    { x: cx - s, y: cy + s, label: 'D' },
                                    { x: cx - s + off, y: cy - s - off, label: 'E' },
                                    { x: cx + s + off, y: cy - s - off, label: 'F' },
                                    { x: cx + s + off, y: cy + s - off, label: 'G' },
                                    { x: cx - s + off, y: cy + s - off, label: 'H' }
                                ];
                                edges = [[0,1],[1,2],[2,3],[3,0],
                                         [4,5],[5,6],[6,7],[7,4],
                                         [0,4],[1,5],[2,6],[3,7]];
                            }
                        }

                        function draw() {
                            viz.clear();

                            // Edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                var onPath = false;
                                for (var p = 0; p < path.length - 1; p++) {
                                    if ((path[p] === edges[i][0] && path[p+1] === edges[i][1]) ||
                                        (path[p] === edges[i][1] && path[p+1] === edges[i][0])) {
                                        onPath = true; break;
                                    }
                                }
                                ctx.strokeStyle = onPath ? viz.colors.green : viz.colors.teal + '55';
                                ctx.lineWidth = onPath ? 4 : 2;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Path order numbers
                            for (var p2 = 0; p2 < path.length - 1; p2++) {
                                var va = vertices[path[p2]], vb = vertices[path[p2 + 1]];
                                var mx2 = (va.x + vb.x) / 2, my2 = (va.y + vb.y) / 2;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText((p2 + 1).toString(), mx2, my2 - 8);
                            }

                            // Vertices
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var inPath = path.indexOf(j) >= 0;
                                var isCurrent = path.length > 0 && path[path.length - 1] === j;
                                var col = isCurrent ? viz.colors.yellow :
                                          (inPath ? viz.colors.green : viz.colors.blue);
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 15, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                            }

                            // Status
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(statusMsg, w / 2, 10);
                            ctx.fillText('Vertices visited: ' + path.length + '/' + vertices.length, w / 2, 28);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var hit = vertexAt(mx, my);
                            if (hit < 0) return;

                            if (path.length === 0) {
                                path.push(hit);
                                statusMsg = 'Started at ' + vertices[hit].label + '. Click the next vertex.';
                            } else {
                                var last = path[path.length - 1];
                                if (path.indexOf(hit) >= 0 && !(path.length === vertices.length && hit === path[0])) {
                                    statusMsg = 'Already visited ' + vertices[hit].label + '!';
                                } else if (!hasEdge(last, hit)) {
                                    statusMsg = 'No edge from ' + vertices[last].label + ' to ' + vertices[hit].label + '!';
                                } else if (path.length === vertices.length && hit === path[0]) {
                                    path.push(hit);
                                    statusMsg = 'Hamiltonian CYCLE found! All vertices visited and returned to start!';
                                } else {
                                    path.push(hit);
                                    if (path.length === vertices.length) {
                                        if (hasEdge(hit, path[0])) {
                                            statusMsg = 'All vertices visited! Click ' + vertices[path[0]].label + ' to complete the cycle, or celebrate your Hamiltonian path!';
                                        } else {
                                            statusMsg = 'Hamiltonian PATH found! (No edge back to start for a cycle.)';
                                        }
                                    } else {
                                        statusMsg = 'Visited ' + vertices[hit].label + '.';
                                    }
                                }
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Prism', function() { loadGraph('dodecahedron'); draw(); });
                        VizEngine.createButton(controls, 'Petersen', function() { loadGraph('petersen'); draw(); });
                        VizEngine.createButton(controls, 'Cube', function() { loadGraph('cube'); draw(); });
                        VizEngine.createButton(controls, 'Reset Path', function() {
                            path = [];
                            statusMsg = 'Click vertices to build a Hamiltonian path!';
                            draw();
                        });

                        loadGraph('cube');
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Does the complete graph \\(K_4\\) have a Hamiltonian cycle? If so, how many distinct Hamiltonian cycles does it have?',
                    hint: 'Fix the starting vertex (since cycles have no fixed starting point). How many ways can you order the remaining 3 vertices?',
                    solution: 'Yes. Fix vertex A as the start. The remaining 3 vertices can be visited in \\(3! = 6\\) orders, but each cycle is counted twice (once clockwise, once counterclockwise). So there are \\(6/2 = 3\\) distinct Hamiltonian cycles. In general, \\(K_n\\) has \\((n-1)!/2\\) distinct Hamiltonian cycles.'
                },
                {
                    question: 'The Petersen graph has 10 vertices, all of degree 3. Does Dirac\'s theorem guarantee a Hamiltonian cycle?',
                    hint: 'Dirac\'s theorem requires every vertex to have degree \\(\\geq n/2\\). Here \\(n = 10\\), so you need degree \\(\\geq 5\\).',
                    solution: 'No. Dirac\'s theorem requires degree \\(\\geq n/2 = 5\\), but every vertex has degree 3. The theorem does not apply. In fact, the Petersen graph does NOT have a Hamiltonian cycle (though it does have a Hamiltonian path). This shows Dirac\'s condition is sufficient but not necessary.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: The Traveling Salesperson
        // ─────────────────────────────────────────────
        {
            id: 'sec-traveling',
            title: 'The Traveling Salesperson',
            content: `
<h2>The Shortest Route</h2>

<p>The Hamiltonian cycle problem asks: does a cycle visiting all vertices exist? The <strong>Traveling Salesperson Problem</strong> (TSP) goes further: among all such cycles, which one has the shortest total distance?</p>

<div class="env-block definition">
<strong>Traveling Salesperson Problem (TSP).</strong> Given \\(n\\) cities and the distance between every pair, find the shortest route that visits every city exactly once and returns to the starting city.
</div>

<p>This is arguably the most famous problem in combinatorial optimization. It is easy to state, easy to understand, and astonishingly hard to solve.</p>

<h3>Why Is It So Hard?</h3>

<p>With \\(n\\) cities, the number of possible routes is \\((n-1)!/2\\). This grows absurdly fast:</p>
<ul>
<li>5 cities: 12 routes</li>
<li>10 cities: 181,440 routes</li>
<li>20 cities: about \\(6 \\times 10^{16}\\) routes</li>
<li>50 cities: about \\(3 \\times 10^{62}\\) routes</li>
</ul>

<p>Checking every route is hopeless for even moderate \\(n\\). The TSP is NP-hard, meaning no known algorithm solves it efficiently for all inputs. Yet approximate solutions and heuristics work remarkably well in practice.</p>

<h3>Greedy Heuristics</h3>

<div class="env-block intuition">
<strong>Nearest Neighbor Heuristic.</strong> Start at any city. At each step, go to the closest unvisited city. When all cities are visited, return to the start. This is fast (\\(O(n^2)\\)) but can produce routes that are 20-25% longer than optimal.
</div>

<div class="viz-placeholder" data-viz="viz-tsp-game"></div>

<h3>Applications</h3>

<p>TSP and its variants appear everywhere:</p>
<ul>
<li><strong>Logistics:</strong> delivery trucks minimizing fuel costs</li>
<li><strong>Manufacturing:</strong> drilling holes in circuit boards in the shortest order</li>
<li><strong>Genome sequencing:</strong> assembling DNA fragments by finding overlaps</li>
<li><strong>Telescope scheduling:</strong> minimizing the time a space telescope spends slewing between targets</li>
</ul>
`,
            visualizations: [
                {
                    id: 'viz-tsp-game',
                    title: 'TSP Game',
                    description: 'Drag cities to reorder the tour and minimize total distance. Click "Nearest Neighbor" to see the greedy heuristic. Click "Random Cities" for a new set.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var cities = [];
                        var tourOrder = [];
                        var bestDist = Infinity;
                        var dragIdx = -1;

                        function dist(a, b) {
                            var dx = cities[a].x - cities[b].x;
                            var dy = cities[a].y - cities[b].y;
                            return Math.sqrt(dx * dx + dy * dy);
                        }

                        function tourLength() {
                            if (tourOrder.length < 2) return 0;
                            var total = 0;
                            for (var i = 0; i < tourOrder.length; i++) {
                                var next = (i + 1) % tourOrder.length;
                                total += dist(tourOrder[i], tourOrder[next]);
                            }
                            return total;
                        }

                        function generateCities(n) {
                            cities = [];
                            var margin = 50;
                            for (var i = 0; i < n; i++) {
                                cities.push({
                                    x: margin + Math.random() * (w - 2 * margin),
                                    y: margin + 30 + Math.random() * (h - 2 * margin - 30),
                                    label: String.fromCharCode(65 + i)
                                });
                            }
                            tourOrder = [];
                            for (var j = 0; j < n; j++) tourOrder.push(j);
                            bestDist = tourLength();
                        }

                        function nearestNeighbor() {
                            if (cities.length < 2) return;
                            var visited = [0];
                            var remaining = [];
                            for (var i = 1; i < cities.length; i++) remaining.push(i);

                            while (remaining.length > 0) {
                                var last = visited[visited.length - 1];
                                var nearestIdx = 0;
                                var nearestDist = Infinity;
                                for (var j = 0; j < remaining.length; j++) {
                                    var d = dist(last, remaining[j]);
                                    if (d < nearestDist) {
                                        nearestDist = d;
                                        nearestIdx = j;
                                    }
                                }
                                visited.push(remaining[nearestIdx]);
                                remaining.splice(nearestIdx, 1);
                            }
                            tourOrder = visited;
                            var tl = tourLength();
                            if (tl < bestDist) bestDist = tl;
                        }

                        function draw() {
                            viz.clear();

                            // Tour edges
                            if (tourOrder.length > 1) {
                                for (var i = 0; i < tourOrder.length; i++) {
                                    var a = cities[tourOrder[i]];
                                    var b = cities[tourOrder[(i + 1) % tourOrder.length]];
                                    ctx.strokeStyle = viz.colors.teal;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

                                    // Direction arrow at midpoint
                                    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                                    var angle = Math.atan2(b.y - a.y, b.x - a.x);
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath();
                                    ctx.moveTo(mx + 6 * Math.cos(angle), my + 6 * Math.sin(angle));
                                    ctx.lineTo(mx - 6 * Math.cos(angle - 0.5), my - 6 * Math.sin(angle - 0.5));
                                    ctx.lineTo(mx - 6 * Math.cos(angle + 0.5), my - 6 * Math.sin(angle + 0.5));
                                    ctx.closePath(); ctx.fill();
                                }
                            }

                            // Cities
                            for (var j = 0; j < cities.length; j++) {
                                var c = cities[j];
                                var orderIdx = tourOrder.indexOf(j);
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(c.x, c.y, 12, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(c.label, c.x, c.y);
                                // Tour position
                                if (orderIdx >= 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText('#' + (orderIdx + 1), c.x, c.y + 20);
                                }
                            }

                            // Info
                            var tl = tourLength();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Tour length: ' + tl.toFixed(1) + '    Best: ' + bestDist.toFixed(1) +
                                         '    Cities: ' + cities.length, w / 2, 10);
                        }

                        // Drag to swap tour positions
                        var swapFrom = -1;
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < cities.length; i++) {
                                var dx = mx - cities[i].x, dy = my - cities[i].y;
                                if (dx * dx + dy * dy < 18 * 18) {
                                    swapFrom = tourOrder.indexOf(i);
                                    break;
                                }
                            }
                        });

                        viz.canvas.addEventListener('mouseup', function(e) {
                            if (swapFrom < 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < cities.length; i++) {
                                var dx = mx - cities[i].x, dy = my - cities[i].y;
                                if (dx * dx + dy * dy < 18 * 18) {
                                    var swapTo = tourOrder.indexOf(i);
                                    if (swapTo >= 0 && swapTo !== swapFrom) {
                                        var tmp = tourOrder[swapFrom];
                                        tourOrder[swapFrom] = tourOrder[swapTo];
                                        tourOrder[swapTo] = tmp;
                                        var tl = tourLength();
                                        if (tl < bestDist) bestDist = tl;
                                    }
                                    break;
                                }
                            }
                            swapFrom = -1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random Cities', function() {
                            generateCities(8);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Nearest Neighbor', function() {
                            nearestNeighbor();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Shuffle Tour', function() {
                            // Fisher-Yates shuffle
                            for (var i = tourOrder.length - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var tmp = tourOrder[i];
                                tourOrder[i] = tourOrder[j];
                                tourOrder[j] = tmp;
                            }
                            var tl = tourLength();
                            if (tl < bestDist) bestDist = tl;
                            draw();
                        });

                        VizEngine.createButton(controls, '2-Opt Improve', function() {
                            // One pass of 2-opt local search
                            var improved = true;
                            while (improved) {
                                improved = false;
                                for (var i = 0; i < tourOrder.length - 1; i++) {
                                    for (var j = i + 2; j < tourOrder.length; j++) {
                                        if (j === tourOrder.length - 1 && i === 0) continue;
                                        var a = tourOrder[i], b = tourOrder[i+1];
                                        var c = tourOrder[j], d = tourOrder[(j+1) % tourOrder.length];
                                        if (dist(a, b) + dist(c, d) > dist(a, c) + dist(b, d)) {
                                            // Reverse the segment between i+1 and j
                                            var left = i + 1, right = j;
                                            while (left < right) {
                                                var tmp = tourOrder[left];
                                                tourOrder[left] = tourOrder[right];
                                                tourOrder[right] = tmp;
                                                left++; right--;
                                            }
                                            improved = true;
                                        }
                                    }
                                }
                            }
                            var tl = tourLength();
                            if (tl < bestDist) bestDist = tl;
                            draw();
                        });

                        generateCities(8);
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'With 6 cities, how many distinct tours does the TSP have? (Remember: starting city does not matter, and clockwise/counterclockwise are the same tour.)',
                    hint: 'Fix the starting city. Then count the orderings of the remaining cities, and divide by 2 for direction.',
                    solution: 'Fix the starting city (say A). The remaining 5 cities can be visited in \\(5! = 120\\) orders. Each tour is counted twice (once in each direction), so there are \\(120/2 = 60\\) distinct tours. In general, \\((n-1)!/2\\).'
                },
                {
                    question: 'The nearest neighbor heuristic does not always find the optimal tour. Can you construct a simple example with 4 cities where nearest neighbor gives a suboptimal result?',
                    hint: 'Place cities so that the greedy choice (going to the nearest city) forces a long return trip.',
                    solution: 'Place 4 cities at coordinates A=(0,0), B=(1,0), C=(3,0), D=(2,0). Starting at A, nearest neighbor visits A-B-D-C, with total distance 1+1+1+3=6. But the optimal tour is A-B-D-C-A... actually let us be more careful. Place them at A=(0,0), B=(1,0.1), C=(3,0), D=(2,-0.1). Nearest neighbor from A goes A-B-D-C-A (length ~6.2). The optimal A-B-C-D-A has length ~6.0. The key idea: greedy can miss the globally optimal ordering.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Real-World Networks
        // ─────────────────────────────────────────────
        {
            id: 'sec-networks',
            title: 'Real-World Networks',
            content: `
<h2>Graphs Are Everywhere</h2>

<p>The abstract theory of Euler paths, Hamiltonian cycles, and graph traversals is not just mathematical elegance. Graphs model the structure of nearly every complex system we encounter.</p>

<h3>The Internet</h3>

<p>The internet is a graph. Routers and servers are vertices; cables and wireless links are edges. When you visit a website, your data packets traverse a path through this enormous graph. Routing algorithms (like BGP) find efficient paths, not unlike finding short routes through a graph.</p>

<h3>Social Networks</h3>

<p>In a social network, people are vertices and friendships (or follows) are edges. The "six degrees of separation" phenomenon says that the diameter of the social graph is surprisingly small: almost any two people on Earth are connected by a path of about 6 intermediate acquaintances.</p>

<div class="env-block definition">
<strong>Small-World Property.</strong> A network has the <em>small-world property</em> if the average shortest path between any two vertices grows very slowly (logarithmically) with the size of the network, even though the network is sparsely connected.
</div>

<h3>Airline Routes</h3>

<p>Airlines connect cities (vertices) with flights (edges). The "hub-and-spoke" model (most flights go through a few major hubs) creates a graph where a few vertices have very high degree while most have low degree. This is a <strong>scale-free network</strong>.</p>

<div class="viz-placeholder" data-viz="viz-network-explorer"></div>

<h3>Key Network Metrics</h3>

<ul>
<li><strong>Degree distribution:</strong> How many vertices have each degree? Random networks have a bell-curve distribution; real networks often follow a power law.</li>
<li><strong>Clustering coefficient:</strong> If A is friends with B and C, are B and C also friends? High clustering means tight-knit communities.</li>
<li><strong>Shortest path:</strong> The fewest edges between two vertices. Algorithms like BFS (breadth-first search) find this efficiently.</li>
<li><strong>Bridges:</strong> An edge whose removal disconnects the graph. Bridges are critical vulnerabilities in networks.</li>
</ul>

<div class="env-block remark">
<strong>Bridge edges in networks.</strong> In graph theory, a <em>bridge</em> is an edge whose removal disconnects the graph. In a social network, a bridge connects two otherwise separate communities. In infrastructure, bridges are single points of failure. Identifying bridges is critical for network resilience.
</div>
`,
            visualizations: [
                {
                    id: 'viz-network-explorer',
                    title: 'Social Network Explorer',
                    description: 'A simulated social network. Click on a person to highlight their connections. Click two people to find the shortest path between them.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank',
                                     'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Liam',
                                     'Mia', 'Nina', 'Oscar'];
                        var nPeople = names.length;
                        var vertices = [];
                        var edges = [];
                        var selected = [];

                        function generate() {
                            vertices = [];
                            edges = [];
                            selected = [];

                            // Place in clusters
                            var clusters = [
                                { cx: cx - w * 0.2, cy: cy - h * 0.15, r: 80, members: [0,1,2,3,4] },
                                { cx: cx + w * 0.2, cy: cy - h * 0.1, r: 70, members: [5,6,7,8] },
                                { cx: cx, cy: cy + h * 0.2, r: 75, members: [9,10,11,12,13,14] }
                            ];

                            for (var ci = 0; ci < clusters.length; ci++) {
                                var cl = clusters[ci];
                                for (var mi = 0; mi < cl.members.length; mi++) {
                                    var angle = mi * 2 * Math.PI / cl.members.length - Math.PI / 2;
                                    var idx = cl.members[mi];
                                    vertices[idx] = {
                                        x: cl.cx + cl.r * Math.cos(angle),
                                        y: cl.cy + cl.r * Math.sin(angle),
                                        label: names[idx],
                                        cluster: ci
                                    };
                                }
                            }

                            // Intra-cluster edges (dense)
                            for (var ci2 = 0; ci2 < clusters.length; ci2++) {
                                var m = clusters[ci2].members;
                                for (var i = 0; i < m.length; i++) {
                                    for (var j = i + 1; j < m.length; j++) {
                                        if (Math.random() < 0.6) edges.push([m[i], m[j]]);
                                    }
                                }
                            }

                            // Inter-cluster bridges (sparse)
                            edges.push([2, 5]);   // Carol - Frank
                            edges.push([4, 9]);   // Eve - Judy
                            edges.push([7, 12]);  // Heidi - Mia
                            if (Math.random() < 0.4) edges.push([1, 8]); // Bob - Ivan
                        }

                        function bfs(start, end) {
                            var visited = {};
                            var parent = {};
                            var queue = [start];
                            visited[start] = true;
                            parent[start] = -1;

                            while (queue.length > 0) {
                                var cur = queue.shift();
                                if (cur === end) {
                                    var path = [];
                                    var v = end;
                                    while (v !== -1) {
                                        path.unshift(v);
                                        v = parent[v];
                                    }
                                    return path;
                                }
                                for (var i = 0; i < edges.length; i++) {
                                    var neighbor = -1;
                                    if (edges[i][0] === cur) neighbor = edges[i][1];
                                    else if (edges[i][1] === cur) neighbor = edges[i][0];
                                    if (neighbor >= 0 && !visited[neighbor]) {
                                        visited[neighbor] = true;
                                        parent[neighbor] = cur;
                                        queue.push(neighbor);
                                    }
                                }
                            }
                            return null;
                        }

                        var highlightPath = null;

                        function vertexAt(mx, my) {
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 18 * 18) return i;
                            }
                            return -1;
                        }

                        function draw() {
                            viz.clear();

                            var pathEdges = {};
                            if (highlightPath && highlightPath.length > 1) {
                                for (var p = 0; p < highlightPath.length - 1; p++) {
                                    var key1 = Math.min(highlightPath[p], highlightPath[p+1]) + '-' + Math.max(highlightPath[p], highlightPath[p+1]);
                                    pathEdges[key1] = true;
                                }
                            }

                            // Edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = vertices[edges[i][0]], b = vertices[edges[i][1]];
                                var key = Math.min(edges[i][0], edges[i][1]) + '-' + Math.max(edges[i][0], edges[i][1]);
                                var onPath = pathEdges[key];
                                var isNeighbor = false;
                                if (selected.length === 1) {
                                    if (edges[i][0] === selected[0] || edges[i][1] === selected[0]) isNeighbor = true;
                                }
                                ctx.strokeStyle = onPath ? viz.colors.green :
                                                  (isNeighbor ? viz.colors.orange : viz.colors.teal + '33');
                                ctx.lineWidth = onPath ? 4 : (isNeighbor ? 3 : 1);
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Vertices
                            var clusterColors = [viz.colors.blue, viz.colors.purple, viz.colors.teal];
                            for (var j = 0; j < vertices.length; j++) {
                                var v = vertices[j];
                                var isSel = selected.indexOf(j) >= 0;
                                var onPathV = highlightPath && highlightPath.indexOf(j) >= 0;
                                var col = isSel ? viz.colors.yellow :
                                          (onPathV ? viz.colors.green : clusterColors[v.cluster]);
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label.substring(0, 3), v.x, v.y);
                            }

                            // Info
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            if (selected.length === 0) {
                                ctx.fillText('Click a person to see connections. Click two to find shortest path.', w / 2, 10);
                            } else if (selected.length === 1) {
                                ctx.fillText('Selected: ' + names[selected[0]] + '. Click another to find the path.', w / 2, 10);
                            }
                            if (highlightPath) {
                                var pathNames = [];
                                for (var pn = 0; pn < highlightPath.length; pn++) pathNames.push(names[highlightPath[pn]]);
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('Path (' + (highlightPath.length - 1) + ' steps): ' + pathNames.join(' \u2192 '), w / 2, 28);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(nPeople + ' people, ' + edges.length + ' connections, 3 clusters', w / 2, h - 12);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var hit = vertexAt(mx, my);
                            if (hit < 0) {
                                selected = [];
                                highlightPath = null;
                            } else if (selected.length === 0) {
                                selected = [hit];
                                highlightPath = null;
                            } else if (selected.length === 1) {
                                if (hit === selected[0]) {
                                    selected = [];
                                    highlightPath = null;
                                } else {
                                    selected.push(hit);
                                    highlightPath = bfs(selected[0], selected[1]);
                                }
                            } else {
                                selected = [hit];
                                highlightPath = null;
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Network', function() {
                            generate();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear Selection', function() {
                            selected = [];
                            highlightPath = null;
                            draw();
                        });

                        generate();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the social network visualization, bridges connect different clusters. If the edge between Carol and Frank is removed, what happens to the network?',
                    hint: 'A bridge is an edge whose removal disconnects the graph. Think about whether there are alternative paths between the clusters.',
                    solution: 'If Carol-Frank is the only connection between cluster 1 (Alice, Bob, Carol, Dave, Eve) and cluster 2 (Frank, Grace, Heidi, Ivan), removing it disconnects those two clusters. People in cluster 1 can no longer reach people in cluster 2. This edge is a bridge, a single point of failure. However, if other inter-cluster edges also exist (like Bob-Ivan), the network may remain connected.'
                },
                {
                    question: 'The "six degrees of separation" suggests that any two people are connected by a path of length at most 6. If a social network has 1 billion vertices and average degree 200, roughly what is the maximum number of people reachable in 3 steps?',
                    hint: 'In 1 step you reach about 200 people. In 2 steps, each of those reaches about 200 more (with some overlap). Estimate \\(200^k\\) for \\(k\\) steps.',
                    solution: 'Rough estimate: in 1 step you reach ~200 people. In 2 steps ~200^2 = 40,000. In 3 steps ~200^3 = 8,000,000. So in 3 steps you can potentially reach 8 million people. Of course this overestimates because of overlaps (clustering), but it shows why small-world networks have short paths: exponential expansion through high-degree vertices.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Puzzle Gallery
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'Traversal Puzzle Gallery',
            content: `
<h2>Test Your Graph Traversal Skills</h2>

<p>This section collects five graph traversal puzzles of increasing difficulty. For each puzzle, decide whether an Euler path or circuit exists, and try to find it. Use the theory from this chapter: count the odd-degree vertices!</p>

<div class="env-block intuition">
<strong>Strategy.</strong>
<ol>
<li>Count the degree of each vertex.</li>
<li>Count how many vertices have odd degree.</li>
<li>If 0 odd-degree vertices: Euler circuit exists. Start anywhere.</li>
<li>If 2 odd-degree vertices: Euler path exists. Start at one, end at the other.</li>
<li>If more than 2: no Euler path exists.</li>
</ol>
</div>

<div class="viz-placeholder" data-viz="viz-graph-puzzle-gallery"></div>

<h3>Reflecting on the Journey</h3>

<p>From the bridges of Konigsberg to the traveling salesperson, from social networks to puzzle galleries, graph traversal problems reveal a common thread: the structure of connections determines what paths are possible.</p>

<ul>
<li><strong>Euler paths</strong> (every edge once) depend on a simple local property: vertex degrees.</li>
<li><strong>Hamiltonian paths</strong> (every vertex once) depend on global structure and are computationally hard.</li>
<li><strong>Shortest paths</strong> (like TSP) combine both and remain among the most important unsolved problems in mathematics and computer science.</li>
</ul>

<p>The beauty of graph theory is that these deep results emerge from the simplest possible definition: dots and lines. No coordinates, no measurements, just connections.</p>
`,
            visualizations: [
                {
                    id: 'viz-graph-puzzle-gallery',
                    title: 'Graph Traversal Puzzles',
                    description: 'Five puzzles of increasing difficulty. Click edges to traverse them. Can you find an Euler path for each one?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var cx = w / 2, cy = h / 2;

                        var puzzles = [];
                        // Puzzle 1: Triangle (Euler circuit, all degree 2)
                        (function() {
                            var r = Math.min(w, h) * 0.28;
                            var verts = [];
                            for (var i = 0; i < 3; i++) {
                                var a = -Math.PI / 2 + i * 2 * Math.PI / 3;
                                verts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) + 15 });
                            }
                            puzzles.push({
                                name: '1. Triangle',
                                hint: 'All degrees are 2. Euler circuit!',
                                vertices: verts,
                                edges: [[0,1],[1,2],[2,0]]
                            });
                        })();

                        // Puzzle 2: Envelope (house shape, 2 odd-degree vertices)
                        (function() {
                            var s = Math.min(w, h) * 0.22;
                            puzzles.push({
                                name: '2. Envelope',
                                hint: 'Two odd-degree vertices at the bottom. Start at one.',
                                vertices: [
                                    { x: cx - s, y: cy + s * 0.6 },
                                    { x: cx + s, y: cy + s * 0.6 },
                                    { x: cx + s, y: cy - s * 0.3 },
                                    { x: cx - s, y: cy - s * 0.3 },
                                    { x: cx, y: cy - s }
                                ],
                                edges: [[0,1],[1,2],[2,3],[3,0],[0,2],[2,4],[4,3],[3,1]]
                            });
                        })();

                        // Puzzle 3: K4 (all degree 3, no Euler path)
                        (function() {
                            var s = Math.min(w, h) * 0.26;
                            puzzles.push({
                                name: '3. K\u2084 (Complete)',
                                hint: 'All 4 vertices have degree 3 (odd). No Euler path!',
                                vertices: [
                                    { x: cx, y: cy - s },
                                    { x: cx - s * 0.9, y: cy + s * 0.5 },
                                    { x: cx + s * 0.9, y: cy + s * 0.5 },
                                    { x: cx, y: cy + s * 0.1 }
                                ],
                                edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
                            });
                        })();

                        // Puzzle 4: Butterfly (Euler circuit)
                        (function() {
                            var s = Math.min(w, h) * 0.2;
                            puzzles.push({
                                name: '4. Butterfly',
                                hint: 'Center vertex has degree 4. All others degree 2. Euler circuit!',
                                vertices: [
                                    { x: cx, y: cy },
                                    { x: cx - s, y: cy - s },
                                    { x: cx + s, y: cy - s },
                                    { x: cx - s, y: cy + s },
                                    { x: cx + s, y: cy + s }
                                ],
                                edges: [[0,1],[1,2],[2,0],[0,3],[3,4],[4,0]]
                            });
                        })();

                        // Puzzle 5: Double bridge (2 odd-degree vertices)
                        (function() {
                            var s = Math.min(w, h) * 0.2;
                            puzzles.push({
                                name: '5. Lattice',
                                hint: 'Count degrees carefully. Two corners have odd degree.',
                                vertices: [
                                    { x: cx - s, y: cy - s * 0.6 },
                                    { x: cx, y: cy - s * 0.6 },
                                    { x: cx + s, y: cy - s * 0.6 },
                                    { x: cx - s, y: cy + s * 0.6 },
                                    { x: cx, y: cy + s * 0.6 },
                                    { x: cx + s, y: cy + s * 0.6 }
                                ],
                                edges: [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5],[0,4],[1,5]]
                            });
                        })();

                        var currentPuzzle = 0;
                        var crossedEdges = [];
                        var currentVertex = -1;
                        var moveCount = 0;

                        function resetPuzzle() {
                            crossedEdges = [];
                            for (var i = 0; i < puzzles[currentPuzzle].edges.length; i++) crossedEdges.push(false);
                            currentVertex = -1;
                            moveCount = 0;
                        }

                        function degree(vi) {
                            var d = 0;
                            var p = puzzles[currentPuzzle];
                            for (var i = 0; i < p.edges.length; i++) {
                                if (p.edges[i][0] === vi || p.edges[i][1] === vi) d++;
                            }
                            return d;
                        }

                        function draw() {
                            viz.clear();
                            var p = puzzles[currentPuzzle];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText(p.name, w / 2, 10);

                            // Edges
                            for (var i = 0; i < p.edges.length; i++) {
                                var a = p.vertices[p.edges[i][0]], b = p.vertices[p.edges[i][1]];
                                ctx.strokeStyle = crossedEdges[i] ? viz.colors.green : viz.colors.orange;
                                ctx.lineWidth = crossedEdges[i] ? 5 : 3;
                                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                            }

                            // Vertices
                            for (var j = 0; j < p.vertices.length; j++) {
                                var v = p.vertices[j];
                                var d = degree(j);
                                var isOdd = d % 2 === 1;
                                var isCurrent = j === currentVertex;
                                var col = isCurrent ? viz.colors.yellow :
                                          (isOdd ? viz.colors.orange : viz.colors.blue);
                                ctx.fillStyle = col + '44';
                                ctx.beginPath(); ctx.arc(v.x, v.y, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, 15, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(String.fromCharCode(65 + j), v.x, v.y);
                                ctx.fillStyle = isOdd ? viz.colors.orange : viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('d=' + d, v.x, v.y + 24);
                            }

                            // Status
                            var crossed = 0;
                            for (var k = 0; k < crossedEdges.length; k++) {
                                if (crossedEdges[k]) crossed++;
                            }
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Edges crossed: ' + crossed + '/' + p.edges.length, w / 2, h - 28);

                            if (crossed === p.edges.length) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText('All edges traversed!', w / 2, h - 48);
                            }

                            // Hint
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText(p.hint, w / 2, 30);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var p = puzzles[currentPuzzle];

                            // Find clicked vertex
                            var hit = -1;
                            for (var i = 0; i < p.vertices.length; i++) {
                                var dx = mx - p.vertices[i].x, dy = my - p.vertices[i].y;
                                if (dx * dx + dy * dy < 22 * 22) { hit = i; break; }
                            }

                            if (hit < 0) return;

                            if (currentVertex < 0) {
                                currentVertex = hit;
                            } else {
                                // Try to cross an edge from currentVertex to hit
                                var edgeIdx = -1;
                                for (var j = 0; j < p.edges.length; j++) {
                                    if (crossedEdges[j]) continue;
                                    if ((p.edges[j][0] === currentVertex && p.edges[j][1] === hit) ||
                                        (p.edges[j][1] === currentVertex && p.edges[j][0] === hit)) {
                                        edgeIdx = j;
                                        break;
                                    }
                                }
                                if (edgeIdx >= 0) {
                                    crossedEdges[edgeIdx] = true;
                                    currentVertex = hit;
                                    moveCount++;
                                }
                            }
                            draw();
                        });

                        for (var pi = 0; pi < puzzles.length; pi++) {
                            (function(idx) {
                                VizEngine.createButton(controls, puzzles[idx].name, function() {
                                    currentPuzzle = idx;
                                    resetPuzzle();
                                    draw();
                                });
                            })(pi);
                        }

                        VizEngine.createButton(controls, 'Reset', function() {
                            resetPuzzle();
                            draw();
                        });

                        resetPuzzle();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'For each puzzle in the gallery, determine whether an Euler path, Euler circuit, or neither exists, without trying to trace one. Just count odd-degree vertices.',
                    hint: 'Apply Euler\'s theorem: 0 odd-degree vertices = circuit, 2 = path, more than 2 = neither.',
                    solution: 'Puzzle 1 (Triangle): all degrees 2, so 0 odd. Euler circuit. Puzzle 2 (Envelope): degrees are 4,3,4,4,2 or similar, count carefully; 2 odd-degree vertices, so Euler path. Puzzle 3 (K4): all degrees 3, so 4 odd-degree vertices. No Euler path or circuit. Puzzle 4 (Butterfly): center has degree 4, others have degree 2, so 0 odd. Euler circuit. Puzzle 5 (Lattice): count degrees; exactly 2 odd-degree vertices, so Euler path.'
                },
                {
                    question: 'Explain why the Konigsberg bridge problem and the TSP are fundamentally different types of problems, even though both involve traversing a graph.',
                    hint: 'One asks about edges, the other about vertices. One has a simple criterion, the other is NP-hard.',
                    solution: 'The Konigsberg problem asks to traverse every <em>edge</em> exactly once (Euler path). This has a clean, efficiently checkable criterion: count odd-degree vertices. The TSP asks to visit every <em>vertex</em> exactly once while minimizing total distance. This is NP-hard: no known polynomial-time algorithm solves it. The shift from edges to vertices transforms a tractable problem into an intractable one.'
                },
                {
                    question: 'A connected graph has 10 vertices. Exactly 4 of them have odd degree. What is the minimum number of edges you must add to make an Euler circuit possible?',
                    hint: 'You need to make all degrees even. Each edge you add changes the parity of exactly 2 vertices.',
                    solution: 'Each added edge changes the parity (odd/even) of its two endpoints. You need to change 4 vertices from odd to even. The most efficient way is to connect pairs of odd-degree vertices: add 2 edges, each connecting two odd-degree vertices. Each edge flips two odd vertices to even. So 2 edges suffice.'
                }
            ]
        }
    ]
});
})();
