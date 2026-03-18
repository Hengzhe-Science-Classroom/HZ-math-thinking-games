window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'Probabilistic Thinking',
    subtitle: 'When certainty runs out, probability takes over',
    sections: [
        // ============================================================
        // SECTION 1: Chance and randomness
        // ============================================================
        {
            id: 'ch16-sec01',
            title: 'Chance and randomness',
            content: `
                <h2>Chance and Randomness</h2>

                <div class="env-block intuition">
                    <div class="env-title">From Strategy to Chance</div>
                    <div class="env-body">
                        <p>In previous chapters, we studied games where perfect play leads to certain victory or certain defeat. But many real-world situations involve <strong>uncertainty</strong>: Will it rain tomorrow? Will the coin land heads? Will your opponent roll a six? Probability is the mathematical language for reasoning about the uncertain.</p>
                    </div>
                </div>

                <p>When we flip a coin, we cannot predict the outcome of any single flip. But after 1000 flips, we expect roughly 500 heads. This pattern, order emerging from randomness, is the central miracle of probability theory.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (Experiment, Outcome, Event)</div>
                    <div class="env-body">
                        <p>A <strong>random experiment</strong> is a process whose result is uncertain. Each possible result is called an <strong>outcome</strong>. The set of all outcomes is the <strong>sample space</strong> \\(\\Omega\\). An <strong>event</strong> is any subset \\(A \\subseteq \\Omega\\).</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Rolling a Die</div>
                    <div class="env-body">
                        <p>Experiment: roll a standard six-sided die.</p>
                        <p>Sample space: \\(\\Omega = \\{1, 2, 3, 4, 5, 6\\}\\).</p>
                        <p>Event "roll an even number": \\(A = \\{2, 4, 6\\}\\).</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition (Probability)</div>
                    <div class="env-body">
                        <p>The <strong>probability</strong> of an event \\(A\\) is a number \\(P(A)\\) satisfying:</p>
                        <ol>
                            <li>\\(0 \\leq P(A) \\leq 1\\) for every event \\(A\\).</li>
                            <li>\\(P(\\Omega) = 1\\) (something must happen).</li>
                            <li>If events \\(A\\) and \\(B\\) are mutually exclusive (\\(A \\cap B = \\emptyset\\)), then \\(P(A \\cup B) = P(A) + P(B)\\).</li>
                        </ol>
                    </div>
                </div>

                <p>The visualization below simulates coin flips. Watch how the proportion of heads fluctuates wildly at first but gradually settles near 0.5 as the number of flips grows. This is the <strong>law of large numbers</strong> in action.</p>

                <div class="viz-placeholder" data-viz="coin-flip-streaks"></div>

                <div class="env-block remark">
                    <div class="env-title">Frequentist Intuition</div>
                    <div class="env-body">
                        <p>One way to think about probability: \\(P(A)\\) is the fraction of times event \\(A\\) would occur if you repeated the experiment very many times. This is the <strong>frequentist interpretation</strong>. If \\(P(\\text{heads}) = 0.5\\), then in 10,000 flips, you expect about 5,000 heads.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'coin-flip-streaks',
                    title: 'Coin Flip Simulator',
                    description: 'Click "Flip" to flip coins one at a time, or "Flip 100" for a burst. Watch the running proportion of heads converge toward 0.5.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 320, scale: 30, originX: 60, originY: 280 });
                        var results = [];
                        var headCount = 0;

                        VizEngine.createButton(controls, 'Flip 1', function() {
                            var r = Math.random() < 0.5 ? 1 : 0;
                            results.push(r);
                            headCount += r;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Flip 10', function() {
                            for (var i = 0; i < 10; i++) {
                                var r = Math.random() < 0.5 ? 1 : 0;
                                results.push(r);
                                headCount += r;
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Flip 100', function() {
                            for (var i = 0; i < 100; i++) {
                                var r = Math.random() < 0.5 ? 1 : 0;
                                results.push(r);
                                headCount += r;
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            results = [];
                            headCount = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = results.length;

                            // Title and stats
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Coin Flip Experiment', viz.width / 2, 20);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Flips: ' + n + '    Heads: ' + headCount + '    Tails: ' + (n - headCount), viz.width / 2, 42);

                            if (n > 0) {
                                var prop = headCount / n;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('Proportion of heads: ' + prop.toFixed(4), viz.width / 2, 60);
                            }

                            // Graph area
                            var graphL = 60;
                            var graphR = viz.width - 30;
                            var graphT = 85;
                            var graphB = 260;
                            var graphW = graphR - graphL;
                            var graphH = graphB - graphT;

                            // Background
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(graphL, graphT, graphW, graphH);

                            // Horizontal line at 0.5
                            ctx.strokeStyle = viz.colors.orange + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            var halfY = graphT + graphH / 2;
                            ctx.beginPath();
                            ctx.moveTo(graphL, halfY);
                            ctx.lineTo(graphR, halfY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('0.5', graphL - 5, halfY);

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('1.0', graphL - 5, graphT);
                            ctx.fillText('0.0', graphL - 5, graphB);

                            // Plot running proportion
                            if (n > 0) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var runningHeads = 0;
                                var maxPlot = Math.min(n, 1000);
                                var step = n > 1000 ? Math.floor(n / 1000) : 1;

                                for (var i = 0; i < n; i++) {
                                    runningHeads += results[i];
                                    if (i % step !== 0 && i !== n - 1) continue;
                                    var px = graphL + ((i + 1) / Math.max(n, 1)) * graphW;
                                    var proportion = runningHeads / (i + 1);
                                    var py = graphB - proportion * graphH;
                                    if (i === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Last few flips display
                            var recentY = 280;
                            var recentCount = Math.min(n, 30);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Recent flips:', 45, recentY + 8);
                            for (var j = 0; j < recentCount; j++) {
                                var idx = n - recentCount + j;
                                var fx = 90 + j * 20;
                                ctx.fillStyle = results[idx] ? viz.colors.gold : viz.colors.axis;
                                ctx.font = '14px -apple-system,sans-serif';
                                ctx.fillText(results[idx] ? 'H' : 'T', fx, recentY + 8);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A bag contains 3 red balls and 7 blue balls. You draw one ball at random. What is \\(P(\\text{red})\\)?',
                    hint: 'Total outcomes = 10 balls. Favorable outcomes = 3 red balls.',
                    solution: '\\(P(\\text{red}) = \\frac{3}{10} = 0.3\\).'
                },
                {
                    question: 'If \\(P(A) = 0.6\\), what is \\(P(\\text{not } A)\\)?',
                    hint: 'The probabilities of an event and its complement must sum to 1.',
                    solution: '\\(P(\\text{not } A) = 1 - P(A) = 1 - 0.6 = 0.4\\).'
                }
            ]
        },

        // ============================================================
        // SECTION 2: Equally likely outcomes
        // ============================================================
        {
            id: 'ch16-sec02',
            title: 'Equally likely outcomes',
            content: `
                <h2>Equally Likely Outcomes</h2>

                <p>When all outcomes in the sample space are equally likely (like a fair die or a well-shuffled deck), we can compute probabilities by simple counting.</p>

                <div class="env-block theorem">
                    <div class="env-title">Classical Probability Formula</div>
                    <div class="env-body">
                        <p>If all outcomes are equally likely:</p>
                        \\[P(A) = \\frac{|A|}{|\\Omega|} = \\frac{\\text{number of favorable outcomes}}{\\text{total number of outcomes}}\\]
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Two Dice</div>
                    <div class="env-body">
                        <p>Roll two dice. What is the probability that the sum is 7?</p>
                        <p>Sample space: \\(|\\Omega| = 6 \\times 6 = 36\\) equally likely pairs.</p>
                        <p>Favorable outcomes (sum = 7): \\((1,6), (2,5), (3,4), (4,3), (5,2), (6,1)\\). That is 6 outcomes.</p>
                        <p>\\(P(\\text{sum} = 7) = \\frac{6}{36} = \\frac{1}{6} \\approx 0.167\\).</p>
                    </div>
                </div>

                <p>This connects directly to the counting techniques from Chapters 4-7. The <em>art</em> of probability often reduces to the <em>art</em> of counting.</p>

                <div class="viz-placeholder" data-viz="dice-frequency"></div>

                <div class="env-block remark">
                    <div class="env-title">Why 7 Is the Most Common Sum</div>
                    <div class="env-body">
                        <p>The sum 7 has 6 favorable pairs out of 36, making it the most likely sum when rolling two dice. Sums of 2 and 12 each have only 1 favorable pair. The distribution is symmetric around 7, forming a triangular shape. This is an early glimpse of the <strong>central limit theorem</strong>.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Cards</div>
                    <div class="env-body">
                        <p>Draw one card from a standard 52-card deck. What is \\(P(\\text{heart or ace})\\)?</p>
                        <p>Hearts: 13 cards. Aces: 4 cards. But the ace of hearts is counted twice!</p>
                        <p>By inclusion-exclusion: \\(P = \\frac{13 + 4 - 1}{52} = \\frac{16}{52} = \\frac{4}{13}\\).</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'dice-frequency',
                    title: 'Two-Dice Sum Simulator',
                    description: 'Roll two dice many times and watch the frequency distribution build up. Compare observed frequencies with the theoretical distribution.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 340, scale: 30, originX: 60, originY: 300 });
                        var counts = {};
                        var totalRolls = 0;
                        for (var s = 2; s <= 12; s++) counts[s] = 0;

                        // Theoretical probabilities
                        var theory = {};
                        theory[2] = 1; theory[3] = 2; theory[4] = 3; theory[5] = 4; theory[6] = 5;
                        theory[7] = 6; theory[8] = 5; theory[9] = 4; theory[10] = 3; theory[11] = 2; theory[12] = 1;

                        VizEngine.createButton(controls, 'Roll 1', function() {
                            doRolls(1);
                        });
                        VizEngine.createButton(controls, 'Roll 50', function() {
                            doRolls(50);
                        });
                        VizEngine.createButton(controls, 'Roll 500', function() {
                            doRolls(500);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var s = 2; s <= 12; s++) counts[s] = 0;
                            totalRolls = 0;
                            draw();
                        });

                        function doRolls(n) {
                            for (var i = 0; i < n; i++) {
                                var d1 = Math.floor(Math.random() * 6) + 1;
                                var d2 = Math.floor(Math.random() * 6) + 1;
                                counts[d1 + d2]++;
                                totalRolls++;
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Two-Dice Sum Distribution (total rolls: ' + totalRolls + ')', viz.width / 2, 20);

                            var barL = 80;
                            var barR = viz.width - 40;
                            var barT = 50;
                            var barB = 270;
                            var barW = (barR - barL) / 11;
                            var barH = barB - barT;

                            // Find max count for scaling
                            var maxCount = 1;
                            for (var s = 2; s <= 12; s++) {
                                if (counts[s] > maxCount) maxCount = counts[s];
                            }

                            // Also scale by theory
                            var theoryMax = totalRolls > 0 ? totalRolls * 6 / 36 : barH * 0.5;
                            var scaleMax = Math.max(maxCount, totalRolls > 0 ? theoryMax : 1);

                            for (var sum = 2; sum <= 12; sum++) {
                                var idx = sum - 2;
                                var bx = barL + idx * barW;

                                // Observed bar
                                var bh = scaleMax > 0 ? (counts[sum] / scaleMax) * barH : 0;
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.fillRect(bx + 3, barB - bh, barW - 6, bh);

                                // Theoretical outline
                                if (totalRolls > 0) {
                                    var expected = totalRolls * theory[sum] / 36;
                                    var th = (expected / scaleMax) * barH;
                                    ctx.strokeStyle = viz.colors.orange;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(bx + 3, barB - th, barW - 6, th);
                                }

                                // Labels
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('' + sum, bx + barW / 2, barB + 5);

                                if (counts[sum] > 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText('' + counts[sum], bx + barW / 2, barB - bh - 2);
                                }
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width / 2 - 120, barB + 30, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Observed', viz.width / 2 - 104, barB + 36);

                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(viz.width / 2 + 20, barB + 30, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Theoretical', viz.width / 2 + 36, barB + 36);

                            // Theoretical probabilities
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Theoretical: P(sum=7) = 6/36 = 1/6;  P(sum=2) = P(sum=12) = 1/36', viz.width / 2, barB + 55);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Roll two dice. What is \\(P(\\text{sum} \\geq 10)\\)?',
                    hint: 'List all pairs that give sum 10, 11, and 12.',
                    solution: 'Sum 10: (4,6),(5,5),(6,4) = 3. Sum 11: (5,6),(6,5) = 2. Sum 12: (6,6) = 1. Total favorable = 6. \\(P = 6/36 = 1/6\\).'
                },
                {
                    question: 'A class has 20 students: 8 boys and 12 girls. Two students are chosen at random. What is the probability both are girls?',
                    hint: 'Use \\(\\binom{n}{k}\\). Total ways to choose 2 from 20. Favorable ways to choose 2 girls from 12.',
                    solution: '\\(P = \\frac{\\binom{12}{2}}{\\binom{20}{2}} = \\frac{66}{190} = \\frac{33}{95} \\approx 0.347\\).'
                }
            ]
        },

        // ============================================================
        // SECTION 3: The Monty Hall problem
        // ============================================================
        {
            id: 'ch16-sec03',
            title: 'The Monty Hall problem',
            content: `
                <h2>The Monty Hall Problem</h2>

                <p>This is one of the most famous (and most argued-about) probability puzzles in history. It is named after Monty Hall, the host of the TV game show "Let's Make a Deal."</p>

                <div class="env-block example">
                    <div class="env-title">The Setup</div>
                    <div class="env-body">
                        <p>There are 3 doors. Behind one door is a car (the prize). Behind the other two doors are goats (no prize).</p>
                        <ol>
                            <li>You pick a door (say Door 1).</li>
                            <li>The host, who knows where the car is, opens one of the other doors to reveal a goat (say Door 3).</li>
                            <li>The host asks: <strong>"Do you want to switch to Door 2?"</strong></li>
                        </ol>
                        <p>Should you switch? Does it matter?</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">The Answer</div>
                    <div class="env-body">
                        <p><strong>You should always switch.</strong> Switching wins the car with probability \\(\\frac{2}{3}\\). Staying wins with probability \\(\\frac{1}{3}\\).</p>
                    </div>
                </div>

                <p>This surprises almost everyone. Most people's intuition says "50-50, it doesn't matter." But that intuition is wrong. Here is why.</p>

                <div class="env-block intuition">
                    <div class="env-title">Why Switching Wins 2/3</div>
                    <div class="env-body">
                        <p>When you first pick a door, you have a \\(\\frac{1}{3}\\) chance of picking the car and a \\(\\frac{2}{3}\\) chance of picking a goat.</p>
                        <p><strong>If you picked the car (probability 1/3):</strong> switching loses.</p>
                        <p><strong>If you picked a goat (probability 2/3):</strong> the host must open the other goat door, so switching wins the car.</p>
                        <p>Switching wins exactly when your initial pick was wrong, which happens \\(\\frac{2}{3}\\) of the time.</p>
                    </div>
                </div>

                <p>Still not convinced? Play the game below many times and track your results!</p>

                <div class="viz-placeholder" data-viz="monty-hall-sim"></div>

                <div class="env-block remark">
                    <div class="env-title">The Key Insight</div>
                    <div class="env-body">
                        <p>The host's action is <strong>not random</strong>. The host always opens a goat door. This gives you information. Your original pick had a 1/3 chance of being right, and the host's reveal does not change that. The remaining 2/3 probability is concentrated on the one un-opened door.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Extreme Version</div>
                    <div class="env-body">
                        <p>Imagine 100 doors. You pick one. The host opens 98 doors, all goats. Now there is your door and one other door. Would you switch? Of course! Your door had a 1/100 chance; the other door has 99/100. The 3-door case works the same way, just less dramatically.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'monty-hall-sim',
                    title: 'Monty Hall Simulator',
                    description: 'Play the Monty Hall game! Pick a door, the host reveals a goat, then decide whether to switch. Track your stats over many rounds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 380, scale: 30, originX: 50, originY: 350 });

                        var carDoor = -1;
                        var playerPick = -1;
                        var hostOpen = -1;
                        var finalChoice = -1;
                        var phase = 0; // 0: pick, 1: host revealed, 2: result
                        var stats = { switchWin: 0, switchLoss: 0, stayWin: 0, stayLoss: 0 };

                        VizEngine.createButton(controls, 'New Game', function() { newGame(); });

                        function newGame() {
                            carDoor = Math.floor(Math.random() * 3);
                            playerPick = -1;
                            hostOpen = -1;
                            finalChoice = -1;
                            phase = 0;
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var doorW = 120;
                            var doorH = 160;
                            var doorGap = 40;
                            var totalW = 3 * doorW + 2 * doorGap;
                            var startX = (viz.width - totalW) / 2;
                            var doorY = 60;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            if (phase === 0) {
                                ctx.fillText('Pick a door! (click on a door)', viz.width / 2, 25);
                            } else if (phase === 1) {
                                ctx.fillText('The host opens Door ' + (hostOpen + 1) + ' (a goat!). Switch or Stay?', viz.width / 2, 25);
                            } else {
                                var won = finalChoice === carDoor;
                                ctx.fillStyle = won ? viz.colors.green : viz.colors.red;
                                ctx.fillText(won ? 'You WON the car!' : 'You got a goat...', viz.width / 2, 25);
                            }

                            // Draw doors
                            for (var d = 0; d < 3; d++) {
                                var dx = startX + d * (doorW + doorGap);
                                var isOpen = (phase >= 2) || (phase >= 1 && d === hostOpen);
                                var isSelected = (d === playerPick && phase >= 1);
                                var isFinal = (d === finalChoice && phase >= 2);

                                // Door background
                                if (isOpen) {
                                    ctx.fillStyle = '#1a1a2e';
                                } else {
                                    ctx.fillStyle = isSelected ? viz.colors.blue + '55' : '#2a2a5a';
                                }
                                ctx.fillRect(dx, doorY, doorW, doorH);

                                // Door border
                                ctx.strokeStyle = isSelected ? viz.colors.blue : (isFinal ? viz.colors.orange : viz.colors.axis);
                                ctx.lineWidth = isSelected || isFinal ? 3 : 1.5;
                                ctx.strokeRect(dx, doorY, doorW, doorH);

                                // Door number
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Door ' + (d + 1), dx + doorW / 2, doorY - 10);

                                // Door content
                                if (isOpen) {
                                    if (d === carDoor) {
                                        // Car
                                        ctx.fillStyle = viz.colors.gold;
                                        ctx.font = '40px -apple-system,sans-serif';
                                        ctx.fillText('\u2605', dx + doorW / 2, doorY + doorH / 2 - 10);
                                        ctx.font = '14px -apple-system,sans-serif';
                                        ctx.fillText('CAR', dx + doorW / 2, doorY + doorH / 2 + 25);
                                    } else {
                                        // Goat
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.font = '36px -apple-system,sans-serif';
                                        ctx.fillText('\ud83d\udc10', dx + doorW / 2, doorY + doorH / 2 - 10);
                                        ctx.font = '14px -apple-system,sans-serif';
                                        ctx.fillText('GOAT', dx + doorW / 2, doorY + doorH / 2 + 25);
                                    }
                                } else {
                                    // Closed door - draw handle
                                    ctx.fillStyle = viz.colors.gold;
                                    ctx.beginPath();
                                    ctx.arc(dx + doorW - 20, doorY + doorH / 2, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Question mark
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '30px -apple-system,sans-serif';
                                    ctx.fillText('?', dx + doorW / 2, doorY + doorH / 2);
                                }
                            }

                            // Switch / Stay buttons (in phase 1)
                            if (phase === 1) {
                                var btnY = doorY + doorH + 25;
                                // Find the switch door
                                var switchDoor = -1;
                                for (var i = 0; i < 3; i++) {
                                    if (i !== playerPick && i !== hostOpen) { switchDoor = i; break; }
                                }
                                ctx.fillStyle = viz.colors.teal + '44';
                                ctx.fillRect(viz.width / 2 - 170, btnY, 150, 35);
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(viz.width / 2 - 170, btnY, 150, 35);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillText('SWITCH to Door ' + (switchDoor + 1), viz.width / 2 - 95, btnY + 17);

                                ctx.fillStyle = viz.colors.purple + '44';
                                ctx.fillRect(viz.width / 2 + 20, btnY, 150, 35);
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.strokeRect(viz.width / 2 + 20, btnY, 150, 35);
                                ctx.fillStyle = viz.colors.purple;
                                ctx.fillText('STAY with Door ' + (playerPick + 1), viz.width / 2 + 95, btnY + 17);
                            }

                            // Stats
                            var statsY = 310;
                            var totalGames = stats.switchWin + stats.switchLoss + stats.stayWin + stats.stayLoss;
                            var switchTotal = stats.switchWin + stats.switchLoss;
                            var stayTotal = stats.stayWin + stats.stayLoss;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Statistics (' + totalGames + ' games)', viz.width / 2, statsY);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            var switchRate = switchTotal > 0 ? (stats.switchWin / switchTotal * 100).toFixed(1) : '---';
                            ctx.fillText('Switch: ' + stats.switchWin + ' wins / ' + switchTotal + ' games = ' + switchRate + '% win rate', viz.width / 2 - 170, statsY + 22);

                            ctx.fillStyle = viz.colors.purple;
                            var stayRate = stayTotal > 0 ? (stats.stayWin / stayTotal * 100).toFixed(1) : '---';
                            ctx.fillText('Stay: ' + stats.stayWin + ' wins / ' + stayTotal + ' games = ' + stayRate + '% win rate', viz.width / 2 + 170, statsY + 22);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Theory: Switch wins 66.7%, Stay wins 33.3%', viz.width / 2, statsY + 44);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            var doorW = 120;
                            var doorH = 160;
                            var doorGap = 40;
                            var totalW = 3 * doorW + 2 * doorGap;
                            var startX = (viz.width - totalW) / 2;
                            var doorY = 60;

                            if (phase === 0) {
                                // Pick a door
                                for (var d = 0; d < 3; d++) {
                                    var dx = startX + d * (doorW + doorGap);
                                    if (mx >= dx && mx <= dx + doorW && my >= doorY && my <= doorY + doorH) {
                                        playerPick = d;
                                        // Host opens a goat door (not player's pick, not car)
                                        var choices = [];
                                        for (var i = 0; i < 3; i++) {
                                            if (i !== playerPick && i !== carDoor) choices.push(i);
                                        }
                                        hostOpen = choices[Math.floor(Math.random() * choices.length)];
                                        phase = 1;
                                        draw();
                                        return;
                                    }
                                }
                            } else if (phase === 1) {
                                // Switch or Stay
                                var btnY = doorY + doorH + 25;
                                if (mx >= viz.width / 2 - 170 && mx <= viz.width / 2 - 20 && my >= btnY && my <= btnY + 35) {
                                    // Switch
                                    for (var j = 0; j < 3; j++) {
                                        if (j !== playerPick && j !== hostOpen) { finalChoice = j; break; }
                                    }
                                    phase = 2;
                                    if (finalChoice === carDoor) stats.switchWin++;
                                    else stats.switchLoss++;
                                    draw();
                                } else if (mx >= viz.width / 2 + 20 && mx <= viz.width / 2 + 170 && my >= btnY && my <= btnY + 35) {
                                    // Stay
                                    finalChoice = playerPick;
                                    phase = 2;
                                    if (finalChoice === carDoor) stats.stayWin++;
                                    else stats.stayLoss++;
                                    draw();
                                }
                            }
                        });

                        newGame();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose there are 4 doors (1 car, 3 goats). You pick one, the host opens one goat door. Should you switch? What is the probability of winning if you switch?',
                    hint: 'Initially you pick correctly with probability 1/4. If the host opens 1 goat door, the remaining probability 3/4 is split among 2 remaining doors.',
                    solution: 'If you switch, you win with probability \\(\\frac{3/4}{2} \\cdot 2 = \\frac{3}{4} \\cdot \\frac{1}{2}\\)... actually, more carefully: your original door has P(car) = 1/4. The two remaining doors together have P(car) = 3/4. If you switch to one of them uniformly at random, you win with probability \\(\\frac{3}{4} \\cdot \\frac{1}{2} = \\frac{3}{8}\\). But if the host lets you choose which of the 2 remaining doors to pick, and you have no information to distinguish them, the win probability is still 3/8 per door. Switching is better than staying (3/8 > 1/4).'
                }
            ]
        },

        // ============================================================
        // SECTION 4: Expected value
        // ============================================================
        {
            id: 'ch16-sec04',
            title: 'Expected value',
            content: `
                <h2>Expected Value</h2>

                <p>Probability tells us how likely different outcomes are. But when outcomes have different <em>values</em> attached to them (money won, points scored, etc.), we want a single number that captures the "average" result over many repetitions. That number is the <strong>expected value</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition (Expected Value)</div>
                    <div class="env-body">
                        <p>If a random variable \\(X\\) takes values \\(x_1, x_2, \\ldots, x_n\\) with probabilities \\(p_1, p_2, \\ldots, p_n\\), then the <strong>expected value</strong> (or <strong>mean</strong>) of \\(X\\) is:</p>
                        \\[E[X] = x_1 p_1 + x_2 p_2 + \\cdots + x_n p_n = \\sum_{i=1}^{n} x_i p_i\\]
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>The expected value is the <strong>long-run average</strong>. If you play a game 10,000 times, your total payoff will be approximately \\(10,\\!000 \\times E[X]\\). It is the "center of gravity" of the probability distribution.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: Fair Die</div>
                    <div class="env-body">
                        <p>Roll a fair die. What is the expected value of the number shown?</p>
                        \\[E[X] = 1 \\cdot \\tfrac{1}{6} + 2 \\cdot \\tfrac{1}{6} + 3 \\cdot \\tfrac{1}{6} + 4 \\cdot \\tfrac{1}{6} + 5 \\cdot \\tfrac{1}{6} + 6 \\cdot \\tfrac{1}{6} = \\frac{21}{6} = 3.5\\]
                        <p>You will never actually roll 3.5, but it is the average over many rolls.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example: A Bet</div>
                    <div class="env-body">
                        <p>A game costs \\$1 to play. You flip a coin: heads wins \\$3, tails wins nothing.</p>
                        <p>Expected payoff: \\(3 \\cdot 0.5 + 0 \\cdot 0.5 = 1.50\\).</p>
                        <p>Expected profit: \\(1.50 - 1.00 = +\\$0.50\\) per game. This is a good bet!</p>
                    </div>
                </div>

                <div class="env-block warning">
                    <div class="env-title">"Fair" Games</div>
                    <div class="env-body">
                        <p>A game is called <strong>fair</strong> (in the probabilistic sense) if the expected profit is exactly 0. Casino games are designed to be slightly unfair in the house's favor: the expected value of your profit is negative. That is how casinos make money, one tiny fraction of a dollar at a time, over millions of games.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="expected-value-demo"></div>
            `,
            visualizations: [
                {
                    id: 'expected-value-demo',
                    title: 'Expected Value Simulator',
                    description: 'A game: roll a die. Win $10 if you roll a 6, win $2 if you roll 4 or 5, lose $3 otherwise. Play many times and watch your running average converge to the expected value.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 320, scale: 30, originX: 60, originY: 280 });
                        var results = [];
                        var totalProfit = 0;

                        // Payoffs: roll 1-3: -3, roll 4-5: +2, roll 6: +10
                        function payoff(roll) {
                            if (roll === 6) return 10;
                            if (roll >= 4) return 2;
                            return -3;
                        }

                        // Theoretical EV
                        var ev = ((-3) * 3 + 2 * 2 + 10 * 1) / 6; // (-9 + 4 + 10)/6 = 5/6 ~ 0.833

                        VizEngine.createButton(controls, 'Play 1', function() { play(1); });
                        VizEngine.createButton(controls, 'Play 10', function() { play(10); });
                        VizEngine.createButton(controls, 'Play 100', function() { play(100); });
                        VizEngine.createButton(controls, 'Reset', function() {
                            results = [];
                            totalProfit = 0;
                            draw();
                        });

                        function play(n) {
                            for (var i = 0; i < n; i++) {
                                var roll = Math.floor(Math.random() * 6) + 1;
                                var p = payoff(roll);
                                results.push(p);
                                totalProfit += p;
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = results.length;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Die Roll Game: Roll 6 = +$10, Roll 4-5 = +$2, Roll 1-3 = -$3', viz.width / 2, 20);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Games played: ' + n + '    Total profit: $' + totalProfit.toFixed(2) + '    Average: $' + (n > 0 ? (totalProfit / n).toFixed(3) : '---'), viz.width / 2, 42);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Theoretical E[X] = (3\u00d7(-3) + 2\u00d72 + 1\u00d710) / 6 = 5/6 \u2248 $' + ev.toFixed(3), viz.width / 2, 60);

                            // Graph
                            var graphL = 60;
                            var graphR = viz.width - 30;
                            var graphT = 80;
                            var graphB = 260;
                            var graphW = graphR - graphL;
                            var graphH = graphB - graphT;

                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(graphL, graphT, graphW, graphH);

                            // Y axis: running average, range -3 to +10
                            var yMin = -3;
                            var yMax = 5;
                            var yRange = yMax - yMin;

                            function yToScreen(val) {
                                return graphB - ((val - yMin) / yRange) * graphH;
                            }

                            // EV line
                            ctx.strokeStyle = viz.colors.orange + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            var evY = yToScreen(ev);
                            ctx.beginPath();
                            ctx.moveTo(graphL, evY);
                            ctx.lineTo(graphR, evY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('E[X]=' + ev.toFixed(2), graphL - 3, evY);

                            // Zero line
                            var zeroY = yToScreen(0);
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(graphL, zeroY);
                            ctx.lineTo(graphR, zeroY);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('$0', graphL - 3, zeroY);

                            // Plot running average
                            if (n > 0) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var runSum = 0;
                                var step = Math.max(1, Math.floor(n / 1000));
                                for (var i = 0; i < n; i++) {
                                    runSum += results[i];
                                    if (i % step !== 0 && i !== n - 1) continue;
                                    var px = graphL + ((i + 1) / n) * graphW;
                                    var avg = runSum / (i + 1);
                                    var py = yToScreen(VizEngine.clamp(avg, yMin, yMax));
                                    if (i === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var y = yMin; y <= yMax; y += 1) {
                                ctx.fillText('$' + y, graphL - 3, yToScreen(y));
                            }

                            // Bottom text
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('The running average (teal) converges toward E[X] (orange dashed) as games increase', viz.width / 2, graphB + 20);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A lottery ticket costs $2. You win $100 with probability 0.01, win $10 with probability 0.05, and win nothing otherwise. What is the expected profit?',
                    hint: 'Expected payoff = \\(100 \\cdot 0.01 + 10 \\cdot 0.05 + 0 \\cdot 0.94\\). Then subtract the $2 cost.',
                    solution: 'Expected payoff = \\(100(0.01) + 10(0.05) + 0(0.94) = 1 + 0.50 + 0 = \\$1.50\\). Expected profit = \\(1.50 - 2.00 = -\\$0.50\\). On average, you lose 50 cents per ticket. This is not a good bet.'
                },
                {
                    question: 'You have two options: (A) Receive $50 guaranteed, or (B) Flip a coin: heads gives $120, tails gives $0. Which has higher expected value?',
                    hint: 'Compute \\(E[B] = 120 \\cdot 0.5 + 0 \\cdot 0.5\\).',
                    solution: '\\(E[A] = 50\\). \\(E[B] = 60\\). Option B has higher expected value ($60 > $50). But many people prefer option A because it is risk-free. The study of this preference is called <strong>risk aversion</strong>, a key topic in economics and decision theory.'
                }
            ]
        },

        // ============================================================
        // SECTION 5: Probability paradoxes
        // ============================================================
        {
            id: 'ch16-sec05',
            title: 'Probability paradoxes',
            content: `
                <h2>Probability Paradoxes</h2>

                <p>Probability is full of situations where our intuition leads us astray. Here are two famous examples that have tripped up even professional mathematicians.</p>

                <h3>The Birthday Paradox</h3>

                <div class="env-block example">
                    <div class="env-title">The Question</div>
                    <div class="env-body">
                        <p>How many people do you need in a room before there is a 50% chance that two of them share a birthday?</p>
                        <p>Most people guess around 183 (half of 365). The actual answer is only <strong>23</strong>.</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Birthday Probability Formula</div>
                    <div class="env-body">
                        <p>With \\(n\\) people (assuming 365 equally likely birthdays), the probability that <em>all</em> birthdays are different is:</p>
                        \\[P(\\text{all different}) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdots \\frac{365 - n + 1}{365}\\]
                        <p>The probability of at least one shared birthday is \\(1 - P(\\text{all different})\\).</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Why 23 Is Enough</div>
                    <div class="env-body">
                        <p>With 23 people, there are \\(\\binom{23}{2} = 253\\) pairs. Each pair has a small chance of matching (roughly 1/365), but with 253 chances, collisions become likely. The number of pairs grows much faster than the number of people: \\(\\binom{n}{2} = \\frac{n(n-1)}{2}\\).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="birthday-paradox"></div>

                <h3>The Gambler's Fallacy</h3>

                <div class="env-block warning">
                    <div class="env-title">The Gambler's Fallacy</div>
                    <div class="env-body">
                        <p>A coin has landed heads 10 times in a row. Is tails "due"?</p>
                        <p><strong>No!</strong> The coin has no memory. Each flip is independent. The probability of heads on the next flip is still exactly \\(\\frac{1}{2}\\).</p>
                        <p>The gambler's fallacy is the belief that past outcomes affect future independent events. Casinos love this fallacy: it keeps people betting after a losing streak, convinced their luck must change.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Streaks Are Normal</div>
                    <div class="env-body">
                        <p>In 100 fair coin flips, the expected length of the longest run of heads (or tails) is about 6-7. Streaks of 10+ are uncommon but not rare over thousands of flips. Randomness is "clumpier" than people expect. If you see a random sequence with no streaks, it probably is not truly random.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Penney's Game: A Paradox of Sequences</div>
                    <div class="env-body">
                        <p>Here is a surprising fact: in a sequence of fair coin flips, the pattern THH is more likely to appear before HHH. The second player in Penney's game (who picks their sequence after seeing the first player's choice) can <em>always</em> find a sequence that beats the first player's sequence with probability greater than 1/2. There is no "best" sequence; the game is non-transitive!</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'birthday-paradox',
                    title: 'Birthday Paradox Calculator',
                    description: 'Adjust the number of people and see the probability of a shared birthday. The 50% threshold is crossed at just 23 people.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 340, scale: 30, originX: 60, originY: 300 });
                        var numPeople = 23;

                        VizEngine.createSlider(controls, 'People', 2, 70, numPeople, 1, function(v) {
                            numPeople = Math.round(v);
                            draw();
                        });

                        function birthdayProb(n) {
                            var pAllDiff = 1;
                            for (var i = 0; i < n; i++) {
                                pAllDiff *= (365 - i) / 365;
                            }
                            return 1 - pAllDiff;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Birthday Paradox', viz.width / 2, 20);

                            // Graph area
                            var graphL = 70;
                            var graphR = viz.width - 30;
                            var graphT = 50;
                            var graphB = 260;
                            var graphW = graphR - graphL;
                            var graphH = graphB - graphT;

                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(graphL, graphT, graphW, graphH);

                            // 50% line
                            var halfY = graphB - 0.5 * graphH;
                            ctx.strokeStyle = viz.colors.orange + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(graphL, halfY);
                            ctx.lineTo(graphR, halfY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('50%', graphL - 5, halfY);

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            for (var pct = 0; pct <= 100; pct += 25) {
                                var yy = graphB - (pct / 100) * graphH;
                                ctx.fillText(pct + '%', graphL - 5, yy);
                            }

                            // Plot the curve
                            var maxN = 70;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 2; i <= maxN; i++) {
                                var prob = birthdayProb(i);
                                var px = graphL + ((i - 2) / (maxN - 2)) * graphW;
                                var py = graphB - prob * graphH;
                                if (i === 2) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Highlight current point
                            var curProb = birthdayProb(numPeople);
                            var curX = graphL + ((numPeople - 2) / (maxN - 2)) * graphW;
                            var curY = graphB - curProb * graphH;

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(curX, curY, 6, 0, Math.PI * 2);
                            ctx.fill();

                            // Vertical guide
                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            ctx.moveTo(curX, curY);
                            ctx.lineTo(curX, graphB);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 10; t <= 70; t += 10) {
                                var tx = graphL + ((t - 2) / (maxN - 2)) * graphW;
                                ctx.fillText('' + t, tx, graphB + 5);
                            }
                            ctx.fillText('People', graphL + graphW / 2, graphB + 20);

                            // Result text
                            var resultY = 290;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(numPeople + ' people: P(shared birthday) = ' + (curProb * 100).toFixed(1) + '%', viz.width / 2, resultY);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Number of pairs: C(' + numPeople + ',2) = ' + (numPeople * (numPeople - 1) / 2), viz.width / 2, resultY + 22);

                            if (curProb >= 0.5) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('More likely than not to have a match!', viz.width / 2, resultY + 42);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many people are needed for a 99% chance of a shared birthday?',
                    hint: 'You can compute this iteratively or use the visualization. It is much less than 365.',
                    solution: 'About <strong>57 people</strong> gives a 99% probability of a shared birthday. At 70 people, the probability exceeds 99.9%.'
                },
                {
                    question: 'Explain why the gambler\'s fallacy is a fallacy using the concept of independent events.',
                    hint: 'Two events A and B are independent if \\(P(A \\cap B) = P(A) \\cdot P(B)\\).',
                    solution: 'For independent events, knowing the outcome of one event gives no information about the other. Coin flips are independent: \\(P(\\text{heads on flip 11} \\mid \\text{10 heads in a row}) = P(\\text{heads}) = 0.5\\). The coin has no "memory" of previous flips. The fallacy arises from confusing the probability of a <em>sequence</em> (10 heads in a row is unlikely) with the probability of the <em>next individual flip</em> (always 50-50).'
                }
            ]
        }
    ]
});
