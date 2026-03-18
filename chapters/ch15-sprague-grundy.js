window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'Fair Games & Sprague-Grundy',
    subtitle: 'Every impartial game is secretly just Nim in disguise',
    sections: [
        // ============================================================
        // SECTION 1: What makes a game "fair"?
        // ============================================================
        {
            id: 'ch15-sec01',
            title: 'What makes a game "fair"?',
            content: `
                <h2>What Makes a Game "Fair"?</h2>

                <div class="env-block intuition">
                    <div class="env-title">The Big Idea</div>
                    <div class="env-body">
                        <p>In Chapters 13 and 14, we studied Nim and winning strategies. Now we ask a deeper question: <strong>what kinds of games have the same mathematical structure as Nim?</strong> The answer, given by the Sprague-Grundy theorem, is surprisingly broad: <em>every</em> impartial game is equivalent to a single Nim pile.</p>
                    </div>
                </div>

                <p>Before diving into the theory, we need to be precise about which games we are studying. Not all games are created equal.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (Impartial Game)</div>
                    <div class="env-body">
                        <p>A two-player game is called <strong>impartial</strong> if:</p>
                        <ol>
                            <li>Both players have exactly the same moves available from every position.</li>
                            <li>The game must end in finitely many moves (no infinite loops).</li>
                            <li>The last player to move wins (normal play convention).</li>
                        </ol>
                        <p>A game where the two players have different available moves is called <strong>partisan</strong>.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Impartial vs. Partisan</div>
                    <div class="env-body">
                        <p><strong>Nim</strong> is impartial: both players can remove stones from any pile.</p>
                        <p><strong>Chess</strong> is partisan: White can only move white pieces, and Black can only move black pieces.</p>
                        <p><strong>Tic-tac-toe</strong> is also partisan: one player places X, the other places O.</p>
                    </div>
                </div>

                <p>In an impartial game, every position is either a <strong>P-position</strong> (Previous player wins, meaning the player who just moved is winning) or an <strong>N-position</strong> (Next player wins, meaning the player about to move has a winning strategy).</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem (P and N Classification)</div>
                    <div class="env-body">
                        <p>Every position in a finite impartial game is exactly one of:</p>
                        <ul>
                            <li><strong>P-position:</strong> Every move from here leads to an N-position.</li>
                            <li><strong>N-position:</strong> There exists at least one move to a P-position.</li>
                        </ul>
                        <p>Terminal positions (no moves available) are P-positions, because the player who must move loses.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Memory Aid</div>
                    <div class="env-body">
                        <p><strong>P</strong> = <strong>P</strong>revious player wins (you do NOT want to be the one moving from here).</p>
                        <p><strong>N</strong> = <strong>N</strong>ext player wins (you DO want to be the one moving from here).</p>
                    </div>
                </div>

                <p>Let us see P and N positions in action with a simple game.</p>

                <div class="env-block example">
                    <div class="env-title">Example: Subtraction Game</div>
                    <div class="env-body">
                        <p>There is a pile of stones. On your turn, you may remove 1, 2, or 3 stones. The player who takes the last stone wins.</p>
                        <p>Starting from 0 stones: P-position (no moves, you lose).</p>
                        <p>From 1, 2, or 3 stones: N-positions (you take everything and win).</p>
                        <p>From 4 stones: P-position! Any move leaves 1, 2, or 3 (all N-positions for your opponent).</p>
                        <p>The pattern repeats: positions 0, 4, 8, 12, ... are P-positions.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="pn-positions"></div>
            `,
            visualizations: [
                {
                    id: 'pn-positions',
                    title: 'P/N Position Explorer',
                    description: 'Explore the subtraction game {1,2,3}. Green = P-position (previous player wins), Red = N-position (next player wins). Change the maximum subtraction to see different patterns.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 280, scale: 30, originX: 40, originY: 240 });
                        var maxSub = 3;
                        var maxN = 20;

                        VizEngine.createSlider(controls, 'Max subtract', 1, 6, maxSub, 1, function(v) {
                            maxSub = Math.round(v);
                            draw();
                        });

                        function computePN(n, ms) {
                            var result = [];
                            for (var i = 0; i <= n; i++) {
                                if (i === 0) { result.push('P'); continue; }
                                var isN = false;
                                for (var s = 1; s <= ms && s <= i; s++) {
                                    if (result[i - s] === 'P') { isN = true; break; }
                                }
                                result.push(isN ? 'N' : 'P');
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pn = computePN(maxN, maxSub);
                            var cellW = 30;
                            var cellH = 40;
                            var startX = 20;
                            var startY = 30;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Subtraction Game: remove 1 to ' + maxSub + ' stones', viz.width / 2, startY);

                            for (var i = 0; i <= maxN; i++) {
                                var x = startX + i * cellW;
                                var y = startY + 40;
                                var isP = pn[i] === 'P';
                                var color = isP ? viz.colors.green : viz.colors.red;

                                ctx.fillStyle = color + '44';
                                ctx.fillRect(x - cellW / 2 + 2, y - cellH / 2, cellW - 4, cellH);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x - cellW / 2 + 2, y - cellH / 2, cellW - 4, cellH);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('' + i, x, y - 6);

                                ctx.fillStyle = color;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText(pn[i], x, y + 10);
                            }

                            // Draw arrows for a selected P-position
                            var arrowY = startY + 40 + cellH / 2 + 30;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Pattern: P-positions repeat every ' + (maxSub + 1) + ' steps (at multiples of ' + (maxSub + 1) + ')', viz.width / 2, arrowY);

                            // Show the period
                            var periodY = arrowY + 25;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var pPositions = [];
                            for (var j = 0; j <= maxN; j++) {
                                if (pn[j] === 'P') pPositions.push(j);
                            }
                            ctx.fillText('P-positions: {' + pPositions.join(', ') + ', ...}', viz.width / 2, periodY);

                            // Key insight
                            var keyY = periodY + 30;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText('Position n is a P-position iff n mod ' + (maxSub + 1) + ' = 0', viz.width / 2, keyY);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the subtraction game where you can remove 1, 2, or 3 stones, is the position with 7 stones a P-position or N-position? What is the winning move?',
                    hint: 'Compute \\(7 \\mod 4\\). If it is not 0, the position is an N-position.',
                    solution: '\\(7 \\mod 4 = 3 \\neq 0\\), so 7 is an N-position. The winning move is to remove 3 stones, leaving 4 (a P-position for your opponent).'
                },
                {
                    question: 'In a subtraction game with set \\(\\{1, 4, 5\\}\\), classify positions 0 through 10 as P or N.',
                    hint: 'Start from 0 (P). For each position, check if any allowed subtraction leads to a P-position.',
                    solution: 'Position 0: P. Position 1: N (remove 1 to reach 0). Position 2: P (can only remove 1, reaching N-position 1... wait, 1 is N, so removing 1 from 2 goes to 1 which is N; we cannot reach P). Position 2: P. Position 3: P (only move is to 2, which is P... no, remove 1 to reach 2 (P), so 3 is N). Let us be careful: 0=P, 1=N, 2=P, 3=N, 4=N, 5=N, 6=P, 7=N, 8=P, 9=N, 10=N.'
                }
            ]
        },

        // ============================================================
        // SECTION 2: Grundy values (nimbers)
        // ============================================================
        {
            id: 'ch15-sec02',
            title: 'Grundy values (nimbers)',
            content: `
                <h2>Grundy Values (Nimbers)</h2>

                <p>The P/N classification tells us <em>who</em> wins, but not <em>how much</em> a position is worth when combined with other games. For that, we need a finer tool: the <strong>Grundy value</strong>, also called the <strong>nimber</strong> or <strong>Sprague-Grundy value</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (Minimal Excludant)</div>
                    <div class="env-body">
                        <p>Given a set \\(S\\) of non-negative integers, the <strong>minimal excludant</strong> (mex) of \\(S\\) is the smallest non-negative integer NOT in \\(S\\):</p>
                        \\[\\operatorname{mex}(S) = \\min\\{n \\geq 0 : n \\notin S\\}\\]
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Examples of mex</div>
                    <div class="env-body">
                        <p>\\(\\operatorname{mex}(\\{0, 1, 2\\}) = 3\\) (the first missing value)</p>
                        <p>\\(\\operatorname{mex}(\\{1, 2, 3\\}) = 0\\) (0 is missing!)</p>
                        <p>\\(\\operatorname{mex}(\\{0, 2, 4\\}) = 1\\)</p>
                        <p>\\(\\operatorname{mex}(\\{\\,\\}) = 0\\) (empty set, nothing is present)</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition (Grundy Value)</div>
                    <div class="env-body">
                        <p>For an impartial game position \\(G\\) with options (positions reachable in one move) \\(G_1, G_2, \\ldots, G_k\\), the <strong>Grundy value</strong> is defined recursively:</p>
                        \\[\\mathcal{G}(G) = \\operatorname{mex}\\{\\mathcal{G}(G_1), \\mathcal{G}(G_2), \\ldots, \\mathcal{G}(G_k)\\}\\]
                        <p>A terminal position (no options) has \\(\\mathcal{G} = \\operatorname{mex}(\\{\\,\\}) = 0\\).</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Key Insight</div>
                    <div class="env-body">
                        <p>The Grundy value tells you which Nim pile a position is equivalent to! A position with Grundy value \\(g\\) behaves exactly like a Nim pile of \\(g\\) stones. In particular:</p>
                        <ul>
                            <li>\\(\\mathcal{G}(G) = 0\\) if and only if \\(G\\) is a P-position (losing for the player to move).</li>
                            <li>\\(\\mathcal{G}(G) > 0\\) if and only if \\(G\\) is an N-position (winning for the player to move).</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Grundy Values of Nim Piles</div>
                    <div class="env-body">
                        <p>A Nim pile of size \\(n\\) has Grundy value \\(n\\). Why?</p>
                        <p>From a pile of size \\(n\\), you can move to any pile of size \\(0, 1, \\ldots, n-1\\).</p>
                        <p>So \\(\\mathcal{G}(n) = \\operatorname{mex}\\{0, 1, \\ldots, n-1\\} = n\\). The formula checks out!</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="mex-calculator"></div>

                <div class="env-block warning">
                    <div class="env-title">Watch Out</div>
                    <div class="env-body">
                        <p>The Grundy value depends on the <strong>game rules</strong>, not just the position number. A pile of 5 stones has Grundy value 5 in standard Nim, but in the subtraction game \\(\\{1,2,3\\}\\), position 5 has Grundy value 1 (since \\(5 \\mod 4 = 1\\)).</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'mex-calculator',
                    title: 'Interactive mex Calculator',
                    description: 'Click numbers to add or remove them from the set. The mex (minimal excludant) updates automatically.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 260, scale: 30, originX: 50, originY: 200 });
                        var inSet = {};
                        var maxVal = 10;

                        function computeMex() {
                            for (var i = 0; i <= maxVal + 1; i++) {
                                if (!inSet[i]) return i;
                            }
                            return maxVal + 1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cellSize = 50;
                            var startX = (viz.width - (maxVal + 1) * cellSize) / 2;
                            var startY = 60;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Click numbers to toggle them in the set S', viz.width / 2, 25);

                            for (var i = 0; i <= maxVal; i++) {
                                var x = startX + i * cellSize + cellSize / 2;
                                var y = startY + cellSize / 2;
                                var active = !!inSet[i];

                                ctx.fillStyle = active ? viz.colors.blue + '55' : viz.colors.grid;
                                ctx.fillRect(startX + i * cellSize + 2, startY + 2, cellSize - 4, cellSize - 4);
                                ctx.strokeStyle = active ? viz.colors.blue : viz.colors.axis;
                                ctx.lineWidth = active ? 2 : 1;
                                ctx.strokeRect(startX + i * cellSize + 2, startY + 2, cellSize - 4, cellSize - 4);

                                ctx.fillStyle = active ? viz.colors.blue : viz.colors.text;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('' + i, x, y);
                            }

                            // Show current set
                            var setItems = [];
                            for (var j = 0; j <= maxVal; j++) {
                                if (inSet[j]) setItems.push(j);
                            }
                            var setStr = setItems.length === 0 ? '{ }' : '{ ' + setItems.join(', ') + ' }';

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('S = ' + setStr, viz.width / 2, startY + cellSize + 30);

                            // Show mex
                            var mex = computeMex();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 22px -apple-system,sans-serif';
                            ctx.fillText('mex(S) = ' + mex, viz.width / 2, startY + cellSize + 65);

                            // Explanation
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('The smallest non-negative integer not in S is ' + mex, viz.width / 2, startY + cellSize + 95);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 50;
                            var startX = (viz.width - (maxVal + 1) * cellSize) / 2;
                            var startY = 60;
                            for (var i = 0; i <= maxVal; i++) {
                                var cx = startX + i * cellSize;
                                if (mx >= cx && mx < cx + cellSize && my >= startY && my < startY + cellSize) {
                                    inSet[i] = !inSet[i];
                                    draw();
                                    return;
                                }
                            }
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\operatorname{mex}(\\{0, 1, 3, 5, 7\\})\\).',
                    hint: 'List 0, 1, 2, 3, ... and find the first one missing from the set.',
                    solution: '0 is present, 1 is present, 2 is NOT present. So \\(\\operatorname{mex}(\\{0,1,3,5,7\\}) = 2\\).'
                },
                {
                    question: 'In the subtraction game \\(\\{1, 2, 3\\}\\), compute the Grundy values for positions 0 through 8.',
                    hint: 'Use \\(\\mathcal{G}(n) = \\operatorname{mex}\\{\\mathcal{G}(n-1), \\mathcal{G}(n-2), \\mathcal{G}(n-3)\\}\\), starting from \\(\\mathcal{G}(0) = 0\\).',
                    solution: '\\(\\mathcal{G}(0) = 0\\). \\(\\mathcal{G}(1) = \\operatorname{mex}\\{0\\} = 1\\). \\(\\mathcal{G}(2) = \\operatorname{mex}\\{0,1\\} = 2\\). \\(\\mathcal{G}(3) = \\operatorname{mex}\\{0,1,2\\} = 3\\). \\(\\mathcal{G}(4) = \\operatorname{mex}\\{1,2,3\\} = 0\\). \\(\\mathcal{G}(5) = \\operatorname{mex}\\{0,2,3\\} = 1\\). \\(\\mathcal{G}(6) = \\operatorname{mex}\\{0,1,3\\} = 2\\). \\(\\mathcal{G}(7) = \\operatorname{mex}\\{0,1,2\\} = 3\\). \\(\\mathcal{G}(8) = \\operatorname{mex}\\{1,2,3\\} = 0\\). The pattern cycles: 0, 1, 2, 3, 0, 1, 2, 3, ...'
                }
            ]
        },

        // ============================================================
        // SECTION 3: Computing Grundy numbers
        // ============================================================
        {
            id: 'ch15-sec03',
            title: 'Computing Grundy numbers',
            content: `
                <h2>Computing Grundy Numbers</h2>

                <p>Now that we know what Grundy values are, let us practice computing them for various games. The method is always the same: work backwards from terminal positions, applying the mex rule at each step.</p>

                <h3>Algorithm</h3>

                <div class="env-block definition">
                    <div class="env-title">Recipe for Computing Grundy Values</div>
                    <div class="env-body">
                        <ol>
                            <li><strong>Identify terminal positions.</strong> These have Grundy value 0.</li>
                            <li><strong>Work backwards.</strong> For each position, list the Grundy values of all positions reachable in one move.</li>
                            <li><strong>Apply mex.</strong> The Grundy value is the mex of that list.</li>
                        </ol>
                    </div>
                </div>

                <h3>Example: The "1, 3, 4" Subtraction Game</h3>

                <p>Players alternate removing 1, 3, or 4 stones from a pile. Last to move wins.</p>

                <div class="env-block example">
                    <div class="env-title">Computing Step by Step</div>
                    <div class="env-body">
                        <p>\\(\\mathcal{G}(0) = 0\\) (terminal)</p>
                        <p>\\(\\mathcal{G}(1) = \\operatorname{mex}\\{\\mathcal{G}(0)\\} = \\operatorname{mex}\\{0\\} = 1\\)</p>
                        <p>\\(\\mathcal{G}(2) = \\operatorname{mex}\\{\\mathcal{G}(1)\\} = \\operatorname{mex}\\{1\\} = 0\\)</p>
                        <p>(From 2, you can only remove 1, reaching position 1.)</p>
                        <p>\\(\\mathcal{G}(3) = \\operatorname{mex}\\{\\mathcal{G}(2), \\mathcal{G}(0)\\} = \\operatorname{mex}\\{0, 0\\} = 1\\)</p>
                        <p>\\(\\mathcal{G}(4) = \\operatorname{mex}\\{\\mathcal{G}(3), \\mathcal{G}(1), \\mathcal{G}(0)\\} = \\operatorname{mex}\\{1, 1, 0\\} = 2\\)</p>
                        <p>\\(\\mathcal{G}(5) = \\operatorname{mex}\\{\\mathcal{G}(4), \\mathcal{G}(2), \\mathcal{G}(1)\\} = \\operatorname{mex}\\{2, 0, 1\\} = 3\\)</p>
                        <p>\\(\\mathcal{G}(6) = \\operatorname{mex}\\{\\mathcal{G}(5), \\mathcal{G}(3), \\mathcal{G}(2)\\} = \\operatorname{mex}\\{3, 1, 0\\} = 2\\)</p>
                        <p>\\(\\mathcal{G}(7) = \\operatorname{mex}\\{\\mathcal{G}(6), \\mathcal{G}(4), \\mathcal{G}(3)\\} = \\operatorname{mex}\\{2, 2, 1\\} = 0\\)</p>
                    </div>
                </div>

                <p>Notice that the Grundy values do not simply equal \\(n \\mod k\\) for some fixed \\(k\\), unlike the \\(\\{1,2,3\\}\\) game. Different subtraction sets produce different, sometimes surprising, patterns.</p>

                <div class="viz-placeholder" data-viz="grundy-calculator"></div>

                <div class="env-block remark">
                    <div class="env-title">Periodicity</div>
                    <div class="env-body">
                        <p>A remarkable fact (the <strong>Sprague-Grundy periodicity theorem</strong>) guarantees that the Grundy values of any subtraction game eventually become periodic. The period and offset might not be obvious, but they always exist.</p>
                    </div>
                </div>

                <h3>Game Graphs</h3>

                <p>It helps to visualize a game as a <strong>directed graph</strong>. Each position is a node, and there is an arrow from position \\(A\\) to position \\(B\\) if you can move from \\(A\\) to \\(B\\) in one turn. Terminal positions are nodes with no outgoing arrows.</p>

                <div class="viz-placeholder" data-viz="game-graph-viz"></div>
            `,
            visualizations: [
                {
                    id: 'grundy-calculator',
                    title: 'Grundy Value Calculator',
                    description: 'Enter a subtraction set and see the Grundy values computed automatically. Toggle individual elements to build different games.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 320, scale: 30, originX: 40, originY: 280 });
                        var subSet = [1, 2, 3];
                        var maxPos = 20;
                        var buttons = {};

                        for (var s = 1; s <= 6; s++) {
                            (function(val) {
                                var active = subSet.indexOf(val) >= 0;
                                var btn = VizEngine.createButton(controls, (active ? '\u2713 ' : '') + val, function() {
                                    var idx = subSet.indexOf(val);
                                    if (idx >= 0) { subSet.splice(idx, 1); btn.textContent = '' + val; }
                                    else { subSet.push(val); subSet.sort(function(a, b) { return a - b; }); btn.textContent = '\u2713 ' + val; }
                                    draw();
                                });
                                buttons[val] = btn;
                            })(s);
                        }

                        function computeGrundy(n, ss) {
                            var g = [0];
                            for (var i = 1; i <= n; i++) {
                                var reachable = {};
                                for (var j = 0; j < ss.length; j++) {
                                    if (ss[j] <= i) reachable[g[i - ss[j]]] = true;
                                }
                                var mex = 0;
                                while (reachable[mex]) mex++;
                                g.push(mex);
                            }
                            return g;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = computeGrundy(maxPos, subSet);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Subtraction set: {' + subSet.join(', ') + '}', viz.width / 2, 20);

                            var cellW = 30;
                            var startX = (viz.width - (maxPos + 1) * cellW) / 2;

                            // Position row
                            var rowY1 = 55;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Position:', startX - 30, rowY1);

                            for (var i = 0; i <= maxPos; i++) {
                                var x = startX + i * cellW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('' + i, x, rowY1);
                            }

                            // Grundy value row
                            var rowY2 = 90;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('G(n):', startX - 30, rowY2);

                            var maxG = 0;
                            for (var k = 0; k <= maxPos; k++) {
                                if (g[k] > maxG) maxG = g[k];
                            }

                            var grundyColors = [viz.colors.green, viz.colors.blue, viz.colors.orange, viz.colors.purple, viz.colors.teal, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            for (var m = 0; m <= maxPos; m++) {
                                var px = startX + m * cellW;
                                var gv = g[m];
                                var gc = grundyColors[gv % grundyColors.length];

                                ctx.fillStyle = gc + '44';
                                ctx.fillRect(px - cellW / 2 + 2, rowY2 - 14, cellW - 4, 28);
                                ctx.strokeStyle = gc;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(px - cellW / 2 + 2, rowY2 - 14, cellW - 4, 28);

                                ctx.fillStyle = gc;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('' + gv, px, rowY2);
                            }

                            // Visual bar chart of Grundy values
                            var barY = 140;
                            var barH = 120;
                            var barMax = Math.max(maxG, 1);

                            for (var q = 0; q <= maxPos; q++) {
                                var bx = startX + q * cellW;
                                var bh = (g[q] / barMax) * barH;
                                var bc = grundyColors[g[q] % grundyColors.length];
                                if (bh > 0) {
                                    ctx.fillStyle = bc + '88';
                                    ctx.fillRect(bx - cellW / 2 + 4, barY + barH - bh, cellW - 8, bh);
                                }
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('' + q, bx, barY + barH + 12);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Grundy value bar chart', viz.width / 2, barY - 10);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'game-graph-viz',
                    title: 'Game Graph with Grundy Values',
                    description: 'See the subtraction game {1,2,3} as a directed graph. Each node shows its Grundy value. Green = 0 (P-position).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 300, scale: 30, originX: 50, originY: 250 });
                        var subSet = [1, 2, 3];
                        var numNodes = 10;

                        function computeGrundy(n, ss) {
                            var g = [0];
                            for (var i = 1; i <= n; i++) {
                                var reach = {};
                                for (var j = 0; j < ss.length; j++) {
                                    if (ss[j] <= i) reach[g[i - ss[j]]] = true;
                                }
                                var mex = 0;
                                while (reach[mex]) mex++;
                                g.push(mex);
                            }
                            return g;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = computeGrundy(numNodes, subSet);
                            var grundyColors = [viz.colors.green, viz.colors.blue, viz.colors.orange, viz.colors.purple];
                            var nodeR = 22;
                            var spacing = 60;
                            var startX = 50;
                            var rowY = 80;

                            // Layout nodes in a row
                            var positions = [];
                            for (var i = 0; i <= numNodes; i++) {
                                positions.push({ x: startX + i * spacing, y: rowY });
                            }

                            // Draw edges first (curved arcs below)
                            for (var n = 0; n <= numNodes; n++) {
                                for (var si = 0; si < subSet.length; si++) {
                                    var target = n - subSet[si];
                                    if (target < 0) continue;
                                    var sx = positions[n].x;
                                    var sy = positions[n].y;
                                    var tx = positions[target].x;
                                    var ty = positions[target].y;
                                    var dist = subSet[si];
                                    var curveY = rowY + 30 + dist * 22;

                                    ctx.strokeStyle = viz.colors.axis + '88';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(sx, sy + nodeR);
                                    ctx.quadraticCurveTo((sx + tx) / 2, curveY, tx, ty + nodeR);
                                    ctx.stroke();

                                    // Arrowhead
                                    var angle = Math.atan2(ty + nodeR - curveY, tx - (sx + tx) / 2);
                                    ctx.fillStyle = viz.colors.axis + '88';
                                    ctx.beginPath();
                                    ctx.moveTo(tx, ty + nodeR);
                                    ctx.lineTo(tx - 6 * Math.cos(angle - 0.4), ty + nodeR - 6 * Math.sin(angle - 0.4));
                                    ctx.lineTo(tx - 6 * Math.cos(angle + 0.4), ty + nodeR - 6 * Math.sin(angle + 0.4));
                                    ctx.closePath();
                                    ctx.fill();
                                }
                            }

                            // Draw nodes
                            for (var m = 0; m <= numNodes; m++) {
                                var nx = positions[m].x;
                                var ny = positions[m].y;
                                var gv = g[m];
                                var nc = grundyColors[gv % grundyColors.length];

                                ctx.fillStyle = nc + '33';
                                ctx.beginPath();
                                ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.strokeStyle = nc;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('' + m, nx, ny - 4);

                                ctx.fillStyle = nc;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('G=' + gv, nx, ny + 10);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Subtraction game {1,2,3}: arcs show moves, node labels show position and Grundy value', 20, viz.height - 15);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Grundy values for positions 0 through 10 in the subtraction game \\(\\{1, 3\\}\\).',
                    hint: 'From position \\(n\\), you can move to \\(n-1\\) (if \\(n \\geq 1\\)) and \\(n-3\\) (if \\(n \\geq 3\\)). Apply mex at each step.',
                    solution: '\\(\\mathcal{G}(0)=0, \\mathcal{G}(1)=1, \\mathcal{G}(2)=\\operatorname{mex}\\{1\\}=0, \\mathcal{G}(3)=\\operatorname{mex}\\{0,0\\}=1, \\mathcal{G}(4)=\\operatorname{mex}\\{1,1\\}=0, \\mathcal{G}(5)=\\operatorname{mex}\\{0,0\\}=1, \\ldots\\) The pattern is 0, 1, 0, 1, 0, 1, ... This game behaves like taking 1 stone from a pile (only the parity matters).'
                }
            ]
        },

        // ============================================================
        // SECTION 4: Sprague-Grundy Theorem
        // ============================================================
        {
            id: 'ch15-sec04',
            title: 'Sprague-Grundy theorem',
            content: `
                <h2>The Sprague-Grundy Theorem</h2>

                <p>We now arrive at one of the most beautiful results in combinatorial game theory, discovered independently by Roland Sprague (1935) and Patrick Grundy (1939).</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem (Sprague-Grundy)</div>
                    <div class="env-body">
                        <p>Every impartial game under normal play convention is equivalent to a Nim pile whose size equals the game's Grundy value.</p>
                        <p>In symbols: a game position \\(G\\) with \\(\\mathcal{G}(G) = g\\) behaves identically to a Nim pile of size \\(g\\). That is, for the purpose of determining who wins, you can replace \\(G\\) with a pile of \\(g\\) stones in Nim.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Why This Is Amazing</div>
                    <div class="env-body">
                        <p>This theorem says that <strong>every</strong> impartial game, no matter how complicated, is secretly just Nim! A position in Chomp, Wythoff's game, Turning Turtles, or any other impartial game is exactly equivalent to some number of Nim stones. The Grundy value is that number.</p>
                    </div>
                </div>

                <h3>Proof Sketch</h3>

                <p>The key idea is that a position with Grundy value \\(g\\) has exactly the same "reach" structure as a Nim pile of size \\(g\\):</p>

                <div class="env-block remark">
                    <div class="env-title">Three Properties</div>
                    <div class="env-body">
                        <ol>
                            <li>From a position with \\(\\mathcal{G} = g\\), you can reach a position with any Grundy value \\(0, 1, \\ldots, g-1\\). (Otherwise, mex would not give \\(g\\).)</li>
                            <li>From a position with \\(\\mathcal{G} = g\\), you cannot reach another position with \\(\\mathcal{G} = g\\). (Otherwise, \\(g\\) would be in the mex set, and mex would be at most \\(g\\), contradicting \\(\\mathcal{G} = g\\)... wait, that is not quite right. Actually, you might be able to reach \\(g\\); what matters is that you <em>can</em> reach every value \\(0\\) through \\(g-1\\), just like in Nim.)</li>
                            <li>A terminal position has \\(\\mathcal{G} = 0\\), matching an empty Nim pile.</li>
                        </ol>
                        <p>Property 1 guarantees the same move structure as Nim: from a pile of \\(g\\), you can reduce to 0, 1, ..., \\(g-1\\).</p>
                    </div>
                </div>

                <h3>What "Equivalent" Means</h3>

                <p>Two game positions \\(A\\) and \\(B\\) are <strong>equivalent</strong> if for every game \\(C\\), the combined game \\(A + C\\) has the same winner as \\(B + C\\). The Sprague-Grundy theorem says that a position with Grundy value \\(g\\) is equivalent to a Nim pile of \\(g\\) in this strong sense.</p>

                <div class="env-block example">
                    <div class="env-title">Example</div>
                    <div class="env-body">
                        <p>Consider the subtraction game \\(\\{1, 3, 4\\}\\) at position 5. We computed \\(\\mathcal{G}(5) = 3\\).</p>
                        <p>This means position 5 in this game is equivalent to a Nim pile of 3 stones. If this game were combined with other games, you would treat it as "3 Nim-stones" for the purpose of strategy.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="sg-theorem-demo"></div>
            `,
            visualizations: [
                {
                    id: 'sg-theorem-demo',
                    title: 'Sprague-Grundy in Action',
                    description: 'See how a subtraction game position maps to an equivalent Nim pile. The Grundy value is the bridge between any impartial game and Nim.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 320, scale: 30, originX: 50, originY: 280 });
                        var position = 5;
                        var subSet = [1, 3, 4];

                        VizEngine.createSlider(controls, 'Position n', 0, 15, position, 1, function(v) {
                            position = Math.round(v);
                            draw();
                        });

                        function computeGrundy(n, ss) {
                            var g = [0];
                            for (var i = 1; i <= n; i++) {
                                var reach = {};
                                for (var j = 0; j < ss.length; j++) {
                                    if (ss[j] <= i) reach[g[i - ss[j]]] = true;
                                }
                                var mex = 0;
                                while (reach[mex]) mex++;
                                g.push(mex);
                            }
                            return g;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = computeGrundy(Math.max(position, 15), subSet);
                            var gv = g[position];

                            // Left side: subtraction game
                            var leftX = 170;
                            var midY = 100;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Subtraction Game {1,3,4}', leftX, 25);

                            // Draw stones
                            var stoneR = 10;
                            var cols = Math.min(position, 8);
                            var rows = cols > 0 ? Math.ceil(position / cols) : 0;
                            for (var i = 0; i < position; i++) {
                                var col = i % (cols || 1);
                                var row = Math.floor(i / (cols || 1));
                                var sx = leftX - (cols - 1) * 12 + col * 24;
                                var sy = 50 + row * 24;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(sx, sy, stoneR, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Position: ' + position + ' stones', leftX, 50 + rows * 24 + 15);
                            ctx.fillText('Can remove: {1, 3, 4}', leftX, 50 + rows * 24 + 35);

                            // Arrow in the middle
                            var arrowX = 350;
                            var arrowY = 80;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(arrowX - 40, arrowY);
                            ctx.lineTo(arrowX + 40, arrowY);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.moveTo(arrowX + 45, arrowY);
                            ctx.lineTo(arrowX + 35, arrowY - 8);
                            ctx.lineTo(arrowX + 35, arrowY + 8);
                            ctx.closePath();
                            ctx.fill();

                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('G = ' + gv, arrowX, arrowY - 15);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('equivalent to', arrowX, arrowY + 20);

                            // Right side: Nim pile
                            var rightX = 530;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Nim Pile', rightX, 25);

                            for (var j = 0; j < gv; j++) {
                                var ny = 50 + j * 24;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(rightX, ny, stoneR, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            var nimY = 50 + Math.max(gv, 0) * 24 + 15;
                            ctx.fillText(gv + ' stones', rightX, nimY);

                            // Bottom: full Grundy sequence
                            var seqY = 220;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Grundy values for {1,3,4}:', viz.width / 2, seqY);

                            var grundyColors = [viz.colors.green, viz.colors.blue, viz.colors.orange, viz.colors.purple, viz.colors.teal, viz.colors.red];
                            var cellW = 36;
                            var seqStartX = (viz.width - 16 * cellW) / 2;

                            for (var p = 0; p <= 15; p++) {
                                var cx = seqStartX + p * cellW;
                                var cy = seqY + 25;
                                var gVal = g[p];
                                var col2 = grundyColors[gVal % grundyColors.length];
                                var isSelected = (p === position);

                                ctx.fillStyle = isSelected ? col2 + '88' : col2 + '33';
                                ctx.fillRect(cx - cellW / 2 + 2, cy - 12, cellW - 4, 36);
                                if (isSelected) {
                                    ctx.strokeStyle = viz.colors.white;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(cx - cellW / 2 + 2, cy - 12, cellW - 4, 36);
                                }

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('n=' + p, cx, cy - 2);

                                ctx.fillStyle = col2;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText('' + gVal, cx, cy + 13);
                            }

                            // Who wins?
                            var winY = seqY + 75;
                            ctx.textAlign = 'center';
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            if (gv === 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('G(' + position + ') = 0: P-position (next player LOSES)', viz.width / 2, winY);
                            } else {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('G(' + position + ') = ' + gv + ': N-position (next player WINS)', viz.width / 2, winY);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why can you not reach a position with the same Grundy value as the current position in Nim? (Hint: think about what mex computes.)',
                    hint: 'In Nim, from a pile of \\(g\\) you move to a pile of \\(0, 1, \\ldots, g-1\\). None of those equal \\(g\\).',
                    solution: 'In standard Nim, removing stones from a pile of \\(g\\) stones always reduces the pile size, so you reach piles of size \\(0, 1, \\ldots, g-1\\), never \\(g\\) again. For general impartial games, the Sprague-Grundy equivalence works because the mex function guarantees you can reach all Grundy values \\(0\\) through \\(g-1\\), mimicking the Nim structure.'
                },
                {
                    question: 'In the subtraction game \\(\\{2, 5\\}\\), what is \\(\\mathcal{G}(6)\\)?',
                    hint: 'Compute \\(\\mathcal{G}(0)\\) through \\(\\mathcal{G}(6)\\) step by step. From position \\(n\\), you can only move to \\(n-2\\) (if \\(n \\geq 2\\)) and \\(n-5\\) (if \\(n \\geq 5\\)).',
                    solution: '\\(\\mathcal{G}(0)=0, \\mathcal{G}(1)=0\\) (no moves), \\(\\mathcal{G}(2)=\\operatorname{mex}\\{0\\}=1, \\mathcal{G}(3)=\\operatorname{mex}\\{0\\}=1, \\mathcal{G}(4)=\\operatorname{mex}\\{1\\}=0, \\mathcal{G}(5)=\\operatorname{mex}\\{1,0\\}=2, \\mathcal{G}(6)=\\operatorname{mex}\\{0,0\\}=1\\).'
                }
            ]
        },

        // ============================================================
        // SECTION 5: Combining games
        // ============================================================
        {
            id: 'ch15-sec05',
            title: 'Combining games',
            content: `
                <h2>Combining Games</h2>

                <p>The real power of Grundy values emerges when we play <strong>multiple games simultaneously</strong>. On your turn, you pick one of the games and make a move in it. The player who makes the last move across all games wins.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (Sum of Games)</div>
                    <div class="env-body">
                        <p>Given games \\(G_1, G_2, \\ldots, G_k\\), their <strong>sum</strong> \\(G_1 + G_2 + \\cdots + G_k\\) is played as follows:</p>
                        <ul>
                            <li>On your turn, choose exactly one component game \\(G_i\\) and make a move in it.</li>
                            <li>The other games remain unchanged.</li>
                            <li>When all component games have reached terminal positions, the player to move loses.</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem (Grundy's Theorem for Sums)</div>
                    <div class="env-body">
                        <p>The Grundy value of a sum of games equals the <strong>XOR</strong> (nim-sum) of the individual Grundy values:</p>
                        \\[\\mathcal{G}(G_1 + G_2 + \\cdots + G_k) = \\mathcal{G}(G_1) \\oplus \\mathcal{G}(G_2) \\oplus \\cdots \\oplus \\mathcal{G}(G_k)\\]
                        <p>The combined game is a P-position (losing for the next player) if and only if the XOR of all Grundy values is 0.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">The Punchline</div>
                    <div class="env-body">
                        <p>This is exactly the Nim strategy from Chapter 13! Since each component game is equivalent to a Nim pile (Sprague-Grundy theorem), a sum of games is equivalent to a multi-pile Nim game. The winning strategy is to make the XOR equal 0 after your move, just as in Nim.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Mixed Game</div>
                    <div class="env-body">
                        <p>You are playing three games simultaneously:</p>
                        <ul>
                            <li>Game A: Subtraction \\(\\{1,2,3\\}\\) at position 5 (Grundy value = \\(5 \\mod 4 = 1\\))</li>
                            <li>Game B: Subtraction \\(\\{1,3,4\\}\\) at position 7 (Grundy value = 0)</li>
                            <li>Game C: A Nim pile of 3 stones (Grundy value = 3)</li>
                        </ul>
                        <p>Overall: \\(1 \\oplus 0 \\oplus 3 = 1 \\oplus 3 = 2 \\neq 0\\).</p>
                        <p>This is an N-position. You have a winning move! You need to make the XOR equal 0.</p>
                        <p>If you reduce Game C from 3 to 1 (remove 2 stones), then \\(1 \\oplus 0 \\oplus 1 = 0\\). That is the winning move.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="combined-game-solver"></div>

                <div class="env-block remark">
                    <div class="env-title">Beyond Nim</div>
                    <div class="env-body">
                        <p>The Sprague-Grundy framework applies to an enormous family of games: Nim, Wythoff's game, Chomp, Turning Turtles, Green Hackenbush (for impartial positions), and many more. Whenever you encounter a new impartial game, the recipe is the same: compute Grundy values, XOR them for sums, and play the Nim strategy.</p>
                    </div>
                </div>

                <div class="env-block warning">
                    <div class="env-title">Limitation</div>
                    <div class="env-body">
                        <p>The Sprague-Grundy theorem applies only to <strong>impartial</strong> games under <strong>normal play</strong> (last player wins). Partisan games like Chess and Go require different theories (e.g., Conway's surreal numbers). Misere play (last player <em>loses</em>) also requires modifications.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'combined-game-solver',
                    title: 'Combined Game Solver',
                    description: 'Set Grundy values for up to 4 component games and see the XOR analysis. The solver tells you who wins and suggests a winning move.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 340, scale: 30, originX: 50, originY: 300 });
                        var grundyVals = [3, 1, 2, 0];
                        var numGames = 3;

                        VizEngine.createSlider(controls, 'Games', 2, 4, numGames, 1, function(v) {
                            numGames = Math.round(v);
                            draw();
                        });

                        var sliders = [];
                        for (var i = 0; i < 4; i++) {
                            (function(idx) {
                                var sl = VizEngine.createSlider(controls, 'G' + (idx + 1), 0, 7, grundyVals[idx], 1, function(v) {
                                    grundyVals[idx] = Math.round(v);
                                    draw();
                                });
                                sliders.push(sl);
                            })(i);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var gameColors = [viz.colors.blue, viz.colors.orange, viz.colors.teal, viz.colors.purple];

                            // Compute XOR
                            var xorVal = 0;
                            for (var i = 0; i < numGames; i++) {
                                xorVal ^= grundyVals[i];
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Combined Game Analysis', viz.width / 2, 22);

                            // Draw each game as a pile of stones
                            var pileSpacing = viz.width / (numGames + 1);
                            var pileY = 70;
                            var stoneR = 10;

                            for (var g = 0; g < numGames; g++) {
                                var px = pileSpacing * (g + 1);
                                var gv = grundyVals[g];

                                ctx.fillStyle = gameColors[g];
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Game ' + (g + 1), px, pileY - 20);

                                // Draw stones
                                for (var s = 0; s < gv; s++) {
                                    ctx.fillStyle = gameColors[g];
                                    ctx.beginPath();
                                    ctx.arc(px, pileY + s * 22, stoneR, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('G = ' + gv, px, pileY + Math.max(gv, 1) * 22 + 10);
                            }

                            // XOR computation
                            var xorY = 220;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';

                            var parts = [];
                            for (var k = 0; k < numGames; k++) {
                                parts.push('' + grundyVals[k]);
                            }
                            ctx.fillText(parts.join(' XOR ') + ' = ' + xorVal, viz.width / 2, xorY);

                            // Binary breakdown
                            var binY = xorY + 25;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            var binParts = [];
                            for (var b = 0; b < numGames; b++) {
                                var bin = (grundyVals[b] >>> 0).toString(2);
                                while (bin.length < 3) bin = '0' + bin;
                                binParts.push(bin);
                            }
                            var xorBin = (xorVal >>> 0).toString(2);
                            while (xorBin.length < 3) xorBin = '0' + xorBin;
                            ctx.fillText('Binary: ' + binParts.join(' XOR ') + ' = ' + xorBin, viz.width / 2, binY);

                            // Result
                            var resultY = binY + 35;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            if (xorVal === 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('XOR = 0: P-position (next player LOSES)', viz.width / 2, resultY);
                            } else {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('XOR = ' + xorVal + ': N-position (next player WINS)', viz.width / 2, resultY);

                                // Find a winning move
                                var moveY = resultY + 25;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '13px -apple-system,sans-serif';
                                var found = false;
                                for (var w = 0; w < numGames && !found; w++) {
                                    var target = grundyVals[w] ^ xorVal;
                                    if (target < grundyVals[w]) {
                                        ctx.fillText('Winning move: change Game ' + (w + 1) + ' from G=' + grundyVals[w] + ' to G=' + target, viz.width / 2, moveY);
                                        found = true;
                                    }
                                }
                                if (!found) {
                                    ctx.fillText('(Move exists, but requires increasing a Grundy value via non-Nim rules)', viz.width / 2, moveY);
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
                    question: 'You play three simultaneous subtraction games \\(\\{1,2,3\\}\\) with piles of sizes 6, 9, and 11. Who wins, and what is the winning move?',
                    hint: 'In the \\(\\{1,2,3\\}\\) subtraction game, \\(\\mathcal{G}(n) = n \\mod 4\\). Compute the Grundy values and XOR them.',
                    solution: '\\(\\mathcal{G}(6) = 6 \\mod 4 = 2\\), \\(\\mathcal{G}(9) = 9 \\mod 4 = 1\\), \\(\\mathcal{G}(11) = 11 \\mod 4 = 3\\). XOR: \\(2 \\oplus 1 \\oplus 3 = 0\\). This is a P-position, so the <strong>second player wins</strong> with perfect play. The first player has no winning move.'
                },
                {
                    question: 'Prove that in a sum of two identical game positions \\(G + G\\), the second player always wins.',
                    hint: 'What is \\(g \\oplus g\\) for any integer \\(g\\)?',
                    solution: 'For any \\(g\\), \\(g \\oplus g = 0\\). So \\(\\mathcal{G}(G + G) = \\mathcal{G}(G) \\oplus \\mathcal{G}(G) = 0\\), which is a P-position. The second player wins by the <strong>copycat strategy</strong>: whatever the first player does in one copy, the second player mirrors in the other copy.'
                }
            ]
        }
    ]
});
