// === Chapter 5: Number Tricks & Surprises ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Number Tricks & Surprises',
    subtitle: 'Mathematical magic tricks you can explain',
    file: 'ch05-number-tricks',

    sections: [
        // ============================================================
        // Section 0: Motivation
        // ============================================================
        {
            id: 'sec-motivation',
            title: 'Mathematics as Magic',
            content: `
<h2>Mathematics as Magic</h2>

<p>Imagine you ask a friend to pick any three-digit number, perform a series of arithmetic operations, and you correctly predict the final result every single time. Is it a magic trick? In a sense, yes. But the "magic" is algebra, and once you see the mechanism, the wonder does not diminish; it deepens.</p>

<p>Number tricks occupy a special place in mathematical thinking. They sit at the intersection of arithmetic, algebra, and number theory. Each trick encodes a genuine theorem, even if the person performing it has no idea why it works.</p>

<div class="env-block intuition">
<strong>Why study number tricks?</strong>
<ul>
<li>They train you to think algebraically: replacing specific numbers with variables reveals hidden structure.</li>
<li>They illustrate deep properties of our number system (place value, divisibility, fixed points).</li>
<li>They are fun. Seriously. Show one to a friend and watch their face.</li>
</ul>
</div>

<p>In this chapter we will explore several classic number tricks, uncover the algebra or number theory that makes each one tick, and learn to invent tricks of our own. Along the way, we will meet the mysterious number 1089, Kaprekar's constant 6174, and the ancient art of "casting out nines."</p>

<div class="env-block remark">
<strong>A note on "always."</strong> When we say a trick "always works," we mean it works for every valid input. Part of the fun is figuring out exactly which inputs are valid and why the exceptions (if any) exist.
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ============================================================
        // Section 1: The 1089 Trick
        // ============================================================
        {
            id: 'sec-1089',
            title: 'The 1089 Trick',
            content: `
<h2>The 1089 Trick</h2>

<p>Here is one of the most famous number tricks in all of mathematics:</p>

<div class="env-block definition">
<strong>The 1089 Algorithm</strong>
<ol>
<li>Pick any three-digit number whose first and last digits differ by at least 2. (For example, 725.)</li>
<li>Reverse the digits. (527.)</li>
<li>Subtract the smaller from the larger. (725 &minus; 527 = 198.)</li>
<li>Reverse the result. (891.)</li>
<li>Add the result and its reversal. (198 + 891 = <strong>1089</strong>.)</li>
</ol>
</div>

<p>Try it with any qualifying three-digit number. The answer is <em>always</em> 1089.</p>

<h3>Why does it work?</h3>

<p>Let us write the original number as \\(\\overline{abc}\\), which means \\(100a + 10b + c\\) where \\(a > c + 1\\) (we assumed the first digit is larger; if not, we swap). The reversed number is \\(100c + 10b + a\\).</p>

<p>The subtraction gives:</p>
\\[
(100a + 10b + c) - (100c + 10b + a) = 99(a - c).
\\]

<p>Since \\(a - c\\) is between 2 and 9, the result \\(99(a-c)\\) takes values 198, 297, 396, 495, 594, 693, 792, or 891. Now comes the key observation: write any of these as \\(\\overline{pqr}\\). You can verify that in every case, \\(p + r = 9\\) and \\(q = 9\\). So the number and its reversal sum to:</p>
\\[
(100p + 90 + r) + (100r + 90 + p) = 101(p + r) + 180 = 101 \\times 9 + 180 = 909 + 180 = 1089.
\\]

<div class="env-block intuition">
<strong>The real insight.</strong> The trick works because \\(99k\\) for \\(k \\in \\{2,\\ldots,9\\}\\) always produces a three-digit number whose first and last digits sum to 9 and whose middle digit is 9. That structural rigidity forces the final sum to be 1089 regardless of the starting number.
</div>

<div class="viz-placeholder" data-viz="viz-1089-trick"></div>
`,
            visualizations: [
                {
                    id: 'viz-1089-trick',
                    title: 'The 1089 Trick Step-by-Step',
                    description: 'Enter any three-digit number (first and last digits differ by at least 2) and watch the trick unfold step by step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var inputNum = 725;
                        var step = 0; // 0=input, 1=reverse, 2=subtract, 3=reverse result, 4=add, 5=done
                        var animating = false;

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:6px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.value = '725';
                        inp.min = 100; inp.max = 999;
                        inp.style.cssText = 'width:90px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(inp);
                        body.appendChild(inputDiv);

                        function reverseNum(n) {
                            return parseInt(String(n).split('').reverse().join(''), 10);
                        }

                        function pad3(n) {
                            var s = String(n);
                            while (s.length < 3) s = '0' + s;
                            return s;
                        }

                        function compute(n) {
                            var rev = reverseNum(n);
                            var big = Math.max(n, rev);
                            var small = Math.min(n, rev);
                            var diff = big - small;
                            var diffRev = reverseNum(parseInt(pad3(diff), 10));
                            var total = diff + diffRev;
                            return { original: n, reversed: rev, big: big, small: small, diff: diff, diffStr: pad3(diff), diffRev: diffRev, diffRevStr: pad3(diffRev), total: total };
                        }

                        function validate(n) {
                            if (n < 100 || n > 999) return false;
                            var d1 = Math.floor(n / 100);
                            var d3 = n % 10;
                            return Math.abs(d1 - d3) >= 2;
                        }

                        function draw() {
                            viz.clear();
                            var c = compute(inputNum);
                            var valid = validate(inputNum);

                            viz.screenText('The 1089 Trick', w / 2, 22, viz.colors.white, 16);

                            if (!valid) {
                                viz.screenText('Please enter a 3-digit number where', w / 2, h / 2 - 20, viz.colors.red, 14);
                                viz.screenText('the first and last digits differ by at least 2.', w / 2, h / 2 + 5, viz.colors.red, 13);
                                viz.screenText('(e.g., 725, 341, 912)', w / 2, h / 2 + 30, viz.colors.text, 12);
                                return;
                            }

                            var steps = [
                                { label: 'Start with:', value: String(c.original), color: viz.colors.blue },
                                { label: 'Reverse the digits:', value: String(c.reversed), color: viz.colors.teal },
                                { label: 'Subtract (' + c.big + ' \u2212 ' + c.small + '):', value: c.diffStr, color: viz.colors.orange },
                                { label: 'Reverse the result:', value: c.diffRevStr, color: viz.colors.purple },
                                { label: 'Add (' + c.diffStr + ' + ' + c.diffRevStr + '):', value: String(c.total), color: viz.colors.green }
                            ];

                            var startY = 55;
                            var lineH = 52;

                            for (var i = 0; i < steps.length; i++) {
                                if (i > step) break;
                                var yy = startY + i * lineH;
                                var alpha = (i === step) ? 'ff' : '99';

                                // Step number circle
                                ctx.fillStyle = steps[i].color + '44';
                                ctx.beginPath();
                                ctx.arc(50, yy + 10, 16, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = steps[i].color;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(String(i + 1), 50, yy + 10);

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(steps[i].label, 80, yy + 4);

                                // Value (big digits)
                                ctx.fillStyle = steps[i].color + alpha;
                                ctx.font = 'bold 22px monospace';
                                ctx.textAlign = 'left';
                                ctx.fillText(steps[i].value, 80, yy + 28);

                                // Draw individual digit boxes for the value
                                var valStr = steps[i].value;
                                var boxX = 200;
                                var boxW = 36;
                                for (var d = 0; d < valStr.length; d++) {
                                    ctx.strokeStyle = steps[i].color + '55';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(boxX + d * (boxW + 4), yy + 8, boxW, boxW);
                                    ctx.fillStyle = steps[i].color + alpha;
                                    ctx.font = 'bold 20px monospace';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(valStr[d], boxX + d * (boxW + 4) + boxW / 2, yy + 8 + boxW / 2 + 1);
                                }
                            }

                            // Final reveal
                            if (step >= 4) {
                                var fy = startY + 5 * lineH;
                                if (c.total === 1089) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 18px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('It is always 1089!', w / 2, fy);
                                } else {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Result: ' + c.total + ' (digits too close?)', w / 2, fy);
                                }

                                // Show the algebra
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var d1 = Math.floor(c.original / 100);
                                var d3 = c.original % 10;
                                var k = Math.abs(d1 - d3);
                                ctx.fillText('a \u2212 c = ' + k + ',  99 \u00D7 ' + k + ' = ' + (99 * k) + ',  digits sum: first+last = 9, middle = 9', w / 2, fy + 22);
                            }
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (step < 4) {
                                step++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Auto Play', function() {
                            step = 0;
                            draw();
                            var timer = setInterval(function() {
                                step++;
                                draw();
                                if (step >= 4) clearInterval(timer);
                            }, 800);
                        });

                        inp.addEventListener('change', function() {
                            inputNum = parseInt(inp.value, 10) || 0;
                            step = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Try the 1089 trick with the number 341. Show all five steps.',
                    hint: 'Reverse 341 to get 143. Subtract: 341 \u2212 143 = 198. Reverse 198 to get 891. Add them.',
                    solution: '341 \u2192 143. Subtract: 341 \u2212 143 = 198. Reverse: 891. Sum: 198 + 891 = 1089.'
                },
                {
                    question: 'Why does the trick require the first and last digits to differ by at least 2? What happens if they differ by exactly 1?',
                    hint: 'Compute 99 \u00D7 1 = 99. This is only two digits, which breaks the "reverse a three-digit number" step.',
                    solution: 'If \\(a - c = 1\\), then \\(99 \\times 1 = 099\\), which is really just 99 (two digits). Reversing gives 99, and \\(99 + 99 = 198 \\neq 1089\\). The trick relies on a genuine three-digit difference. If \\(a = c\\), the difference is 0, which is even worse.'
                }
            ]
        },

        // ============================================================
        // Section 2: Think of a Number
        // ============================================================
        {
            id: 'sec-think-number',
            title: 'Think of a Number',
            content: `
<h2>Think of a Number</h2>

<p>"Think of a number. Double it. Add 10. Halve the result. Subtract your original number. Your answer is 5."</p>

<p>This is perhaps the oldest genre of mathematical magic. A performer issues a sequence of instructions, and no matter what number the audience member starts with, the result is predetermined. The secret, of course, is algebra.</p>

<h3>How it works</h3>

<p>Let the chosen number be \\(x\\). Follow the instructions:</p>
<ol>
<li>Start with \\(x\\).</li>
<li>Double it: \\(2x\\).</li>
<li>Add 10: \\(2x + 10\\).</li>
<li>Halve the result: \\(x + 5\\).</li>
<li>Subtract your original number: \\(x + 5 - x = 5\\).</li>
</ol>

<p>The \\(x\\) cancels out. That is the entire mechanism. Every "think of a number" trick works by engineering the algebra so that the unknown cancels, leaving only constants.</p>

<div class="env-block definition">
<strong>The cancellation principle.</strong> If you apply operations that ultimately produce an expression of the form \\(f(x) = c\\) (a constant), then the result is independent of \\(x\\). The art of designing a trick is choosing operations that feel unpredictable but algebraically collapse.
</div>

<h3>A more elaborate trick</h3>

<div class="env-block example">
<strong>The "reveal your age" trick.</strong>
<ol>
<li>Take your age. (Call it \\(x\\).)</li>
<li>Multiply by 2.</li>
<li>Add 5.</li>
<li>Multiply by 50.</li>
<li>If you have already had your birthday this year, add 1776. Otherwise, add 1775.</li>
<li>Subtract the year you were born.</li>
</ol>
The result is a three-digit number. The first digit is your age, and the last two digits are... also related to your age! (This trick is calibrated for the year 2026.)
</div>

<p>The algebra: \\(((2x + 5) \\times 50) + 1776 - \\text{birth year} = 100x + 250 + 1776 - \\text{birth year} = 100x + (2026 - \\text{birth year})\\). If you have had your birthday, \\(2026 - \\text{birth year} = x\\), giving \\(100x + x = 101x\\). The digits encode your age!</p>

<div class="viz-placeholder" data-viz="viz-think-of-number"></div>
`,
            visualizations: [
                {
                    id: 'viz-think-of-number',
                    title: 'Mind Reading Machine',
                    description: 'The computer will "read your mind." Think of a number and follow the instructions. The algebra is revealed at the end.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var tricks = [
                            {
                                name: 'Classic Five',
                                steps: [
                                    { text: 'Think of a number.', expr: 'x', op: null },
                                    { text: 'Double it.', expr: '2x', op: function(v) { return v * 2; } },
                                    { text: 'Add 10.', expr: '2x + 10', op: function(v) { return v + 10; } },
                                    { text: 'Halve the result.', expr: 'x + 5', op: function(v) { return v / 2; } },
                                    { text: 'Subtract your original number.', expr: '5', op: function(v, orig) { return v - orig; } }
                                ],
                                result: 'Your answer is 5!'
                            },
                            {
                                name: 'Always 3',
                                steps: [
                                    { text: 'Think of a number.', expr: 'x', op: null },
                                    { text: 'Add 5.', expr: 'x + 5', op: function(v) { return v + 5; } },
                                    { text: 'Double the result.', expr: '2x + 10', op: function(v) { return v * 2; } },
                                    { text: 'Subtract 4.', expr: '2x + 6', op: function(v) { return v - 4; } },
                                    { text: 'Halve the result.', expr: 'x + 3', op: function(v) { return v / 2; } },
                                    { text: 'Subtract your original number.', expr: '3', op: function(v, orig) { return v - orig; } }
                                ],
                                result: 'Your answer is 3!'
                            },
                            {
                                name: 'Always 4',
                                steps: [
                                    { text: 'Think of a number.', expr: 'x', op: null },
                                    { text: 'Multiply by 3.', expr: '3x', op: function(v) { return v * 3; } },
                                    { text: 'Add 12.', expr: '3x + 12', op: function(v) { return v + 12; } },
                                    { text: 'Divide by 3.', expr: 'x + 4', op: function(v) { return v / 3; } },
                                    { text: 'Subtract your original number.', expr: '4', op: function(v, orig) { return v - orig; } }
                                ],
                                result: 'Your answer is 4!'
                            }
                        ];

                        var trickIdx = 0;
                        var currentStep = 0;
                        var secretNum = 7;
                        var currentVal = 7;
                        var showAlgebra = false;

                        // Input for secret number
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:6px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var lbl = document.createElement('span');
                        lbl.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        lbl.textContent = 'Your secret number:';
                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.value = '7';
                        inp.style.cssText = 'width:80px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        body.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var trick = tricks[trickIdx];

                            viz.screenText('Mind Reading: "' + trick.name + '"', w / 2, 22, viz.colors.white, 15);

                            var startY = 52;
                            var lineH = 44;

                            for (var i = 0; i <= Math.min(currentStep, trick.steps.length - 1); i++) {
                                var yy = startY + i * lineH;
                                var s = trick.steps[i];

                                // Step text
                                ctx.fillStyle = (i === currentStep) ? viz.colors.white : viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText((i + 1) + '. ' + s.text, 30, yy);

                                // Algebra column
                                if (showAlgebra || i < currentStep) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '13px monospace';
                                    ctx.textAlign = 'left';
                                    ctx.fillText(s.expr, w - 180, yy);
                                }

                                // Actual value column (hidden until reveal)
                                if (showAlgebra) {
                                    var val = secretNum;
                                    for (var j = 1; j <= i; j++) {
                                        val = trick.steps[j].op(val, secretNum);
                                    }
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '13px monospace';
                                    ctx.textAlign = 'right';
                                    ctx.fillText('= ' + val, w - 20, yy);
                                }
                            }

                            // Result
                            if (currentStep >= trick.steps.length) {
                                var ry = startY + trick.steps.length * lineH + 10;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(trick.result, w / 2, ry);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('The x always cancels out, leaving only the constant.', w / 2, ry + 25);
                            }
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            var trick = tricks[trickIdx];
                            if (currentStep < trick.steps.length) {
                                currentStep++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Show Algebra', function() {
                            showAlgebra = !showAlgebra;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Next Trick', function() {
                            trickIdx = (trickIdx + 1) % tricks.length;
                            currentStep = 0;
                            showAlgebra = false;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            currentStep = 0;
                            showAlgebra = false;
                            draw();
                        });

                        inp.addEventListener('change', function() {
                            secretNum = parseFloat(inp.value) || 0;
                            currentStep = 0;
                            showAlgebra = false;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design a "think of a number" trick whose final answer is always 7.',
                    hint: 'You need operations that produce \\(x + 7 - x\\) or something equivalent. For instance: triple, add 21, divide by 3, subtract original.',
                    solution: 'One solution: (1) Think of \\(x\\). (2) Multiply by 3: \\(3x\\). (3) Add 21: \\(3x + 21\\). (4) Divide by 3: \\(x + 7\\). (5) Subtract original: 7. The key is that \\(21/3 = 7\\).'
                },
                {
                    question: 'In the "always 5" trick (double, add 10, halve, subtract original), what happens if you start with a negative number or a fraction? Does the trick still work?',
                    hint: 'Trace through the algebra with \\(x = -3\\) or \\(x = 1/2\\).',
                    solution: 'Yes! The algebra \\(x + 5 - x = 5\\) holds for any real number \\(x\\). With \\(x = -3\\): \\(-6, 4, 2, 5\\). With \\(x = 1/2\\): \\(1, 11, 5.5, 5\\). The trick works for all real numbers.'
                }
            ]
        },

        // ============================================================
        // Section 3: Divisibility Tricks as Magic
        // ============================================================
        {
            id: 'sec-divisibility-tricks',
            title: 'Divisibility Tricks as Magic',
            content: `
<h2>Divisibility Tricks as Magic</h2>

<p>Long before calculators existed, people needed quick ways to test whether a number was divisible by 3, 9, 11, or other small primes. The tests they discovered are, in effect, number tricks with a rigorous algebraic foundation.</p>

<h3>Divisibility by 9: the digit sum</h3>

<div class="env-block definition">
<strong>The digit sum rule.</strong> A number is divisible by 9 if and only if the sum of its digits is divisible by 9. Moreover, the remainder when dividing by 9 equals the remainder of the digit sum divided by 9.
</div>

<p>For example, \\(2{,}718 \\to 2 + 7 + 1 + 8 = 18 \\to 1 + 8 = 9\\). Since 9 is divisible by 9, so is 2718.</p>

<h3>Why it works</h3>

<p>The key identity is \\(10 \\equiv 1 \\pmod{9}\\). So \\(10^k \\equiv 1 \\pmod{9}\\) for all \\(k\\). Therefore:</p>
\\[
\\overline{d_n d_{n-1} \\cdots d_1 d_0} = d_n \\cdot 10^n + \\cdots + d_1 \\cdot 10 + d_0 \\equiv d_n + \\cdots + d_1 + d_0 \\pmod{9}.
\\]

<p>The number and its digit sum have the same remainder when divided by 9. The same logic works for divisibility by 3 (since \\(10 \\equiv 1 \\pmod{3}\\) as well).</p>

<h3>Divisibility by 11: the alternating sum</h3>

<div class="env-block definition">
<strong>The alternating sum rule.</strong> A number is divisible by 11 if and only if the alternating sum of its digits (starting from the right) is divisible by 11.
</div>

<p>For example, \\(918{,}082 \\to 2 - 8 + 0 - 8 + 1 - 9 = -22\\). Since \\(-22\\) is divisible by 11, so is 918,082.</p>

<p>This works because \\(10 \\equiv -1 \\pmod{11}\\), so \\(10^k \\equiv (-1)^k \\pmod{11}\\).</p>

<h3>Casting out nines</h3>

<p>The digit sum rule gives us a powerful mental arithmetic check called <strong>casting out nines</strong>. To verify that \\(247 \\times 382 = 94{,}354\\):</p>
<ol>
<li>Digital root of 247: \\(2 + 4 + 7 = 13 \\to 1 + 3 = 4\\).</li>
<li>Digital root of 382: \\(3 + 8 + 2 = 13 \\to 1 + 3 = 4\\).</li>
<li>Product of digital roots: \\(4 \\times 4 = 16 \\to 1 + 6 = 7\\).</li>
<li>Digital root of 94,354: \\(9 + 4 + 3 + 5 + 4 = 25 \\to 2 + 5 = 7\\). Match!</li>
</ol>

<div class="env-block warning">
<strong>A necessary but not sufficient check.</strong> If the digital roots do not match, the calculation is definitely wrong. If they do match, the calculation is <em>probably</em> right, but not guaranteed. Errors that are multiples of 9 will slip through. For instance, \\(94{,}354\\) and \\(94{,}345\\) have the same digital root.
</div>

<div class="viz-placeholder" data-viz="viz-casting-out-nines"></div>
`,
            visualizations: [
                {
                    id: 'viz-casting-out-nines',
                    title: 'Casting Out Nines',
                    description: 'Enter a multiplication problem and check your answer using the digit sum method.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var numA = 247;
                        var numB = 382;
                        var userAnswer = 94354;
                        var showCheck = false;

                        // Inputs
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:6px;display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;';

                        function makeInput(val, placeholder) {
                            var i = document.createElement('input');
                            i.type = 'number';
                            i.value = val;
                            i.placeholder = placeholder;
                            i.style.cssText = 'width:90px;padding:6px 8px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:0.95rem;text-align:center;';
                            return i;
                        }

                        var inpA = makeInput('247', 'First');
                        var times = document.createElement('span');
                        times.textContent = '\u00D7';
                        times.style.cssText = 'color:#8b949e;font-size:1.1rem;';
                        var inpB = makeInput('382', 'Second');
                        var eq = document.createElement('span');
                        eq.textContent = '=';
                        eq.style.cssText = 'color:#8b949e;font-size:1.1rem;';
                        var inpAns = makeInput('94354', 'Your answer');
                        inpAns.style.width = '110px';

                        inputDiv.appendChild(inpA);
                        inputDiv.appendChild(times);
                        inputDiv.appendChild(inpB);
                        inputDiv.appendChild(eq);
                        inputDiv.appendChild(inpAns);
                        body.appendChild(inputDiv);

                        function digitalRoot(n) {
                            n = Math.abs(n);
                            if (n === 0) return 0;
                            var r = n % 9;
                            return r === 0 ? 9 : r;
                        }

                        function digitSum(n) {
                            n = Math.abs(n);
                            var s = 0;
                            while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
                            return s;
                        }

                        function draw() {
                            viz.clear();

                            viz.screenText('Casting Out Nines', w / 2, 22, viz.colors.white, 16);

                            if (!showCheck) {
                                viz.screenText('Enter a multiplication and your answer,', w / 2, h / 2 - 20, viz.colors.text, 13);
                                viz.screenText('then press "Check" to verify with digit sums.', w / 2, h / 2 + 5, viz.colors.text, 13);
                                return;
                            }

                            var actual = numA * numB;
                            var drA = digitalRoot(numA);
                            var drB = digitalRoot(numB);
                            var drProduct = digitalRoot(drA * drB);
                            var drAnswer = digitalRoot(userAnswer);
                            var match = drProduct === drAnswer;

                            var y = 50;
                            var col1 = 60;
                            var col2 = w / 2 + 20;

                            // Left column: the computation
                            ctx.textAlign = 'left';

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Digit sum of ' + numA + ':', col1, y);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(digitSum(numA) + ' \u2192 dr = ' + drA, col1 + 10, y + 22);

                            y += 55;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Digit sum of ' + numB + ':', col1, y);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(digitSum(numB) + ' \u2192 dr = ' + drB, col1 + 10, y + 22);

                            y += 55;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Product of digital roots:', col1, y);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(drA + ' \u00D7 ' + drB + ' = ' + (drA * drB) + ' \u2192 dr = ' + drProduct, col1 + 10, y + 22);

                            y += 55;
                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Digital root of your answer (' + userAnswer + '):', col1, y);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(digitSum(userAnswer) + ' \u2192 dr = ' + drAnswer, col1 + 10, y + 22);

                            // Verdict
                            y += 60;
                            if (match) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Digital roots match! (' + drProduct + ' = ' + drAnswer + ')', w / 2, y);
                                if (userAnswer === actual) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.fillText('And the answer is correct: ' + actual, w / 2, y + 22);
                                } else {
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.fillText('But actual answer is ' + actual + '. The error is a multiple of 9!', w / 2, y + 22);
                                }
                            } else {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Mismatch! (' + drProduct + ' \u2260 ' + drAnswer + ') \u2014 the answer is wrong.', w / 2, y);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText('The correct answer is ' + actual + '.', w / 2, y + 22);
                            }
                        }

                        VizEngine.createButton(controls, 'Check', function() {
                            numA = parseInt(inpA.value, 10) || 0;
                            numB = parseInt(inpB.value, 10) || 0;
                            userAnswer = parseInt(inpAns.value, 10) || 0;
                            showCheck = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            showCheck = false;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the digit sum rule to determine which of the following are divisible by 9: 738, 2016, 99999, 123456.',
                    hint: 'Compute the digit sum of each. If the digit sum is divisible by 9, the number is too.',
                    solution: '738: \\(7+3+8=18\\), divisible by 9. 2016: \\(2+0+1+6=9\\), divisible by 9. 99999: \\(9 \\times 5=45 \\to 9\\), divisible by 9. 123456: \\(1+2+3+4+5+6=21 \\to 3\\), NOT divisible by 9 (but divisible by 3).'
                },
                {
                    question: 'Is 918,082 divisible by 11? Use the alternating sum rule.',
                    hint: 'Starting from the right: \\(2 - 8 + 0 - 8 + 1 - 9\\).',
                    solution: 'Alternating sum (from right): \\(2 - 8 + 0 - 8 + 1 - 9 = -22\\). Since \\(-22\\) is divisible by 11, yes, 918,082 is divisible by 11.'
                }
            ]
        },

        // ============================================================
        // Section 4: Kaprekar's Constant
        // ============================================================
        {
            id: 'sec-kaprekar',
            title: "Kaprekar's Constant",
            content: `
<h2>Kaprekar's Constant: 6174</h2>

<p>In 1949, the Indian mathematician D. R. Kaprekar discovered a remarkable property of four-digit numbers:</p>

<div class="env-block definition">
<strong>Kaprekar's routine.</strong>
<ol>
<li>Take any four-digit number with at least two distinct digits. (Leading zeros are allowed: 0001 counts.)</li>
<li>Arrange the digits in descending order to form the largest possible number.</li>
<li>Arrange them in ascending order to form the smallest.</li>
<li>Subtract: largest minus smallest.</li>
<li>Repeat with the result.</li>
</ol>
Within at most 7 iterations, you always reach <strong>6174</strong>.
</div>

<div class="env-block example">
<strong>Example: start with 3524.</strong>
<ol>
<li>Sort descending: 5432. Sort ascending: 2345. Difference: 5432 \u2212 2345 = <strong>3087</strong>.</li>
<li>8730 \u2212 0378 = <strong>8352</strong>.</li>
<li>8532 \u2212 2358 = <strong>6174</strong>.</li>
</ol>
Reached in 3 steps!
</div>

<h3>Why is 6174 special?</h3>

<p>The number 6174 is a <strong>fixed point</strong> of Kaprekar's routine: \\(7641 - 1467 = 6174\\). Once you reach it, you stay forever. No other four-digit number (with distinct digits) has this property.</p>

<p>A complete proof that every four-digit number (with at least two distinct digits) reaches 6174 can be done by exhaustive computation: there are only \\(9 \\times 10^3 - 9 = 8991\\) such numbers (excluding repdigits like 1111, 2222, etc.), and a computer can verify the claim for each one. The maximum number of steps needed is 7 (for example, starting from 6174 itself in one step, or numbers like 9831 which take 7).</p>

<div class="env-block intuition">
<strong>Kaprekar's routine for other digit lengths.</strong>
<ul>
<li><strong>Two digits:</strong> The process cycles through several values and can reach various fixed points or cycles.</li>
<li><strong>Three digits:</strong> Always reaches 495 (the three-digit Kaprekar constant).</li>
<li><strong>Five digits and beyond:</strong> The behavior is more complex; cycles can appear and there may not be a unique fixed point.</li>
</ul>
</div>

<div class="viz-placeholder" data-viz="viz-kaprekar-journey"></div>
`,
            visualizations: [
                {
                    id: 'viz-kaprekar-journey',
                    title: "Kaprekar's Journey to 6174",
                    description: 'Enter any four-digit number (with at least two distinct digits) and watch it converge to 6174.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var startNum = 3524;
                        var journey = [];
                        var animStep = 0;
                        var animTimer = null;

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:6px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.value = '3524';
                        inp.min = 1; inp.max = 9999;
                        inp.style.cssText = 'width:90px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(inp);
                        body.appendChild(inputDiv);

                        function pad4(n) {
                            var s = String(n);
                            while (s.length < 4) s = '0' + s;
                            return s;
                        }

                        function kaprekarStep(n) {
                            var digits = pad4(n).split('').map(Number);
                            var desc = digits.slice().sort(function(a, b) { return b - a; });
                            var asc = digits.slice().sort(function(a, b) { return a - b; });
                            var big = parseInt(desc.join(''), 10);
                            var small = parseInt(asc.join(''), 10);
                            return { big: big, small: small, diff: big - small, bigStr: desc.join(''), smallStr: asc.join('') };
                        }

                        function hasDistinctDigits(n) {
                            var d = pad4(n).split('');
                            return new Set(d).size > 1;
                        }

                        function computeJourney(n) {
                            var path = [n];
                            var steps = [];
                            var current = n;
                            for (var i = 0; i < 10; i++) {
                                if (!hasDistinctDigits(current)) break;
                                var s = kaprekarStep(current);
                                steps.push(s);
                                current = s.diff;
                                path.push(current);
                                if (current === 6174) break;
                            }
                            return { path: path, steps: steps };
                        }

                        function draw() {
                            viz.clear();
                            var valid = startNum >= 1 && startNum <= 9999 && hasDistinctDigits(startNum);

                            viz.screenText("Kaprekar's Journey to 6174", w / 2, 22, viz.colors.white, 15);

                            if (!valid) {
                                viz.screenText('Enter a 4-digit number with at least 2 distinct digits.', w / 2, h / 2, viz.colors.red, 13);
                                return;
                            }

                            var result = computeJourney(startNum);
                            journey = result.path;
                            var steps = result.steps;
                            var showN = Math.min(animStep, steps.length);

                            var startY = 50;
                            var lineH = Math.min(48, (h - 80) / (steps.length + 1));
                            var nodeR = 18;

                            for (var i = 0; i <= showN; i++) {
                                var yy = startY + i * lineH;
                                var num = journey[i];
                                var numStr = pad4(num);

                                // Node circle
                                var isTarget = (num === 6174);
                                var col = isTarget ? viz.colors.green : viz.colors.blue;
                                ctx.fillStyle = col + '33';
                                ctx.beginPath();
                                ctx.arc(80, yy, nodeR, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(80, yy, nodeR, 0, Math.PI * 2);
                                ctx.stroke();

                                // Number
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(numStr, 80, yy);

                                // Arrow down
                                if (i < showN) {
                                    ctx.strokeStyle = viz.colors.text;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(80, yy + nodeR + 2);
                                    ctx.lineTo(80, yy + lineH - nodeR - 2);
                                    ctx.stroke();
                                    // Arrowhead
                                    ctx.beginPath();
                                    ctx.moveTo(80, yy + lineH - nodeR - 2);
                                    ctx.lineTo(76, yy + lineH - nodeR - 8);
                                    ctx.lineTo(84, yy + lineH - nodeR - 8);
                                    ctx.closePath();
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fill();

                                    // Operation text
                                    var s = steps[i];
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '12px monospace';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(s.bigStr + ' \u2212 ' + s.smallStr + ' = ' + pad4(s.diff), 120, yy + lineH / 2);
                                }

                                // Highlight 6174
                                if (isTarget && i === showN) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 15px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Reached 6174 in ' + i + ' step' + (i !== 1 ? 's' : '') + '!', 120, yy);
                                }
                            }

                            // Step counter
                            viz.screenText('Step: ' + showN + ' / ' + steps.length, w - 60, 22, viz.colors.text, 12);
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            animStep++;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Auto Play', function() {
                            animStep = 0;
                            draw();
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animStep++;
                                draw();
                                var result = computeJourney(startNum);
                                if (animStep >= result.steps.length) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                            }, 900);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animStep = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random', function() {
                            // Pick a random 4-digit number with distinct digits
                            do {
                                startNum = 1000 + Math.floor(Math.random() * 9000);
                            } while (!hasDistinctDigits(startNum));
                            inp.value = String(startNum);
                            animStep = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        });

                        inp.addEventListener('change', function() {
                            startNum = parseInt(inp.value, 10) || 0;
                            animStep = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        });

                        draw();
                        return { stopAnimation: function() { if (animTimer) { clearInterval(animTimer); animTimer = null; } } };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Starting from 1234, how many steps does it take to reach 6174?',
                    hint: '4321 \u2212 1234 = 3087. Then 8730 \u2212 0378 = 8352. Then ...',
                    solution: '1234 \u2192 3087 \u2192 8352 \u2192 6174. It takes 3 steps.'
                },
                {
                    question: 'What is the three-digit Kaprekar constant? Start with 123 and apply the same routine (sort descending, sort ascending, subtract). Keep going until you reach a fixed point.',
                    hint: '321 \u2212 123 = 198. Then 981 \u2212 189 = ?',
                    solution: '123 \u2192 198 \u2192 792 \u2192 693 \u2192 594 \u2192 495. And 954 \u2212 459 = 495. The three-digit Kaprekar constant is 495.'
                }
            ]
        },

        // ============================================================
        // Section 5: More Number Magic
        // ============================================================
        {
            id: 'sec-more-magic',
            title: 'More Number Magic',
            content: `
<h2>More Number Magic</h2>

<h3>The multiply-by-11 trick</h3>

<p>There is a beautiful shortcut for multiplying any two-digit number by 11. Take the two digits, put their sum in the middle, and you have the answer:</p>

<div class="env-block example">
<strong>Example:</strong> \\(36 \\times 11\\).<br>
Take the digits 3 and 6. Their sum is 9. Place it in the middle: <strong>396</strong>. Done!
</div>

<p>If the middle sum exceeds 9, carry the 1:</p>

<div class="env-block example">
<strong>Example:</strong> \\(85 \\times 11\\).<br>
Digits: 8 and 5. Sum: 13. Place 3 in the middle and carry 1 to the left digit: \\(8+1 = 9\\). Result: <strong>935</strong>.
</div>

<h3>Why it works</h3>

<p>For a two-digit number \\(\\overline{ab} = 10a + b\\):</p>
\\[
11 \\times (10a + b) = 110a + 11b = 100a + 10(a + b) + b.
\\]
<p>The hundreds digit is \\(a\\), the tens digit is \\(a + b\\) (with carrying if needed), and the units digit is \\(b\\).</p>

<h3>The 1, 2, 4, 5, 7, 8 pattern</h3>

<p>Compute these:</p>
<ul>
<li>\\(1 \\div 7 = 0.\\overline{142857}\\)</li>
<li>\\(2 \\div 7 = 0.\\overline{285714}\\)</li>
<li>\\(3 \\div 7 = 0.\\overline{428571}\\)</li>
</ul>

<p>The same six digits, 1-4-2-8-5-7, keep appearing in cyclic order! The number 142857 is called a <strong>cyclic number</strong>. Multiply it by 1 through 6 and you get permutations of its own digits. Multiply by 7 and you get 999999.</p>

<div class="env-block intuition">
<strong>Why 142857?</strong> This phenomenon comes from the fact that 7 is a prime whose reciprocal has the maximum period length of 6 (one less than 7). The repeating block of \\(1/7\\) must be a cyclic number. Other primes with this property include 17, 19, 23, and 29.
</div>

<div class="viz-placeholder" data-viz="viz-multiply-by-11"></div>
`,
            visualizations: [
                {
                    id: 'viz-multiply-by-11',
                    title: 'Multiply by 11 Trick',
                    description: 'Enter any two-digit number and see the multiply-by-11 shortcut in action.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var num = 36;

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:6px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var lbl = document.createElement('span');
                        lbl.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        lbl.textContent = 'Two-digit number:';
                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.value = '36';
                        inp.min = 10; inp.max = 99;
                        inp.style.cssText = 'width:70px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        body.appendChild(inputDiv);

                        function draw() {
                            viz.clear();

                            if (num < 10 || num > 99) {
                                viz.screenText('Enter a two-digit number (10-99).', w / 2, h / 2, viz.colors.red, 14);
                                return;
                            }

                            var a = Math.floor(num / 10);
                            var b = num % 10;
                            var sum = a + b;
                            var carry = Math.floor(sum / 10);
                            var mid = sum % 10;
                            var result = num * 11;

                            viz.screenText('Multiply ' + num + ' \u00D7 11', w / 2, 28, viz.colors.white, 17);

                            // Show the digit boxes
                            var boxW = 60;
                            var boxH = 60;
                            var gapX = 20;
                            var centerX = w / 2;
                            var topY = 65;

                            // Original digits
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Step 1: Split the digits', centerX, topY);

                            var d1x = centerX - boxW - gapX / 2;
                            var d2x = centerX + gapX / 2;
                            var dy = topY + 12;

                            // Digit boxes
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(d1x, dy, boxW, boxH);
                            ctx.strokeRect(d2x, dy, boxW, boxH);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 28px monospace';
                            ctx.fillText(String(a), d1x + boxW / 2, dy + boxH / 2 + 2);
                            ctx.fillText(String(b), d2x + boxW / 2, dy + boxH / 2 + 2);

                            // Step 2: show sum
                            var step2Y = dy + boxH + 30;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Step 2: Sum of digits = ' + a + ' + ' + b + ' = ' + sum, centerX, step2Y);

                            // Step 3: place in middle
                            var step3Y = step2Y + 25;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            if (carry > 0) {
                                ctx.fillText('Step 3: Sum \u2265 10, so carry ' + carry + ' to the left', centerX, step3Y);
                            } else {
                                ctx.fillText('Step 3: Place ' + mid + ' in the middle', centerX, step3Y);
                            }

                            // Result boxes
                            var resY = step3Y + 15;
                            var resDigits = String(result).split('');
                            var totalW = resDigits.length * (boxW + 8) - 8;
                            var resStartX = centerX - totalW / 2;

                            for (var i = 0; i < resDigits.length; i++) {
                                var rx = resStartX + i * (boxW + 8);
                                var isMiddle = (resDigits.length === 3 && i === 1) || (resDigits.length === 4 && (i === 1 || i === 0));
                                var boxCol = isMiddle ? viz.colors.orange : viz.colors.green;

                                ctx.strokeStyle = boxCol;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(rx, resY, boxW, boxH);
                                ctx.fillStyle = boxCol + '22';
                                ctx.fillRect(rx, resY, boxW, boxH);

                                ctx.fillStyle = boxCol;
                                ctx.font = 'bold 28px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(resDigits[i], rx + boxW / 2, resY + boxH / 2 + 2);
                            }

                            // Final answer
                            var finalY = resY + boxH + 30;
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 20px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(num + ' \u00D7 11 = ' + result, centerX, finalY);

                            // Algebra
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Algebra: 11 \u00D7 (10\u00B7' + a + ' + ' + b + ') = 100\u00B7' + a + ' + 10\u00B7(' + a + '+' + b + ') + ' + b + ' = ' + result, centerX, finalY + 22);
                        }

                        inp.addEventListener('input', function() {
                            num = parseInt(inp.value, 10) || 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the multiply-by-11 trick to compute \\(74 \\times 11\\) and \\(99 \\times 11\\) mentally.',
                    hint: 'For 74: digits 7 and 4, sum 11, carry the 1. For 99: digits 9 and 9, sum 18, carry the 1.',
                    solution: '\\(74 \\times 11\\): \\(7 + 4 = 11\\), place 1 in the middle and carry 1: \\(7+1 = 8\\). Result: 814. \\(99 \\times 11\\): \\(9 + 9 = 18\\), place 8 in the middle and carry 1: \\(9+1 = 10\\). Result: 1089. (Notice: 1089 again!)'
                },
                {
                    question: 'Compute \\(142857 \\times 3\\) and \\(142857 \\times 5\\). What do you notice about the digits?',
                    hint: 'Just multiply and look at the result. Compare the digits to 142857.',
                    solution: '\\(142857 \\times 3 = 428571\\) and \\(142857 \\times 5 = 714285\\). Both are cyclic permutations of 142857! The digits 1, 4, 2, 8, 5, 7 appear in the same cyclic order, just starting from a different position.'
                }
            ]
        },

        // ============================================================
        // Section 6: Bridge
        // ============================================================
        {
            id: 'sec-bridge',
            title: 'The Magic Behind the Magic',
            content: `
<h2>The Magic Behind the Magic</h2>

<p>Every number trick in this chapter rests on a genuine mathematical theorem:</p>

<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left;padding:6px;color:#58a6ff;">Trick</th>
<th style="text-align:left;padding:6px;color:#58a6ff;">Underlying Mathematics</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px;">1089 trick</td>
<td style="padding:6px;">Place value and the structure of multiples of 99</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px;">"Think of a number"</td>
<td style="padding:6px;">Algebra: variable cancellation in linear expressions</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px;">Divisibility tests</td>
<td style="padding:6px;">Modular arithmetic: \\(10 \\equiv 1 \\pmod{9}\\), \\(10 \\equiv -1 \\pmod{11}\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px;">Kaprekar's constant</td>
<td style="padding:6px;">Fixed-point theory and digit rearrangement maps</td>
</tr>
<tr>
<td style="padding:6px;">Multiply by 11</td>
<td style="padding:6px;">Distributive law and place-value decomposition</td>
</tr>
</table>

<p>What makes these tricks so delightful is the gap between their apparent mystery and their actual simplicity. A trick that seems like mind reading turns out to be a one-line algebraic identity. A process that seems chaotic (rearranging digits, subtracting) turns out to converge to a fixed point with mathematical certainty.</p>

<div class="env-block intuition">
<strong>Inventing your own tricks.</strong> To create a number trick, start with the algebra you want to exploit, then dress it up as a series of "mysterious" instructions. The best tricks use many steps (to hide the structure) but simple algebra (so the result is always clean). Try designing a trick where the final answer is the audience member's birth month!
</div>

<p>In the next chapter, we will see how pattern recognition (the subject of Chapter 9) connects to these number properties, revealing deeper structures in the integers.</p>

<div class="viz-placeholder" data-viz="viz-number-magic-show"></div>
`,
            visualizations: [
                {
                    id: 'viz-number-magic-show',
                    title: 'Number Magic Show',
                    description: 'Perform a magic trick for a friend! Choose a trick, follow the step-by-step instructions, and reveal the answer.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var trickList = [
                            {
                                name: 'The 1089 Trick',
                                audience: 'Ask your friend to pick a 3-digit number\n(first and last digits differ by 2+)',
                                steps: [
                                    'Write down a three-digit number (e.g., 725)',
                                    'Reverse the digits (e.g., 527)',
                                    'Subtract the smaller from the larger (725 \u2212 527 = 198)',
                                    'Reverse the result (891)',
                                    'Add the two numbers (198 + 891)',
                                    'The answer is always... 1089!'
                                ],
                                reveal: '1089'
                            },
                            {
                                name: 'The Always-5 Trick',
                                audience: 'Ask your friend to think of any number.',
                                steps: [
                                    '"Think of any number."',
                                    '"Double it."',
                                    '"Add 10."',
                                    '"Halve the result."',
                                    '"Subtract your original number."',
                                    '"Your answer is... 5!"'
                                ],
                                reveal: '5'
                            },
                            {
                                name: 'Kaprekar\'s 6174',
                                audience: 'Ask your friend for any 4-digit number\n(at least 2 different digits)',
                                steps: [
                                    'Write the number (e.g., 2581)',
                                    'Sort digits largest to smallest (8521)',
                                    'Sort digits smallest to largest (1258)',
                                    'Subtract: 8521 \u2212 1258 = 7263',
                                    'Repeat the sort-and-subtract process',
                                    'Keep going... you always reach 6174!'
                                ],
                                reveal: '6174'
                            },
                            {
                                name: 'Multiply by 11',
                                audience: 'Ask your friend for any two-digit number.',
                                steps: [
                                    '"Tell me your two-digit number." (e.g., 63)',
                                    'Split the digits: 6 and 3',
                                    'Add them: 6 + 3 = 9',
                                    'Place the sum between the digits: 6_9_3',
                                    '"The product with 11 is... 693!"',
                                    '(If the sum is 10+, carry the 1 to the left digit)'
                                ],
                                reveal: 'Instant!'
                            }
                        ];

                        var selectedTrick = 0;
                        var currentStep = -1; // -1 = intro

                        function draw() {
                            viz.clear();
                            var trick = trickList[selectedTrick];

                            // Title bar
                            ctx.fillStyle = viz.colors.purple + '33';
                            ctx.fillRect(0, 0, w, 40);
                            viz.screenText('Number Magic Show', w / 2, 20, viz.colors.purple, 16);

                            // Trick name
                            viz.screenText(trick.name, w / 2, 58, viz.colors.white, 15);

                            if (currentStep === -1) {
                                // Instructions for the performer
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var lines = trick.audience.split('\n');
                                for (var i = 0; i < lines.length; i++) {
                                    ctx.fillText(lines[i], w / 2, 90 + i * 20);
                                }

                                viz.screenText('Press "Next Step" to begin the performance!', w / 2, h / 2 + 20, viz.colors.teal, 13);

                                // Show a big magic hat or star
                                ctx.fillStyle = viz.colors.purple + '22';
                                ctx.beginPath();
                                var cx = w / 2, cy = h / 2 - 30;
                                for (var p = 0; p < 5; p++) {
                                    var angle = -Math.PI / 2 + (p * 2 * Math.PI / 5);
                                    var outerR = 45;
                                    var innerR = 20;
                                    ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
                                    var angle2 = angle + Math.PI / 5;
                                    ctx.lineTo(cx + innerR * Math.cos(angle2), cy + innerR * Math.sin(angle2));
                                }
                                ctx.closePath();
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            } else {
                                // Show steps
                                var startY = 82;
                                var lineH = 40;

                                for (var s = 0; s < trick.steps.length; s++) {
                                    if (s > currentStep) break;
                                    var yy = startY + s * lineH;
                                    var isCurrent = (s === currentStep);
                                    var isLast = (s === trick.steps.length - 1);

                                    // Step marker
                                    var markerCol = isLast && isCurrent ? viz.colors.green : (isCurrent ? viz.colors.orange : viz.colors.text);
                                    ctx.fillStyle = markerCol;
                                    ctx.beginPath();
                                    ctx.arc(30, yy, 10, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.bg;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(String(s + 1), 30, yy);

                                    // Step text
                                    ctx.fillStyle = isCurrent ? viz.colors.white : viz.colors.text;
                                    ctx.font = (isCurrent ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(trick.steps[s], 50, yy);
                                }

                                // Reveal animation on last step
                                if (currentStep >= trick.steps.length - 1) {
                                    var revY = startY + trick.steps.length * lineH + 20;
                                    ctx.fillStyle = viz.colors.green + '22';
                                    ctx.fillRect(w / 2 - 80, revY - 20, 160, 50);
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(w / 2 - 80, revY - 20, 160, 50);

                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 22px monospace';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(trick.reveal, w / 2, revY + 5);
                                }
                            }
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            var trick = trickList[selectedTrick];
                            if (currentStep < trick.steps.length - 1) {
                                currentStep++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            currentStep = -1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Next Trick', function() {
                            selectedTrick = (selectedTrick + 1) % trickList.length;
                            currentStep = -1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Prev Trick', function() {
                            selectedTrick = (selectedTrick - 1 + trickList.length) % trickList.length;
                            currentStep = -1;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design your own "think of a number" trick where the final answer is the audience member\'s birth month (1-12). What instructions would you give?',
                    hint: 'You need the trick to produce the birth month \\(m\\) as the final answer while canceling whatever other number they started with. For example: "Think of a number. Add your birth month. Double the result. Add 10. Halve everything. Subtract your original number. Subtract 5."',
                    solution: 'Let the starting number be \\(x\\) and birth month be \\(m\\). Following the hint: \\(x \\to x+m \\to 2(x+m) = 2x+2m \\to 2x+2m+10 \\to x+m+5 \\to m+5 \\to m\\). The answer is the birth month! The key: every operation involving \\(x\\) must cancel, leaving only \\(m\\).'
                },
                {
                    question: 'The number 142857 is called a cyclic number. Compute \\(142857 \\times 7\\). What happens? Explain why using the fact that \\(1/7 = 0.\\overline{142857}\\).',
                    hint: 'Multiply it out, then think about what \\(0.\\overline{142857} \\times 7\\) equals.',
                    solution: '\\(142857 \\times 7 = 999999\\). This makes sense because \\(1/7 = 0.\\overline{142857} = 142857 / 999999\\), which gives \\(142857 = 999999 / 7\\), so \\(142857 \\times 7 = 999999\\).'
                }
            ]
        }
    ]
});
})();
