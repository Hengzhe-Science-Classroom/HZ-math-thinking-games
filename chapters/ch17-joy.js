// === Chapter 17: The Joy of Mathematics ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17-joy',
    number: 17.5,
    title: 'The Joy of Mathematics',
    subtitle: 'Mathematics is beautiful, surprising, and everywhere',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Why Math Is Beautiful
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'Why Math Is Beautiful',
            content: `
<h2>Why Math Is Beautiful</h2>

<p>Throughout this book we have solved puzzles, played games, counted possibilities, discovered patterns, and built proofs. Along the way, you may have noticed something: mathematics is not just useful. It is <em>beautiful</em>.</p>

<p>Mathematicians talk about beauty in the same way musicians talk about melody or painters talk about composition. A theorem can be elegant. A proof can be surprising. A connection between distant ideas can take your breath away.</p>

<div class="env-block intuition">
    <div class="env-title">The Mathematician's Aesthetic</div>
    <div class="env-body">
        <p>The mathematician G.H. Hardy wrote: "Beauty is the first test: there is no permanent place in the world for ugly mathematics." Paul Erdos spoke of a celestial "Book" containing the most elegant proof of every theorem. When a proof was particularly beautiful, he would say: "That's from the Book."</p>
    </div>
</div>

<p>What makes mathematics beautiful? There is no single answer, but several ingredients recur:</p>

<ul>
<li><strong>Surprise.</strong> When a result is unexpected, when a pattern appears where none was anticipated, when two ideas from different worlds turn out to be the same thing.</li>
<li><strong>Economy.</strong> When a deep truth is captured in a short formula. When a proof uses exactly the right idea, nothing more.</li>
<li><strong>Inevitability.</strong> When each step of an argument feels like the only possible move, and the conclusion arrives with a sense of "of course, it had to be this way."</li>
<li><strong>Connection.</strong> When geometry meets algebra, when number theory meets analysis, when a puzzle about rabbits leads to a ratio that appears in flowers and galaxies.</li>
</ul>

<p>This final chapter is a celebration. We will visit some of the most beautiful objects, formulas, and unsolved mysteries in mathematics. Some you have met before in earlier chapters; others will be new. The goal is not mastery but wonder.</p>

<div class="env-block remark">
    <div class="env-title">A Personal Invitation</div>
    <div class="env-body">
        <p>Mathematics is not a spectator sport. The beauty of a theorem is best appreciated by working through it yourself. As you read this chapter, pause to calculate, sketch, and experiment. The joy is in the doing.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ─────────────────────────────────────────────
        // Section 2: Euler's Formula
        // ─────────────────────────────────────────────
        {
            id: 'sec-euler',
            title: "Euler's Formula",
            content: `
<h2>Euler's Formula: The Most Beautiful Equation</h2>

<p>In the 18th century, Leonhard Euler discovered a formula that connects five of the most important numbers in mathematics:</p>

\\[
e^{i\\pi} + 1 = 0
\\]

<p>This single equation ties together:</p>
<ul>
<li>\\(e \\approx 2.71828\\ldots\\), the base of natural logarithms (growth and calculus)</li>
<li>\\(i = \\sqrt{-1}\\), the imaginary unit (algebra and complex numbers)</li>
<li>\\(\\pi \\approx 3.14159\\ldots\\), the ratio of circumference to diameter (geometry)</li>
<li>\\(1\\), the multiplicative identity (arithmetic)</li>
<li>\\(0\\), the additive identity (arithmetic)</li>
</ul>

<p>It also uses the three fundamental operations: addition, multiplication, and exponentiation. Five constants, three operations, one equation, zero on one side. Polls of mathematicians consistently rank it the most beautiful formula in all of mathematics.</p>

<h3>Where Does It Come From?</h3>

<p>The full version of Euler's formula is:</p>

\\[
e^{i\\theta} = \\cos\\theta + i\\sin\\theta
\\]

<p>This says that \\(e^{i\\theta}\\) traces out the <strong>unit circle</strong> in the complex plane as \\(\\theta\\) varies. When \\(\\theta = 0\\), we get \\(e^0 = 1\\). When \\(\\theta = \\pi/2\\), we get \\(e^{i\\pi/2} = i\\). When \\(\\theta = \\pi\\), we get \\(e^{i\\pi} = -1\\), which gives us the famous identity.</p>

<div class="env-block definition">
<strong>Euler's Formula.</strong> For any real number \\(\\theta\\),
\\[
e^{i\\theta} = \\cos\\theta + i\\sin\\theta.
\\]
Setting \\(\\theta = \\pi\\) yields \\(e^{i\\pi} = -1\\), or equivalently \\(e^{i\\pi} + 1 = 0\\).
</div>

<p>The visualization below shows \\(e^{i\\theta}\\) moving around the unit circle. Watch as the angle \\(\\theta\\) increases from 0 to \\(2\\pi\\): the point traces a perfect circle, and at \\(\\theta = \\pi\\) it lands exactly at \\(-1\\).</p>

<div class="viz-placeholder" data-viz="viz-euler-formula"></div>

<h3>Why Is It True?</h3>

<p>One way to see it: the Taylor series for \\(e^x\\), \\(\\cos x\\), and \\(\\sin x\\) are:</p>

\\[
e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
\\]

\\[
\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots, \\qquad
\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots
\\]

