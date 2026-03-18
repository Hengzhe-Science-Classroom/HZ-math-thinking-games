window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: 'River Crossing & State Search',
    subtitle: 'Turn puzzles into graphs, then solve them systematically',
    sections: [
        // ============================================================
        // SECTION 1: The farmer's dilemma
        // ============================================================
        {
            id: 'ch17-sec01',
            title: "The farmer's dilemma",
            content: `
                <h2>The Farmer's Dilemma</h2>

                <div class="env-block intuition">
                    <div class="env-title">A Puzzle from the Middle Ages</div>
                    <div class="env-body">
                        <p>This puzzle dates back at least to the 8th century, appearing in a manuscript attributed to Alcuin of York. It has delighted puzzle lovers for over 1200 years, and it hides deep ideas about <strong>state spaces</strong> and <strong>graph search</strong>.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">The Puzzle</div>
                    <div class="env-body">
                        <p>A farmer must cross a river with a <strong>wolf</strong>, a <strong>goat</strong>, and a <strong>cabbage</strong>. The boat can carry the farmer and at most one item. The constraints:</p>
                        <ul>
                            <li>The <strong>wolf</strong> will eat the <strong>goat</strong> if left alone together (without the farmer).</li>
                            <li>The <strong>goat</strong> will eat the <strong>cabbage</strong> if left alone together (without the farmer).</li>
                        </ul>
                        <p>How can the farmer get everything across safely?</p>
                    </div>
                </div>

                <p>Try solving it yourself in the interactive game below before reading the solution!</p>

                <div class="viz-placeholder" data-viz="farmer-game"></div>

                <div class="env-block remark">
                    <div class="env-title">The Solution</div>
                    <div class="env-body">
                        <p>There are two solutions, both requiring <strong>7 crossings</strong>:</p>
                        <p><strong>Solution 1:</strong></p>
                        <ol>
                            <li>Farmer takes goat across.</li>
                            <li>Farmer returns alone.</li>
                            <li>Farmer takes wolf across.</li>
                            <li>Farmer brings goat back.</li>
                            <li>Farmer takes cabbage across.</li>
                            <li>Farmer returns alone.</li>
                            <li>Farmer takes goat across.</li>
                        </ol>
                        <p><strong>Solution 2:</strong> Same, but swap wolf and cabbage in steps 3 and 5.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">The Key Trick</div>
                    <div class="env-body">
                        <p>The crucial step is step 4: <strong>bringing the goat back</strong>. Most people do not think of moving something <em>backwards</em>. The goat is the "dangerous" item (it conflicts with both the wolf and the cabbage), so it needs special handling.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'farmer-game',
                    title: 'Farmer, Wolf, Goat & Cabbage',
                    description: 'Click items to load/unload them on the boat. Click "Cross River" to move the boat. The farmer is always in the boat. Can you get everything across safely?',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 400, scale: 30, originX: 50, originY: 350 });

                        // State: positions of each entity. false = left bank, true = right bank
                        var state = { farmer: false, wolf: false, goat: false, cabbage: false };
                        var boat = []; // items in boat (not including farmer)
                        var moves = 0;
                        var gameOver = false;
                        var won = false;
                        var message = 'Click an item near the farmer to load it, then Cross River!';

                        VizEngine.createButton(controls, 'Cross River', function() {
                            if (gameOver) return;
                            // Move farmer and boat contents to other side
                            var newSide = !state.farmer;
                            state.farmer = newSide;
                            for (var i = 0; i < boat.length; i++) {
                                state[boat[i]] = newSide;
                            }
                            boat = [];
                            moves++;

                            // Check for violations
                            if (checkViolation()) {
                                gameOver = true;
                                won = false;
                            } else if (state.farmer && state.wolf && state.goat && state.cabbage) {
                                gameOver = true;
                                won = true;
                                message = 'You won in ' + moves + ' moves! (Optimal is 7)';
                            } else {
                                message = 'Move ' + moves + ' complete. Click items to load, then Cross.';
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            state = { farmer: false, wolf: false, goat: false, cabbage: false };
                            boat = [];
                            moves = 0;
                            gameOver = false;
                            won = false;
                            message = 'Click an item near the farmer to load it, then Cross River!';
                            draw();
                        });

                        function checkViolation() {
                            // Check left bank
                            if (!state.farmer) return false; // farmer is here, no violation on this side... check other side
                            // Farmer is on right bank. Check left bank:
                            var leftWolf = !state.wolf;
                            var leftGoat = !state.goat;
                            var leftCabbage = !state.cabbage;
                            if (leftWolf && leftGoat) { message = 'The wolf ate the goat on the left bank!'; return true; }
                            if (leftGoat && leftCabbage) { message = 'The goat ate the cabbage on the left bank!'; return true; }
                            // Also check right bank when farmer is on left
                            return false;
                        }

                        function checkViolationFull() {
                            // Check both banks for violations (farmer absent)
                            var farmerSide = state.farmer;
                            // Check the bank WITHOUT the farmer
                            var items = ['wolf', 'goat', 'cabbage'];
                            var otherSide = [];
                            for (var i = 0; i < items.length; i++) {
                                if (state[items[i]] !== farmerSide) otherSide.push(items[i]);
                            }
                            if (otherSide.indexOf('wolf') >= 0 && otherSide.indexOf('goat') >= 0) {
                                message = 'The wolf ate the goat!';
                                return true;
                            }
                            if (otherSide.indexOf('goat') >= 0 && otherSide.indexOf('cabbage') >= 0) {
                                message = 'The goat ate the cabbage!';
                                return true;
                            }
                            return false;
                        }

                        // Override the simple check with the full check
                        checkViolation = checkViolationFull;

                        var itemLabels = { wolf: '\ud83d\udc3a Wolf', goat: '\ud83d\udc10 Goat', cabbage: '\ud83e\udd66 Cabbage' };
                        var itemColors = { wolf: viz.colors.red, goat: viz.colors.green, cabbage: viz.colors.teal };
                        var itemSymbols = { wolf: 'W', goat: 'G', cabbage: 'C' };

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // River
                            ctx.fillStyle = '#0a2a5a';
                            ctx.fillRect(280, 0, 140, viz.height);

                            // Banks
                            ctx.fillStyle = '#1a3a20';
                            ctx.fillRect(0, 0, 280, viz.height);
                            ctx.fillStyle = '#1a3a20';
                            ctx.fillRect(420, 0, 280, viz.height);

                            // Labels
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('LEFT BANK', 140, 25);
                            ctx.fillText('RIGHT BANK', 560, 25);

                            // Boat
                            var boatX = state.farmer ? 420 - 50 : 280 + 10;
                            var boatY = 200;
                            ctx.fillStyle = '#5a3a1a';
                            ctx.beginPath();
                            ctx.moveTo(boatX, boatY);
                            ctx.lineTo(boatX + 80, boatY);
                            ctx.lineTo(boatX + 70, boatY + 30);
                            ctx.lineTo(boatX + 10, boatY + 30);
                            ctx.closePath();
                            ctx.fill();
                            ctx.strokeStyle = '#8a6a3a';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Farmer in boat
                            ctx.fillStyle = viz.colors.gold;
                            ctx.font = '18px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('F', boatX + 20, boatY - 5);

                            // Items in boat
                            for (var b = 0; b < boat.length; b++) {
                                ctx.fillStyle = itemColors[boat[b]];
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillText(itemSymbols[boat[b]], boatX + 50, boatY - 5);
                            }

                            // Items on banks
                            var items = ['wolf', 'goat', 'cabbage'];
                            var leftY = 80;
                            var rightY = 80;

                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                if (boat.indexOf(item) >= 0) continue; // in boat
                                var onRight = state[item];
                                var ix, iy;
                                if (onRight) {
                                    ix = 560;
                                    iy = rightY;
                                    rightY += 60;
                                } else {
                                    ix = 140;
                                    iy = leftY;
                                    leftY += 60;
                                }

                                // Clickable area
                                ctx.fillStyle = itemColors[item] + '33';
                                ctx.fillRect(ix - 55, iy - 20, 110, 45);
                                ctx.strokeStyle = itemColors[item];
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(ix - 55, iy - 20, 110, 45);

                                ctx.fillStyle = itemColors[item];
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(itemLabels[item], ix, iy);
                            }

                            // Message
                            ctx.fillStyle = gameOver ? (won ? viz.colors.green : viz.colors.red) : viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(message, viz.width / 2, 310);

                            // Move counter
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Moves: ' + moves + '  |  Boat: farmer' + (boat.length > 0 ? ' + ' + boat.join(', ') : ' (empty)'), viz.width / 2, 340);

                            // Constraints reminder
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Wolf eats goat.  Goat eats cabbage.  Farmer must be present to prevent eating.', viz.width / 2, 370);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            var items = ['wolf', 'goat', 'cabbage'];
                            var leftY = 80;
                            var rightY = 80;

                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                if (boat.indexOf(item) >= 0) continue;
                                var onRight = state[item];
                                var ix, iy;
                                if (onRight) {
                                    ix = 560;
                                    iy = rightY;
                                    rightY += 60;
                                } else {
                                    ix = 140;
                                    iy = leftY;
                                    leftY += 60;
                                }

                                if (mx >= ix - 55 && mx <= ix + 55 && my >= iy - 20 && my <= iy + 25) {
                                    // Check if item is on same side as farmer
                                    if (state[item] === state.farmer) {
                                        if (boat.indexOf(item) >= 0) {
                                            // Unload
                                            boat.splice(boat.indexOf(item), 1);
                                        } else if (boat.length < 1) {
                                            // Load (max 1 item)
                                            boat.push(item);
                                        } else {
                                            message = 'Boat can carry only 1 item! Unload first.';
                                        }
                                    } else {
                                        message = 'That item is on the other bank!';
                                    }
                                    draw();
                                    return;
                                }
                            }

                            // Check if clicking boat area to unload
                            var boatX = state.farmer ? 420 - 50 : 280 + 10;
                            var boatY = 200;
                            if (mx >= boatX && mx <= boatX + 80 && my >= boatY - 20 && my <= boatY + 30 && boat.length > 0) {
                                boat.pop();
                                draw();
                            }
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Can the farmer-wolf-goat-cabbage puzzle be solved in fewer than 7 crossings? Why or why not?',
                    hint: 'Count the minimum number of trips needed. Each round trip (there and back) is 2 crossings. There are 3 items to move.',
                    solution: 'No, 7 is optimal. The farmer needs at least 3 forward trips (one per item) plus at least 2 return trips (the farmer must come back at least twice to ferry remaining items), plus the key "bring goat back" step. Any valid sequence requires at least 7 moves. This can be verified by exhaustive search of the state graph (see next section).'
                }
            ]
        },

        // ============================================================
        // SECTION 2: State diagrams
        // ============================================================
        {
            id: 'ch17-sec02',
            title: 'State diagrams',
            content: `
                <h2>State Diagrams</h2>

                <p>The farmer puzzle feels tricky when you try to solve it by trial and error. But there is a systematic way to see <em>all</em> possibilities at once: draw the <strong>state diagram</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (State)</div>
                    <div class="env-body">
                        <p>A <strong>state</strong> is a complete description of the current situation in a puzzle. For the farmer puzzle, a state records the position (left bank or right bank) of each entity: farmer (F), wolf (W), goat (G), and cabbage (C).</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Encoding States</div>
                    <div class="env-body">
                        <p>We can encode each state as a 4-bit string FWGC, where 0 = left bank, 1 = right bank.</p>
                        <p>Start state: <strong>0000</strong> (everything on the left).</p>
                        <p>Goal state: <strong>1111</strong> (everything on the right).</p>
                        <p>There are \\(2^4 = 16\\) possible states, but not all are valid.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Invalid States</div>
                    <div class="env-body">
                        <p>A state is <strong>invalid</strong> if the farmer is absent from a bank where a predator-prey pair exists:</p>
                        <ul>
                            <li>Wolf and goat on the same bank without the farmer.</li>
                            <li>Goat and cabbage on the same bank without the farmer.</li>
                        </ul>
                        <p>This eliminates 6 states, leaving <strong>10 valid states</strong>.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition (State Diagram)</div>
                    <div class="env-body">
                        <p>The <strong>state diagram</strong> (or <strong>state graph</strong>) has:</p>
                        <ul>
                            <li><strong>Nodes:</strong> all valid states.</li>
                            <li><strong>Edges:</strong> connect two states if you can get from one to the other in a single boat crossing.</li>
                        </ul>
                        <p>Solving the puzzle means finding a <strong>path</strong> from the start node (0000) to the goal node (1111).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="state-graph"></div>

                <div class="env-block intuition">
                    <div class="env-title">Why This Helps</div>
                    <div class="env-body">
                        <p>Once you draw the state graph, the puzzle becomes a simple graph traversal problem. You can literally <em>see</em> all possible paths from start to goal. The puzzle's difficulty, which came from the branching choices and the need to backtrack (bringing the goat back), becomes transparent.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'state-graph',
                    title: 'State Graph: Farmer-Wolf-Goat-Cabbage',
                    description: 'All valid states and transitions for the river crossing puzzle. Green = start, Gold = goal. The two shortest paths (7 moves each) are highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 420, scale: 30, originX: 50, originY: 380 });
                        var showPath = 1;

                        VizEngine.createButton(controls, 'Path 1', function() { showPath = 1; draw(); });
                        VizEngine.createButton(controls, 'Path 2', function() { showPath = 2; draw(); });
                        VizEngine.createButton(controls, 'No highlight', function() { showPath = 0; draw(); });

                        // States: FWGC encoded as 4-bit
                        function isValid(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            // Wolf and goat same side, farmer not there
                            if (w === g && f !== w) return false;
                            // Goat and cabbage same side, farmer not there
                            if (g === c && f !== g) return false;
                            return true;
                        }

                        function stateLabel(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            var left = '', right = '';
                            if (!f) left += 'F'; else right += 'F';
                            if (!w) left += 'W'; else right += 'W';
                            if (!g) left += 'G'; else right += 'G';
                            if (!c) left += 'C'; else right += 'C';
                            return left + '|' + right;
                        }

                        function getNeighbors(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            var nbrs = [];
                            var nf = 1 - f;
                            // Farmer crosses alone
                            var s2 = (nf << 3) | (w << 2) | (g << 1) | c;
                            if (isValid(s2)) nbrs.push(s2);
                            // Farmer takes wolf
                            if (w === f) {
                                var nw = 1 - w;
                                s2 = (nf << 3) | (nw << 2) | (g << 1) | c;
                                if (isValid(s2)) nbrs.push(s2);
                            }
                            // Farmer takes goat
                            if (g === f) {
                                var ng = 1 - g;
                                s2 = (nf << 3) | (w << 2) | (ng << 1) | c;
                                if (isValid(s2)) nbrs.push(s2);
                            }
                            // Farmer takes cabbage
                            if (c === f) {
                                var nc = 1 - c;
                                s2 = (nf << 3) | (w << 2) | (g << 1) | nc;
                                if (isValid(s2)) nbrs.push(s2);
                            }
                            return nbrs;
                        }

                        // Build valid states and edges
                        var validStates = [];
                        for (var s = 0; s < 16; s++) {
                            if (isValid(s)) validStates.push(s);
                        }

                        var edges = [];
                        var edgeSet = {};
                        for (var i = 0; i < validStates.length; i++) {
                            var nbrs = getNeighbors(validStates[i]);
                            for (var j = 0; j < nbrs.length; j++) {
                                var a = Math.min(validStates[i], nbrs[j]);
                                var b = Math.max(validStates[i], nbrs[j]);
                                var key = a + '-' + b;
                                if (!edgeSet[key]) {
                                    edgeSet[key] = true;
                                    edges.push([a, b]);
                                }
                            }
                        }

                        // Two shortest paths
                        var path1 = [0, 2, 3, 11, 9, 13, 12, 14, 15]; // encoded
                        // Actual paths: 0000 -> 0010 (take goat)... let me compute properly
                        // FWGC bits: F=8, W=4, G=2, C=1
                        // Start: 0000 = 0
                        // Take goat: F and G to right: 1010 = 10
                        // Return alone: F back: 0010 = 2
                        // Take wolf: F and W to right: 1110 = 14... check: left has C only, valid? G=right, C=left, farmer=right. G and C different sides, ok. W=right, farmer=right. Valid.
                        // Wait, let me recompute carefully.
                        // 0000: all left
                        // Take goat -> 1010: F,G right; W,C left. W and C left without farmer: ok (wolf doesn't eat cabbage)
                        // F returns -> 0010: F left; G right; W,C left. W,C with farmer: ok
                        // Take wolf -> 1110: F,W,G right; C left. G and W same side but farmer there: ok
                        // Return with goat -> 0100: wait...
                        // F returns with goat from right to left: F,G go left. So W stays right.
                        // 0100: F=0,W=1,G=0,C=0 = 0*8+1*4+0*2+0*1 = 4. Left: F,G,C. Right: W. Valid.
                        // Take cabbage -> 1001: F,C right. Left: W... wait
                        // From 0100 (F=left,W=right,G=left,C=left), take cabbage: F and C go right.
                        // New: F=1,W=1,G=0,C=1 = 8+4+0+1=13. Left: G alone. Right: F,W,C. Valid (G alone is fine).
                        // F returns alone: F=0,W=1,G=0,C=1 = 0+4+0+1=5. Left: F,G. Right: W,C. Valid.
                        // Take goat: F,G go right: 1111=15. Done!

                        path1 = [0, 10, 2, 14, 4, 13, 5, 15];

                        // Path 2: swap wolf and cabbage
                        // 0000 -> take goat -> 1010=10 -> F returns -> 0010=2
                        // Take cabbage: F,C right. 1011=11. Left: W alone. Right: F,G,C. G,C with farmer: ok.
                        // F returns with goat: 0001=1. Left: F,W,G. Right: C.
                        // Take wolf: F,W right. 1101=13. Wait: 1101 = F=1,W=1,G=0,C=1. Left: G. Right: F,W,C. Valid.
                        // Hmm, that gives same state 13. Let me redo.
                        // From 0010 (F=left,W=left,G=right,C=left), take cabbage: F,C go right.
                        // New: F=1,W=0,G=1,C=1 = 8+0+2+1=11. Left: W alone. Right: F,G,C. G,C same side with farmer: ok.
                        // F returns with goat: F,G go left. F=0,W=0,G=0,C=1 = 1. Left: F,W,G. Right: C.
                        // W and G same side with farmer: ok.
                        // Take wolf: F,W go right. F=1,W=1,G=0,C=1 = 13. Left: G. Right: F,W,C. Valid.
                        // F returns alone: F=0,W=1,G=0,C=1 = 5. Left: F,G. Right: W,C. Valid.
                        // Take goat: F,G go right. 1111=15.
                        path2 = [0, 10, 2, 11, 1, 13, 5, 15];

                        // Layout positions for nodes
                        var nodePositions = {};
                        // Manual layout for clarity
                        var layout = {};
                        layout[0] = { x: 80, y: 200 };   // 0000 start
                        layout[10] = { x: 200, y: 120 };  // 1010
                        layout[2] = { x: 200, y: 280 };   // 0010
                        layout[14] = { x: 340, y: 60 };   // 1110
                        layout[11] = { x: 340, y: 340 };  // 1011
                        layout[4] = { x: 340, y: 160 };   // 0100
                        layout[1] = { x: 340, y: 240 };   // 0001
                        layout[13] = { x: 480, y: 120 };  // 1101
                        layout[5] = { x: 480, y: 280 };   // 0101
                        layout[15] = { x: 620, y: 200 };  // 1111 goal

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('State Graph (FWGC: 0=left, 1=right)', viz.width / 2, 20);

                            // Determine path edges for highlighting
                            var pathEdges = {};
                            var activePath = showPath === 1 ? path1 : (showPath === 2 ? path2 : []);
                            for (var pi = 0; pi < activePath.length - 1; pi++) {
                                var a = Math.min(activePath[pi], activePath[pi + 1]);
                                var b = Math.max(activePath[pi], activePath[pi + 1]);
                                pathEdges[a + '-' + b] = true;
                            }
                            var pathNodes = {};
                            for (var pj = 0; pj < activePath.length; pj++) {
                                pathNodes[activePath[pj]] = pj;
                            }

                            // Draw edges
                            for (var ei = 0; ei < edges.length; ei++) {
                                var ea = edges[ei][0], eb = edges[ei][1];
                                if (!layout[ea] || !layout[eb]) continue;
                                var eKey = Math.min(ea, eb) + '-' + Math.max(ea, eb);
                                var isPath = pathEdges[eKey];

                                ctx.strokeStyle = isPath ? viz.colors.orange : viz.colors.axis + '55';
                                ctx.lineWidth = isPath ? 3 : 1;
                                ctx.beginPath();
                                ctx.moveTo(layout[ea].x, layout[ea].y);
                                ctx.lineTo(layout[eb].x, layout[eb].y);
                                ctx.stroke();
                            }

                            // Draw nodes
                            var nodeR = 28;
                            for (var ni = 0; ni < validStates.length; ni++) {
                                var ns = validStates[ni];
                                if (!layout[ns]) continue;
                                var nx = layout[ns].x;
                                var ny = layout[ns].y;
                                var isStart = ns === 0;
                                var isGoal = ns === 15;
                                var onPath = pathNodes[ns] !== undefined;

                                var nodeColor = isStart ? viz.colors.green : (isGoal ? viz.colors.gold : (onPath ? viz.colors.orange : viz.colors.blue));

                                ctx.fillStyle = nodeColor + '33';
                                ctx.beginPath();
                                ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.strokeStyle = nodeColor;
                                ctx.lineWidth = onPath || isStart || isGoal ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
                                ctx.stroke();

                                // Label
                                var label = stateLabel(ns);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, nx, ny - 5);

                                // Binary
                                var bin = ((ns >> 3) & 1) + '' + ((ns >> 2) & 1) + '' + ((ns >> 1) & 1) + '' + (ns & 1);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,monospace';
                                ctx.fillText(bin, nx, ny + 10);

                                // Step number on path
                                if (onPath && showPath > 0) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.fillText('step ' + pathNodes[ns], nx, ny + nodeR + 10);
                                }
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('10 valid states, ' + edges.length + ' edges.  Both shortest paths have length 7.', viz.width / 2, viz.height - 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many of the 16 possible FWGC states are invalid? List them.',
                    hint: 'A state is invalid if wolf=goat on a side without the farmer, or goat=cabbage on a side without the farmer.',
                    solution: 'Invalid states (where farmer is absent from a conflict): 0110 (F=left, WG=right without F), 0011 (F=left, GC=right without F), 0111 (F=left, WGC=right), 1001 (F=right, WG=left), 1100 (F=right, GC=left), 1000 (F=right, WGC=left). That is <strong>6 invalid states</strong>, leaving 10 valid ones.'
                }
            ]
        },

        // ============================================================
        // SECTION 3: Solving with BFS
        // ============================================================
        {
            id: 'ch17-sec03',
            title: 'Solving with BFS',
            content: `
                <h2>Solving with BFS</h2>

                <p>Now that we have turned the puzzle into a graph, we can use a standard algorithm to find the shortest solution: <strong>Breadth-First Search (BFS)</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (BFS)</div>
                    <div class="env-body">
                        <p><strong>Breadth-First Search</strong> explores a graph layer by layer:</p>
                        <ol>
                            <li>Start at the source node. Mark it as visited.</li>
                            <li>Visit all neighbors of the source (distance 1).</li>
                            <li>Then visit all unvisited neighbors of those nodes (distance 2).</li>
                            <li>Continue until you reach the target or exhaust all nodes.</li>
                        </ol>
                        <p>BFS always finds the <strong>shortest path</strong> (fewest edges) in an unweighted graph.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Analogy</div>
                    <div class="env-body">
                        <p>Think of BFS as dropping a pebble into a pond: the ripples spread outward in concentric circles. BFS explores all nodes at distance 1, then all at distance 2, and so on. The first time you reach the target, you have found the shortest path.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">BFS on the Farmer Puzzle</div>
                    <div class="env-body">
                        <p><strong>Layer 0:</strong> {0000} (start)</p>
                        <p><strong>Layer 1:</strong> {1010} (only valid move: take goat)</p>
                        <p><strong>Layer 2:</strong> {0010} (return alone)</p>
                        <p><strong>Layer 3:</strong> {1110, 1011} (take wolf or cabbage)</p>
                        <p><strong>Layer 4:</strong> {0100, 0001} (return with goat)</p>
                        <p><strong>Layer 5:</strong> {1101, 0101} (take cabbage or wolf)</p>
                        <p><strong>Layer 6:</strong> {0101, 0101} ... converges</p>
                        <p><strong>Layer 7:</strong> {1111} (take goat, done!)</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="bfs-demo"></div>

                <div class="env-block theorem">
                    <div class="env-title">Why BFS Works</div>
                    <div class="env-body">
                        <p>BFS guarantees the shortest path because it explores nodes in order of increasing distance from the start. If a path of length \\(k\\) exists, BFS will find it before exploring any path of length \\(k+1\\). For the farmer puzzle, BFS confirms that the minimum number of crossings is 7, and it finds both optimal solutions.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">BFS Complexity</div>
                    <div class="env-body">
                        <p>BFS visits each node at most once and examines each edge at most once, so its running time is \\(O(V + E)\\) where \\(V\\) is the number of valid states and \\(E\\) is the number of edges. For the farmer puzzle, this is tiny. For larger puzzles, the state space can be enormous, but BFS is still systematic and guaranteed to find the shortest solution if one exists.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'bfs-demo',
                    title: 'BFS Layer-by-Layer Explorer',
                    description: 'Watch BFS explore the farmer puzzle state graph layer by layer. Each step reveals nodes at the next distance from the start.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 380, scale: 30, originX: 50, originY: 350 });
                        var currentLayer = 0;

                        function isValid(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            if (w === g && f !== w) return false;
                            if (g === c && f !== g) return false;
                            return true;
                        }

                        function getNeighbors(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            var nbrs = [];
                            var nf = 1 - f;
                            var s2 = (nf << 3) | (w << 2) | (g << 1) | c;
                            if (isValid(s2)) nbrs.push(s2);
                            if (w === f) { s2 = (nf << 3) | ((1 - w) << 2) | (g << 1) | c; if (isValid(s2)) nbrs.push(s2); }
                            if (g === f) { s2 = (nf << 3) | (w << 2) | ((1 - g) << 1) | c; if (isValid(s2)) nbrs.push(s2); }
                            if (c === f) { s2 = (nf << 3) | (w << 2) | (g << 1) | (1 - c); if (isValid(s2)) nbrs.push(s2); }
                            return nbrs;
                        }

                        function stateLabel(s) {
                            var f = (s >> 3) & 1, w = (s >> 2) & 1, g = (s >> 1) & 1, c = s & 1;
                            var left = '', right = '';
                            if (!f) left += 'F'; else right += 'F';
                            if (!w) left += 'W'; else right += 'W';
                            if (!g) left += 'G'; else right += 'G';
                            if (!c) left += 'C'; else right += 'C';
                            return left + '|' + right;
                        }

                        // Run full BFS to get layers
                        var layers = [[0]];
                        var visited = { 0: true };
                        var dist = { 0: 0 };
                        while (true) {
                            var prevLayer = layers[layers.length - 1];
                            var nextLayer = [];
                            for (var i = 0; i < prevLayer.length; i++) {
                                var nbrs = getNeighbors(prevLayer[i]);
                                for (var j = 0; j < nbrs.length; j++) {
                                    if (!visited[nbrs[j]]) {
                                        visited[nbrs[j]] = true;
                                        dist[nbrs[j]] = layers.length;
                                        nextLayer.push(nbrs[j]);
                                    }
                                }
                            }
                            if (nextLayer.length === 0) break;
                            layers.push(nextLayer);
                        }

                        VizEngine.createButton(controls, 'Next Layer', function() {
                            if (currentLayer < layers.length - 1) { currentLayer++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Prev Layer', function() {
                            if (currentLayer > 0) { currentLayer--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            currentLayer = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show All', function() {
                            currentLayer = layers.length - 1;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('BFS Exploration (Layer ' + currentLayer + ' of ' + (layers.length - 1) + ')', viz.width / 2, 20);

                            // Draw layers as columns
                            var colSpacing = viz.width / (layers.length + 1);
                            var nodeR = 22;

                            // Pre-compute positions
                            var positions = {};
                            for (var l = 0; l < layers.length; l++) {
                                var layerNodes = layers[l];
                                var rowSpacing = Math.min(55, (viz.height - 100) / (layerNodes.length + 1));
                                var startY = (viz.height - rowSpacing * (layerNodes.length - 1)) / 2 + 10;
                                for (var n = 0; n < layerNodes.length; n++) {
                                    positions[layerNodes[n]] = {
                                        x: colSpacing * (l + 1),
                                        y: startY + n * rowSpacing,
                                        layer: l
                                    };
                                }
                            }

                            // Draw edges (only for revealed nodes)
                            for (var s in positions) {
                                s = parseInt(s);
                                if (positions[s].layer > currentLayer) continue;
                                var nbrs = getNeighbors(s);
                                for (var ni = 0; ni < nbrs.length; ni++) {
                                    var nb = nbrs[ni];
                                    if (!positions[nb] || positions[nb].layer > currentLayer) continue;
                                    if (positions[nb].layer > positions[s].layer || nb > s) {
                                        ctx.strokeStyle = viz.colors.axis + '44';
                                        ctx.lineWidth = 1;
                                        ctx.beginPath();
                                        ctx.moveTo(positions[s].x, positions[s].y);
                                        ctx.lineTo(positions[nb].x, positions[nb].y);
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Draw nodes
                            var layerColors = [viz.colors.green, viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.pink, viz.colors.gold];
                            for (var st in positions) {
                                st = parseInt(st);
                                var pos = positions[st];
                                if (pos.layer > currentLayer) continue;
                                var isCurrent = pos.layer === currentLayer;
                                var lc = layerColors[pos.layer % layerColors.length];

                                ctx.fillStyle = isCurrent ? lc + '55' : lc + '22';
                                ctx.beginPath();
                                ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.strokeStyle = lc;
                                ctx.lineWidth = isCurrent ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(stateLabel(st), pos.x, pos.y - 3);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText('d=' + pos.layer, pos.x, pos.y + 10);
                            }

                            // Layer labels
                            for (var ll = 0; ll <= currentLayer && ll < layers.length; ll++) {
                                ctx.fillStyle = layerColors[ll % layerColors.length];
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Layer ' + ll, colSpacing * (ll + 1), viz.height - 10);
                            }

                            // Status
                            if (currentLayer >= layers.length - 1) {
                                ctx.fillStyle = viz.colors.gold;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('BFS complete! Goal found at distance 7.', viz.width / 2, 45);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'If BFS on the farmer puzzle finds the goal at layer 7, what does this tell us about solutions with fewer than 7 crossings?',
                    hint: 'BFS explores all states at distance \\(d\\) before any at distance \\(d+1\\).',
                    solution: 'Since BFS explores layer by layer, and the goal state (1111) first appears at layer 7, there is no path from start to goal with fewer than 7 edges. This proves 7 crossings is optimal. If a shorter path existed, BFS would have found the goal at an earlier layer.'
                }
            ]
        },

        // ============================================================
        // SECTION 4: Missionaries and cannibals
        // ============================================================
        {
            id: 'ch17-sec04',
            title: 'Missionaries and cannibals',
            content: `
                <h2>Missionaries and Cannibals</h2>

                <p>Now let us tackle a harder river-crossing puzzle using the same state-space approach.</p>

                <div class="env-block example">
                    <div class="env-title">The Puzzle</div>
                    <div class="env-body">
                        <p>Three missionaries (M) and three cannibals (C) must cross a river. The boat holds at most 2 people and needs at least 1 person to operate. The constraint: on either bank (and in the boat), <strong>cannibals must never outnumber missionaries</strong> (or the missionaries get eaten). If there are 0 missionaries on a bank, any number of cannibals is fine.</p>
                        <p>Find a way to get everyone across.</p>
                    </div>
                </div>

                <h3>State Representation</h3>

                <p>A state can be described by the number of missionaries and cannibals on the <strong>left bank</strong>, plus the boat's position:</p>
                <p style="text-align:center;">\\((M_{\\text{left}}, C_{\\text{left}}, \\text{boat side})\\)</p>
                <p>The right bank is determined: \\(M_{\\text{right}} = 3 - M_{\\text{left}}\\), \\(C_{\\text{right}} = 3 - C_{\\text{left}}\\).</p>

                <div class="env-block definition">
                    <div class="env-title">Valid States</div>
                    <div class="env-body">
                        <p>A state \\((m, c, b)\\) is valid if:</p>
                        <ul>
                            <li>\\(0 \\leq m \\leq 3\\), \\(0 \\leq c \\leq 3\\)</li>
                            <li>On the left bank: \\(m = 0\\) or \\(m \\geq c\\)</li>
                            <li>On the right bank: \\(3-m = 0\\) or \\(3-m \\geq 3-c\\)</li>
                        </ul>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="missionaries-game"></div>

                <div class="env-block remark">
                    <div class="env-title">Solution</div>
                    <div class="env-body">
                        <p>The puzzle requires <strong>11 crossings</strong> (minimum). One solution:</p>
                        <ol>
                            <li>Send 2 cannibals across</li>
                            <li>1 cannibal returns</li>
                            <li>Send 2 cannibals across</li>
                            <li>1 cannibal returns</li>
                            <li>Send 2 missionaries across</li>
                            <li>1 missionary + 1 cannibal return</li>
                            <li>Send 2 missionaries across</li>
                            <li>1 cannibal returns</li>
                            <li>Send 2 cannibals across</li>
                            <li>1 cannibal returns</li>
                            <li>Send 2 cannibals across</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Comparing Puzzles</div>
                    <div class="env-body">
                        <p>The farmer puzzle has \\(2^4 = 16\\) potential states (10 valid). The missionaries puzzle has \\(4 \\times 4 \\times 2 = 32\\) potential states. Both are solved by the same method: enumerate valid states, build the state graph, find shortest path. The <em>representation</em> changes, but the <em>technique</em> is universal.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'missionaries-game',
                    title: 'Missionaries & Cannibals',
                    description: 'Click the buttons to send people across the river. Keep missionaries safe! At least 1 person must be in the boat, at most 2.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 400, scale: 30, originX: 50, originY: 350 });
                        var mLeft = 3, cLeft = 3, boatLeft = true;
                        var boatM = 0, boatC = 0;
                        var moves = 0;
                        var gameOver = false;
                        var won = false;
                        var message = 'Load missionaries (M) or cannibals (C) onto the boat, then cross!';

                        function checkValid() {
                            // Check left bank
                            var ml = mLeft - boatM * (boatLeft ? 1 : 0);
                            var cl = cLeft - boatC * (boatLeft ? 1 : 0);
                            var mr = (3 - mLeft) - boatM * (!boatLeft ? 1 : 0);
                            var cr = (3 - cLeft) - boatC * (!boatLeft ? 1 : 0);
                            // After crossing:
                            if (mLeft > 0 && cLeft > mLeft) return false;
                            var mRight = 3 - mLeft, cRight = 3 - cLeft;
                            if (mRight > 0 && cRight > mRight) return false;
                            return true;
                        }

                        VizEngine.createButton(controls, '+M on boat', function() {
                            if (gameOver) return;
                            var available = boatLeft ? mLeft : (3 - mLeft);
                            if (boatM + boatC < 2 && available > 0) {
                                boatM++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, '+C on boat', function() {
                            if (gameOver) return;
                            var available = boatLeft ? cLeft : (3 - cLeft);
                            if (boatM + boatC < 2 && available > 0) {
                                boatC++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Unload', function() {
                            if (gameOver) return;
                            boatM = 0;
                            boatC = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Cross!', function() {
                            if (gameOver) return;
                            if (boatM + boatC < 1) {
                                message = 'Need at least 1 person in the boat!';
                                draw();
                                return;
                            }
                            // Move boat
                            if (boatLeft) {
                                mLeft -= boatM;
                                cLeft -= boatC;
                            } else {
                                mLeft += boatM;
                                cLeft += boatC;
                            }
                            boatLeft = !boatLeft;
                            boatM = 0;
                            boatC = 0;
                            moves++;

                            // Check validity
                            if (!checkValid()) {
                                gameOver = true;
                                won = false;
                                message = 'Cannibals outnumber missionaries! Game over.';
                            } else if (mLeft === 0 && cLeft === 0) {
                                gameOver = true;
                                won = true;
                                message = 'Everyone crossed safely in ' + moves + ' moves! (Optimal: 11)';
                            } else {
                                message = 'Move ' + moves + '. Left bank: ' + mLeft + 'M, ' + cLeft + 'C. Load the boat!';
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            mLeft = 3; cLeft = 3; boatLeft = true;
                            boatM = 0; boatC = 0; moves = 0;
                            gameOver = false; won = false;
                            message = 'Load missionaries (M) or cannibals (C) onto the boat, then cross!';
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // River
                            ctx.fillStyle = '#0a2a5a';
                            ctx.fillRect(260, 0, 180, viz.height);

                            // Banks
                            ctx.fillStyle = '#1a3a20';
                            ctx.fillRect(0, 0, 260, viz.height);
                            ctx.fillStyle = '#1a3a20';
                            ctx.fillRect(440, 0, 260, viz.height);

                            // Labels
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('LEFT BANK', 130, 25);
                            ctx.fillText('RIGHT BANK', 570, 25);

                            // Draw people on left bank
                            var mOnLeft = mLeft - (boatLeft ? boatM : 0);
                            var cOnLeft = cLeft - (boatLeft ? boatC : 0);
                            var mOnRight = (3 - mLeft) - (!boatLeft ? boatM : 0);
                            var cOnRight = (3 - cLeft) - (!boatLeft ? boatC : 0);

                            // Left bank missionaries
                            for (var i = 0; i < mOnLeft; i++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(70 + i * 40, 80, 15, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('M', 70 + i * 40, 80);
                            }

                            // Left bank cannibals
                            for (var j = 0; j < cOnLeft; j++) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(70 + j * 40, 140, 15, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('C', 70 + j * 40, 140);
                            }

                            // Right bank missionaries
                            for (var k = 0; k < mOnRight; k++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(500 + k * 40, 80, 15, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('M', 500 + k * 40, 80);
                            }

                            // Right bank cannibals
                            for (var l = 0; l < cOnRight; l++) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(500 + l * 40, 140, 15, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('C', 500 + l * 40, 140);
                            }

                            // Boat
                            var boatX = boatLeft ? 270 : 380;
                            var boatY = 220;
                            ctx.fillStyle = '#5a3a1a';
                            ctx.beginPath();
                            ctx.moveTo(boatX, boatY);
                            ctx.lineTo(boatX + 70, boatY);
                            ctx.lineTo(boatX + 60, boatY + 25);
                            ctx.lineTo(boatX + 10, boatY + 25);
                            ctx.closePath();
                            ctx.fill();
                            ctx.strokeStyle = '#8a6a3a';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // People in boat
                            var bpx = boatX + 15;
                            for (var bm = 0; bm < boatM; bm++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(bpx, boatY - 10, 10, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('M', bpx, boatY - 10);
                                bpx += 25;
                            }
                            for (var bc = 0; bc < boatC; bc++) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(bpx, boatY - 10, 10, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('C', bpx, boatY - 10);
                                bpx += 25;
                            }

                            // State info
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('State: (' + mLeft + 'M, ' + cLeft + 'C, ' + (boatLeft ? 'left' : 'right') + ')  |  Moves: ' + moves + '  |  Boat: ' + boatM + 'M + ' + boatC + 'C', viz.width / 2, 290);

                            // Message
                            ctx.fillStyle = gameOver ? (won ? viz.colors.green : viz.colors.red) : viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText(message, viz.width / 2, 320);

                            // Constraint
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Rule: cannibals must never outnumber missionaries on either bank (unless 0 missionaries there)', viz.width / 2, 360);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many valid states are there in the 3M-3C missionaries and cannibals problem?',
                    hint: 'A state is \\((m, c, b)\\) where \\(m \\in \\{0,1,2,3\\}\\), \\(c \\in \\{0,1,2,3\\}\\), \\(b \\in \\{L,R\\}\\). Check the constraint on both banks.',
                    solution: 'Valid states on the left bank require \\(m=0\\) or \\(m \\geq c\\), and on the right bank \\(3-m=0\\) or \\(3-m \\geq 3-c\\). The valid \\((m,c)\\) pairs are: (0,0), (0,1), (0,2), (0,3), (1,1), (2,2), (3,3), (3,2), (3,1), (3,0). That is 10 valid configurations, each with 2 boat positions, giving <strong>20 valid states</strong>. (Some are unreachable from the start, but all 20 are valid.)'
                }
            ]
        },

        // ============================================================
        // SECTION 5: Designing your own puzzles
        // ============================================================
        {
            id: 'ch17-sec05',
            title: 'Designing your own puzzles',
            content: `
                <h2>Designing Your Own Puzzles</h2>

                <p>Now that you understand the state-space framework, you can <em>design</em> puzzles, not just solve them. This is a powerful shift: from puzzle consumer to puzzle creator.</p>

                <div class="env-block definition">
                    <div class="env-title">Recipe for Creating a River-Crossing Puzzle</div>
                    <div class="env-body">
                        <ol>
                            <li><strong>Choose your characters.</strong> What entities need to cross?</li>
                            <li><strong>Define constraints.</strong> Which combinations are forbidden when unsupervised?</li>
                            <li><strong>Set boat capacity.</strong> How many can cross at once?</li>
                            <li><strong>Check solvability.</strong> Build the state graph and verify a path exists from start to goal.</li>
                            <li><strong>Tune difficulty.</strong> Adjust constraints or capacity to make the minimum solution longer or shorter.</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Jealous Husbands</div>
                    <div class="env-body">
                        <p>Three married couples must cross a river. The boat holds 2 people. No woman can be on a bank (or in the boat) with another man unless her husband is also present. This is a classic variant with a much larger state space and requires 11 crossings.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">The General Pattern</div>
                    <div class="env-body">
                        <p>All of these puzzles follow the same framework:</p>
                        <ol>
                            <li><strong>State space:</strong> the set of all configurations.</li>
                            <li><strong>Transition rules:</strong> which moves are allowed.</li>
                            <li><strong>Constraints:</strong> which states are forbidden.</li>
                            <li><strong>Goal:</strong> reach a target state.</li>
                        </ol>
                        <p>This is the framework of <strong>constraint satisfaction</strong> and <strong>state-space search</strong>, which appears throughout computer science, artificial intelligence, and operations research.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="puzzle-designer"></div>

                <div class="env-block remark">
                    <div class="env-title">Beyond River Crossing</div>
                    <div class="env-body">
                        <p>The state-space approach works far beyond river crossings:</p>
                        <ul>
                            <li><strong>Rubik's Cube:</strong> \\(\\sim 4.3 \\times 10^{19}\\) states, solved by BFS variants.</li>
                            <li><strong>15-puzzle (sliding tiles):</strong> \\(\\sim 10^{13}\\) states.</li>
                            <li><strong>Water pouring puzzles:</strong> States are the water levels in each jug.</li>
                            <li><strong>Any logic puzzle:</strong> Encode the state, list the transitions, search for the goal.</li>
                        </ul>
                        <p>Whenever you face a puzzle, ask: "What is the state? What are the transitions? What is the goal?" Then let BFS (or a smarter algorithm) do the work.</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">The Power of Abstraction</div>
                    <div class="env-body">
                        <p>By representing a puzzle as a graph, we transform a specific, concrete puzzle into an instance of a general, well-studied problem (graph search). This is one of the most important ideas in mathematics and computer science: <strong>abstraction</strong> lets us solve infinitely many specific problems by solving one general problem.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'puzzle-designer',
                    title: 'Puzzle Constraint Explorer',
                    description: 'Explore how different conflict constraints change the state graph. Toggle conflicts between entities and see how the number of valid states and solution length change.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 360, scale: 30, originX: 50, originY: 330 });
                        var entities = ['A', 'B', 'C'];
                        var conflicts = { 'AB': true, 'BC': true, 'AC': false };

                        VizEngine.createButton(controls, 'A-B conflict: ON', function(e) {
                            conflicts['AB'] = !conflicts['AB'];
                            e.target.textContent = 'A-B conflict: ' + (conflicts['AB'] ? 'ON' : 'OFF');
                            draw();
                        });
                        VizEngine.createButton(controls, 'B-C conflict: ON', function(e) {
                            conflicts['BC'] = !conflicts['BC'];
                            e.target.textContent = 'B-C conflict: ' + (conflicts['BC'] ? 'ON' : 'OFF');
                            draw();
                        });
                        VizEngine.createButton(controls, 'A-C conflict: OFF', function(e) {
                            conflicts['AC'] = !conflicts['AC'];
                            e.target.textContent = 'A-C conflict: ' + (conflicts['AC'] ? 'ON' : 'OFF');
                            draw();
                        });

                        function isValid(state) {
                            // state: bit 3 = farmer, bit 2 = A, bit 1 = B, bit 0 = C
                            var f = (state >> 3) & 1;
                            var a = (state >> 2) & 1;
                            var b = (state >> 1) & 1;
                            var c = state & 1;

                            // Check side without farmer
                            // Left bank: entities with value 0
                            // Right bank: entities with value 1
                            function checkSide(side) {
                                var onSide = [];
                                if (a === side) onSide.push('A');
                                if (b === side) onSide.push('B');
                                if (c === side) onSide.push('C');
                                if (f === side) return true; // farmer present, ok
                                // No farmer. Check conflicts.
                                if (conflicts['AB'] && onSide.indexOf('A') >= 0 && onSide.indexOf('B') >= 0) return false;
                                if (conflicts['BC'] && onSide.indexOf('B') >= 0 && onSide.indexOf('C') >= 0) return false;
                                if (conflicts['AC'] && onSide.indexOf('A') >= 0 && onSide.indexOf('C') >= 0) return false;
                                return true;
                            }
                            return checkSide(0) && checkSide(1);
                        }

                        function getNeighbors(s) {
                            var f = (s >> 3) & 1;
                            var a = (s >> 2) & 1;
                            var b = (s >> 1) & 1;
                            var c = s & 1;
                            var nf = 1 - f;
                            var nbrs = [];
                            // Farmer alone
                            var s2 = (nf << 3) | (a << 2) | (b << 1) | c;
                            if (isValid(s2)) nbrs.push(s2);
                            // Take A
                            if (a === f) { s2 = (nf << 3) | ((1 - a) << 2) | (b << 1) | c; if (isValid(s2)) nbrs.push(s2); }
                            // Take B
                            if (b === f) { s2 = (nf << 3) | (a << 2) | ((1 - b) << 1) | c; if (isValid(s2)) nbrs.push(s2); }
                            // Take C
                            if (c === f) { s2 = (nf << 3) | (a << 2) | (b << 1) | (1 - c); if (isValid(s2)) nbrs.push(s2); }
                            return nbrs;
                        }

                        function bfsSolve() {
                            var visited = { 0: true };
                            var queue = [0];
                            var dist = { 0: 0 };
                            while (queue.length > 0) {
                                var cur = queue.shift();
                                if (cur === 15) return dist[15];
                                var nbrs = getNeighbors(cur);
                                for (var i = 0; i < nbrs.length; i++) {
                                    if (!visited[nbrs[i]]) {
                                        visited[nbrs[i]] = true;
                                        dist[nbrs[i]] = dist[cur] + 1;
                                        queue.push(nbrs[i]);
                                    }
                                }
                            }
                            return -1; // no solution
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Count valid states
                            var validCount = 0;
                            var validStates = [];
                            for (var s = 0; s < 16; s++) {
                                if (isValid(s)) { validCount++; validStates.push(s); }
                            }

                            var solLen = bfsSolve();

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Custom Puzzle: Farmer + 3 Entities (A, B, C)', viz.width / 2, 25);

                            // Show conflict graph
                            var cx = 170, cy = 120;
                            var triR = 50;
                            var nodePos = {
                                A: { x: cx, y: cy - triR },
                                B: { x: cx - triR * 0.87, y: cy + triR * 0.5 },
                                C: { x: cx + triR * 0.87, y: cy + triR * 0.5 }
                            };

                            // Draw conflict edges
                            var pairs = [['A', 'B', 'AB'], ['B', 'C', 'BC'], ['A', 'C', 'AC']];
                            for (var p = 0; p < pairs.length; p++) {
                                var e1 = pairs[p][0], e2 = pairs[p][1], ek = pairs[p][2];
                                ctx.strokeStyle = conflicts[ek] ? viz.colors.red : viz.colors.grid;
                                ctx.lineWidth = conflicts[ek] ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.moveTo(nodePos[e1].x, nodePos[e1].y);
                                ctx.lineTo(nodePos[e2].x, nodePos[e2].y);
                                ctx.stroke();
                                if (conflicts[ek]) {
                                    var midX = (nodePos[e1].x + nodePos[e2].x) / 2;
                                    var midY = (nodePos[e1].y + nodePos[e2].y) / 2;
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText('conflict', midX + 15, midY);
                                }
                            }

                            // Draw entity nodes
                            for (var ent in nodePos) {
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath();
                                ctx.arc(nodePos[ent].x, nodePos[ent].y, 18, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(ent, nodePos[ent].x, nodePos[ent].y);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Conflict graph', cx, cy + triR + 30);

                            // Stats
                            var statsX = 480;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('State Space Stats', statsX, 60);

                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Total possible states: 16', statsX, 90);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Valid states: ' + validCount, statsX, 115);

                            if (solLen >= 0) {
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText('Shortest solution: ' + solLen + ' moves', statsX, 140);
                            } else {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('No solution exists!', statsX, 140);
                            }

                            // Draw valid states as a grid
                            var gridY = 200;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Valid states:', viz.width / 2, gridY);

                            var cellW = Math.min(42, (viz.width - 40) / validCount);
                            var gridStartX = (viz.width - validCount * cellW) / 2;

                            for (var vi = 0; vi < validStates.length; vi++) {
                                var vs = validStates[vi];
                                var gx = gridStartX + vi * cellW;
                                var gy = gridY + 20;

                                var isStart = vs === 0;
                                var isGoal = vs === 15;
                                var nc = isStart ? viz.colors.green : (isGoal ? viz.colors.gold : viz.colors.blue);

                                ctx.fillStyle = nc + '33';
                                ctx.fillRect(gx + 1, gy, cellW - 2, 35);
                                ctx.strokeStyle = nc;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(gx + 1, gy, cellW - 2, 35);

                                var bin = ((vs >> 3) & 1) + '' + ((vs >> 2) & 1) + '' + ((vs >> 1) & 1) + '' + (vs & 1);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(bin, gx + cellW / 2, gy + 17);
                            }

                            // Bottom explanation
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('More conflicts = fewer valid states = harder (or impossible!) puzzle.', viz.width / 2, gridY + 75);
                            ctx.fillText('Toggle conflicts to see how the puzzle changes. (FABC encoding: bits = right bank)', viz.width / 2, gridY + 95);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design a river-crossing puzzle with 4 entities (plus the farmer) and a boat that holds 1 item. What is the minimum number of conflict pairs needed to make the puzzle non-trivial (requiring more than 7 crossings)?',
                    hint: 'With 4 entities, there are \\(\\binom{4}{2} = 6\\) possible conflict pairs. Start with a chain of conflicts (A-B, B-C, C-D) and see how many crossings are needed.',
                    solution: 'With a chain A-B-C-D (3 conflicts), the puzzle requires more complex back-and-forth. The exact number depends on the specific conflicts. With all 6 pairs conflicting, the puzzle becomes impossible (too many constraints). A good starting point is 3 conflict pairs in a chain, which forces multiple "bring back" steps similar to the goat in the classic puzzle. Experimentation with the state graph is the best way to determine the exact solution length.'
                },
                {
                    question: 'The Rubik\'s Cube has about \\(4.3 \\times 10^{19}\\) states. Why is standard BFS impractical for solving it?',
                    hint: 'Think about memory requirements. Each state must be stored.',
                    solution: 'BFS requires storing all discovered states in memory. With \\(4.3 \\times 10^{19}\\) states, even if each state took just 1 byte, you would need \\(\\sim 43\\) exabytes of memory, far exceeding any computer. Instead, Rubik\'s Cube solvers use pattern databases, iterative deepening, and group theory to prune the search space dramatically. The lesson: the state-space approach is always conceptually correct, but for large state spaces, clever algorithms and heuristics are essential.'
                }
            ]
        }
    ]
});
