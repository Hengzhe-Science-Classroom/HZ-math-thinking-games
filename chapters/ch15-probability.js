// === Chapter 15: Probability Puzzles ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'Probability Puzzles',
    subtitle: 'When intuition fails and math saves the day',
    sections: [
        // ============================================================
        // SECTION 1: Motivation
        // ============================================================
        {
            id: 'sec-motivation',
            title: 'Why Probability Tricks Us',
            content: `
<h2>Why Probability Tricks Us</h2>

<div class="env-block intuition">
    <div class="env-title">Your Gut Is Wrong</div>
    <div class="env-body">
        <p>Human brains evolved to detect patterns, not to calculate probabilities. We are hardwired to see streaks in random data, to confuse "unlikely" with "impossible," and to let vivid stories override cold statistics. This chapter is a guided tour of the places where intuition crashes hardest into mathematical reality.</p>
    </div>
</div>

<p>Consider these questions:</p>
<ul>
    <li>You are on a game show. You pick a door. The host opens another door, revealing a goat. Should you switch?</li>
    <li>How many people do you need in a room before there is a 50% chance two share a birthday?</li>
    <li>A coin has landed heads five times in a row. Is tails "due"?</li>
    <li>A lottery ticket costs $2 and pays $1,000,000 with probability 1 in 500,000. Is it a good deal?</li>
</ul>

<p>Most people get at least one of these wrong. The errors are not random; they follow predictable patterns that psychologists call <strong>cognitive biases</strong>. Probability theory is, among other things, a toolkit for overriding those biases with rigorous calculation.</p>

<div class="env-block remark">
    <div class="env-title">A Thread Through This Chapter</div>
    <div class="env-body">
        <p>Each section presents a famous puzzle or fallacy, explains why intuition fails, and then shows the correct mathematical analysis. Along the way, we will build interactive simulations so you can <em>see</em> the math in action.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ============================================================
        // SECTION 2: The Monty Hall Problem
        // ============================================================
        {
            id: 'sec-monty',
            title: 'The Monty Hall Problem',
            content: `
<h2>The Monty Hall Problem</h2>

<div class="env-block intuition">
    <div class="env-title">The Setup</div>
    <div class="env-body">
        <p>You are a contestant on a game show. There are three doors. Behind one door is a car; behind the other two are goats. You pick a door, say Door 1. The host, who <em>knows</em> what is behind each door, opens another door, say Door 3, revealing a goat. The host then asks: "Do you want to switch to Door 2?"</p>
        <p>Should you switch?</p>
    </div>
</div>

<p>When this problem appeared in Marilyn vos Savant's column in 1990, nearly 10,000 readers wrote in to say she was wrong when she advised switching. Among those who disagreed were nearly 1,000 PhDs. Yet the math is unambiguous: <strong>you should always switch</strong>.</p>

<h3>The Analysis</h3>

<p>When you first pick a door, you have a \\(\\frac{1}{3}\\) chance of picking the car and a \\(\\frac{2}{3}\\) chance of picking a goat. The host's action does not change this. The host <em>always</em> opens a door with a goat (the host never opens your door and never reveals the car).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.1 (Monty Hall)</div>
    <div class="env-body">
        <p>In the standard Monty Hall problem with three doors:</p>
        <ul>
            <li>If you <strong>stay</strong>, you win with probability \\(\\frac{1}{3}\\).</li>
            <li>If you <strong>switch</strong>, you win with probability \\(\\frac{2}{3}\\).</li>
        </ul>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Label the doors 1, 2, 3. Without loss of generality, suppose you pick Door 1. There are three equally likely cases for the car's location:</p>
        <table style="margin:1em auto;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #555;"><th style="padding:4px 12px;">Car behind</th><th style="padding:4px 12px;">Host opens</th><th style="padding:4px 12px;">Stay wins?</th><th style="padding:4px 12px;">Switch wins?</th></tr>
            <tr><td style="padding:4px 12px;">Door 1</td><td style="padding:4px 12px;">Door 2 or 3</td><td style="padding:4px 12px;">Yes</td><td style="padding:4px 12px;">No</td></tr>
            <tr><td style="padding:4px 12px;">Door 2</td><td style="padding:4px 12px;">Door 3</td><td style="padding:4px 12px;">No</td><td style="padding:4px 12px;">Yes</td></tr>
            <tr><td style="padding:4px 12px;">Door 3</td><td style="padding:4px 12px;">Door 2</td><td style="padding:4px 12px;">No</td><td style="padding:4px 12px;">Yes</td></tr>
        </table>
        <p>Stay wins in 1 out of 3 cases. Switch wins in 2 out of 3 cases. \\(\\square\\)</p>
    </div>
</div>

<p>The key insight: the host's action is <em>not</em> random. The host always reveals a goat. This concentrates the original \\(\\frac{2}{3}\\) probability (that you were wrong) onto the single remaining door.</p>

<div class="viz-placeholder" data-viz="viz-monty-hall"></div>

<p>Still not convinced? The simulation below runs 1000 games and tracks the win rates for each strategy.</p>

<div class="viz-placeholder" data-viz="viz-monty-simulation"></div>

<div class="env-block remark">
    <div class="env-title">The 100-Door Version</div>
    <div class="env-body">
        <p>If the problem had 100 doors, you pick one, the host opens 98 doors (all goats), leaving your door and one other, switching is clearly better: your initial pick had a \\(\\frac{1}{100}\\) chance of being right, so the remaining door has a \\(\\frac{99}{100}\\) chance. The three-door case is the same logic, just less dramatic.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-monty-hall',
                    title: 'Play the Monty Hall Game',
                    description: 'Pick a door, see the host reveal a goat, then decide: stay or switch? Your wins and losses are tracked across rounds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 380, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var carDoor = -1;
                        var playerPick = -1;
                        var hostOpened = -1;
                        var phase = 'pick'; // pick, reveal, result
                        var result = '';
                        var stats = { switchWin: 0, switchLoss: 0, stayWin: 0, stayLoss: 0 };
                        var animFrame = 0;
                        var animating = false;

                        function newRound() {
                            carDoor = Math.floor(Math.random() * 3);
                            playerPick = -1;
                            hostOpened = -1;
                            phase = 'pick';
                            result = '';
                            animFrame = 0;
                            animating = false;
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var doorW = 100, doorH = 160;
                            var doorY = 80;
                            var gap = (w - 3 * doorW) / 4;

                            // Title
                            viz.screenText('The Monty Hall Game', w / 2, 20, viz.colors.white, 18);

                            if (phase === 'pick') {
                                viz.screenText('Pick a door!', w / 2, 50, viz.colors.teal, 14);
                            } else if (phase === 'reveal') {
                                viz.screenText('The host opened Door ' + (hostOpened + 1) + '. Switch or Stay?', w / 2, 50, viz.colors.orange, 14);
                            } else {
                                viz.screenText(result, w / 2, 50, result.indexOf('Win') >= 0 ? viz.colors.green : viz.colors.red, 14);
                            }

                            for (var i = 0; i < 3; i++) {
                                var dx = gap + i * (doorW + gap);
                                var isOpen = (phase === 'reveal' && i === hostOpened) || (phase === 'result');
                                var isSelected = (i === playerPick);

                                // Door frame
                                ctx.strokeStyle = isSelected ? viz.colors.teal : viz.colors.axis;
                                ctx.lineWidth = isSelected ? 3 : 1.5;
                                ctx.strokeRect(dx, doorY, doorW, doorH);

                                if (isOpen || phase === 'result') {
                                    // Show what is behind
                                    var isCar = (i === carDoor);
                                    ctx.fillStyle = isCar ? '#2a4a2a' : '#3a2a2a';
                                    ctx.fillRect(dx + 1, doorY + 1, doorW - 2, doorH - 2);
                                    if (isCar) {
                                        // Draw a car icon (simple)
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = '40px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('\uD83D\uDE97', dx + doorW / 2, doorY + doorH / 2);
                                    } else {
                                        // Draw goat text
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = '40px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('\uD83D\uDC10', dx + doorW / 2, doorY + doorH / 2);
                                    }
                                } else {
                                    // Closed door
                                    ctx.fillStyle = '#1a2a4a';
                                    ctx.fillRect(dx + 1, doorY + 1, doorW - 2, doorH - 2);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = 'bold 24px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText((i + 1).toString(), dx + doorW / 2, doorY + doorH / 2);
                                    // Doorknob
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(dx + doorW - 15, doorY + doorH / 2, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Door ' + (i + 1), dx + doorW / 2, doorY + doorH + 18);
                            }

                            // Stats
                            var sy = 300;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var totalSwitch = stats.switchWin + stats.switchLoss;
                            var totalStay = stats.stayWin + stats.stayLoss;
                            var swRate = totalSwitch > 0 ? (stats.switchWin / totalSwitch * 100).toFixed(1) : '--';
                            var stRate = totalStay > 0 ? (stats.stayWin / totalStay * 100).toFixed(1) : '--';

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Switch: ' + stats.switchWin + 'W / ' + stats.switchLoss + 'L  (' + swRate + '% win)', 30, sy);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Stay:   ' + stats.stayWin + 'W / ' + stats.stayLoss + 'L  (' + stRate + '% win)', 30, sy + 20);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Theory: Switch wins 66.7% | Stay wins 33.3%', w / 2, sy + 50);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (phase !== 'pick') return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var doorW = 100, doorH = 160, doorY = 80;
                            var gap = (w - 3 * doorW) / 4;
                            for (var i = 0; i < 3; i++) {
                                var dx = gap + i * (doorW + gap);
                                if (mx >= dx && mx <= dx + doorW && my >= doorY && my <= doorY + doorH) {
                                    playerPick = i;
                                    // Host opens a door with a goat that is not player's pick
                                    var options = [];
                                    for (var j = 0; j < 3; j++) {
                                        if (j !== playerPick && j !== carDoor) options.push(j);
                                    }
                                    hostOpened = options[Math.floor(Math.random() * options.length)];
                                    phase = 'reveal';
                                    draw();
                                    return;
                                }
                            }
                        });

                        var switchBtn = VizEngine.createButton(controls, 'Switch!', function() {
                            if (phase !== 'reveal') return;
                            // Switch to the remaining door
                            for (var i = 0; i < 3; i++) {
                                if (i !== playerPick && i !== hostOpened) { playerPick = i; break; }
                            }
                            var won = (playerPick === carDoor);
                            if (won) { stats.switchWin++; result = 'You switched and WON the car!'; }
                            else { stats.switchLoss++; result = 'You switched and got a goat.'; }
                            phase = 'result';
                            draw();
                        });

                        var stayBtn = VizEngine.createButton(controls, 'Stay!', function() {
                            if (phase !== 'reveal') return;
                            var won = (playerPick === carDoor);
                            if (won) { stats.stayWin++; result = 'You stayed and WON the car!'; }
                            else { stats.stayLoss++; result = 'You stayed and got a goat.'; }
                            phase = 'result';
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Round', function() { newRound(); });

                        VizEngine.createButton(controls, 'Reset Stats', function() {
                            stats = { switchWin: 0, switchLoss: 0, stayWin: 0, stayLoss: 0 };
                            newRound();
                        });

                        newRound();
                        return viz;
                    }
                },
                {
                    id: 'viz-monty-simulation',
                    title: 'Monty Hall: 1000-Game Simulation',
                    description: 'Run 1000 games instantly and watch the switching strategy win about 2/3 of the time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var results = [];
                        var running = false;

                        function simulate(n) {
                            results = [];
                            var switchWins = 0, stayWins = 0;
                            for (var i = 0; i < n; i++) {
                                var car = Math.floor(Math.random() * 3);
                                var pick = Math.floor(Math.random() * 3);
                                var stayWon = (pick === car) ? 1 : 0;
                                var switchWon = (pick !== car) ? 1 : 0;
                                stayWins += stayWon;
                                switchWins += switchWon;
                                results.push({
                                    game: i + 1,
                                    switchCum: switchWins / (i + 1),
                                    stayCum: stayWins / (i + 1)
                                });
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Monty Hall: Cumulative Win Rate', w / 2, 20, viz.colors.white, 16);

                            if (results.length === 0) {
                                viz.screenText('Click "Run 1000 Games" to start', w / 2, h / 2, viz.colors.text, 14);
                                return;
                            }

                            var marginL = 60, marginR = 30, marginT = 50, marginB = 60;
                            var chartW = w - marginL - marginR;
                            var chartH = h - marginT - marginB;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(marginL, marginT);
                            ctx.lineTo(marginL, marginT + chartH);
                            ctx.lineTo(marginL + chartW, marginT + chartH);
                            ctx.stroke();

                            // Y-axis labels (0 to 1)
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yy = 0; yy <= 1; yy += 0.25) {
                                var py = marginT + chartH * (1 - yy);
                                ctx.fillText(yy.toFixed(2), marginL - 8, py);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(marginL, py); ctx.lineTo(marginL + chartW, py); ctx.stroke();
                            }

                            // 2/3 and 1/3 reference lines
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            var y23 = marginT + chartH * (1 - 2 / 3);
                            ctx.beginPath(); ctx.moveTo(marginL, y23); ctx.lineTo(marginL + chartW, y23); ctx.stroke();
                            var y13 = marginT + chartH * (1 - 1 / 3);
                            ctx.beginPath(); ctx.moveTo(marginL, y13); ctx.lineTo(marginL + chartW, y13); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.textAlign = 'left';
                            ctx.fillText('2/3', marginL + chartW + 4, y23);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('1/3', marginL + chartW + 4, y13);

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var n = results.length;
                            for (var xi = 0; xi <= n; xi += Math.max(1, Math.floor(n / 5))) {
                                var px = marginL + (xi / n) * chartW;
                                ctx.fillText(xi.toString(), px, marginT + chartH + 6);
                            }
                            ctx.fillText('Games', marginL + chartW / 2, marginT + chartH + 24);

                            // Switch line
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < n; i++) {
                                var px2 = marginL + ((i + 1) / n) * chartW;
                                var py2 = marginT + chartH * (1 - results[i].switchCum);
                                if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Stay line
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var j = 0; j < n; j++) {
                                var px3 = marginL + ((j + 1) / n) * chartW;
                                var py3 = marginT + chartH * (1 - results[j].stayCum);
                                if (j === 0) ctx.moveTo(px3, py3); else ctx.lineTo(px3, py3);
                            }
                            ctx.stroke();

                            // Legend
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Switch: ' + (results[n - 1].switchCum * 100).toFixed(1) + '%', marginL + 10, marginT + 14);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Stay: ' + (results[n - 1].stayCum * 100).toFixed(1) + '%', marginL + 180, marginT + 14);
                        }

                        VizEngine.createButton(controls, 'Run 1000 Games', function() {
                            simulate(1000);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Run 10000 Games', function() {
                            simulate(10000);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            results = [];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the Monty Hall problem, suppose the host opens a door at random (and might accidentally reveal the car). If the host happens to reveal a goat, should you still switch?',
                    hint: 'This is "Monty Fall" not "Monty Hall." The host\'s knowledge matters. Think about what changes when the reveal is random.',
                    solution: 'In the "Monty Fall" variant, the host opens a random door. Given that it happened to be a goat, switching and staying each win with probability \\(\\frac{1}{2}\\). The host\'s <em>knowledge</em> is what creates the asymmetry in the original problem. When the host knowingly avoids the car, the \\(\\frac{2}{3}\\) probability transfers to the remaining door. When the host acts randomly, no such transfer occurs.'
                },
                {
                    question: 'Generalize the Monty Hall problem to \\(n\\) doors. You pick one door, the host opens \\(n - 2\\) doors (all goats), leaving your door and one other. What is the probability of winning if you switch?',
                    hint: 'What is the probability your initial pick was correct?',
                    solution: 'Your initial pick is correct with probability \\(\\frac{1}{n}\\), so switching wins with probability \\(\\frac{n-1}{n}\\). For \\(n = 3\\), this is \\(\\frac{2}{3}\\). For \\(n = 100\\), switching wins 99% of the time.'
                }
            ]
        },

        // ============================================================
        // SECTION 3: The Birthday Paradox
        // ============================================================
        {
            id: 'sec-birthday',
            title: 'The Birthday Paradox',
            content: `
<h2>The Birthday Paradox</h2>

<div class="env-block intuition">
    <div class="env-title">The Question</div>
    <div class="env-body">
        <p>How many people do you need in a room before there is a 50% chance that at least two of them share a birthday? Most people guess around 180 (half of 365). The real answer is <strong>23</strong>.</p>
    </div>
</div>

<p>This is not really a paradox; it is a failure of intuition. We naturally think about whether someone shares <em>our</em> birthday, which is indeed unlikely with only 23 people. But the question asks about <em>any</em> pair sharing a birthday, and the number of pairs grows much faster than the number of people.</p>

<h3>The Calculation</h3>

<p>Assume 365 equally likely birthdays (ignoring leap years). With \\(n\\) people in a room, we compute the probability that <strong>no two</strong> share a birthday, then subtract from 1.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.2 (Birthday Probability)</div>
    <div class="env-body">
        <p>The probability that at least two of \\(n\\) people share a birthday is:</p>
        \\[P(n) = 1 - \\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdots \\frac{365 - n + 1}{365} = 1 - \\prod_{k=0}^{n-1}\\frac{365 - k}{365}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Person 1 can have any birthday (\\(\\frac{365}{365}\\) choices that avoid a collision). Person 2 must avoid Person 1's birthday (\\(\\frac{364}{365}\\)). Person 3 must avoid both (\\(\\frac{363}{365}\\)), and so on. These are independent conditional probabilities, so we multiply. The complementary probability (at least one collision) is one minus the product. \\(\\square\\)</p>
    </div>
</div>

<p>Key values: \\(P(23) \\approx 0.507\\), \\(P(50) \\approx 0.970\\), \\(P(70) \\approx 0.999\\).</p>

<div class="env-block remark">
    <div class="env-title">Why 23 is Small</div>
    <div class="env-body">
        <p>With \\(n\\) people, there are \\(\\binom{n}{2} = \\frac{n(n-1)}{2}\\) pairs. At \\(n = 23\\), that is \\(\\binom{23}{2} = 253\\) pairs, each with a \\(\\frac{1}{365}\\) chance of matching. Roughly \\(253/365 \\approx 0.69\\), which overshoots (the events are not independent), but the intuition is correct: many pairs means many chances for a match.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-birthday-paradox"></div>
`,
            visualizations: [
                {
                    id: 'viz-birthday-paradox',
                    title: 'Birthday Paradox Explorer',
                    description: 'Add people to the room and see the probability of a shared birthday update in real time. Birthdays are shown as dots on a calendar ring.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var people = [];
                        var matchFound = false;
                        var matchPair = null;

                        function addPerson() {
                            var bday = Math.floor(Math.random() * 365);
                            // Check for match
                            for (var i = 0; i < people.length; i++) {
                                if (people[i] === bday && !matchFound) {
                                    matchFound = true;
                                    matchPair = [i, people.length];
                                }
                            }
                            people.push(bday);
                        }

                        function birthdayProb(n) {
                            var p = 1;
                            for (var k = 0; k < n; k++) {
                                p *= (365 - k) / 365;
                            }
                            return 1 - p;
                        }

                        function draw() {
                            viz.clear();
                            var n = people.length;

                            viz.screenText('Birthday Paradox: ' + n + ' people', w / 2, 20, viz.colors.white, 16);

                            // Calendar ring
                            var cx = 170, cy = 210, r = 130;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(cx, cy, r, 0, Math.PI * 2);
                            ctx.stroke();

                            // Month labels
                            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            var monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            for (var m = 0; m < 12; m++) {
                                var ang = (monthDays[m] / 365) * Math.PI * 2 - Math.PI / 2;
                                var lx = cx + (r + 16) * Math.cos(ang);
                                var ly = cy + (r + 16) * Math.sin(ang);
                                ctx.fillText(months[m], lx, ly);
                            }

                            // Birthday dots
                            var bdayCounts = {};
                            for (var i = 0; i < people.length; i++) {
                                var bday = people[i];
                                bdayCounts[bday] = (bdayCounts[bday] || 0) + 1;
                            }

                            for (var day in bdayCounts) {
                                var d = parseInt(day);
                                var cnt = bdayCounts[d];
                                var angle = (d / 365) * Math.PI * 2 - Math.PI / 2;
                                var dotR = r - 10;
                                var dx = cx + dotR * Math.cos(angle);
                                var dy = cy + dotR * Math.sin(angle);
                                var col = cnt > 1 ? viz.colors.red : viz.colors.teal;
                                var dotSize = cnt > 1 ? 5 : 3;
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(dx, dy, dotSize, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Probability curve
                            var graphX = 340, graphY = 50, graphW = 200, graphH = 200;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(graphX, graphY);
                            ctx.lineTo(graphX, graphY + graphH);
                            ctx.lineTo(graphX + graphW, graphY + graphH);
                            ctx.stroke();

                            // Y-axis
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var yv = 0; yv <= 1; yv += 0.25) {
                                var yp = graphY + graphH * (1 - yv);
                                ctx.fillText(yv.toFixed(2), graphX - 4, yp);
                            }

                            // 50% line
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 0.5;
                            ctx.setLineDash([3, 3]);
                            var y50 = graphY + graphH * 0.5;
                            ctx.beginPath(); ctx.moveTo(graphX, y50); ctx.lineTo(graphX + graphW, y50); ctx.stroke();
                            ctx.setLineDash([]);

                            // Curve
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var maxN = 70;
                            for (var k = 1; k <= maxN; k++) {
                                var px = graphX + (k / maxN) * graphW;
                                var py = graphY + graphH * (1 - birthdayProb(k));
                                if (k === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Current position marker
                            if (n > 0 && n <= maxN) {
                                var mpx = graphX + (n / maxN) * graphW;
                                var mpy = graphY + graphH * (1 - birthdayProb(n));
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath();
                                ctx.arc(mpx, mpy, 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // X-axis label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('People', graphX + graphW / 2, graphY + graphH + 18);
                            ctx.textAlign = 'right';
                            ctx.fillText('23', graphX + (23 / maxN) * graphW, graphY + graphH + 12);

                            // 23 marker on x-axis
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([2, 2]);
                            var x23 = graphX + (23 / maxN) * graphW;
                            ctx.beginPath(); ctx.moveTo(x23, graphY); ctx.lineTo(x23, graphY + graphH); ctx.stroke();
                            ctx.setLineDash([]);

                            // Info
                            var prob = n > 0 ? birthdayProb(n) : 0;
                            viz.screenText('P(match) = ' + (prob * 100).toFixed(1) + '%', w / 2, h - 70, viz.colors.white, 14);
                            viz.screenText('Pairs: ' + (n * (n - 1) / 2), w / 2, h - 50, viz.colors.text, 12);
                            if (matchFound) {
                                viz.screenText('Match found! (Day ' + people[matchPair[0]] + ')', w / 2, h - 30, viz.colors.red, 13);
                            }
                        }

                        VizEngine.createButton(controls, 'Add 1 Person', function() { addPerson(); draw(); });
                        VizEngine.createButton(controls, 'Add 5 People', function() { for (var i = 0; i < 5; i++) addPerson(); draw(); });
                        VizEngine.createButton(controls, 'Fill to 23', function() {
                            while (people.length < 23) addPerson();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            people = []; matchFound = false; matchPair = null; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(P(5)\\), the probability that at least two of five people share a birthday. Confirm that it is about 2.7%.',
                    hint: 'Compute the complementary probability: \\(\\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdot \\frac{362}{365} \\cdot \\frac{361}{365}\\).',
                    solution: '\\(P(5) = 1 - \\frac{365 \\cdot 364 \\cdot 363 \\cdot 362 \\cdot 361}{365^5} = 1 - 0.9729 \\approx 0.0271\\), or about 2.7%.'
                },
                {
                    question: 'A hash function maps inputs to one of \\(N\\) buckets. How many random inputs can you hash before there is a 50% chance of a collision? (This is the birthday attack in cryptography.)',
                    hint: 'Use the birthday formula with 365 replaced by \\(N\\). The answer scales as \\(\\sqrt{N}\\).',
                    solution: 'By the birthday approximation, the 50% collision threshold is roughly \\(n \\approx 1.2\\sqrt{N}\\). For a 128-bit hash (\\(N = 2^{128}\\)), you need about \\(2^{64}\\) inputs. This is why cryptographic hashes need at least 256-bit output to resist birthday attacks.'
                }
            ]
        },

        // ============================================================
        // SECTION 4: The Gambler's Fallacy
        // ============================================================
        {
            id: 'sec-gambler',
            title: "The Gambler's Fallacy",
            content: `
<h2>The Gambler's Fallacy</h2>

<div class="env-block intuition">
    <div class="env-title">Coins Have No Memory</div>
    <div class="env-body">
        <p>A fair coin has landed heads five times in a row. Surely tails is "due" next? <strong>No.</strong> The coin does not know its own history. Each flip is independent. The probability of heads on the next flip is still exactly \\(\\frac{1}{2}\\).</p>
    </div>
</div>

<p>The gambler's fallacy is the belief that past outcomes influence future independent events. It has a long and expensive history. On August 18, 1913, at the Monte Carlo Casino, the roulette ball landed on black 26 times in a row. Gamblers lost millions betting on red, convinced that a "correction" was overdue.</p>

<h3>Why the Fallacy Feels Right</h3>

<p>The law of large numbers says that the proportion of heads approaches \\(\\frac{1}{2}\\) as the number of flips grows. People misinterpret this to mean that the <em>counts</em> must balance out. They do not. What happens is that future flips <em>swamp</em> the past imbalance, making it negligible as a fraction.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.3 (Independence)</div>
    <div class="env-body">
        <p>If coin flips are independent with \\(P(H) = p\\), then for any sequence of past outcomes \\(A\\),</p>
        \\[P(\\text{next flip is H} \\mid A) = p.\\]
        <p>The conditional probability equals the unconditional probability. The past is irrelevant.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Five Heads in a Row</div>
    <div class="env-body">
        <p>You might say: "The chance of six heads in a row is \\(\\left(\\frac{1}{2}\\right)^6 = \\frac{1}{64}\\), which is small, so after five heads, tails must be likely." But this confuses prediction with postdiction. Given that five heads have already occurred, the sixth flip is a fresh coin toss. The probability of HHHHHH given HHHHH is \\(\\frac{1}{2}\\), not \\(\\frac{1}{64}\\).</p>
    </div>
</div>

<p>Try flipping coins below and watching for streaks. Notice that streaks of 4 or 5 are not rare at all in sequences of 50+ flips.</p>

<div class="viz-placeholder" data-viz="viz-coin-flip"></div>

<p>The dice roller below shows the complementary lesson: individual rolls are unpredictable, but frequencies converge to the theoretical distribution.</p>

<div class="viz-placeholder" data-viz="viz-dice-roller"></div>
`,
            visualizations: [
                {
                    id: 'viz-coin-flip',
                    title: 'Coin Flip Streak Tracker',
                    description: 'Flip coins and watch streaks form. The coin has no memory; streaks are natural, not anomalous.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 360, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var flips = [];
                        var maxStreak = 0;
                        var currentStreak = 0;
                        var currentSide = -1;

                        function addFlips(n) {
                            for (var i = 0; i < n; i++) {
                                var f = Math.random() < 0.5 ? 1 : 0; // 1=H, 0=T
                                flips.push(f);
                                if (f === currentSide) {
                                    currentStreak++;
                                } else {
                                    currentSide = f;
                                    currentStreak = 1;
                                }
                                if (currentStreak > maxStreak) maxStreak = currentStreak;
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Coin Flip Streak Tracker', w / 2, 18, viz.colors.white, 16);

                            var total = flips.length;
                            var heads = 0;
                            for (var i = 0; i < total; i++) heads += flips[i];
                            var tails = total - heads;

                            // Stats
                            viz.screenText('Total: ' + total + '   H: ' + heads + '   T: ' + tails, w / 2, 42, viz.colors.text, 12);
                            if (total > 0) {
                                viz.screenText('H rate: ' + (heads / total * 100).toFixed(1) + '%   Longest streak: ' + maxStreak, w / 2, 58, viz.colors.teal, 12);
                            }

                            // Show last 200 flips as colored grid
                            var startIdx = Math.max(0, total - 200);
                            var cellW = 11, cellH = 11;
                            var cols = Math.floor((w - 40) / cellW);
                            var rows = Math.ceil(Math.min(200, total - startIdx) / cols);
                            var gridX = 20, gridY = 80;

                            for (var j = startIdx; j < total; j++) {
                                var idx = j - startIdx;
                                var col = idx % cols;
                                var row = Math.floor(idx / cols);
                                var cx = gridX + col * cellW;
                                var cy = gridY + row * cellH;
                                ctx.fillStyle = flips[j] === 1 ? viz.colors.blue : viz.colors.orange;
                                ctx.fillRect(cx, cy, cellW - 1, cellH - 1);
                            }

                            // Legend
                            var legY = gridY + rows * cellH + 15;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(w / 2 - 80, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Heads', w / 2 - 66, legY + 9);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(w / 2 + 10, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Tails', w / 2 + 24, legY + 9);

                            // Running proportion chart
                            if (total > 1) {
                                var chartY = legY + 30;
                                var chartH = h - chartY - 30;
                                var chartX = 50;
                                var chartW2 = w - 80;

                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(chartX, chartY);
                                ctx.lineTo(chartX, chartY + chartH);
                                ctx.lineTo(chartX + chartW2, chartY + chartH);
                                ctx.stroke();

                                // 50% line
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 0.5;
                                ctx.setLineDash([3, 3]);
                                var y50 = chartY + chartH / 2;
                                ctx.beginPath(); ctx.moveTo(chartX, y50); ctx.lineTo(chartX + chartW2, y50); ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('1.0', chartX - 4, chartY);
                                ctx.fillText('0.5', chartX - 4, y50);
                                ctx.fillText('0.0', chartX - 4, chartY + chartH);

                                // Running proportion
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var cumH = 0;
                                // Sample at most 500 points for performance
                                var step = Math.max(1, Math.floor(total / 500));
                                for (var k = 0; k < total; k++) {
                                    cumH += flips[k];
                                    if (k % step === 0 || k === total - 1) {
                                        var px = chartX + ((k + 1) / total) * chartW2;
                                        var py = chartY + chartH * (1 - cumH / (k + 1));
                                        if (k < step) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                    }
                                }
                                ctx.stroke();
                            }
                        }

                        VizEngine.createButton(controls, 'Flip 1', function() { addFlips(1); draw(); });
                        VizEngine.createButton(controls, 'Flip 10', function() { addFlips(10); draw(); });
                        VizEngine.createButton(controls, 'Flip 100', function() { addFlips(100); draw(); });
                        VizEngine.createButton(controls, 'Flip 500', function() { addFlips(500); draw(); });
                        VizEngine.createButton(controls, 'Reset', function() {
                            flips = []; maxStreak = 0; currentStreak = 0; currentSide = -1;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-dice-roller',
                    title: 'Dice Frequency Tracker',
                    description: 'Roll dice and watch the frequency distribution converge toward uniform (1/6 each).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var counts = [0, 0, 0, 0, 0, 0];
                        var total = 0;
                        var lastRoll = 0;

                        function roll(n) {
                            for (var i = 0; i < n; i++) {
                                var r = Math.floor(Math.random() * 6);
                                counts[r]++;
                                total++;
                                lastRoll = r + 1;
                            }
                        }

                        function drawDie(x, y, size, value) {
                            ctx.fillStyle = '#1a2a3a';
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            var r = 6;
                            ctx.beginPath();
                            ctx.moveTo(x + r, y);
                            ctx.lineTo(x + size - r, y);
                            ctx.quadraticCurveTo(x + size, y, x + size, y + r);
                            ctx.lineTo(x + size, y + size - r);
                            ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
                            ctx.lineTo(x + r, y + size);
                            ctx.quadraticCurveTo(x, y + size, x, y + size - r);
                            ctx.lineTo(x, y + r);
                            ctx.quadraticCurveTo(x, y, x + r, y);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();

                            // Dots
                            ctx.fillStyle = viz.colors.white;
                            var cx2 = x + size / 2, cy2 = y + size / 2;
                            var off = size * 0.25;
                            var dotR = size * 0.07;
                            var positions = {
                                1: [[cx2, cy2]],
                                2: [[cx2 - off, cy2 - off], [cx2 + off, cy2 + off]],
                                3: [[cx2 - off, cy2 - off], [cx2, cy2], [cx2 + off, cy2 + off]],
                                4: [[cx2 - off, cy2 - off], [cx2 + off, cy2 - off], [cx2 - off, cy2 + off], [cx2 + off, cy2 + off]],
                                5: [[cx2 - off, cy2 - off], [cx2 + off, cy2 - off], [cx2, cy2], [cx2 - off, cy2 + off], [cx2 + off, cy2 + off]],
                                6: [[cx2 - off, cy2 - off], [cx2 + off, cy2 - off], [cx2 - off, cy2], [cx2 + off, cy2], [cx2 - off, cy2 + off], [cx2 + off, cy2 + off]]
                            };
                            var dots = positions[value] || [];
                            for (var i = 0; i < dots.length; i++) {
                                ctx.beginPath();
                                ctx.arc(dots[i][0], dots[i][1], dotR, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Dice Frequency Tracker', w / 2, 18, viz.colors.white, 16);
                            viz.screenText('Total rolls: ' + total, w / 2, 38, viz.colors.text, 12);

                            // Draw last die
                            if (lastRoll > 0) {
                                drawDie(w / 2 - 30, 50, 60, lastRoll);
                            }

                            // Bar chart
                            var barY = 130, barH = 160;
                            var barAreaW = w - 120;
                            var barW = barAreaW / 6 * 0.6;
                            var gap = barAreaW / 6 * 0.4;
                            var startX = 60;

                            // Theoretical line at 1/6
                            var expected = total > 0 ? total / 6 : 1;
                            var maxCount = Math.max.apply(null, counts.concat([expected]));
                            if (maxCount === 0) maxCount = 1;

                            for (var i = 0; i < 6; i++) {
                                var bx = startX + i * (barW + gap);
                                var bh = (counts[i] / maxCount) * barH;
                                var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.pink];
                                ctx.fillStyle = colors[i];
                                ctx.fillRect(bx, barY + barH - bh, barW, bh);

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText((i + 1).toString(), bx + barW / 2, barY + barH + 16);

                                // Count
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(counts[i].toString(), bx + barW / 2, barY + barH - bh - 6);

                                // Percentage
                                if (total > 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText((counts[i] / total * 100).toFixed(1) + '%', bx + barW / 2, barY + barH + 30);
                                }
                            }

                            // Expected line
                            if (total > 0) {
                                var expH = (expected / maxCount) * barH;
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(startX - 10, barY + barH - expH);
                                ctx.lineTo(startX + 6 * (barW + gap), barY + barH - expH);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = viz.colors.red;
                                ctx.textAlign = 'left';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('Expected (1/6)', startX + 6 * (barW + gap) + 4, barY + barH - expH);
                            }
                        }

                        VizEngine.createButton(controls, 'Roll 1', function() { roll(1); draw(); });
                        VizEngine.createButton(controls, 'Roll 10', function() { roll(10); draw(); });
                        VizEngine.createButton(controls, 'Roll 100', function() { roll(100); draw(); });
                        VizEngine.createButton(controls, 'Roll 1000', function() { roll(1000); draw(); });
                        VizEngine.createButton(controls, 'Reset', function() {
                            counts = [0, 0, 0, 0, 0, 0]; total = 0; lastRoll = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "In a casino, the roulette wheel has landed on red 8 times in a row. A gambler says: \"Black is overdue, I'll bet big on black.\" Another gambler says: \"Red is hot, I'll bet on red.\" Who is right?",
                    hint: 'Are roulette spins independent events?',
                    solution: "Neither is right. Each spin is independent (assuming a fair wheel). The probability of black on the next spin is \\(\\frac{18}{38} \\approx 47.4\\%\\) regardless of history. The first gambler commits the gambler's fallacy; the second commits the \"hot hand\" fallacy (in a context where it does not apply). The only winning move is not to play (or to recognize the house edge)."
                },
                {
                    question: 'A fair coin is flipped 100 times and lands heads 60 times. After 10,000 more flips, the proportion of heads is very close to 50%. Did the extra flips "fix" the initial imbalance?',
                    hint: 'Look at absolute counts, not proportions.',
                    solution: 'No. After 10,100 flips, if the proportion is 50%, the total heads count is about 5,050. The original "surplus" of 10 extra heads is still there; it is now 10 out of 10,100 (0.1%) instead of 10 out of 100 (10%). The law of large numbers says proportions converge; it does not say imbalances cancel out. The absolute deviation can actually <em>grow</em> over time.'
                }
            ]
        },

        // ============================================================
        // SECTION 5: Expected Value
        // ============================================================
        {
            id: 'sec-expected',
            title: 'Expected Value',
            content: `
<h2>Expected Value</h2>

<div class="env-block intuition">
    <div class="env-title">What Is a "Fair" Game?</div>
    <div class="env-body">
        <p>You pay $1 to play a game. You flip a coin: heads, you get $2 back; tails, you get nothing. Is this game fair? Intuitively, yes. On average, you break even. The tool that formalizes "on average" is <strong>expected value</strong>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Expected Value)</div>
    <div class="env-body">
        <p>If a random variable \\(X\\) takes values \\(x_1, x_2, \\ldots, x_n\\) with probabilities \\(p_1, p_2, \\ldots, p_n\\), its <strong>expected value</strong> is</p>
        \\[E[X] = \\sum_{i=1}^{n} x_i \\cdot p_i.\\]
    </div>
</div>

<p>Expected value is the long-run average: if you play a game many times, your average payoff converges to the expected value.</p>

<div class="env-block example">
    <div class="env-title">Example: Standard Die</div>
    <div class="env-body">
        <p>Roll a fair die. The expected value of the result is:</p>
        \\[E[X] = \\frac{1}{6}(1 + 2 + 3 + 4 + 5 + 6) = \\frac{21}{6} = 3.5.\\]
        <p>You can never actually roll 3.5, but if you roll many times, the average approaches 3.5.</p>
    </div>
</div>

<h3>Is the Lottery Worth It?</h3>

<p>Consider a lottery ticket that costs $2. It pays $1,000,000 with probability \\(\\frac{1}{500{,}000}\\). The expected value of your net gain is:</p>

\\[E[\\text{gain}] = \\frac{1}{500{,}000} \\times \\$1{,}000{,}000 + \\frac{499{,}999}{500{,}000} \\times (\\$0) - \\$2 = \\$2 - \\$2 = \\$0.\\]

<p>This is a "fair" lottery (expected gain = 0). In practice, real lotteries have negative expected value because the prize pool is smaller than the total ticket revenue. For instance, a typical state lottery returns about 50 cents per dollar wagered: \\(E = -\\$1\\) per $2 ticket.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.4 (Linearity of Expectation)</div>
    <div class="env-body">
        <p>For any random variables \\(X\\) and \\(Y\\) (whether independent or not),</p>
        \\[E[X + Y] = E[X] + E[Y].\\]
    </div>
</div>

<p>This property is remarkably powerful. It lets us compute expected values by breaking complex situations into simple pieces, even when the pieces are dependent.</p>

<div class="viz-placeholder" data-viz="viz-expected-value"></div>
`,
            visualizations: [
                {
                    id: 'viz-expected-value',
                    title: 'Expected Value Calculator',
                    description: 'Explore the expected value of various games. Adjust payoffs and probabilities to see whether the game is fair, favorable, or unfavorable.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 380, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var games = [
                            { name: 'Fair Coin ($2 entry)', outcomes: [{ label: 'Heads: +$2', val: 2, prob: 0.5 }, { label: 'Tails: -$2', val: -2, prob: 0.5 }] },
                            { name: 'Die Roll (win face value)', outcomes: [
                                { label: '1', val: 1, prob: 1/6 }, { label: '2', val: 2, prob: 1/6 },
                                { label: '3', val: 3, prob: 1/6 }, { label: '4', val: 4, prob: 1/6 },
                                { label: '5', val: 5, prob: 1/6 }, { label: '6', val: 6, prob: 1/6 }
                            ] },
                            { name: 'Lottery ($2 ticket)', outcomes: [{ label: 'Win $1M', val: 999998, prob: 1/500000 }, { label: 'Lose', val: -2, prob: 499999/500000 }] },
                            { name: 'Roulette: Red ($1 bet)', outcomes: [{ label: 'Win +$1', val: 1, prob: 18/38 }, { label: 'Lose -$1', val: -1, prob: 20/38 }] },
                            { name: 'Insurance ($100/yr)', outcomes: [{ label: 'No claim: -$100', val: -100, prob: 0.99 }, { label: 'Claim: +$9900', val: 9900, prob: 0.01 }] }
                        ];
                        var selectedGame = 0;
                        var simResults = [];
                        var simTotal = 0;

                        function computeEV(game) {
                            var ev = 0;
                            for (var i = 0; i < game.outcomes.length; i++) {
                                ev += game.outcomes[i].val * game.outcomes[i].prob;
                            }
                            return ev;
                        }

                        function simulateOne(game) {
                            var r = Math.random();
                            var cum = 0;
                            for (var i = 0; i < game.outcomes.length; i++) {
                                cum += game.outcomes[i].prob;
                                if (r < cum) return game.outcomes[i].val;
                            }
                            return game.outcomes[game.outcomes.length - 1].val;
                        }

                        function draw() {
                            viz.clear();
                            var game = games[selectedGame];
                            var ev = computeEV(game);

                            viz.screenText('Expected Value Explorer', w / 2, 18, viz.colors.white, 16);
                            viz.screenText(game.name, w / 2, 42, viz.colors.teal, 14);

                            // Outcome breakdown
                            var oy = 70;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var i = 0; i < game.outcomes.length; i++) {
                                var o = game.outcomes[i];
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(o.label, 30, oy + i * 18);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText('P = ' + o.prob.toFixed(6), 220, oy + i * 18);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('Val = $' + o.val.toFixed(2), 380, oy + i * 18);
                            }

                            // EV
                            var evY = oy + game.outcomes.length * 18 + 16;
                            var evColor = ev > 0.01 ? viz.colors.green : (ev < -0.01 ? viz.colors.red : viz.colors.white);
                            var evLabel = ev > 0.01 ? 'Favorable' : (ev < -0.01 ? 'Unfavorable' : 'Fair');
                            viz.screenText('E[X] = $' + ev.toFixed(4) + '  (' + evLabel + ')', w / 2, evY, evColor, 15);

                            // Simulation chart
                            if (simResults.length > 0) {
                                var chartX = 60, chartY2 = evY + 30;
                                var chartW2 = w - 100, chartH2 = h - chartY2 - 40;

                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(chartX, chartY2);
                                ctx.lineTo(chartX, chartY2 + chartH2);
                                ctx.lineTo(chartX + chartW2, chartY2 + chartH2);
                                ctx.stroke();

                                // Find range for y
                                var cumulative = [];
                                var sum = 0;
                                for (var j = 0; j < simResults.length; j++) {
                                    sum += simResults[j];
                                    cumulative.push(sum);
                                }
                                var minVal = Math.min.apply(null, cumulative.concat([0]));
                                var maxVal = Math.max.apply(null, cumulative.concat([0]));
                                var range = maxVal - minVal;
                                if (range < 1) range = 1;

                                // Zero line
                                var zeroY = chartY2 + chartH2 * (maxVal / range);
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 0.5;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(chartX, zeroY); ctx.lineTo(chartX + chartW2, zeroY); ctx.stroke();
                                ctx.setLineDash([]);

                                // Cumulative line
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var step = Math.max(1, Math.floor(simResults.length / 500));
                                for (var k = 0; k < simResults.length; k++) {
                                    if (k % step !== 0 && k !== simResults.length - 1) continue;
                                    var px = chartX + ((k + 1) / simResults.length) * chartW2;
                                    var py = chartY2 + chartH2 * ((maxVal - cumulative[k]) / range);
                                    if (k < step) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // EV line (theoretical)
                                var evEnd = ev * simResults.length;
                                if (Math.abs(ev) > 0.001) {
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 1;
                                    ctx.setLineDash([4, 4]);
                                    ctx.beginPath();
                                    ctx.moveTo(chartX, zeroY);
                                    var evEndY = chartY2 + chartH2 * ((maxVal - evEnd) / range);
                                    ctx.lineTo(chartX + chartW2, evEndY);
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                }

                                viz.screenText('Cumulative gain after ' + simResults.length + ' plays: $' + sum.toFixed(2), w / 2, h - 15, viz.colors.white, 12);
                            }
                        }

                        // Game selector buttons
                        for (var g = 0; g < games.length; g++) {
                            (function(idx) {
                                VizEngine.createButton(controls, games[idx].name.split('(')[0].trim(), function() {
                                    selectedGame = idx;
                                    simResults = [];
                                    simTotal = 0;
                                    draw();
                                });
                            })(g);
                        }

                        VizEngine.createButton(controls, 'Play 100', function() {
                            for (var i = 0; i < 100; i++) simResults.push(simulateOne(games[selectedGame]));
                            draw();
                        });

                        VizEngine.createButton(controls, 'Play 1000', function() {
                            for (var i = 0; i < 1000; i++) simResults.push(simulateOne(games[selectedGame]));
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset Sim', function() {
                            simResults = [];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A game costs $5 to play. You roll two dice: if the sum is 7, you win $20; otherwise you win nothing. What is the expected value of your net gain?',
                    hint: 'What is the probability of rolling a 7 with two dice?',
                    solution: 'There are 36 equally likely outcomes for two dice. The sum is 7 in 6 cases: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). So \\(P(7) = \\frac{6}{36} = \\frac{1}{6}\\). Expected gain: \\(E = \\frac{1}{6} \\times 20 + \\frac{5}{6} \\times 0 - 5 = \\frac{20}{6} - 5 = 3.33 - 5 = -\\$1.67\\). The game is unfavorable.'
                },
                {
                    question: 'Using linearity of expectation: if you roll a fair die 10 times, what is the expected sum?',
                    hint: 'What is the expected value of a single die roll?',
                    solution: 'Each roll has \\(E[X_i] = 3.5\\). By linearity, \\(E[X_1 + X_2 + \\cdots + X_{10}] = 10 \\times 3.5 = 35\\). We did not need to know the distribution of the sum; linearity handles it effortlessly.'
                }
            ]
        },

        // ============================================================
        // SECTION 6: Bridge & Two Envelope
        // ============================================================
        {
            id: 'sec-bridge',
            title: 'Paradoxes and Perspectives',
            content: `
<h2>Paradoxes and Perspectives</h2>

<div class="env-block intuition">
    <div class="env-title">Where Does It All Lead?</div>
    <div class="env-body">
        <p>We have seen that probability is full of traps for the unwary. The Monty Hall problem teaches that information matters. The birthday paradox teaches that pairs grow faster than individuals. The gambler's fallacy teaches that independence is absolute. Expected value teaches that "fair" has a precise meaning. We close with one more puzzle that has confused mathematicians for decades.</p>
    </div>
</div>

<h3>The Two-Envelope Paradox</h3>

<p>You are given two envelopes. One contains twice as much money as the other. You pick one at random and open it: it contains $100. Should you switch?</p>

<p>The "switching" argument goes like this: the other envelope contains either $50 or $200, each with probability \\(\\frac{1}{2}\\). The expected value of switching is:</p>

\\[E[\\text{switch}] = \\frac{1}{2}(50) + \\frac{1}{2}(200) = 125 > 100.\\]

<p>So you should switch! But wait: you could make the <em>same argument</em> no matter what you saw. And by symmetry, both envelopes are equally likely to be the larger one. Something is wrong.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.5 (Two-Envelope Resolution)</div>
    <div class="env-body">
        <p>The flaw is in assigning equal probability to "other = $50" and "other = $200." These are not equally likely given the information you have. Let \\(S\\) be the smaller amount. If \\(S\\) and \\(2S\\) are the envelope values, then seeing $100 means either \\(S = 100\\) (you have the small envelope) or \\(S = 50\\) (you have the large envelope). The prior distribution on \\(S\\) determines the correct conditional probabilities; the argument above implicitly assumes a uniform prior on all positive reals, which is improper (does not integrate to 1).</p>
    </div>
</div>

<p>The two-envelope paradox illustrates that expected value calculations require a well-defined probability model. When the model is incoherent, the conclusions are nonsense.</p>

<div class="viz-placeholder" data-viz="viz-two-envelope"></div>

<h3>What We Have Learned</h3>

<p>Probability puzzles are not just party tricks. They reveal deep features of probabilistic reasoning:</p>

<ul>
    <li><strong>Information changes probabilities.</strong> (Monty Hall, Bayes' theorem)</li>
    <li><strong>Pairs grow quadratically.</strong> (Birthday paradox, collision problems)</li>
    <li><strong>Independence means no memory.</strong> (Gambler's fallacy)</li>
    <li><strong>Expected value is the right yardstick for repeated decisions.</strong> (Fair games, insurance, lotteries)</li>
    <li><strong>Ill-defined models produce paradoxes.</strong> (Two envelopes)</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>These ideas form the foundation of statistics, machine learning, cryptography, game theory, and quantitative finance. Every time you update a belief given evidence (Bayes), test whether a pattern is real or random (hypothesis testing), or make a decision under uncertainty (expected utility), you are doing probability.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-two-envelope',
                    title: 'The Two-Envelope Paradox',
                    description: 'Simulate the two-envelope game. Pick an envelope, see the amount, decide to switch or stay. Track your results over many rounds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 380, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var smallAmt = 0;
                        var myEnvelope = -1; // 0 = small, 1 = large
                        var myAmount = 0;
                        var phase = 'pick'; // pick, opened, result
                        var resultText = '';
                        var stats = { switchTotal: 0, stayTotal: 0, switchCount: 0, stayCount: 0 };

                        function newRound() {
                            // Random small amount between 10 and 200
                            smallAmt = (Math.floor(Math.random() * 20) + 1) * 10;
                            myEnvelope = Math.random() < 0.5 ? 0 : 1;
                            myAmount = myEnvelope === 0 ? smallAmt : smallAmt * 2;
                            phase = 'pick';
                            resultText = '';
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('The Two-Envelope Paradox', w / 2, 20, viz.colors.white, 16);

                            var envW = 120, envH = 80;
                            var envY = 100;
                            var env1x = w / 2 - envW - 30;
                            var env2x = w / 2 + 30;

                            // Draw envelopes
                            for (var e = 0; e < 2; e++) {
                                var ex = e === 0 ? env1x : env2x;
                                var isMyPick = (phase !== 'pick') && ((e === 0 && myEnvelope === 0) || (e === 1 && myEnvelope === 1));
                                var showAmount = (phase === 'opened' && isMyPick) || phase === 'result';

                                // Envelope body
                                ctx.fillStyle = isMyPick ? '#1a3a2a' : '#1a2a3a';
                                ctx.strokeStyle = isMyPick ? viz.colors.teal : viz.colors.axis;
                                ctx.lineWidth = isMyPick ? 2.5 : 1.5;
                                ctx.fillRect(ex, envY, envW, envH);
                                ctx.strokeRect(ex, envY, envW, envH);

                                // Flap
                                ctx.beginPath();
                                ctx.moveTo(ex, envY);
                                ctx.lineTo(ex + envW / 2, envY - 30);
                                ctx.lineTo(ex + envW, envY);
                                ctx.closePath();
                                ctx.fillStyle = isMyPick ? '#1a3a2a' : '#1a2a3a';
                                ctx.fill();
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Envelope ' + (e + 1), ex + envW / 2, envY + envH + 18);

                                if (phase === 'result') {
                                    // Show both amounts
                                    var amt = (e === 0 ? (myEnvelope === 0 ? myAmount : (myEnvelope === 0 ? myAmount : (smallAmt === myAmount ? smallAmt * 2 : smallAmt))) : 0);
                                    // Simpler: envelope 0 has smallAmt if myEnvelope=0 was small, etc.
                                    var envVal;
                                    if (myEnvelope === 0) {
                                        envVal = e === 0 ? smallAmt : smallAmt * 2;
                                    } else {
                                        envVal = e === 0 ? smallAmt : smallAmt * 2;
                                    }
                                    // Actually: the small amount is always smallAmt. If myEnvelope=0, env0=smallAmt, env1=2*smallAmt
                                    // If myEnvelope=1, env0=smallAmt, env1=2*smallAmt
                                    // Wait, myEnvelope is which one I picked (0=small, 1=large). But the physical envelopes are random.
                                    // Let me simplify: just show the values
                                    var actualVal = e === 0 ? smallAmt : smallAmt * 2;
                                    if (myEnvelope === 1) {
                                        // I picked the large one, so I'm holding env with 2*smallAmt
                                        // but which physical envelope? Let's just track it differently.
                                    }
                                    // Simplest approach: physical envelope A = smallAmt, B = 2*smallAmt
                                    // myEnvelope tells which value I got
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    var displayVal = e === 0 ? smallAmt : smallAmt * 2;
                                    ctx.fillText('$' + displayVal, ex + envW / 2, envY + envH / 2 + 5);
                                } else if (showAmount) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 18px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('$' + myAmount, ex + envW / 2, envY + envH / 2 + 5);
                                } else if (phase === 'pick') {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('?', ex + envW / 2, envY + envH / 2 + 5);
                                }
                            }

                            if (phase === 'pick') {
                                viz.screenText('Click an envelope to pick it!', w / 2, 55, viz.colors.teal, 13);
                            } else if (phase === 'opened') {
                                viz.screenText('You opened your envelope: $' + myAmount + '. Switch or Stay?', w / 2, 55, viz.colors.orange, 13);
                            } else {
                                viz.screenText(resultText, w / 2, 55, viz.colors.green, 13);
                            }

                            // Stats
                            var sy = 260;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            var swAvg = stats.switchCount > 0 ? (stats.switchTotal / stats.switchCount).toFixed(1) : '--';
                            var stAvg = stats.stayCount > 0 ? (stats.stayTotal / stats.stayCount).toFixed(1) : '--';

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Switch: ' + stats.switchCount + ' times, avg payout $' + swAvg, 30, sy);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Stay:   ' + stats.stayCount + ' times, avg payout $' + stAvg, 30, sy + 22);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Theory: both strategies yield the same average (by symmetry)', w / 2, sy + 55);

                            // Switching argument display
                            if (phase === 'opened') {
                                var half = myAmount / 2;
                                var doub = myAmount * 2;
                                ctx.fillStyle = viz.colors.purple;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Naive argument: other envelope is $' + half + ' or $' + doub, w / 2, sy + 80);
                                ctx.fillText('"Expected" value of switch = 0.5 x ' + half + ' + 0.5 x ' + doub + ' = $' + (half * 0.5 + doub * 0.5).toFixed(0), w / 2, sy + 96);
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('But this argument is WRONG! (The probabilities are not 50/50.)', w / 2, sy + 112);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (phase !== 'pick') return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var envW = 120, envH = 80, envY = 100;
                            var env1x = w / 2 - envW - 30;
                            var env2x = w / 2 + 30;

                            var picked = -1;
                            if (mx >= env1x && mx <= env1x + envW && my >= envY - 30 && my <= envY + envH) picked = 0;
                            if (mx >= env2x && mx <= env2x + envW && my >= envY - 30 && my <= envY + envH) picked = 1;

                            if (picked >= 0) {
                                // If picked envelope 0, and myEnvelope = 0 (small), we show smallAmt
                                // If picked envelope 0, and myEnvelope = 1 (large), we picked the small one
                                // Simplify: reassign myEnvelope based on which physical envelope chosen
                                // Physical: env0 = smallAmt, env1 = 2*smallAmt
                                myEnvelope = picked;
                                myAmount = picked === 0 ? smallAmt : smallAmt * 2;
                                phase = 'opened';
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Switch', function() {
                            if (phase !== 'opened') return;
                            var otherAmount = myEnvelope === 0 ? smallAmt * 2 : smallAmt;
                            stats.switchTotal += otherAmount;
                            stats.switchCount++;
                            resultText = 'You switched! Got $' + otherAmount + ' (had $' + myAmount + ')';
                            phase = 'result';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Stay', function() {
                            if (phase !== 'opened') return;
                            stats.stayTotal += myAmount;
                            stats.stayCount++;
                            resultText = 'You stayed with $' + myAmount;
                            phase = 'result';
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Round', function() { newRound(); });
                        VizEngine.createButton(controls, 'Reset Stats', function() {
                            stats = { switchTotal: 0, stayTotal: 0, switchCount: 0, stayCount: 0 };
                            newRound();
                        });

                        newRound();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'You draw a card from a standard 52-card deck. You win $10 if it is an ace, $5 if it is a face card (J, Q, K), and nothing otherwise. What is the expected value of your winnings?',
                    hint: 'Count the aces (4), face cards (12), and remaining cards (36).',
                    solution: '\\(E = \\frac{4}{52} \\times 10 + \\frac{12}{52} \\times 5 + \\frac{36}{52} \\times 0 = \\frac{40 + 60}{52} = \\frac{100}{52} \\approx \\$1.92\\).'
                },
                {
                    question: 'In the two-envelope paradox, suppose you know that the smaller amount is equally likely to be $10, $20, $50, or $100. You open your envelope and see $20. What is the probability that you hold the smaller envelope?',
                    hint: 'If you hold the smaller envelope, then S = 20. If you hold the larger, then S = 10 (so 2S = 20). Which prior values of S make your observation possible?',
                    solution: 'You see $20. This is possible if (a) S = 20 and you hold the small envelope, or (b) S = 10 and you hold the large envelope (2 x 10 = 20). Each value of S has prior probability 1/4, and you are equally likely to hold either envelope. So P(see 20 | S=20) = 1/2, P(see 20 | S=10) = 1/2. By Bayes\' theorem: P(small | see 20) = P(see 20 | small, S=20) P(S=20) / [P(see 20 | small, S=20) P(S=20) + P(see 20 | large, S=10) P(S=10)] = (1/2)(1/4) / [(1/2)(1/4) + (1/2)(1/4)] = 1/2. In this case it is genuinely 50/50, and the expected value of switching is 0.5 x 40 + 0.5 x 10 = $25, which is indeed more than $20. But this is specific to the prior; for other priors, the answer differs.'
                }
            ]
        }
    ]
});
})();