<p>Substitute \\(x = i\\theta\\) into the series for \\(e^x\\), use \\(i^2 = -1\\), \\(i^3 = -i\\), \\(i^4 = 1\\), and collect real and imaginary parts. The real part gives \\(\\cos\\theta\\), the imaginary part gives \\(\\sin\\theta\\). The algebra is straightforward, and the result is magical.</p>
`,
            visualizations: [
                {
                    id: 'viz-euler-formula',
                    title: "Euler's Formula on the Unit Circle",
                    description: 'Watch e^{i*theta} trace the unit circle. At theta = pi, the point lands at -1. Drag the slider or let it animate.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 280, originY: 210, scale: 120
                        });
                        var ctx = viz.ctx;
                        var theta = 0;
                        var animating = true;

                        var slider = VizEngine.createSlider(controls, '\u03b8', 0, 6.283, 0, 0.01, function(v) {
                            theta = v;
                            animating = false;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            theta = 0;
                            animating = true;
                        });

                        VizEngine.createButton(controls, '\u03b8 = \u03c0', function() {
                            theta = Math.PI;
                            animating = false;
                            slider.value = Math.PI;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Unit circle
                            ctx.strokeStyle = viz.colors.axis + '88';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(viz.originX, viz.originY, 120, 0, Math.PI * 2);
                            ctx.stroke();

                            // Trace the arc from 0 to theta
                            if (theta > 0.01) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                for (var t = 0; t <= theta; t += 0.02) {
                                    var px = viz.originX + Math.cos(t) * 120;
                                    var py = viz.originY - Math.sin(t) * 120;
                                    if (t === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Point e^{i*theta}
                            var cosT = Math.cos(theta);
                            var sinT = Math.sin(theta);
                            var px = viz.originX + cosT * 120;
                            var py = viz.originY - sinT * 120;

                            // Dashed lines to axes
                            ctx.strokeStyle = viz.colors.teal + '88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(viz.originX, py); ctx.stroke();
                            ctx.setLineDash([]);

                            // Angle arc
                            if (theta > 0.05) {
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(viz.originX, viz.originY, 30, 0, -theta, true);
                                ctx.stroke();
                            }

                            // Line from origin to point
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            ctx.lineTo(px, py);
                            ctx.stroke();

                            // Point
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();

                            // Labels
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                            ctx.fillText('e^{i\u03b8} = cos\u03b8 + i sin\u03b8', viz.width / 2, 22);

                            // Coordinates
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            var label = '(' + cosT.toFixed(3) + ', ' + sinT.toFixed(3) + 'i)';
                            var lx = px + (cosT >= 0 ? 12 : -12);
                            var ly = py + (sinT >= 0 ? -14 : 14);
                            ctx.textAlign = cosT >= 0 ? 'left' : 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(label, lx, ly);

                            // Angle label
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('\u03b8 = ' + theta.toFixed(2) + ' (' + (theta / Math.PI).toFixed(2) + '\u03c0)', viz.originX + 35, viz.originY + 18);

                            // Mark key points
                            var keyPts = [
                                {t: 0, label: '1', ax: 'right', bx: 8, by: 14},
                                {t: Math.PI, label: '-1', ax: 'right', bx: -18, by: 14},
                                {t: Math.PI / 2, label: 'i', ax: 'center', bx: 10, by: -10},
                                {t: 3 * Math.PI / 2, label: '-i', ax: 'center', bx: 10, by: 14}
                            ];
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var k = 0; k < keyPts.length; k++) {
                                var kp = keyPts[k];
                                var kx = viz.originX + Math.cos(kp.t) * 120;
                                var ky = viz.originY - Math.sin(kp.t) * 120;
                                ctx.fillStyle = viz.colors.text;
                                ctx.beginPath(); ctx.arc(kx, ky, 3, 0, Math.PI * 2); ctx.fill();
                                ctx.textAlign = kp.ax; ctx.textBaseline = 'middle';
                                ctx.fillText(kp.label, kx + kp.bx, ky + kp.by);
                            }

                            // Highlight if at pi
                            if (Math.abs(theta - Math.PI) < 0.05) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('e^{i\u03c0} = -1  \u21d2  e^{i\u03c0} + 1 = 0', viz.width / 2, viz.height - 20);
                            }

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Real', viz.width - 20, viz.originY + 6);
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillText('Imaginary', viz.originX - 6, 18);
                        }

                        viz.animate(function(t) {
                            if (animating) {
                                theta += 0.012;
                                if (theta > Math.PI * 2) theta -= Math.PI * 2;
                                slider.value = theta;
                            }
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Euler\'s formula to compute \\(e^{i \\cdot 0}\\), \\(e^{i\\pi/2}\\), \\(e^{i\\pi}\\), and \\(e^{i \\cdot 2\\pi}\\). What pattern do you notice?',
                    hint: 'Substitute each value of \\(\\theta\\) into \\(e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\).',
                    solution: '\\(e^{i \\cdot 0} = 1\\), \\(e^{i\\pi/2} = i\\), \\(e^{i\\pi} = -1\\), \\(e^{i \\cdot 2\\pi} = 1\\). These are the four "compass points" on the unit circle: east, north, west, east again. Multiplying by \\(i\\) rotates by 90 degrees counterclockwise.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: The Golden Ratio
        // ─────────────────────────────────────────────
        {
            id: 'sec-golden',
            title: 'The Golden Ratio',
            content: `
<h2>The Golden Ratio</h2>

<p>Consider this equation:</p>

\\[
\\frac{a+b}{a} = \\frac{a}{b} = \\varphi
\\]

<p>Two quantities are in the <strong>golden ratio</strong> if the ratio of their sum to the larger equals the ratio of the larger to the smaller. Solving, we get:</p>

\\[
\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.6180339887\\ldots
\\]

<p>This irrational number is everywhere. It appears in the Fibonacci sequence, in pentagons, in spirals, in art, and in nature.</p>

<div class="env-block definition">
<strong>The Golden Ratio.</strong> \\(\\varphi = \\frac{1+\\sqrt{5}}{2}\\) is the positive root of \\(x^2 - x - 1 = 0\\). It satisfies the beautiful self-referential property \\(\\varphi = 1 + 1/\\varphi\\).
</div>

<h3>Fibonacci and the Golden Ratio</h3>

<p>The Fibonacci sequence \\(1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, \\ldots\\) is defined by \\(F_n = F_{n-1} + F_{n-2}\\). A remarkable fact:</p>

\\[
\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\varphi
\\]

<p>The ratios of consecutive Fibonacci numbers converge to the golden ratio: \\(1/1 = 1\\), \\(2/1 = 2\\), \\(3/2 = 1.5\\), \\(5/3 = 1.\\overline{6}\\), \\(8/5 = 1.6\\), \\(13/8 = 1.625\\), \\(21/13 \\approx 1.6154\\), and so on, oscillating around \\(\\varphi\\) and getting ever closer.</p>

<h3>The Golden Spiral</h3>

<p>If you draw squares with Fibonacci side lengths arranged in a spiral pattern and connect the corners with quarter-circle arcs, you get the <strong>golden spiral</strong>. This shape appears (approximately) in nautilus shells, hurricanes, and the arrangement of seeds in sunflower heads.</p>

<div class="viz-placeholder" data-viz="viz-golden-ratio-nature"></div>

<h3>In Pentagons and Pentagrams</h3>

<p>The golden ratio appears naturally in the regular pentagon. The diagonal of a regular pentagon with side length 1 is exactly \\(\\varphi\\). In a pentagram (five-pointed star), consecutive line segment ratios are golden. The ancient Pythagoreans used the pentagram as their symbol, and this golden structure is likely why.</p>

