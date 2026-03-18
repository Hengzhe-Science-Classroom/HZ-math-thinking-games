// === Chapter 13: The Nim Game ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'The Nim Game',
    subtitle: 'Where binary arithmetic meets strategic play',
    sections: [
        // ===== Section 0: Rules of Nim =====
        {
            id: 'ch13-sec00',
            title: 'Rules of Nim',
            content: `
<h2>The Oldest Strategy Game You Have Never Heard Of</h2>

<p>Nim is one of the oldest and most important strategy games in mathematics. Its rules are absurdly simple, yet the strategy behind it reveals a deep connection to binary numbers and computer science.</p>

<div class="env-block definition">
<strong>Rules of Nim</strong><br>
<ol>
<li>Start with several piles of stones (or coins, or matchsticks, or anything).</li>
<li>Two players take turns. On your turn, you must choose <em>one</em> pile and remove <em>at least one</em> stone from it (you may remove as many as you like from that pile, even the entire pile).</li>
<li>The player who takes the <em>last</em> stone wins. (The player who cannot move loses.)</li>
</ol>
</div>

<p>That is it. No hidden information, no dice, no luck. Nim is a game of <strong>pure strategy</strong>. And, remarkably, there is a complete mathematical solution. One of the two players always has a winning strategy, and it depends on a single calculation involving binary numbers.</p>

<div class="env-block example">
<strong>A Simple Example</strong><br>
Suppose there is just 1 pile of 5 stones. If it is your turn, you simply take all 5 stones and win. Easy! But what if there are 2 piles of 3 stones each? Now the game becomes interesting.
</div>

<h3>Nim with Two Piles</h3>

<p>Let us think about the 2-pile case. Suppose the piles have sizes \\(a\\) and \\(b\\).</p>

<ul>
<li>If \\(a = b\\), the <em>second</em> player wins! Whatever the first player does to one pile, the second player copies on the other pile. This "mirror strategy" eventually leaves both piles empty after the second player's move.</li>
<li>If \\(a \\neq b\\), the <em>first</em> player wins by making the piles equal (remove stones from the larger pile until it matches the smaller one), then using the mirror strategy.</li>
</ul>

<div class="env-block intuition">
<strong>Symmetry is power</strong><br>
In two-pile Nim, the winning strategy is to create a symmetric position and then maintain it. This is your first taste of a symmetry strategy, a concept we will explore more in Chapter 14.
</div>

<p>But what about three or more piles? The mirror strategy does not directly apply. We need something deeper. That "something" turns out to be XOR, the exclusive-or operation from binary arithmetic.</p>

<div class="viz-placeholder" data-viz="ch13-intro-game"></div>
`,
            visualizations: [
                {
                    id: 'ch13-intro-game',
                    title: 'Two-Pile Nim',
                    description: 'Try the two-pile version first. Click stones to remove them. Can you figure out the winning strategy?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var piles = [4, 5];
                        var originalPiles = [4, 5];
                        var turn = 0; // 0 = player, 1 = computer
                        var selectedPile = -1;
                        var selectedCount = 0;
                        var message = 'Your turn! Click stones in a pile to select, then click "Remove".';
                        var gameOver = false;
                        var stoneRadius = 14;
                        var stoneSpacing = 36;

                        function getStonePositions() {
                            var positions = [];
                            for (var p = 0; p < piles.length; p++) {
                                var pileX = w / (piles.length + 1) * (p + 1);
                                var arr = [];
                                for (var s = 0; s < piles[p]; s++) {
                                    var row = Math.floor(s / 3);
                                    var col = s % 3;
                                    var sx = pileX - stoneSpacing + col * stoneSpacing;
                                    var sy = h - 100 - row * stoneSpacing;
                                    arr.push({ x: sx, y: sy, pile: p, idx: s });
                                }
                                positions.push(arr);
                            }
                            return positions;
                        }

                        function resetGame() {
                            piles = originalPiles.slice();
                            turn = 0;
                            selectedPile = -1;
                            selectedCount = 0;
                            message = 'Your turn! Click stones in a pile to select, then click "Remove".';
                            gameOver = false;
                        }

                        VizEngine.createButton(controls, 'Remove Selected', function() {
                            if (gameOver || turn !== 0 || selectedPile < 0 || selectedCount <= 0) return;
                            piles[selectedPile] -= selectedCount;
                            selectedPile = -1;
                            selectedCount = 0;
                            var total = piles[0] + piles[1];
                            if (total === 0) {
                                message = 'You took the last stone. You win!';
                                gameOver = true;
                                return;
                            }
                            turn = 1;
                            message = 'Computer is thinking...';
                            setTimeout(computerMove, 600);
                        });

                        VizEngine.createButton(controls, 'New Game', function() {
                            originalPiles = [Math.floor(Math.random() * 5) + 2, Math.floor(Math.random() * 5) + 2];
                            resetGame();
                        });

                        function computerMove() {
                            if (gameOver) return;
                            // Optimal: make piles equal
                            var move = null;
                            if (piles[0] > piles[1]) {
                                move = { pile: 0, take: piles[0] - piles[1] };
                            } else if (piles[1] > piles[0]) {
                                move = { pile: 1, take: piles[1] - piles[0] };
                            } else {
                                // Equal piles: losing position, take 1 from random pile
                                var p = piles[0] > 0 ? 0 : 1;
                                if (piles[p] === 0) p = 1 - p;
                                move = { pile: p, take: 1 };
                            }
                            piles[move.pile] -= move.take;
                            var total = piles[0] + piles[1];
                            if (total === 0) {
                                message = 'Computer took the last stone. Computer wins!';
                                gameOver = true;
                            } else {
                                message = 'Computer took ' + move.take + ' from pile ' + (move.pile + 1) + '. Your turn!';
                                turn = 0;
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver || turn !== 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var positions = getStonePositions();
                            for (var p = 0; p < positions.length; p++) {
                                for (var s = positions[p].length - 1; s >= 0; s--) {
                                    var st = positions[p][s];
                                    if (Math.sqrt((mx - st.x) * (mx - st.x) + (my - st.y) * (my - st.y)) < stoneRadius + 4) {
                                        if (selectedPile >= 0 && selectedPile !== p) {
                                            selectedPile = p;
                                            selectedCount = piles[p] - s;
                                        } else {
                                            selectedPile = p;
                                            selectedCount = piles[p] - s;
                                        }
                                        return;
                                    }
                                }
                            }
                        });

                        viz.animate(function(t) {
                            viz.clear();

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Two-Pile Nim', w / 2, 25);

                            // Message
                            ctx.fillStyle = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(message, w / 2, 50);

                            // Draw piles
                            var positions = getStonePositions();
                            for (var p = 0; p < positions.length; p++) {
                                // Pile label
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                var pileX = w / (piles.length + 1) * (p + 1);
                                ctx.fillText('Pile ' + (p + 1) + ' (' + piles[p] + ')', pileX, h - 40);

                                for (var s = 0; s < positions[p].length; s++) {
                                    var st = positions[p][s];
                                    var isSelected = (selectedPile === p && s >= piles[p] - selectedCount);
                                    var hue = p === 0 ? 200 : 35;
                                    ctx.fillStyle = isSelected ? '#f85149' : VizEngine.hsl(hue, 70, 55);
                                    ctx.beginPath();
                                    ctx.arc(st.x, st.y, stoneRadius, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Shine
                                    ctx.fillStyle = 'rgba(255,255,255,0.25)';
                                    ctx.beginPath();
                                    ctx.arc(st.x - 4, st.y - 4, stoneRadius * 0.3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Selection info
                            if (selectedPile >= 0 && selectedCount > 0 && !gameOver) {
                                ctx.fillStyle = '#f0883e';
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Selected: ' + selectedCount + ' from pile ' + (selectedPile + 1), w / 2, 75);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In two-pile Nim with piles of sizes 7 and 3, who wins with optimal play, and what is the first move?',
                    hint: 'The piles are unequal. The first player can make them equal.',
                    solution: 'The first player wins by taking 4 from the pile of 7, leaving piles of (3, 3). Now the position is symmetric, and the first player uses the mirror strategy: whatever the opponent does to one pile, do the same to the other.'
                },
                {
                    question: 'In two-pile Nim with piles of sizes 5 and 5, who wins with optimal play?',
                    hint: 'The piles are already equal.',
                    solution: 'The <em>second</em> player wins. The piles are already equal, so the second player uses the mirror strategy. Whatever the first player takes from one pile, the second player takes the same amount from the other pile. The second player always makes the last move.'
                }
            ]
        },

        // ===== Section 1: Playing Against the Computer =====
        {
            id: 'ch13-sec01',
            title: 'Playing Against the Computer',
            content: `
<h2>Can You Beat the Machine?</h2>

<p>Below is a full Nim game with multiple piles. The computer knows the perfect strategy. Your mission: figure out the pattern and try to beat it!</p>

<div class="viz-placeholder" data-viz="ch13-full-game"></div>

<p>After playing several rounds, you might notice something:</p>

<ul>
<li>Sometimes, no matter what you do, the computer wins. These are <strong>losing positions</strong> for whoever moves first.</li>
<li>Other times, there is exactly one right move that puts the computer into a losing position.</li>
</ul>

<div class="env-block definition">
<strong>Positions in Nim</strong><br>
<ul>
<li>A <strong>P-position</strong> (Previous player wins) is one where the player who just moved is winning, i.e., the player whose turn it is will lose with optimal play.</li>
<li>An <strong>N-position</strong> (Next player wins) is one where the player whose turn it is can win with optimal play.</li>
</ul>
</div>

<p>In normal-play Nim, the terminal position (all piles empty) is a P-position: the player who just moved (took the last stone) wins.</p>

<p>The key question is: given a position \\((a_1, a_2, \\ldots, a_k)\\) listing the pile sizes, how can you tell whether it is a P-position or an N-position? The answer involves binary numbers and a beautiful operation called XOR.</p>
`,
            visualizations: [
                {
                    id: 'ch13-full-game',
                    title: 'Nim: Human vs Computer',
                    description: 'Play multi-pile Nim against a computer that uses the optimal XOR strategy. Click stones in one pile to select how many to remove, then click "Remove".',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var defaultPiles = [3, 5, 7];
                        var piles = defaultPiles.slice();
                        var turn = 0; // 0 = human, 1 = computer
                        var selectedPile = -1;
                        var selectedCount = 0;
                        var message = 'Your turn! Click stones to select, then "Remove".';
                        var gameOver = false;
                        var wins = { human: 0, computer: 0 };
                        var stoneR = 12;

                        function nimSum(arr) {
                            var x = 0;
                            for (var i = 0; i < arr.length; i++) x ^= arr[i];
                            return x;
                        }

                        function totalStones() {
                            var s = 0;
                            for (var i = 0; i < piles.length; i++) s += piles[i];
                            return s;
                        }

                        function getStonePos(pileIdx, stoneIdx) {
                            var numPiles = piles.length;
                            var pileW = w / (numPiles + 1);
                            var cx = pileW * (pileIdx + 1);
                            var cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(piles[pileIdx]))));
                            var col = stoneIdx % cols;
                            var row = Math.floor(stoneIdx / cols);
                            var sx = cx - (cols - 1) * (stoneR * 2.5) / 2 + col * stoneR * 2.5;
                            var sy = h - 90 - row * (stoneR * 2.5);
                            return { x: sx, y: sy };
                        }

                        function resetGame() {
                            var configs = [[3, 5, 7], [2, 4, 6], [1, 3, 5, 7], [3, 4, 5], [2, 3, 7]];
                            defaultPiles = configs[Math.floor(Math.random() * configs.length)];
                            piles = defaultPiles.slice();
                            turn = 0;
                            selectedPile = -1;
                            selectedCount = 0;
                            gameOver = false;
                            message = 'New game! Piles: (' + piles.join(', ') + '). Your turn!';
                        }

                        VizEngine.createButton(controls, 'Remove', function() {
                            if (gameOver || turn !== 0 || selectedPile < 0 || selectedCount <= 0) return;
                            piles[selectedPile] -= selectedCount;
                            if (piles[selectedPile] < 0) piles[selectedPile] = 0;
                            selectedPile = -1;
                            selectedCount = 0;
                            if (totalStones() === 0) {
                                message = 'You took the last stone! You win!';
                                gameOver = true;
                                wins.human++;
                                return;
                            }
                            turn = 1;
                            message = 'Computer thinking...';
                            setTimeout(computerMove, 500);
                        });

                        VizEngine.createButton(controls, 'New Game', resetGame);

                        function computerMove() {
                            if (gameOver) return;
                            var ns = nimSum(piles);
                            var moved = false;
                            if (ns !== 0) {
                                // Find optimal move
                                for (var i = 0; i < piles.length; i++) {
                                    var target = piles[i] ^ ns;
                                    if (target < piles[i]) {
                                        var took = piles[i] - target;
                                        piles[i] = target;
                                        message = 'Computer took ' + took + ' from pile ' + (i + 1) + '.';
                                        moved = true;
                                        break;
                                    }
                                }
                            }
                            if (!moved) {
                                // Losing position: take 1 from first nonempty
                                for (var i = 0; i < piles.length; i++) {
                                    if (piles[i] > 0) {
                                        piles[i]--;
                                        message = 'Computer took 1 from pile ' + (i + 1) + '.';
                                        break;
                                    }
                                }
                            }
                            if (totalStones() === 0) {
                                message = 'Computer took the last stone. Computer wins!';
                                gameOver = true;
                                wins.computer++;
                            } else {
                                message += ' Your turn!';
                                turn = 0;
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver || turn !== 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            for (var p = 0; p < piles.length; p++) {
                                for (var s = piles[p] - 1; s >= 0; s--) {
                                    var pos = getStonePos(p, s);
                                    if (Math.sqrt((mx - pos.x) * (mx - pos.x) + (my - pos.y) * (my - pos.y)) < stoneR + 5) {
                                        selectedPile = p;
                                        selectedCount = piles[p] - s;
                                        return;
                                    }
                                }
                            }
                        });

                        viz.animate(function(t) {
                            viz.clear();

                            // Title and score
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Nim: You vs Computer', w / 2, 22);

                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.fillText('Score \u2014 You: ' + wins.human + '  Computer: ' + wins.computer, w / 2, 42);

                            // Message
                            var msgColor = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                            ctx.fillStyle = msgColor;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(message, w / 2, 62);

                            // Nim-sum display
                            var ns = nimSum(piles);
                            ctx.fillStyle = ns === 0 ? '#3fb950' : '#f0883e';
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('Nim-sum (XOR): ' + ns + (ns === 0 ? ' (P-position)' : ' (N-position)'), w - 20, 22);

                            // Draw piles
                            var pileColors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#f778ba'];
                            for (var p = 0; p < piles.length; p++) {
                                var pileW = w / (piles.length + 1);
                                var cx = pileW * (p + 1);

                                // Pile label
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Pile ' + (p + 1) + ': ' + piles[p], cx, h - 55);

                                // Binary
                                ctx.fillStyle = '#4a4a7a';
                                ctx.font = '11px -apple-system, sans-serif';
                                var bin = piles[p].toString(2);
                                while (bin.length < 4) bin = '0' + bin;
                                ctx.fillText('(' + bin + ')', cx, h - 40);

                                for (var s = 0; s < piles[p]; s++) {
                                    var pos = getStonePos(p, s);
                                    var isSelected = (selectedPile === p && s >= piles[p] - selectedCount);
                                    ctx.fillStyle = isSelected ? '#f85149' : pileColors[p % pileColors.length];
                                    ctx.beginPath();
                                    ctx.arc(pos.x, pos.y, stoneR, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Shine
                                    ctx.fillStyle = 'rgba(255,255,255,0.2)';
                                    ctx.beginPath();
                                    ctx.arc(pos.x - 3, pos.y - 3, stoneR * 0.3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Selection info
                            if (selectedPile >= 0 && selectedCount > 0 && !gameOver) {
                                ctx.fillStyle = '#f0883e';
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Taking ' + selectedCount + ' from pile ' + (selectedPile + 1), w / 2, h - 15);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Play several games of Nim against the computer. Can you ever win when the starting Nim-sum (shown in the top-right corner) is 0? Why or why not?',
                    hint: 'When the Nim-sum is 0, it is a P-position. What does that mean for the player about to move?',
                    solution: 'When the Nim-sum is 0, you are in a P-position (losing for the player to move). With optimal play, the computer will win every time. The only way to win from a P-position is if your opponent makes a mistake. Since the computer plays optimally, you cannot win from a Nim-sum of 0.'
                },
                {
                    question: 'Start a game with piles (3, 5, 7). Is this a P-position or an N-position? If N, what is the winning first move?',
                    hint: 'Compute \\(3 \\oplus 5 \\oplus 7\\) in binary: \\(011 \\oplus 101 \\oplus 111\\).',
                    solution: '\\(3 \\oplus 5 = 6\\), then \\(6 \\oplus 7 = 1 \\neq 0\\). So this is an N-position. To win, we need to make the Nim-sum 0. Trying pile 3: \\(3 \\oplus 1 = 2\\), so leave pile at \\(3 - 2 = 1\\)? Check: \\(1 \\oplus 5 \\oplus 7 = 3 \\neq 0\\). Try pile 2: \\(5 \\oplus 1 = 4\\), leave at 4. Check: \\(3 \\oplus 4 \\oplus 7 = 0\\). Yes! Take 1 from the pile of 5, leaving (3, 4, 7).'
                }
            ]
        },

        // ===== Section 2: The Binary Secret =====
        {
            id: 'ch13-sec02',
            title: 'The Binary Secret',
            content: `
<h2>XOR: The Heart of Nim Strategy</h2>

<p>The winning strategy for Nim was discovered by Charles L. Bouton at Harvard in 1901. It is based on a single operation: the <strong>XOR</strong> (exclusive or) of the pile sizes.</p>

<div class="env-block definition">
<strong>XOR (Exclusive Or)</strong><br>
Write each pile size in binary. For each bit position, the XOR is:
<ul>
<li>0 if the number of 1s in that position is even</li>
<li>1 if the number of 1s in that position is odd</li>
</ul>
The <strong>Nim-sum</strong> of a position \\((a_1, a_2, \\ldots, a_k)\\) is \\(a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_k\\).
</div>

<div class="env-block example">
<strong>Computing the Nim-sum</strong><br>
Piles: (3, 5, 6).<br>
In binary: \\(3 = 011\\), \\(5 = 101\\), \\(6 = 110\\).<br>
XOR column by column:<br>
&emsp; ones place: \\(1 \\oplus 1 \\oplus 0 = 0\\)<br>
&emsp; twos place: \\(1 \\oplus 0 \\oplus 1 = 0\\)<br>
&emsp; fours place: \\(0 \\oplus 1 \\oplus 1 = 0\\)<br>
Nim-sum: \\(000 = 0\\). This is a P-position (losing for the player to move).
</div>

<div class="viz-placeholder" data-viz="ch13-xor-calc"></div>

<h3>Bouton's Theorem</h3>

<div class="env-block theorem">
<strong>Bouton's Theorem (1901)</strong><br>
A Nim position is a P-position (losing for the player to move) if and only if the Nim-sum of all pile sizes is 0.
</div>

<p><strong>Why does this work?</strong> The proof has two parts:</p>

<p><em>Part 1: From a zero Nim-sum, every move creates a nonzero Nim-sum.</em> If you change one pile, you change at least one bit, so the XOR cannot stay at 0.</p>

<p><em>Part 2: From a nonzero Nim-sum, there exists a move that makes it zero.</em> Look at the highest bit that is 1 in the Nim-sum. At least one pile has a 1 in that position. XOR that pile's value with the Nim-sum; the result is smaller, so you can reduce that pile to that value, making the new Nim-sum 0.</p>

<div class="env-block remark">
<strong>The endgame check</strong><br>
The all-zero position \\((0, 0, \\ldots, 0)\\) has Nim-sum 0 and is indeed a P-position (the player who just moved won). So the base case of the analysis is consistent.
</div>

<h3>Using the Strategy in Practice</h3>

<ol>
<li>Compute the Nim-sum of all pile sizes.</li>
<li>If it is 0, you are in trouble (any move you make gives your opponent a winning position).</li>
<li>If it is nonzero, find a pile whose size, XORed with the Nim-sum, is smaller than the pile. Reduce that pile to the XORed value.</li>
</ol>
`,
            visualizations: [
                {
                    id: 'ch13-xor-calc',
                    title: 'XOR Calculator',
                    description: 'Enter pile sizes and see the binary XOR computed step by step. The Nim-sum tells you who wins!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var piles = [3, 5, 7];
                        var sliders = [];

                        for (var i = 0; i < 3; i++) {
                            (function(idx) {
                                sliders.push(VizEngine.createSlider(controls, 'Pile ' + (idx + 1), 0, 15, piles[idx], 1, function(v) {
                                    piles[idx] = Math.round(v);
                                }));
                            })(i);
                        }

                        var pileColors = ['#58a6ff', '#3fb9a0', '#f0883e'];

                        viz.animate(function(t) {
                            viz.clear();

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Binary XOR Calculator', w / 2, 25);

                            var bitWidth = 4;
                            var cellW = 50;
                            var cellH = 35;
                            var startX = w / 2 - (bitWidth * cellW) / 2 - 80;
                            var startY = 60;

                            // Header row
                            ctx.fillStyle = '#8b949e';
                            ctx.font = 'bold 12px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            var bitLabels = ['8s', '4s', '2s', '1s'];
                            for (var b = 0; b < bitWidth; b++) {
                                ctx.fillText(bitLabels[b], startX + 100 + b * cellW + cellW / 2, startY);
                            }
                            ctx.textAlign = 'right';
                            ctx.fillText('Decimal', startX + 90, startY);
                            startY += 20;

                            // Each pile row
                            for (var p = 0; p < 3; p++) {
                                var val = piles[p];
                                var bin = val.toString(2);
                                while (bin.length < bitWidth) bin = '0' + bin;

                                ctx.fillStyle = pileColors[p];
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Pile ' + (p + 1) + ':', startX, startY + p * cellH + cellH / 2 + 4);

                                ctx.textAlign = 'right';
                                ctx.fillText(val.toString(), startX + 90, startY + p * cellH + cellH / 2 + 4);

                                ctx.textAlign = 'center';
                                for (var b = 0; b < bitWidth; b++) {
                                    var bit = bin[b];
                                    var cx = startX + 100 + b * cellW + cellW / 2;
                                    var cy = startY + p * cellH + cellH / 2;

                                    // Cell background
                                    ctx.fillStyle = bit === '1' ? pileColors[p] + '33' : '#0c0c2044';
                                    ctx.fillRect(cx - cellW / 2 + 2, cy - cellH / 2 + 2, cellW - 4, cellH - 4);

                                    ctx.fillStyle = bit === '1' ? pileColors[p] : '#4a4a7a';
                                    ctx.font = 'bold 18px -apple-system, sans-serif';
                                    ctx.fillText(bit, cx, cy + 6);
                                }
                            }

                            // Separator line
                            var sepY = startY + 3 * cellH + 5;
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(startX + 95, sepY);
                            ctx.lineTo(startX + 100 + bitWidth * cellW, sepY);
                            ctx.stroke();

                            // XOR label
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('XOR', startX + 55, sepY + 5);

                            // Nim-sum result
                            var nimsum = piles[0] ^ piles[1] ^ piles[2];
                            var nimBin = nimsum.toString(2);
                            while (nimBin.length < bitWidth) nimBin = '0' + nimBin;

                            var resultY = sepY + 15;
                            var resultColor = nimsum === 0 ? '#3fb950' : '#f85149';

                            ctx.fillStyle = resultColor;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Nim-sum:', startX, resultY + cellH / 2 + 4);
                            ctx.textAlign = 'right';
                            ctx.fillText(nimsum.toString(), startX + 90, resultY + cellH / 2 + 4);

                            ctx.textAlign = 'center';
                            for (var b = 0; b < bitWidth; b++) {
                                var bit = nimBin[b];
                                var cx = startX + 100 + b * cellW + cellW / 2;
                                var cy = resultY + cellH / 2;

                                ctx.fillStyle = bit === '1' ? resultColor + '33' : '#0c0c2044';
                                ctx.fillRect(cx - cellW / 2 + 2, cy - cellH / 2 + 2, cellW - 4, cellH - 4);

                                ctx.fillStyle = bit === '1' ? resultColor : '#4a4a7a';
                                ctx.font = 'bold 18px -apple-system, sans-serif';
                                ctx.fillText(bit, cx, cy + 6);
                            }

                            // Verdict
                            var verdictY = resultY + cellH + 25;
                            ctx.fillStyle = resultColor;
                            ctx.font = 'bold 18px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            if (nimsum === 0) {
                                ctx.fillText('Nim-sum = 0  \u2192  P-position (current player LOSES)', w / 2, verdictY);
                            } else {
                                ctx.fillText('Nim-sum = ' + nimsum + '  \u2192  N-position (current player WINS)', w / 2, verdictY);
                            }

                            // Show winning move if N-position
                            if (nimsum !== 0) {
                                verdictY += 25;
                                ctx.fillStyle = '#f0883e';
                                ctx.font = '13px -apple-system, sans-serif';
                                for (var i = 0; i < 3; i++) {
                                    var target = piles[i] ^ nimsum;
                                    if (target < piles[i]) {
                                        ctx.fillText('Winning move: take ' + (piles[i] - target) + ' from pile ' + (i + 1) + ' (reduce ' + piles[i] + ' to ' + target + ')', w / 2, verdictY);
                                        break;
                                    }
                                }
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Nim-sum of (4, 7, 11). Is it a P-position or N-position?',
                    hint: 'Convert to binary: \\(4 = 0100\\), \\(7 = 0111\\), \\(11 = 1011\\). XOR bit by bit.',
                    solution: '\\(4 \\oplus 7 = 3\\), then \\(3 \\oplus 11 = 8\\). Since \\(8 \\neq 0\\), this is an N-position. The current player can win. To find the move: \\(11 \\oplus 8 = 3 \\lt 11\\), so take 8 from the pile of 11, leaving (4, 7, 3). Check: \\(4 \\oplus 7 \\oplus 3 = 0\\). The opponent is now in a P-position (losing).'
                },
                {
                    question: 'Prove that XOR has the property \\(a \\oplus a = 0\\) for any non-negative integer \\(a\\). Use this to explain the two-pile Nim result from Section 0.',
                    hint: 'In binary, each bit of \\(a\\) XORed with itself gives 0.',
                    solution: 'Each bit position of \\(a\\) is either 0 or 1. XORing a bit with itself: \\(0 \\oplus 0 = 0\\) and \\(1 \\oplus 1 = 0\\). So \\(a \\oplus a = 0\\). For two-pile Nim with piles \\((a, b)\\): the Nim-sum is \\(a \\oplus b\\). This is 0 iff \\(a = b\\). So equal piles form a P-position (second player wins), and unequal piles form an N-position (first player wins by equalizing). This matches our symmetry argument from Section 0.'
                }
            ]
        },

        // ===== Section 3: Multi-Pile Nim =====
        {
            id: 'ch13-sec03',
            title: 'Multi-Pile Nim',
            content: `
<h2>Scaling Up</h2>

<p>Bouton's theorem works for any number of piles. Let us practice the strategy on some larger examples.</p>

<div class="env-block example">
<strong>Four-Pile Nim: (2, 5, 8, 11)</strong><br>
Binary: \\(0010, 0101, 1000, 1011\\).<br>
XOR: \\(2 \\oplus 5 = 7\\), \\(7 \\oplus 8 = 15\\), \\(15 \\oplus 11 = 4\\).<br>
Nim-sum \\(= 4 \\neq 0\\), so this is an N-position.<br>
Winning move: \\(8 \\oplus 4 = 12 \\gt 8\\) (no good), \\(11 \\oplus 4 = 15 \\gt 11\\) (no good), \\(5 \\oplus 4 = 1 \\lt 5\\) (yes!). Take 4 from the pile of 5, leaving (2, 1, 8, 11). Verify: \\(2 \\oplus 1 \\oplus 8 \\oplus 11 = 0\\).
</div>

<h3>Why XOR?</h3>

<p>You might wonder: why does XOR, of all operations, govern Nim? The deep reason is that XOR captures the structure of "independent choices." Each bit position in the binary representation behaves like an independent sub-game. The XOR combines these independent sub-games, and a combined position is losing if and only if each sub-component is "balanced." This idea is generalized by the <strong>Sprague-Grundy theorem</strong>, which we will study in Chapter 15.</p>

<h3>Nim as a Foundation</h3>

<p>Nim is not just a fun game. It is the <em>foundation</em> of combinatorial game theory. The Sprague-Grundy theorem says that every impartial game (a game where both players have the same moves available) is equivalent to a single Nim pile. This means solving any impartial game reduces to computing its "Grundy value," which is its equivalent Nim pile size.</p>

<div class="env-block remark">
<strong>Impartial vs. Partisan</strong><br>
In an <strong>impartial</strong> game, both players have the same moves (like Nim). In a <strong>partisan</strong> game, different players have different moves (like chess). The Sprague-Grundy theory applies to impartial games. Partisan games require the deeper theory of John Conway's surreal numbers.
</div>

<h3>Practice: Finding Winning Moves</h3>

<p>Here is a systematic method for finding the winning move:</p>

<ol>
<li>Compute \\(S = a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_k\\).</li>
<li>If \\(S = 0\\), no winning move exists (you are in a P-position).</li>
<li>If \\(S \\neq 0\\), for each pile \\(a_i\\), compute \\(a_i \\oplus S\\). If \\(a_i \\oplus S \\lt a_i\\), then reducing pile \\(i\\) to \\(a_i \\oplus S\\) is a winning move.</li>
</ol>

<div class="env-block intuition">
<strong>Why does \\(a_i \\oplus S \\lt a_i\\) guarantee a valid move?</strong><br>
The highest bit of \\(S\\) must appear as a 1 in at least one \\(a_i\\) (since XOR is 1 in that position). XORing \\(a_i\\) with \\(S\\) flips that bit from 1 to 0, which necessarily makes the value smaller. So a valid pile always exists.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Find the Nim-sum of (1, 2, 3, 4, 5). Is there a winning move? If so, find it.',
                    hint: 'Compute step by step: \\(1 \\oplus 2 = 3\\), \\(3 \\oplus 3 = 0\\), \\(0 \\oplus 4 = 4\\), \\(4 \\oplus 5 = ?\\)',
                    solution: '\\(1 \\oplus 2 \\oplus 3 \\oplus 4 \\oplus 5 = 1\\). This is an N-position. To find a winning move: \\(1 \\oplus 1 = 0 \\lt 1\\). So take 1 from the pile of 1, removing it entirely. The remaining piles (2, 3, 4, 5) have Nim-sum \\(2 \\oplus 3 \\oplus 4 \\oplus 5 = 0\\), a P-position for your opponent.'
                },
                {
                    question: 'Suppose you are playing Nim with piles (8, 8, 8). What is the Nim-sum? Who wins?',
                    hint: '\\(8 \\oplus 8 = 0\\). What is \\(0 \\oplus 8\\)?',
                    solution: '\\(8 \\oplus 8 \\oplus 8 = (8 \\oplus 8) \\oplus 8 = 0 \\oplus 8 = 8 \\neq 0\\). This is an N-position; the first player wins. Despite the symmetry of three equal piles, the position is winning because three identical values XOR to a nonzero result (unlike two identical values, which XOR to 0). A winning move: reduce one pile to \\(8 \\oplus 8 = 0\\), leaving (0, 8, 8), which has Nim-sum 0.'
                },
                {
                    question: 'Why are positions with an even number of equal-size piles always P-positions?',
                    hint: 'What is \\(a \\oplus a\\)?',
                    solution: 'If piles can be paired into equal-size pairs, the XOR of each pair is 0. The overall Nim-sum is \\(0 \\oplus 0 \\oplus \\cdots = 0\\), a P-position. For example, (3, 3, 5, 5) has Nim-sum \\((3 \\oplus 3) \\oplus (5 \\oplus 5) = 0 \\oplus 0 = 0\\).'
                }
            ]
        },

        // ===== Section 4: Variations (Misere Nim) =====
        {
            id: 'ch13-sec04',
            title: 'Variations (Mis\u00E8re Nim)',
            content: `
<h2>What If Taking the Last Stone Loses?</h2>

<p>In standard ("normal play") Nim, you <em>want</em> to take the last stone. But there is a famous variation where the rule is reversed:</p>

<div class="env-block definition">
<strong>Mis\u00E8re Nim</strong><br>
Same rules as Nim, but the player who takes the <em>last</em> stone <strong>loses</strong>.
</div>

<p>You might expect the strategy to be completely different. Surprisingly, it is almost the same!</p>

<div class="env-block theorem">
<strong>Mis\u00E8re Nim Strategy</strong><br>
Play exactly the same XOR strategy as normal Nim, with one exception at the endgame: when you would normally leave piles with Nim-sum 0, instead aim for an <strong>odd</strong> number of piles of size 1 (and no piles of size \\(\\geq 2\\)).
</div>

<p>More precisely, a position in Mis\u00E8re Nim is a losing position (for the player to move) if and only if:</p>

<ul>
<li>Every pile has size \\(\\leq 1\\), and the number of nonempty piles is <strong>even</strong>, OR</li>
<li>At least one pile has size \\(\\geq 2\\), and the Nim-sum is 0.</li>
</ul>

<div class="env-block example">
<strong>Mis\u00E8re Nim: (1, 1, 1)</strong><br>
All piles have size \\(\\leq 1\\), and there are 3 (odd) nonempty piles. The player to move takes one, leaving (1, 1). The opponent takes one, leaving (1). Now you must take the last stone and lose. Wait, that means (1, 1, 1) is actually an <strong>N-position</strong> in Mis\u00E8re Nim, because the player to move wants to leave an even number of 1s. Indeed, take from any pile, leaving (1, 1). Opponent takes one, leaving (1). You... lose? No! The opponent took the last-to-second stone, leaving you with the last stone, so you lose. Hmm.
<br><br>
Let us re-examine: from (1, 1, 1), you take 1, leaving (1, 1). Opponent takes 1, leaving (1). You must take the last stone. You lose. So (1, 1, 1) is a <em>P-position</em> in Mis\u00E8re Nim (an odd number of 1-piles is losing for the mover since you will be forced to take the last one). Correct: 3 is odd, so the player to move loses.
</div>

<h3>The Fascinating Near-Equivalence</h3>

<p>The remarkable fact is that for most of the game, the optimal strategy in Mis\u00E8re Nim is <em>identical</em> to normal Nim. You use XOR, maintain a Nim-sum of 0 for your opponent, and play normally. The only difference comes in the very last moves, when all piles have been reduced to size 0 or 1. At that point, you switch to the "leave an odd number of 1-piles" rule.</p>

<div class="env-block remark">
<strong>Why so similar?</strong><br>
As long as some pile has \\(\\geq 2\\) stones, the game is strategically identical: every move that maintains Nim-sum 0 also works in Mis\u00E8re Nim (because you still have flexibility in how to distribute the endgame). The twist only appears when you are forced into the final phase with all-singleton piles.
</div>

<h3>Other Nim Variations</h3>

<p>There are many other fascinating Nim-like games:</p>

<ul>
<li><strong>Wythoff's Nim:</strong> Two piles, but you can either take from one pile (as in Nim) or take the <em>same amount</em> from both piles. The winning strategy involves the golden ratio!</li>
<li><strong>Fibonacci Nim:</strong> One pile. The first player takes any number (but not all). After that, you can take at most twice what your opponent just took. The strategy involves Fibonacci numbers.</li>
<li><strong>Turning Turtles:</strong> Coins in a row; flip a heads to tails and optionally flip one earlier coin. Equivalent to Nim in disguise.</li>
</ul>

<div class="env-block intuition">
<strong>Games in disguise</strong><br>
Many puzzles and games that seem unrelated to Nim turn out to be Nim in disguise. Once you learn to compute Nim-values, you can solve a huge family of games. This is the power of the Sprague-Grundy theorem (Chapter 15).
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'In Mis\u00E8re Nim with piles (2, 3), who wins? What is the winning strategy?',
                    hint: 'The Nim-sum is \\(2 \\oplus 3 = 1 \\neq 0\\), and there is a pile with \\(\\geq 2\\) stones. So the analysis is the same as normal Nim until the endgame.',
                    solution: 'The first player wins. Nim-sum \\(= 1 \\neq 0\\), so this is an N-position (same as normal Nim since piles \\(\\geq 2\\) exist). Winning move: take 1 from the pile of 2, leaving (1, 3). Wait, that gives Nim-sum \\(= 2\\). Better: take 2 from the pile of 3, leaving (2, 1). Nim-sum \\(= 3\\). Hmm. Take 3 from the pile of 3, leaving (2, 0). Nim-sum \\(= 2\\). Actually, the key insight for Mis\u00E8re: take 2 from the pile of 3, leaving (2, 1). Now when opponent takes from the pile of 2, you can adjust the last pile to leave an odd number of 1s. The simplest winning move: take all from the pile of 3, leaving (2). Opponent must take from the pile of 2. If opponent takes 1, leaving (1), you must take it and lose. So opponent takes both from the pile of 2 and wins? No: let us reconsider. Take 1 from pile of 3, leaving (2, 2). Nim-sum = 0, piles \\(\\geq 2\\) exist, so opponent is in a losing position (Mis\u00E8re). Whatever they take from one pile, you mirror on the other, eventually forcing them to take the last stone.'
                },
                {
                    question: 'Explain why normal Nim and Mis\u00E8re Nim have the same P-positions when at least one pile has \\(\\geq 2\\) stones, but differ when all piles have size \\(\\leq 1\\).',
                    hint: 'When all piles are 0 or 1, the game is just "take turns removing a pile of 1." Who takes the last one depends on parity.',
                    solution: 'When at least one pile has \\(\\geq 2\\) stones, a player can always choose to leave a pile at 1 or 0, giving them control over the endgame. So the mid-game strategy (maintain Nim-sum 0) works the same way. The difference appears only in the endgame: when all piles are 0 or 1, the game reduces to "there are \\(m\\) stones left, players alternate taking one." In normal Nim, taking the last is good, so even \\(m\\) is losing (for the mover). In Mis\u00E8re Nim, taking the last is bad, so odd \\(m\\) is losing (for the mover). This is the only difference.'
                }
            ]
        }
    ]
});
})();
