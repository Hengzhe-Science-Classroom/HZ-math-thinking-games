// === Chapter 8: The Pigeonhole Principle ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch08',
        number: 8,
        title: 'The Pigeonhole Principle',
        subtitle: 'A statement so obvious it sounds trivial, yet powerful enough to prove the impossible',

        sections: [
            // ============================================================
            // Section 1: More pigeons than holes
            // ============================================================
            {
                id: 'basic',
                title: 'More Pigeons Than Holes',
                content: `
<h2>The Simplest Deep Idea</h2>

<p>Imagine 6 pigeons flying into 5 pigeonholes. No matter how the pigeons arrange themselves, at least one hole must contain 2 or more pigeons. There is simply no way around it.</p>

<div class="env-block theorem">
<strong>The Pigeonhole Principle (Basic Form)</strong><br>
If \\(n + 1\\) (or more) objects are placed into \\(n\\) containers, then at least one container holds at least 2 objects.
</div>

<p>This sounds too obvious to be useful. And yet, it is one of the most powerful tools in combinatorics and beyond. The trick is not the statement itself but figuring out what the "pigeons" and "holes" should be in a given problem.</p>

<div class="env-block example">
<strong>Socks in the dark</strong><br>
A drawer has 10 red socks and 10 blue socks. You pull socks out in the dark. How many must you pull to guarantee a matching pair? The "pigeons" are socks, the "holes" are colors (2 colors). By the pigeonhole principle, pulling \\(2 + 1 = 3\\) socks guarantees at least two of the same color.
</div>

<div class="env-block example">
<strong>13 people, same birth month</strong><br>
If 13 people are in a room, at least two share a birth month. There are 12 months (holes) and 13 people (pigeons), so by the pigeonhole principle, at least one month has 2 or more people.
</div>

<p>Try it in the interactive demonstration below. Drag pigeons into holes and watch what happens when you have more pigeons than holes.</p>

<div class="viz-placeholder" data-viz="pigeon-demo"></div>

<div class="env-block intuition">
<strong>The real power</strong><br>
The pigeonhole principle gives <em>existence</em> proofs. It tells you that something <em>must</em> happen without telling you exactly where or when. This is what makes it so useful in theoretical arguments: you do not need to find the specific case, just prove it exists.
</div>
`,
                visualizations: [
                    {
                        id: 'pigeon-demo',
                        title: 'Pigeons into Holes',
                        description: 'Click "Add Pigeon" to randomly place a pigeon. When there are more pigeons than holes, at least one hole is highlighted with 2+ pigeons.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var numHoles = 5;
                            var holes = []; // each element: array of pigeon indices
                            var totalPigeons = 0;
                            var pigeonColors = [viz.colors.blue, viz.colors.orange, viz.colors.teal,
                                                viz.colors.green, viz.colors.purple, viz.colors.pink,
                                                viz.colors.yellow, viz.colors.red, viz.colors.gold, viz.colors.white];

                            function resetHoles() {
                                holes = [];
                                for (var i = 0; i < numHoles; i++) holes.push([]);
                                totalPigeons = 0;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;

                                var spacing = Math.min(100, (W - 40) / numHoles);
                                var startX = (W - (numHoles - 1) * spacing) / 2;
                                var holeY = H - 80;
                                var holeW = spacing * 0.7;
                                var holeH = 50;

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(totalPigeons + ' pigeons, ' + numHoles + ' holes', W / 2, 24);

                                // Check if pigeonhole violated
                                var maxInHole = 0;
                                var overflowIdx = -1;
                                for (var i = 0; i < holes.length; i++) {
                                    if (holes[i].length > maxInHole) {
                                        maxInHole = holes[i].length;
                                        overflowIdx = i;
                                    }
                                }
                                var violated = totalPigeons > numHoles;

                                // Draw holes
                                for (var i = 0; i < numHoles; i++) {
                                    var hx = startX + i * spacing;
                                    var isOver = holes[i].length >= 2;

                                    // Hole box
                                    ctx.fillStyle = isOver ? viz.colors.red + '33' : '#1a1a4066';
                                    ctx.fillRect(hx - holeW / 2, holeY - holeH, holeW, holeH);
                                    ctx.strokeStyle = isOver ? viz.colors.red : viz.colors.axis;
                                    ctx.lineWidth = isOver ? 2.5 : 1;
                                    ctx.strokeRect(hx - holeW / 2, holeY - holeH, holeW, holeH);

                                    // Hole label
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText('Hole ' + (i + 1), hx, holeY + 4);

                                    // Draw pigeons in this hole
                                    var pigeonR = 10;
                                    for (var j = 0; j < holes[i].length; j++) {
                                        var py = holeY - holeH + 14 + j * 22;
                                        var pIdx = holes[i][j];
                                        ctx.fillStyle = pigeonColors[pIdx % pigeonColors.length];
                                        ctx.beginPath(); ctx.arc(hx, Math.min(py, holeY - 14), pigeonR, 0, Math.PI * 2); ctx.fill();
                                        // Pigeon number
                                        ctx.fillStyle = '#000';
                                        ctx.font = 'bold 9px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(pIdx + 1, hx, Math.min(py, holeY - 14));
                                    }
                                }

                                // Message
                                if (violated) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText('Pigeonhole Principle triggered! At least one hole has \u2265 2 pigeons.', W / 2, 50);
                                } else if (totalPigeons > 0) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText('So far, each hole has at most 1 pigeon. Add more!', W / 2, 50);
                                }

                                // Count display
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Max in any hole: ' + maxInHole, W / 2, 74);
                            }

                            resetHoles();

                            VizEngine.createSlider(controls, 'Holes', 2, 10, numHoles, 1, function (v) {
                                numHoles = Math.round(v);
                                resetHoles();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Add Pigeon', function () {
                                if (totalPigeons >= numHoles * 3) return; // cap
                                var target = Math.floor(Math.random() * numHoles);
                                holes[target].push(totalPigeons);
                                totalPigeons++;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Fill n+1', function () {
                                resetHoles();
                                // Place n+1 pigeons
                                for (var p = 0; p <= numHoles; p++) {
                                    var target = Math.floor(Math.random() * numHoles);
                                    holes[target].push(p);
                                    totalPigeons++;
                                }
                                draw();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                resetHoles();
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A bag has red, blue, green, and yellow marbles (many of each). How many must you draw to guarantee 3 of the same color?',
                        hint: 'Pigeons = marbles, holes = 4 colors. You want at least 3 in one hole.',
                        solution: 'In the worst case, you draw 2 of each color (8 marbles) before getting a third of any color. So you need \\(2 \\times 4 + 1 = 9\\) marbles.'
                    },
                    {
                        question: 'Prove that among any 5 integers, two must have the same remainder when divided by 4.',
                        hint: 'What are the possible remainders mod 4?',
                        solution: 'The possible remainders when dividing by 4 are 0, 1, 2, 3 (four values). Five integers with four possible remainders: by the pigeonhole principle, at least two share the same remainder.'
                    }
                ]
            },

            // ============================================================
            // Section 2: Simple applications
            // ============================================================
            {
                id: 'simple-apps',
                title: 'Simple Applications',
                content: `
<h2>Surprising Consequences of the Obvious</h2>

<h3>The handshake theorem</h3>

<p>At a party of \\(n \\geq 2\\) people, each person shakes hands with some others. Prove that at least two people shook the same number of hands.</p>

<p>Each person could shake 0 to \\(n-1\\) hands. That is \\(n\\) possible values. But wait: if someone shook 0 hands (nobody), then nobody shook \\(n-1\\) hands (everybody). So at most \\(n-1\\) distinct values are actually achievable. With \\(n\\) people and at most \\(n-1\\) possible handshake counts, the pigeonhole principle guarantees a repeat.</p>

<div class="env-block theorem">
<strong>Handshake Theorem</strong><br>
At any party, at least two people shook the same number of hands.
</div>

<h3>Points in a square</h3>

<div class="env-block example">
<strong>5 points in a unit square</strong><br>
Place 5 points anywhere inside a \\(1 \\times 1\\) square. Prove that at least two points are within distance \\(\\frac{\\sqrt{2}}{2}\\) of each other.<br><br>
Divide the square into 4 equal sub-squares of size \\(\\frac{1}{2} \\times \\frac{1}{2}\\). By pigeonhole, at least 2 of the 5 points land in the same sub-square. The maximum distance between two points in a \\(\\frac{1}{2} \\times \\frac{1}{2}\\) square is its diagonal: \\(\\frac{\\sqrt{2}}{2} \\approx 0.707\\). Done!
</div>

<h3>Divisibility trick</h3>

<div class="env-block example">
<strong>Consecutive sums divisible by \\(n\\)</strong><br>
Given \\(n\\) integers \\(a_1, a_2, \\ldots, a_n\\), there is always a consecutive block \\(a_{i+1} + a_{i+2} + \\cdots + a_j\\) whose sum is divisible by \\(n\\).<br><br>
Consider the partial sums \\(S_k = a_1 + a_2 + \\cdots + a_k\\) for \\(k = 1, \\ldots, n\\), plus \\(S_0 = 0\\). That is \\(n+1\\) values. Their remainders mod \\(n\\) take values in \\(\\{0, 1, \\ldots, n-1\\}\\). If any \\(S_k \\equiv 0\\), we are done. Otherwise, \\(n\\) non-zero remainders from \\(n-1\\) possible values, so two must match: \\(S_i \\equiv S_j \\pmod{n}\\). Then \\(S_j - S_i = a_{i+1} + \\cdots + a_j\\) is divisible by \\(n\\).
</div>

<div class="env-block remark">
<strong>Pattern</strong><br>
Notice the problem-solving strategy: define your "objects" and "categories" cleverly, then let the pigeonhole principle do the heavy lifting. The creativity lies in the setup, not in the conclusion.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A chess player plays at least 1 game per day for 77 days but no more than 132 games total. Prove there is a consecutive stretch of days where they played exactly 21 games.',
                        hint: 'Let \\(a_i\\) = total games through day \\(i\\). Consider the \\(2 \\times 77 = 154\\) numbers: \\(a_1, \\ldots, a_{77}\\) and \\(a_1 + 21, \\ldots, a_{77} + 21\\). What are their ranges?',
                        solution: 'The values \\(a_1, \\ldots, a_{77}\\) range from 1 to 132. The values \\(a_1 + 21, \\ldots, a_{77} + 21\\) range from 22 to 153. All 154 numbers lie in \\(\\{1, 2, \\ldots, 153\\}\\), which has 153 values. By pigeonhole, two must be equal. They cannot both be from the same group (since \\(a_i\\) is strictly increasing), so \\(a_j = a_i + 21\\) for some \\(i, j\\). The games played on days \\(i+1\\) through \\(j\\) total exactly 21.'
                    },
                    {
                        question: 'Among any 10 integers, prove that some non-empty subset has a sum divisible by 10.',
                        hint: 'Consider the 10 partial sums mod 10.',
                        solution: 'Consider partial sums \\(S_1, S_2, \\ldots, S_{10}\\) (each mod 10). If any \\(S_k \\equiv 0\\), the subset \\(\\{a_1, \\ldots, a_k\\}\\) works. Otherwise, 10 values in 9 bins \\(\\{1, \\ldots, 9\\}\\), so two match: \\(S_i \\equiv S_j \\pmod{10}\\) with \\(i < j\\). Then \\(a_{i+1} + \\cdots + a_j\\) is divisible by 10.'
                    }
                ]
            },

            // ============================================================
            // Section 3: The generalized pigeonhole
            // ============================================================
            {
                id: 'generalized',
                title: 'The Generalized Pigeonhole',
                content: `
<h2>More Than Just Two in a Hole</h2>

<p>The basic pigeonhole principle says \\(n+1\\) pigeons in \\(n\\) holes forces at least one hole to have \\(\\geq 2\\). But what if we have many more pigeons?</p>

<div class="env-block theorem">
<strong>Generalized Pigeonhole Principle</strong><br>
If \\(N\\) objects are placed into \\(k\\) containers, then at least one container holds at least \\(\\lceil N/k \\rceil\\) objects (where \\(\\lceil \\cdot \\rceil\\) is the ceiling function, rounding up).
</div>

<p>In other words, you cannot spread things out <em>too</em> evenly. The most crowded bin has at least \\(\\lceil N/k \\rceil\\) items.</p>

<div class="env-block example">
<strong>Birthday months, revisited</strong><br>
Among 100 people, at least \\(\\lceil 100/12 \\rceil = 9\\) share the same birth month. Not just 2, but at least 9!
</div>

<div class="env-block example">
<strong>Cards in a hand</strong><br>
You are dealt 13 cards from a standard 52-card deck (4 suits). At least \\(\\lceil 13/4 \\rceil = 4\\) cards must be of the same suit.
</div>

<h3>Proof of the generalized version</h3>

<p>Suppose (for contradiction) that every container has fewer than \\(\\lceil N/k \\rceil\\) objects, meaning each has at most \\(\\lceil N/k \\rceil - 1\\). Then the total is at most \\(k \\cdot (\\lceil N/k \\rceil - 1) < k \\cdot N/k = N\\). But we have \\(N\\) objects total. Contradiction.</p>

<div class="env-block remark">
<strong>The ceiling matters</strong><br>
If \\(N = 25\\) objects go into \\(k = 7\\) bins, at least one bin has \\(\\lceil 25/7 \\rceil = 4\\) objects. You cannot say "at least 3.57," which is why we need the ceiling.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A bag contains red, blue, green, yellow, and white marbles. How many must you draw to guarantee 4 of the same color?',
                        hint: 'You want \\(\\lceil N/5 \\rceil \\geq 4\\), which means \\(N \\geq 5 \\times 3 + 1\\).',
                        solution: 'In the worst case, you draw 3 of each color (15 marbles) before getting a 4th of any color. So \\(3 \\times 5 + 1 = 16\\) draws guarantee 4 of one color.'
                    },
                    {
                        question: 'How many integers must you pick from \\(\\{1, 2, \\ldots, 50\\}\\) to guarantee two that differ by at most 1?',
                        hint: 'Group the 50 integers into pairs: \\(\\{1,2\\}, \\{3,4\\}, \\ldots, \\{49,50\\}\\). How many groups are there?',
                        solution: 'There are 25 pairs. Picking 26 integers means (by pigeonhole) two must come from the same pair, so they differ by at most 1.'
                    }
                ]
            },

            // ============================================================
            // Section 4: Surprising consequences
            // ============================================================
            {
                id: 'surprising',
                title: 'Surprising Consequences',
                content: `
<h2>The Birthday Problem</h2>

<p>The birthday problem asks: how many people must be in a room before there is a greater than 50% chance that two share a birthday?</p>

<p>The pigeonhole principle tells us that with 367 people (366 possible birthdays + 1), a shared birthday is <em>guaranteed</em>. But probability kicks in much earlier.</p>

<div class="env-block theorem">
<strong>Birthday Problem</strong><br>
With just 23 people, the probability of a shared birthday exceeds 50%. With 70 people, it exceeds 99.9%.
</div>

<h3>The calculation</h3>

<p>It is easier to compute the probability of <em>no</em> match. For \\(k\\) people:</p>
\\[
P(\\text{all different}) = \\frac{365}{365} \\times \\frac{364}{365} \\times \\frac{363}{365} \\times \\cdots \\times \\frac{365-k+1}{365}
\\]

<p>For \\(k = 23\\): \\(P(\\text{all different}) \\approx 0.4927\\), so \\(P(\\text{match}) \\approx 0.5073 > 50\\%\\).</p>

<div class="env-block intuition">
<strong>Why so few?</strong><br>
The key insight is that we are not asking if someone shares <em>your</em> birthday (that would need about 253 people for 50%). We are asking if <em>any two people</em> in the room share a birthday. With 23 people, there are \\(\\binom{23}{2} = 253\\) pairs to check. Each pair has a small chance of matching, but 253 chances add up fast.
</div>

<p>Watch the birthday paradox unfold in the simulator below. Generate random "people" and see how quickly a collision appears.</p>

<div class="viz-placeholder" data-viz="birthday-sim"></div>

<h3>Beyond birthdays</h3>

<p>The birthday problem appears in computer science (hash collisions), cryptography (birthday attacks), and DNA analysis (random matches). Any time you are looking for collisions in a random process, the birthday paradox applies.</p>
`,
                visualizations: [
                    {
                        id: 'birthday-sim',
                        title: 'Birthday Paradox Simulator',
                        description: 'Add random people one at a time. The bar chart shows birthdays by month. Watch how quickly a collision (shared birthday) occurs.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 400, scale: 1, originX: 0, originY: 0 });
                            var people = [];    // array of day-of-year (0-364)
                            var collision = -1; // day of first collision, or -1
                            var dayCount = new Array(365);
                            var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

                            function reset() {
                                people = [];
                                collision = -1;
                                for (var i = 0; i < 365; i++) dayCount[i] = 0;
                            }

                            function addPerson() {
                                var day = Math.floor(Math.random() * 365);
                                people.push(day);
                                dayCount[day]++;
                                if (dayCount[day] >= 2 && collision < 0) collision = day;
                            }

                            function dayToLabel(d) {
                                var m = 0, cum = 0;
                                for (m = 0; m < 12; m++) {
                                    if (d < cum + monthDays[m]) break;
                                    cum += monthDays[m];
                                }
                                return monthNames[m] + ' ' + (d - cum + 1);
                            }

                            // Probability calculation
                            function theoreticalProb(k) {
                                if (k <= 1) return 0;
                                var p = 1;
                                for (var i = 0; i < k; i++) p *= (365 - i) / 365;
                                return 1 - p;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var k = people.length;

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(k + ' people in the room', W / 2, 22);

                                // Monthly histogram
                                var monthCounts = new Array(12).fill(0);
                                for (var i = 0; i < k; i++) {
                                    var d = people[i], cum = 0, m = 0;
                                    for (m = 0; m < 12; m++) {
                                        if (d < cum + monthDays[m]) break;
                                        cum += monthDays[m];
                                    }
                                    monthCounts[m]++;
                                }
                                var maxMonth = Math.max(1, Math.max.apply(null, monthCounts));
                                var barW = (W - 80) / 12;
                                var barMaxH = 120;
                                var barY0 = 170;

                                for (var m = 0; m < 12; m++) {
                                    var bx = 40 + m * barW;
                                    var bh = monthCounts[m] / maxMonth * barMaxH;
                                    ctx.fillStyle = monthCounts[m] > 0 ? viz.colors.blue : '#1a1a40';
                                    ctx.fillRect(bx + 2, barY0 - bh, barW - 4, bh);
                                    // Label
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(monthNames[m], bx + barW / 2, barY0 + 12);
                                    if (monthCounts[m] > 0) {
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.fillText(monthCounts[m], bx + barW / 2, barY0 - bh - 6);
                                    }
                                }

                                // Collision info
                                if (collision >= 0) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('First collision on ' + dayToLabel(collision) + '!', W / 2, 44);
                                }

                                // Probability info
                                var y0 = 210;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var tp = (theoreticalProb(k) * 100).toFixed(1);
                                ctx.fillText('P(match) with ' + k + ' people: ' + tp + '%', 30, y0);

                                // Probability curve
                                var curveY0 = y0 + 30;
                                var curveH = 100;
                                var curveW = W - 60;
                                // Axes
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(30, curveY0); ctx.lineTo(30, curveY0 + curveH); ctx.lineTo(30 + curveW, curveY0 + curveH); ctx.stroke();

                                // Draw curve
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var x = 0; x <= 70; x++) {
                                    var px = 30 + (x / 70) * curveW;
                                    var py = curveY0 + curveH - theoreticalProb(x) * curveH;
                                    if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // 50% line
                                ctx.strokeStyle = viz.colors.orange + '66';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(30, curveY0 + curveH * 0.5);
                                ctx.lineTo(30 + curveW, curveY0 + curveH * 0.5);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Current position marker
                                if (k > 0 && k <= 70) {
                                    var mkx = 30 + (k / 70) * curveW;
                                    var mky = curveY0 + curveH - theoreticalProb(k) * curveH;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath(); ctx.arc(mkx, mky, 5, 0, Math.PI * 2); ctx.fill();
                                }

                                // Labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('0', 30, curveY0 + curveH + 12);
                                ctx.fillText('23', 30 + (23 / 70) * curveW, curveY0 + curveH + 12);
                                ctx.fillText('50', 30 + (50 / 70) * curveW, curveY0 + curveH + 12);
                                ctx.fillText('70', 30 + curveW, curveY0 + curveH + 12);
                                ctx.fillText('People', 30 + curveW / 2, curveY0 + curveH + 24);
                                ctx.textAlign = 'right';
                                ctx.fillText('50%', 26, curveY0 + curveH * 0.5 + 3);
                                ctx.fillText('100%', 26, curveY0 + 3);
                            }

                            reset();

                            VizEngine.createButton(controls, 'Add 1', function () {
                                addPerson(); draw();
                            });
                            VizEngine.createButton(controls, 'Add 10', function () {
                                for (var i = 0; i < 10; i++) addPerson();
                                draw();
                            });
                            VizEngine.createButton(controls, 'Fill to 23', function () {
                                while (people.length < 23) addPerson();
                                draw();
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                reset(); draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'How many people do you need in a room to guarantee (with 100% certainty) that two share a birthday?',
                        hint: 'This is a pigeonhole question, not a probability question.',
                        solution: '367 people (366 possible birthdays including Feb 29, plus 1). This is much more than the 23 needed for a >50% probability.'
                    },
                    {
                        question: 'A website assigns 4-digit PINs to users. How many users can sign up before a duplicate PIN is guaranteed?',
                        hint: 'How many possible 4-digit PINs are there?',
                        solution: 'There are \\(10^4 = 10000\\) possible PINs. By pigeonhole, 10001 users guarantee a duplicate.'
                    }
                ]
            },

            // ============================================================
            // Section 5: Ramsey theory preview
            // ============================================================
            {
                id: 'ramsey',
                title: 'Ramsey Theory Preview',
                content: `
<h2>Complete Disorder Is Impossible</h2>

<p>The pigeonhole principle is the doorway to one of the deepest areas of combinatorics: <strong>Ramsey theory</strong>, named after Frank Ramsey (1903-1930). The central idea is profound: in any large enough structure, order must emerge.</p>

<h3>The party problem</h3>

<div class="env-block theorem">
<strong>Ramsey's Theorem (Party Version)</strong><br>
Among any 6 people at a party, either 3 are mutual friends (all three know each other) or 3 are mutual strangers (no pair among them knows each other).
</div>

<h3>The proof, step by step</h3>

<p>Pick any person, say Alex. Alex has 5 relationships (with the other 5 people). Each relationship is either "friends" or "strangers." By the pigeonhole principle, at least \\(\\lceil 5/2 \\rceil = 3\\) of these relationships are the same type.</p>

<p>Suppose Alex is friends with (at least) 3 people: Bob, Carol, Dave.</p>
<ul>
    <li>If any two of {Bob, Carol, Dave} are friends, then those two plus Alex form a trio of mutual friends. Done.</li>
    <li>If no two of {Bob, Carol, Dave} are friends, then Bob, Carol, Dave are all mutual strangers. Done.</li>
</ul>

<p>The same argument works if Alex is strangers with at least 3 people (just swap the roles of "friend" and "stranger").</p>

<div class="env-block intuition">
<strong>Why this is remarkable</strong><br>
No matter how complicated or chaotic the friendships are, 6 people is enough to force a triangle of same-type relationships. The number 6 is sharp: with 5 people, it is possible to avoid any such trio. The minimum number of people needed is called a <em>Ramsey number</em>.
</div>

<div class="env-block definition">
<strong>Ramsey Number \\(R(m, n)\\)</strong><br>
The smallest number \\(N\\) such that any red/blue coloring of the edges of the complete graph on \\(N\\) vertices must contain either a red \\(K_m\\) (complete subgraph of \\(m\\) vertices) or a blue \\(K_n\\). The party problem shows \\(R(3,3) = 6\\).
</div>

<h3>Known Ramsey numbers</h3>

<p>Despite the simplicity of the question, Ramsey numbers are notoriously hard to compute:</p>
<ul>
    <li>\\(R(3,3) = 6\\) (the party problem)</li>
    <li>\\(R(3,4) = 9\\)</li>
    <li>\\(R(4,4) = 18\\)</li>
    <li>\\(R(5,5)\\) is unknown! We only know \\(43 \\leq R(5,5) \\leq 48\\).</li>
</ul>

<p>The mathematician Paul Erd\u0151s once said: "Suppose aliens invade the Earth and threaten to obliterate it in a year's time unless human beings can find \\(R(5,5)\\). We could marshal the world's best minds and fastest computers, and within a year we could probably solve the problem. But if they digit-demanded \\(R(6,6)\\), we should begin preparing for the end."</p>

<div class="viz-placeholder" data-viz="ramsey-six"></div>

<div class="env-block remark">
<strong>The big picture</strong><br>
The pigeonhole principle says that complete uniformity is impossible when there are too many objects and too few categories. Ramsey theory extends this insight: in any sufficiently large structure, patterns are unavoidable. Disorder has limits. That is both a mathematical theorem and a philosophical statement.
</div>
`,
                visualizations: [
                    {
                        id: 'ramsey-six',
                        title: 'The Party Problem: R(3,3) = 6',
                        description: 'Six people at a party. Each pair is friends (blue) or strangers (red). Click edges to toggle. A monochromatic triangle is always highlighted.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 400, scale: 1, originX: 0, originY: 0 });
                            var n = 6;
                            // Adjacency: 1 = friends (blue), 0 = strangers (red)
                            // edges[i][j] for i < j
                            var edges = {};
                            for (var i = 0; i < n; i++) {
                                for (var j = i + 1; j < n; j++) {
                                    edges[i + ',' + j] = Math.random() < 0.5 ? 1 : 0;
                                }
                            }

                            function getEdge(a, b) {
                                var lo = Math.min(a, b), hi = Math.max(a, b);
                                return edges[lo + ',' + hi];
                            }

                            function findMonoTriangle() {
                                // Find a monochromatic triangle
                                for (var a = 0; a < n; a++) {
                                    for (var b = a + 1; b < n; b++) {
                                        for (var c = b + 1; c < n; c++) {
                                            var ab = getEdge(a, b), ac = getEdge(a, c), bc = getEdge(b, c);
                                            if (ab === ac && ac === bc) {
                                                return { verts: [a, b, c], type: ab };
                                            }
                                        }
                                    }
                                }
                                return null;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var cx = W / 2, cy = H / 2 - 10;
                                var R = 130;

                                // Compute positions (hexagon)
                                var pos = [];
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                                    pos.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
                                }

                                // Find monochromatic triangle
                                var tri = findMonoTriangle();

                                // Draw edges
                                for (var i = 0; i < n; i++) {
                                    for (var j = i + 1; j < n; j++) {
                                        var isFriend = getEdge(i, j);
                                        var inTri = tri && tri.verts.includes(i) && tri.verts.includes(j);
                                        ctx.strokeStyle = isFriend ? viz.colors.blue : viz.colors.red;
                                        ctx.lineWidth = inTri ? 3.5 : 1.5;
                                        ctx.globalAlpha = inTri ? 1.0 : 0.4;
                                        ctx.beginPath();
                                        ctx.moveTo(pos[i][0], pos[i][1]);
                                        ctx.lineTo(pos[j][0], pos[j][1]);
                                        ctx.stroke();
                                    }
                                }
                                ctx.globalAlpha = 1.0;

                                // Highlight triangle fill
                                if (tri) {
                                    var triColor = tri.type === 1 ? viz.colors.blue : viz.colors.red;
                                    ctx.fillStyle = triColor + '22';
                                    ctx.beginPath();
                                    ctx.moveTo(pos[tri.verts[0]][0], pos[tri.verts[0]][1]);
                                    ctx.lineTo(pos[tri.verts[1]][0], pos[tri.verts[1]][1]);
                                    ctx.lineTo(pos[tri.verts[2]][0], pos[tri.verts[2]][1]);
                                    ctx.closePath();
                                    ctx.fill();
                                }

                                // Draw vertices
                                var labels = ['A','B','C','D','E','F'];
                                for (var i = 0; i < n; i++) {
                                    var inTri2 = tri && tri.verts.includes(i);
                                    ctx.fillStyle = inTri2 ? viz.colors.gold : viz.colors.white;
                                    ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], inTri2 ? 16 : 12, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(labels[i], pos[i][0], pos[i][1]);
                                }

                                // Info
                                if (tri) {
                                    var typeLabel = tri.type === 1 ? 'mutual friends (blue)' : 'mutual strangers (red)';
                                    ctx.fillStyle = tri.type === 1 ? viz.colors.blue : viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Found: ' + labels[tri.verts[0]] + ', ' + labels[tri.verts[1]] + ', ' + labels[tri.verts[2]] + ' are ' + typeLabel, W / 2, H - 24);
                                }

                                // Legend
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('\u2014 Friends', 12, 20);
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('\u2014 Strangers', 12, 36);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Click an edge to toggle', 12, 52);
                            }

                            // Click to toggle edge
                            viz.canvas.addEventListener('click', function (e) {
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left;
                                var my = e.clientY - rect.top;
                                var cx = viz.width / 2, cy = viz.height / 2 - 10;
                                var R = 130;
                                var pos = [];
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                                    pos.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
                                }

                                // Find closest edge
                                var bestDist = 999, bestI = -1, bestJ = -1;
                                for (var i = 0; i < n; i++) {
                                    for (var j = i + 1; j < n; j++) {
                                        // Distance from point to line segment
                                        var x1 = pos[i][0], y1 = pos[i][1];
                                        var x2 = pos[j][0], y2 = pos[j][1];
                                        var dx = x2 - x1, dy = y2 - y1;
                                        var t = Math.max(0, Math.min(1, ((mx - x1) * dx + (my - y1) * dy) / (dx * dx + dy * dy)));
                                        var px = x1 + t * dx, py = y1 + t * dy;
                                        var dist = Math.sqrt((mx - px) * (mx - px) + (my - py) * (my - py));
                                        if (dist < bestDist) { bestDist = dist; bestI = i; bestJ = j; }
                                    }
                                }

                                if (bestDist < 15 && bestI >= 0) {
                                    var key = bestI + ',' + bestJ;
                                    edges[key] = 1 - edges[key];
                                    draw();
                                }
                            });

                            VizEngine.createButton(controls, 'Randomize', function () {
                                for (var i = 0; i < n; i++) {
                                    for (var j = i + 1; j < n; j++) {
                                        edges[i + ',' + j] = Math.random() < 0.5 ? 1 : 0;
                                    }
                                }
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Show that with 5 people, it is possible that there is no trio of mutual friends and no trio of mutual strangers.',
                        hint: 'Try arranging 5 people in a circle, with each person being friends with their two neighbors and strangers with the two non-neighbors.',
                        solution: 'Place 5 people in a circle: A-B-C-D-E. Make each person friends with their two neighbors (A-B, B-C, C-D, D-E, E-A) and strangers with the other two (A-C, A-D, B-D, B-E, C-E). Check: any trio includes at least one friend pair and one stranger pair, so no monochromatic triangle exists. This proves \\(R(3,3) > 5\\), and since \\(R(3,3) = 6\\) is achieved, the bound is tight.'
                    },
                    {
                        question: 'A chess club has 10 members. Each pair has played either 0 or 1 game against each other. Prove that there exist 3 members who have all played each other, or 3 members where no pair has played.',
                        hint: 'This follows from \\(R(3,3) = 6\\). But you have 10 people, which is more than 6.',
                        solution: 'Since \\(R(3,3) = 6\\), any 2-coloring of the edges of \\(K_6\\) contains a monochromatic triangle. We have \\(K_{10}\\), which contains \\(K_6\\) as a subgraph. Therefore, the result holds with even more room to spare.'
                    }
                ]
            }
        ]
    });
})();