<div class="env-block remark">
    <div class="env-title">A Word of Caution</div>
    <div class="env-body">
        <p>Popular culture overstates the golden ratio's role. Not every rectangle in the Parthenon is golden, and not every spiral in nature exactly follows \\(\\varphi\\). But the genuine appearances are remarkable enough without exaggeration. The mathematical beauty is real; the mysticism is not always warranted.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-golden-ratio-nature',
                    title: 'The Golden Spiral and Fibonacci',
                    description: 'Watch the golden spiral build from Fibonacci squares. The ratio F(n+1)/F(n) converges to the golden ratio phi.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var nFib = 8;

                        VizEngine.createSlider(controls, 'Fibonacci terms', 3, 12, nFib, 1, function(v) {
                            nFib = Math.round(v);
                            draw();
                        });

                        var spiralColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.green,
                            viz.colors.orange, viz.colors.purple, viz.colors.pink,
                            viz.colors.yellow, viz.colors.red, viz.colors.blue,
                            viz.colors.teal, viz.colors.green, viz.colors.orange
                        ];

                        function draw() {
                            viz.clear();

                            // Generate Fibonacci
                            var fib = [1, 1];
                            for (var i = 2; i < nFib; i++) fib.push(fib[i-1] + fib[i-2]);

                            // Scale to fit
                            var maxFib = fib[fib.length - 1];
                            var scale = Math.min(w * 0.55, h * 0.55) / maxFib;

                            // Draw Fibonacci squares spiraling out
                            var cx = w / 2 - maxFib * scale * 0.15;
                            var cy = h / 2 + maxFib * scale * 0.1;
                            var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]; // right, up, left, down
                            var x = cx, y = cy;
                            var arcStartAngles = [0, -Math.PI / 2, Math.PI, Math.PI / 2];
                            var arcCenters = [];

                            for (var j = 0; j < fib.length; j++) {
                                var s = fib[j] * scale;
                                var d = dirs[j % 4];
                                var col = spiralColors[j % spiralColors.length];

                                ctx.fillStyle = col + '22';
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;

                                var rx = x, ry = y;
                                if (d[0] === 1 && d[1] === 0) { rx = x; ry = y - s; }
                                else if (d[0] === 0 && d[1] === -1) { rx = x; ry = y - s; }
                                else if (d[0] === -1 && d[1] === 0) { rx = x - s; ry = y; }
                                else { rx = x - s; ry = y; }

                                // Compute square position based on direction
                                var sx, sy;
                                if (j === 0) {
                                    sx = x; sy = y - s;
                                } else if (j % 4 === 0) {
                                    sx = x; sy = y - s;
                                } else if (j % 4 === 1) {
                                    sx = x; sy = y - s;
                                } else if (j % 4 === 2) {
                                    sx = x - s; sy = y;
                                } else {
                                    sx = x - s; sy = y;
                                }

                                ctx.fillRect(sx, sy, s, s);
                                ctx.strokeRect(sx, sy, s, s);

                                // Label
                                ctx.fillStyle = col;
                                ctx.font = Math.max(9, Math.min(14, s * 0.35)) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(fib[j], sx + s / 2, sy + s / 2);

                                // Draw quarter-circle arc
                                var arcR = s;
                                var acx, acy, startA;
                                if (j % 4 === 0) { acx = sx; acy = sy + s; startA = -Math.PI / 2; }
                                else if (j % 4 === 1) { acx = sx; acy = sy; startA = 0; }
                                else if (j % 4 === 2) { acx = sx + s; acy = sy; startA = Math.PI / 2; }
                                else { acx = sx + s; acy = sy + s; startA = Math.PI; }

                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(acx, acy, arcR, startA, startA + Math.PI / 2);
                                ctx.stroke();

                                // Move to next position
                                if (j % 4 === 0) { x = sx + s; y = sy; }
                                else if (j % 4 === 1) { x = sx + s; y = sy + s; }
                                else if (j % 4 === 2) { x = sx; y = sy + s; }
                                else { x = sx; y = sy; }
                            }

                            // Title and ratio
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Golden Spiral from Fibonacci Squares', w / 2, 6);

                            if (fib.length >= 2) {
                                var ratio = fib[fib.length - 1] / fib[fib.length - 2];
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(
                                    'F(' + fib.length + ')/F(' + (fib.length - 1) + ') = ' +
                                    fib[fib.length - 1] + '/' + fib[fib.length - 2] + ' = ' +
                                    ratio.toFixed(6) + '   (\u03c6 = 1.618034...)',
                                    w / 2, h - 14
                                );
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the first 12 ratios \\(F_{n+1}/F_n\\) of consecutive Fibonacci numbers. How quickly do they approach \\(\\varphi\\)?',
                    hint: 'Start with \\(F_1 = 1, F_2 = 1, F_3 = 2, \\ldots\\) and compute each ratio.',
                    solution: 'The ratios are: 1, 2, 1.5, 1.667, 1.6, 1.625, 1.6154, 1.6190, 1.6176, 1.6182, 1.6180, 1.6181. By \\(n = 10\\) the ratio matches \\(\\varphi\\) to 4 decimal places. The error decreases geometrically, roughly by a factor of \\(1/\\varphi^2 \\approx 0.382\\) at each step.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: The Mystery of Pi
        // ─────────────────────────────────────────────
        {
            id: 'sec-pi',
            title: 'The Mystery of Pi',
            content: `
<h2>The Mystery of \\(\\pi\\)</h2>

<p>The number \\(\\pi\\) needs no introduction. It is the ratio of a circle's circumference to its diameter. But \\(\\pi\\) is much more than a geometric constant. It appears in probability, in number theory, in physics, and in places where circles seem to have nothing to do with anything.</p>

<h3>Infinite Series for \\(\\pi\\)</h3>

<p>Some of the most beautiful formulas in mathematics are infinite series for \\(\\pi\\):</p>

<p><strong>Leibniz's formula (1674):</strong></p>
\\[
\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\frac{1}{9} - \\cdots
\\]

<p><strong>Euler's Basel formula (1735):</strong></p>
\\[
\\frac{\\pi^2}{6} = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} + \\frac{1}{25} + \\cdots = \\sum_{n=1}^{\\infty} \\frac{1}{n^2}
\\]

<p>That last formula is astonishing. The sum of the reciprocals of the perfect squares equals \\(\\pi^2/6\\). What do squares have to do with circles?</p>

<h3>Buffon's Needle</h3>

<p>In 1777, the Comte de Buffon posed a remarkable question: if you drop a needle of length \\(\\ell\\) onto a floor ruled with parallel lines spaced \\(d \\geq \\ell\\) apart, the probability that the needle crosses a line is:</p>

\\[
P(\\text{crossing}) = \\frac{2\\ell}{\\pi d}
\\]

<p>This means you can estimate \\(\\pi\\) by dropping needles! If you drop \\(N\\) needles and \\(C\\) of them cross a line, then:</p>

\\[
\\pi \\approx \\frac{2\\ell N}{d C}
\\]

<p>Try it in the visualization below. This is a <strong>Monte Carlo</strong> method: using randomness to compute a deterministic quantity.</p>

<div class="viz-placeholder" data-viz="viz-pi-buffon"></div>

<h3>Pi as a Random Walk</h3>

<p>Another way to "see" \\(\\pi\\) is to encode its digits as directions. Assign each digit 0-9 a direction, and take a step in that direction for each successive digit. The result is a beautiful, seemingly random walk that never repeats (since \\(\\pi\\) is irrational and believed to be normal).</p>

<div class="viz-placeholder" data-viz="viz-pi-digits"></div>

<div class="env-block remark">
    <div class="env-title">\\(\\pi\\) Is Transcendental</div>
    <div class="env-body">
        <p>In 1882, Ferdinand von Lindemann proved that \\(\\pi\\) is <em>transcendental</em>: it is not a root of any polynomial with integer coefficients. This settled the ancient problem of "squaring the circle" (constructing a square with the same area as a given circle using only compass and straightedge). It is impossible.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-pi-buffon',
                    title: "Buffon's Needle Simulation",
                    description: 'Drop needles on lined paper to estimate pi. The more needles, the better the estimate.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var needles = [];
                        var crossings = 0;
                        var lineSpacing = 60;
                        var needleLen = 40;

                        function dropNeedle() {
                            var cx = Math.random() * w;
                            var cy = Math.random() * (h - 80) + 40;
                            var angle = Math.random() * Math.PI;
                            var x1 = cx - (needleLen / 2) * Math.cos(angle);
                            var y1 = cy - (needleLen / 2) * Math.sin(angle);
                            var x2 = cx + (needleLen / 2) * Math.cos(angle);
                            var y2 = cy + (needleLen / 2) * Math.sin(angle);

                            // Check crossing
                            var crosses = false;
                            for (var ly = 0; ly < h; ly += lineSpacing) {
                                if ((y1 <= ly && y2 >= ly) || (y2 <= ly && y1 >= ly)) {
                                    crosses = true;
                                    break;
                                }
                            }

                            if (crosses) crossings++;
                            needles.push({ x1: x1, y1: y1, x2: x2, y2: y2, crosses: crosses });
                        }

                        function draw() {
                            viz.clear();

                            // Draw parallel lines
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            for (var ly = 0; ly < h; ly += lineSpacing) {
                                ctx.beginPath();
                                ctx.moveTo(0, ly);
                                ctx.lineTo(w, ly);
                                ctx.stroke();
                            }

                            // Draw needles
                            for (var i = 0; i < needles.length; i++) {
                                var n = needles[i];
                                ctx.strokeStyle = n.crosses ? viz.colors.red : viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(n.x1, n.y1);
                                ctx.lineTo(n.x2, n.y2);
                                ctx.stroke();
                            }

                            // Stats
                            ctx.fillStyle = '#000000aa';
                            ctx.fillRect(0, 0, w, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            var piEst = crossings > 0 ? (2 * needleLen * needles.length) / (lineSpacing * crossings) : 0;
                            ctx.fillText(
                                'Needles: ' + needles.length +
                                '  |  Crossings: ' + crossings +
                                '  |  \u03c0 estimate: ' + (crossings > 0 ? piEst.toFixed(4) : '...') +
                                '  |  Actual \u03c0: 3.1416',
                                8, 10
                            );

                            // Color legend
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(w - 170, 8, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('crosses', w - 156, 10);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(w - 90, 8, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('misses', w - 76, 10);
                        }

                        VizEngine.createButton(controls, 'Drop 1', function() { dropNeedle(); draw(); });
                        VizEngine.createButton(controls, 'Drop 10', function() { for (var i = 0; i < 10; i++) dropNeedle(); draw(); });
                        VizEngine.createButton(controls, 'Drop 100', function() { for (var i = 0; i < 100; i++) dropNeedle(); draw(); });
                        VizEngine.createButton(controls, 'Drop 1000', function() { for (var i = 0; i < 1000; i++) dropNeedle(); draw(); });
                        VizEngine.createButton(controls, 'Reset', function() { needles = []; crossings = 0; draw(); });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-pi-digits',
                    title: 'Pi Digit Random Walk',
                    description: 'Each digit of pi determines a direction. Walk through the digits and watch a beautiful path emerge.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        // First 500 digits of pi (after 3.)
                        var piStr = '14159265358979323846264338327950288419716939937510' +
                            '58209749445923078164062862089986280348253421170679' +
                            '82148086513282306647093844609550582231725359408128' +
                            '48111745028410270193852110555964462294895493038196' +
                            '44288109756659334461284756482337867831652712019091' +
                            '45648566923460348610454326648213393607260249141273' +
                            '72458700660631558817488152092096282925409171536436' +
                            '78925903600113305305488204665213841469519415116094' +
                            '33057270365759591953092186117381932611793105118548' +
                            '07446237996274956735188575272489122793818301194912';

                        var nDigits = 200;
                        var digitColors = [
                            '#f85149', '#f0883e', '#d29922', '#3fb950', '#3fb9a0',
                            '#58a6ff', '#bc8cff', '#f778ba', '#c9d1d9', '#8b949e'
                        ];

                        VizEngine.createSlider(controls, 'Digits', 20, 500, nDigits, 10, function(v) {
                            nDigits = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();

                            var step = 3;
                            var pts = [{x: w / 2, y: h / 2}];

                            for (var i = 0; i < Math.min(nDigits, piStr.length); i++) {
                                var d = parseInt(piStr[i]);
                                var angle = d * Math.PI * 2 / 10;
                                var last = pts[pts.length - 1];
                                pts.push({
                                    x: last.x + step * Math.cos(angle),
                                    y: last.y + step * Math.sin(angle),
                                    digit: d
                                });
                            }

                            // Find bounds and center
                            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                            for (var j = 0; j < pts.length; j++) {
                                if (pts[j].x < minX) minX = pts[j].x;
                                if (pts[j].x > maxX) maxX = pts[j].x;
                                if (pts[j].y < minY) minY = pts[j].y;
                                if (pts[j].y > maxY) maxY = pts[j].y;
                            }
                            var rangeX = maxX - minX || 1;
                            var rangeY = maxY - minY || 1;
                            var sc = Math.min((w - 60) / rangeX, (h - 60) / rangeY);
                            var offX = (w - rangeX * sc) / 2 - minX * sc;
                            var offY = (h - rangeY * sc) / 2 - minY * sc;

                            // Draw path
                            for (var k = 1; k < pts.length; k++) {
                                var p1x = pts[k-1].x * sc + offX;
                                var p1y = pts[k-1].y * sc + offY;
                                var p2x = pts[k].x * sc + offX;
                                var p2y = pts[k].y * sc + offY;
                                ctx.strokeStyle = digitColors[pts[k].digit] + 'cc';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(p1x, p1y);
                                ctx.lineTo(p2x, p2y);
                                ctx.stroke();
                            }

                            // Start point
                            var sx = pts[0].x * sc + offX;
                            var sy = pts[0].y * sc + offY;
                            ctx.fillStyle = viz.colors.white;
                            ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03c0 Digit Walk (' + nDigits + ' digits)', w / 2, 6);

                            // Color legend
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var c = 0; c < 10; c++) {
                                var lx = w / 2 - 90 + c * 20;
                                ctx.fillStyle = digitColors[c];
                                ctx.fillText(c, lx, h - 8);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Compute the Leibniz sum \\(1 - 1/3 + 1/5 - 1/7 + \\cdots\\) using 10, 100, and 1000 terms. How does the estimate of \\(\\pi/4\\) compare to the true value?",
                    hint: 'The sum alternates signs. After \\(n\\) terms, the error is roughly \\(1/(2n+1)\\).',
                    solution: 'With 10 terms: \\(\\approx 0.7604\\) (\\(\\pi \\approx 3.042\\)). With 100 terms: \\(\\approx 0.7829\\) (\\(\\pi \\approx 3.132\\)). With 1000 terms: \\(\\approx 0.7854\\) (\\(\\pi \\approx 3.141\\)). Convergence is very slow: about one new correct decimal digit per 10x more terms. This is why the Leibniz formula is beautiful but impractical for computing \\(\\pi\\).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Unsolved Problems
        // ─────────────────────────────────────────────
        {
            id: 'sec-unsolved',
            title: 'Unsolved Problems',
            content: `
<h2>Unsolved Problems</h2>

<p>Mathematics is not a finished building. It is an active construction site. Some of the simplest-sounding questions remain unanswered after centuries of effort. Here are three famous examples that you can state to a child but that no one on Earth can prove.</p>

<h3>Goldbach's Conjecture (1742)</h3>

<p>Every even integer greater than 2 is the sum of two primes.</p>

<p>Examples: \\(4 = 2+2\\), \\(6 = 3+3\\), \\(8 = 3+5\\), \\(10 = 5+5\\), \\(100 = 47+53\\). It has been verified by computer for all even numbers up to \\(4 \\times 10^{18}\\), but no one has proved it must always hold.</p>

<h3>The Twin Prime Conjecture</h3>

<p>There are infinitely many pairs of primes that differ by exactly 2: \\((3,5)\\), \\((5,7)\\), \\((11,13)\\), \\((17,19)\\), \\((29,31)\\), \\(\\ldots\\)</p>

<p>Euclid proved there are infinitely many primes (around 300 BC). But whether the "twin" primes go on forever is still open. In 2013, Yitang Zhang made a breakthrough by proving there are infinitely many pairs of primes differing by at most 70 million. Collaborative work (the Polymath project) quickly reduced that bound to 246. The gap between 246 and 2 remains.</p>

<h3>The Collatz Conjecture (the 3n+1 problem)</h3>

<p>Start with any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1. Repeat. The conjecture says you always eventually reach 1.</p>

<p>Example starting from 7: \\(7 \\to 22 \\to 11 \\to 34 \\to 17 \\to 52 \\to 26 \\to 13 \\to 40 \\to 20 \\to 10 \\to 5 \\to 16 \\to 8 \\to 4 \\to 2 \\to 1\\).</p>

<p>It has been checked for all numbers up to \\(2^{68}\\). Erdos said: "Mathematics is not yet ready for such problems."</p>

<div class="viz-placeholder" data-viz="viz-collatz-tree"></div>

<div class="env-block remark">
    <div class="env-title">Why Are These Problems Hard?</div>
    <div class="env-body">
        <p>These problems sit at the boundary of number theory where additive and multiplicative structures collide. Primes are defined multiplicatively (no nontrivial factors), but Goldbach and twin primes ask additive questions about them. The Collatz problem mixes multiplication by 3 with division by 2 in a way that resists systematic analysis. In each case, we know the statement is almost certainly true (overwhelming numerical evidence), but we lack the structural insight to prove it.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-collatz-tree',
                    title: 'Collatz Sequences',
                    description: 'Enter a starting number and watch its Collatz sequence. All paths seem to lead to 1, but no one can prove it.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var startN = 27;

                        VizEngine.createSlider(controls, 'Start', 2, 200, startN, 1, function(v) {
                            startN = Math.round(v);
                            draw();
                        });

                        var showAll = false;
                        VizEngine.createButton(controls, 'Show 2-100', function() {
                            showAll = !showAll;
                            draw();
                        });

                        function collatz(n) {
                            var seq = [n];
                            while (n !== 1 && seq.length < 500) {
                                n = n % 2 === 0 ? n / 2 : 3 * n + 1;
                                seq.push(n);
                            }
                            return seq;
                        }

                        function draw() {
                            viz.clear();

                            if (showAll) {
                                // Draw all sequences from 2 to 100, faintly
                                var maxSteps = 0;
                                var maxVal = 0;
                                var allSeqs = [];
                                for (var s = 2; s <= 100; s++) {
                                    var sq = collatz(s);
                                    allSeqs.push(sq);
                                    if (sq.length > maxSteps) maxSteps = sq.length;
                                    for (var si = 0; si < sq.length; si++) {
                                        if (sq[si] > maxVal) maxVal = sq[si];
                                    }
                                }

                                var padL = 50, padR = 20, padT = 40, padB = 40;
                                var plotW = w - padL - padR;
                                var plotH = h - padT - padB;
                                var xScale = plotW / maxSteps;
                                var yScale = plotH / Math.log(maxVal + 1);

                                // All sequences faint
                                for (var ai = 0; ai < allSeqs.length; ai++) {
                                    var aseq = allSeqs[ai];
                                    ctx.strokeStyle = viz.colors.blue + '18';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    for (var aj = 0; aj < aseq.length; aj++) {
                                        var ax = padL + aj * xScale;
                                        var ay = h - padB - Math.log(aseq[aj] + 1) * yScale;
                                        if (aj === 0) ctx.moveTo(ax, ay);
                                        else ctx.lineTo(ax, ay);
                                    }
                                    ctx.stroke();
                                }

                                // Highlight selected
                                var seq = collatz(startN);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (var j = 0; j < seq.length; j++) {
                                    var px = padL + j * xScale;
                                    var py = h - padB - Math.log(seq[j] + 1) * yScale;
                                    if (j === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                            } else {
                                var seq = collatz(startN);
                                var maxV = 0;
                                for (var m = 0; m < seq.length; m++) { if (seq[m] > maxV) maxV = seq[m]; }

                                var padL = 50, padR = 20, padT = 40, padB = 40;
                                var plotW = w - padL - padR;
                                var plotH = h - padT - padB;
                                var xSc = plotW / Math.max(seq.length - 1, 1);
                                var ySc = plotH / (maxV * 1.1);

                                // Axes
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                                // Plot
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var j = 0; j < seq.length; j++) {
                                    var px = padL + j * xSc;
                                    var py = h - padB - seq[j] * ySc;
                                    if (j === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Points
                                for (var k = 0; k < seq.length; k++) {
                                    var ppx = padL + k * xSc;
                                    var ppy = h - padB - seq[k] * ySc;
                                    ctx.fillStyle = seq[k] % 2 === 0 ? viz.colors.teal : viz.colors.orange;
                                    ctx.beginPath(); ctx.arc(ppx, ppy, 3, 0, Math.PI * 2); ctx.fill();
                                }

                                // Axis labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('Step', w / 2, h - 12);
                                ctx.save();
                                ctx.translate(14, h / 2);
                                ctx.rotate(-Math.PI / 2);
                                ctx.fillText('Value', 0, 0);
                                ctx.restore();
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var seq = collatz(startN);
                            ctx.fillText(
                                'Collatz sequence starting at ' + startN + ' (' + seq.length + ' steps, peak ' +
                                Math.max.apply(null, seq) + ')',
                                w / 2, 6
                            );

                            // Even/odd legend
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.textAlign = 'right';
                            ctx.fillText('\u25cf even', w - 60, 24);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u25cf odd', w - 10, 24);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find all the ways to write 50 as the sum of two primes. (This illustrates Goldbach\'s conjecture for \\(n = 50\\).)',
                    hint: 'Start from the smallest prime and work up. You only need to check primes up to 25.',
                    solution: '\\(50 = 3+47 = 7+43 = 13+37 = 19+31\\). There are 4 representations. Note that as \\(n\\) grows, the number of Goldbach representations tends to increase, which is part of the heuristic argument for why the conjecture should be true.'
                },
                {
                    question: 'Compute the Collatz sequence starting from \\(n = 27\\). How many steps does it take to reach 1? What is the peak value?',
                    hint: 'Use the visualization, or compute by hand. Be patient; this one takes a while.',
                    solution: 'Starting from 27, the sequence reaches a peak of 9232 and takes 111 steps to reach 1. This is surprisingly long for such a small starting number, which is part of what makes the Collatz conjecture so resistant to proof: the behavior is highly irregular.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Mathematics in the Real World
        // ─────────────────────────────────────────────
        {
            id: 'sec-careers',
            title: 'Mathematics in the Real World',
            content: `
<h2>Mathematics in the Real World</h2>

<p>The mathematical thinking you have developed in this book is not confined to puzzles and textbooks. It is the foundation of nearly every field that shapes the modern world.</p>

<h3>Computer Science</h3>
<p>Algorithms are mathematics in action. Every time you search the web, stream a video, or use GPS navigation, you rely on graph theory, optimization, number theory (cryptography), and probability. The logic and proof techniques from Chapters 1-3 are the language of program verification. The counting methods from Chapters 4-7 analyze algorithm complexity.</p>

<h3>Science and Engineering</h3>
<p>Physics is written in the language of mathematics (Galileo said this in 1623, and it remains true). Differential equations model everything from planetary orbits to fluid flow to neural activity. Statistics and probability (Chapter 16) are the backbone of experimental science. Game theory (Chapters 13-15) models evolutionary biology and economics.</p>

<h3>Finance and Economics</h3>
<p>Option pricing uses stochastic calculus. Risk management uses probability distributions. Auction design uses game theory. Machine learning, built on linear algebra and optimization, now drives trading, lending, and insurance decisions.</p>

<h3>Art and Design</h3>
<p>Symmetry, proportion, tessellation, fractals: mathematics provides the vocabulary for visual beauty. Digital art, computer graphics, and music synthesis are all deeply mathematical. The golden ratio (Section 3 of this chapter) has influenced artists from da Vinci to Le Corbusier.</p>

<h3>Medicine and Biology</h3>
<p>Medical imaging (CT scans, MRI) relies on the mathematics of the Radon transform. Epidemiological models use differential equations. Genomics uses combinatorics and statistics. Drug trial design uses the logic of hypothesis testing.</p>

<div class="viz-placeholder" data-viz="viz-math-careers"></div>

<div class="env-block remark">
    <div class="env-title">The Common Thread</div>
    <div class="env-body">
        <p>Notice that the same mathematical ideas appear across vastly different fields. Graph theory helps both computer networking and molecular biology. Probability serves both quantum physics and insurance. This universality is itself one of the most beautiful facts about mathematics: it is not a collection of tricks for specific problems, but a unified language of pattern and structure.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-math-careers',
                    title: 'Mathematics Career Map',
                    description: 'Click on a field to see how mathematical thinking is used. The connections show shared mathematical foundations.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var fields = [
                            {
                                name: 'Computer\nScience', x: w * 0.5, y: 60, color: viz.colors.blue,
                                math: ['Logic', 'Graph Theory', 'Combinatorics', 'Number Theory', 'Probability'],
                                desc: 'Algorithms, cryptography, AI, databases'
                            },
                            {
                                name: 'Physics', x: w * 0.15, y: 140, color: viz.colors.teal,
                                math: ['Calculus', 'Linear Algebra', 'Differential Eq.', 'Group Theory'],
                                desc: 'Mechanics, quantum, relativity, thermodynamics'
                            },
                            {
                                name: 'Finance', x: w * 0.85, y: 140, color: viz.colors.green,
                                math: ['Probability', 'Stochastic Calc.', 'Optimization', 'Game Theory'],
                                desc: 'Pricing, risk, portfolio theory, auctions'
                            },
                            {
                                name: 'Biology', x: w * 0.15, y: 280, color: viz.colors.orange,
                                math: ['Statistics', 'Combinatorics', 'Diff. Equations', 'Graph Theory'],
                                desc: 'Genomics, epidemiology, evolution, ecology'
                            },
                            {
                                name: 'Engineering', x: w * 0.5, y: 210, color: viz.colors.purple,
                                math: ['Calculus', 'Linear Algebra', 'Optimization', 'Probability'],
                                desc: 'Signal processing, control, structures, circuits'
                            },
                            {
                                name: 'Art &\nDesign', x: w * 0.85, y: 280, color: viz.colors.pink,
                                math: ['Geometry', 'Symmetry', 'Fractals', 'Proportion'],
                                desc: 'Graphics, animation, architecture, music'
                            },
                            {
                                name: 'Medicine', x: w * 0.3, y: 360, color: viz.colors.red,
                                math: ['Statistics', 'Probability', 'Imaging Math', 'Modeling'],
                                desc: 'Trials, diagnostics, imaging, epidemiology'
                            },
                            {
                                name: 'Data\nScience', x: w * 0.7, y: 360, color: viz.colors.yellow,
                                math: ['Statistics', 'Linear Algebra', 'Optimization', 'Probability'],
                                desc: 'ML, visualization, prediction, NLP'
                            }
                        ];

                        // Connections (shared math)
                        var connections = [
                            [0, 1], [0, 2], [0, 4], [0, 7],
                            [1, 4], [1, 3],
                            [2, 7], [2, 5],
                            [3, 6], [3, 7],
                            [4, 5], [4, 7],
                            [6, 7]
                        ];

                        var selected = -1;

                        function draw() {
                            viz.clear();

                            // Draw connections
                            for (var c = 0; c < connections.length; c++) {
                                var a = fields[connections[c][0]];
                                var b = fields[connections[c][1]];
                                var highlight = (selected === connections[c][0] || selected === connections[c][1]);
                                ctx.strokeStyle = highlight ? viz.colors.white + '66' : viz.colors.grid;
                                ctx.lineWidth = highlight ? 2 : 1;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.stroke();
                            }

                            // Draw nodes
                            for (var i = 0; i < fields.length; i++) {
                                var f = fields[i];
                                var isSelected = (i === selected);
                                var r = isSelected ? 36 : 30;

                                ctx.fillStyle = f.color + (isSelected ? '88' : '44');
                                ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = f.color;
                                ctx.lineWidth = isSelected ? 3 : 1.5;
                                ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (isSelected ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                var lines = f.name.split('\n');
                                for (var li = 0; li < lines.length; li++) {
                                    ctx.fillText(lines[li], f.x, f.y + (li - (lines.length - 1) / 2) * 13);
                                }
                            }

                            // Info panel for selected
                            if (selected >= 0) {
                                var sf = fields[selected];
                                ctx.fillStyle = '#0c0c20dd';
                                ctx.fillRect(10, h - 80, w - 20, 70);
                                ctx.strokeStyle = sf.color;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(10, h - 80, w - 20, 70);

                                ctx.fillStyle = sf.color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillText(sf.name.replace('\n', ' '), 20, h - 72);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText(sf.desc, 20, h - 54);

                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('Key math: ' + sf.math.join(', '), 20, h - 36);
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Where Does Mathematical Thinking Go?', w / 2, 6);
                            if (selected < 0) {
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Click a field to learn more', w / 2, h - 14);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            selected = -1;
                            for (var i = 0; i < fields.length; i++) {
                                var dx = mx - fields[i].x;
                                var dy = my - fields[i].y;
                                if (dx * dx + dy * dy < 36 * 36) {
                                    selected = i;
                                    break;
                                }
                            }
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Pick a career or field that interests you. Identify three specific ways that mathematical thinking (not just calculation) is used in that field.',
                    hint: 'Think about pattern recognition, logical reasoning, abstraction, modeling, and optimization, not just arithmetic or formulas.',
                    solution: 'Answers will vary. For example, in game design: (1) probability theory for balancing random events, (2) graph theory for level/map design, (3) optimization for AI pathfinding. The key insight is that mathematical thinking goes far beyond computation; it is about structure, logic, and abstraction.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 7: Keep Playing!
        // ─────────────────────────────────────────────
        {
            id: 'sec-coda',
            title: 'Keep Playing!',
            content: `
<h2>Keep Playing!</h2>

<p>You have reached the end of this book, but mathematical thinking has no endpoint. The problems get harder, the connections get deeper, and the surprises keep coming. Here are some directions for continuing the journey.</p>

<h3>Competitions</h3>
<p>Mathematical competitions are a wonderful way to sharpen your skills and meet other enthusiasts:</p>
<ul>
<li><strong>AMC / AIME / USAMO</strong> (USA): a ladder of increasingly challenging competitions, starting from multiple choice and ending at proof-based olympiad problems.</li>
<li><strong>International Mathematical Olympiad (IMO)</strong>: the pinnacle of high school mathematics, held annually since 1959.</li>
<li><strong>Kangaroo, SASMO, IMAS</strong> (international): accessible competitions with fun problems at many levels.</li>
<li><strong>Putnam Competition</strong> (university): notoriously difficult, with a median score often close to zero. A humbling and rewarding experience.</li>
</ul>

<h3>Books</h3>
<p>Some books that capture the spirit of mathematical play:</p>
<ul>
<li><em>Problem-Solving Strategies</em> by Arthur Engel: a comprehensive guide to competition mathematics.</li>
<li><em>Proofs from THE BOOK</em> by Aigner and Ziegler: beautiful proofs in the spirit of Erdos's Book.</li>
<li><em>The Art and Craft of Problem Solving</em> by Paul Zeitz: thinking strategies for hard problems.</li>
<li><em>Godel, Escher, Bach</em> by Douglas Hofstadter: a playful exploration of self-reference, intelligence, and formal systems.</li>
<li><em>What Is Mathematics?</em> by Courant and Robbins: a classic overview of the major branches.</li>
</ul>

<h3>Online Resources</h3>
<ul>
<li><strong>Art of Problem Solving (AoPS)</strong>: forums, courses, and a community of young mathematicians.</li>
<li><strong>Project Euler</strong>: programming challenges with a mathematical flavor.</li>
<li><strong>3Blue1Brown</strong>: visual mathematics videos that make deep ideas accessible.</li>
<li><strong>Numberphile</strong>: engaging videos on all kinds of mathematical topics.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-math-timeline"></div>

<h3>A Timeline of Ideas</h3>

<p>Mathematics has a history spanning thousands of years. The timeline above shows some of the key moments: from Euclid's proof that there are infinitely many primes, through Euler's discoveries, to modern breakthroughs in computer science and cryptography. Every dot represents someone who was once a student, just like you, who found a question they could not stop thinking about.</p>

<div class="env-block intuition">
    <div class="env-title">A Final Thought</div>
    <div class="env-body">
        <p>The mathematician Richard Hamming said: "The purpose of computing is insight, not numbers." The same is true of all mathematics. The formulas and techniques matter, but what matters more is the way of thinking: the habit of asking "why?", the patience to chase an idea through many wrong turns, the joy of suddenly seeing a pattern click into place.</p>
        <p>You have practiced that kind of thinking throughout this book. Carry it with you. It will serve you in mathematics and far beyond.</p>
        <p><strong>Keep playing. Keep wondering. Keep proving.</strong></p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-math-timeline',
                    title: 'A Timeline of Mathematical Ideas',
                    description: 'Scroll through major milestones in mathematical history. Click on an event to learn more.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var events = [
                            { year: -300, name: "Euclid's Elements", desc: 'Systematic geometry and the infinitude of primes', color: viz.colors.blue },
                            { year: -250, name: 'Archimedes', desc: 'Pi approximation, areas and volumes, method of exhaustion', color: viz.colors.teal },
                            { year: 628, name: 'Brahmagupta', desc: 'Zero as a number, negative numbers, quadratic formula', color: viz.colors.green },
                            { year: 820, name: 'Al-Khwarizmi', desc: 'Algebra (al-jabr), systematic equation solving', color: viz.colors.orange },
                            { year: 1202, name: 'Fibonacci', desc: 'Liber Abaci: Hindu-Arabic numerals reach Europe', color: viz.colors.purple },
                            { year: 1545, name: 'Cardano', desc: 'Solutions to cubic and quartic equations', color: viz.colors.pink },
                            { year: 1654, name: 'Pascal & Fermat', desc: 'Probability theory born from a gambling question', color: viz.colors.blue },
                            { year: 1687, name: 'Newton', desc: 'Principia: calculus applied to physics', color: viz.colors.teal },
                            { year: 1736, name: 'Euler', desc: 'Konigsberg bridges (graph theory), e^{i*pi}+1=0', color: viz.colors.orange },
                            { year: 1799, name: 'Gauss', desc: 'Fundamental theorem of algebra proved', color: viz.colors.green },
                            { year: 1832, name: 'Galois', desc: 'Group theory, unsolvability of the quintic', color: viz.colors.purple },
                            { year: 1854, name: 'Riemann', desc: 'Riemannian geometry, the Riemann hypothesis', color: viz.colors.red },
                            { year: 1874, name: 'Cantor', desc: 'Set theory, different sizes of infinity', color: viz.colors.pink },
                            { year: 1931, name: 'Godel', desc: 'Incompleteness theorems: limits of formal systems', color: viz.colors.blue },
                            { year: 1936, name: 'Turing', desc: 'Computability, the Turing machine', color: viz.colors.teal },
                            { year: 1944, name: 'Von Neumann', desc: 'Game theory (with Morgenstern)', color: viz.colors.green },
                            { year: 1994, name: 'Wiles', desc: "Fermat's Last Theorem proved after 358 years", color: viz.colors.orange },
                            { year: 2003, name: 'Perelman', desc: 'Poincare conjecture proved (declined Fields Medal)', color: viz.colors.purple },
                            { year: 2013, name: 'Zhang', desc: 'Bounded gaps between primes breakthrough', color: viz.colors.red }
                        ];

                        var scrollOffset = 0;
                        var selected = -1;
                        var timelineY = h * 0.4;
                        var yearMin = -400;
                        var yearMax = 2050;
                        var pixPerYear = (w - 80) / (yearMax - yearMin);

                        function yearToX(year) {
                            return 40 + (year - yearMin) * pixPerYear + scrollOffset;
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Milestones in Mathematical History', w / 2, 6);

                            // Timeline line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(0, timelineY);
                            ctx.lineTo(w, timelineY);
                            ctx.stroke();

                            // Era markers
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var eras = [
                                { year: -300, label: '300 BCE' },
                                { year: 0, label: '0' },
                                { year: 500, label: '500' },
                                { year: 1000, label: '1000' },
                                { year: 1500, label: '1500' },
                                { year: 1700, label: '1700' },
                                { year: 1900, label: '1900' },
                                { year: 2000, label: '2000' }
                            ];
                            for (var e = 0; e < eras.length; e++) {
                                var ex = yearToX(eras[e].year);
                                if (ex > 10 && ex < w - 10) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText(eras[e].label, ex, timelineY + 6);
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.beginPath(); ctx.moveTo(ex, timelineY - 4); ctx.lineTo(ex, timelineY + 4); ctx.stroke();
                                }
                            }

                            // Events
                            for (var i = 0; i < events.length; i++) {
                                var ev = events[i];
                                var ex = yearToX(ev.year);
                                if (ex < -20 || ex > w + 20) continue;

                                var above = (i % 2 === 0);
                                var dotY = timelineY;
                                var labelY = above ? timelineY - 20 - (i === selected ? 10 : 0) : timelineY + 20 + (i === selected ? 10 : 0);

                                // Connector line
                                ctx.strokeStyle = ev.color + '88';
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(ex, dotY); ctx.lineTo(ex, labelY); ctx.stroke();

                                // Dot
                                var r = (i === selected) ? 7 : 5;
                                ctx.fillStyle = ev.color;
                                ctx.beginPath(); ctx.arc(ex, dotY, r, 0, Math.PI * 2); ctx.fill();

                                // Name label
                                ctx.fillStyle = (i === selected) ? viz.colors.white : ev.color;
                                ctx.font = (i === selected ? 'bold ' : '') + '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = above ? 'bottom' : 'top';
                                ctx.fillText(ev.name, ex, labelY);
                            }

                            // Selected detail
                            if (selected >= 0 && selected < events.length) {
                                var se = events[selected];
                                ctx.fillStyle = '#0c0c20dd';
                                ctx.fillRect(10, h - 70, w - 20, 60);
                                ctx.strokeStyle = se.color;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(10, h - 70, w - 20, 60);

                                ctx.fillStyle = se.color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                var yearStr = se.year < 0 ? Math.abs(se.year) + ' BCE' : se.year + ' CE';
                                ctx.fillText(se.name + ' (' + yearStr + ')', 20, h - 62);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText(se.desc, 20, h - 44);
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Click a dot to learn more. Drag to scroll.', w / 2, h - 14);
                            }
                        }

                        // Click handler
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            selected = -1;
                            for (var i = 0; i < events.length; i++) {
                                var ex = yearToX(events[i].year);
                                var dx = mx - ex;
                                var dy = my - timelineY;
                                if (dx * dx + dy * dy < 15 * 15) {
                                    selected = i;
                                    break;
                                }
                            }
                            draw();
                        });

                        // Drag to scroll
                        var dragging = false;
                        var lastDragX = 0;
                        viz.canvas.addEventListener('mousedown', function(e) {
                            dragging = true;
                            lastDragX = e.clientX;
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (!dragging) return;
                            var dx = e.clientX - lastDragX;
                            scrollOffset += dx;
                            lastDragX = e.clientX;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragging = false; });
                        viz.canvas.addEventListener('mouseleave', function() { dragging = false; });

                        // Touch support
                        viz.canvas.addEventListener('touchstart', function(e) {
                            dragging = true;
                            lastDragX = e.touches[0].clientX;
                        }, { passive: true });
                        viz.canvas.addEventListener('touchmove', function(e) {
                            if (!dragging) return;
                            var dx = e.touches[0].clientX - lastDragX;
                            scrollOffset += dx;
                            lastDragX = e.touches[0].clientX;
                            draw();
                        }, { passive: true });
                        viz.canvas.addEventListener('touchend', function() { dragging = false; });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Pick one unsolved problem from Section 5 (Goldbach, twin primes, or Collatz). Spend 15 minutes trying to prove it. What approaches did you try? Why do you think they did not work?',
                    hint: 'The point of this exercise is not to solve the problem (nobody has!), but to experience what mathematical research feels like: trying ideas, hitting walls, and understanding why a problem is hard.',
                    solution: 'Answers will vary. Common attempts: for Goldbach, trying induction (fails because adding 2 to an even number changes the prime decomposition); for Collatz, trying to find an invariant (fails because the odd step introduces multiplication that breaks most invariants). The exercise succeeds if the student articulates why their approach fails and what additional insight would be needed.'
                },
                {
                    question: '(Essay) Of all the topics in this book, which one surprised you the most? Which one do you want to learn more about? Write a paragraph explaining why.',
                    hint: 'There is no wrong answer. Reflect on what sparked your curiosity.',
                    solution: 'This is an open-ended reflection exercise. A strong response identifies a specific topic, explains what was surprising or beautiful about it, and articulates a direction for further learning. The goal is to connect mathematical ideas to personal curiosity.'
                }
            ]
        }
    ]
});
})();
