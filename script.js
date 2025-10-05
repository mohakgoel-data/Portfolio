        const canvas = document.getElementById('header-graph');
        const ctx = canvas.getContext('2d');

        // --- Configuration ---
        const points = [
            { x: 0, y: 0.4 }, 
            { x: 0.028, y: 0.59 }, { x: 0.087, y: 0.24 },{ x: 0.1455, y: 0.84 },
            { x: 0.2058, y: 0.34 },{ x: 0.2646, y: 0.49 }, { x: 0.3234, y: 0.59 }, { x: 0.3822, y: 0.44 },
            { x: 0.436, y: 0.99},{ x: 0.497, y: 0.59 },
            { x: 0.554, y: 0.74 },{ x: 0.612, y: 0.44 },
            { x: 0.67, y: 0.54 }, { x: 0.727, y: 0.34 },
            { x: 0.786, y: 0.84 },{ x: 0.845, y: 0.54 },
            { x: 0.903, y: 0.72 },{x: 0.962, y:0.94},
            {x:1,y:0.2  }
        ];
        const speed = 10; 
        const pointRadius = 0.5;
        const lineColor = '#00FF41';
        const pointColor = '#00FF41';   

        const glowColor = '#00FF41'; // Matches lineColor
        const glowBlur = 8;        // Controls the spread of the glow (smaller for sharper)
        const glowStrength = 0.4;

        // --- State Variables ---
        let targetPointIndex;
        let currentPos;
        let lastPos;
        let animationFrameId;

        // --- Main Setup and Reset Function ---
        function setup() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            // Set canvas size to full screen
            canvas.width = window.innerWidth;
            canvas.height = 300;

            // Clear the canvas completely
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Convert fractional points to actual pixel coordinates
            const pixelPoints = points.map(p => ({
                x: p.x * canvas.width,
                y: p.y * canvas.height
            }));

            // Reset animation state
            targetPointIndex = 1;
            currentPos = { x: pixelPoints[0].x, y: pixelPoints[0].y };
            lastPos = { x: pixelPoints[0].x, y: pixelPoints[0].y };

            // Draw the static guide points first
            pixelPoints.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fill();
            });

            // Start the animation
            animate(pixelPoints);
        }


        // --- Animation Loop ---
        function animate(pixelPoints) {
            if (targetPointIndex >= pixelPoints.length) return;

            const targetPoint = pixelPoints[targetPointIndex];

            const dx = targetPoint.x - currentPos.x;
            const dy = targetPoint.y - currentPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            lastPos.x = currentPos.x;
            lastPos.y = currentPos.y;

            if (distance < speed) {
                currentPos.x = targetPoint.x;
                currentPos.y = targetPoint.y;
                targetPointIndex++;
            } else {
                currentPos.x += (dx / distance) * speed;
                currentPos.y += (dy / distance) * speed;
            }
            ctx.save(); // Save the current canvas state

            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowBlur;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(currentPos.x, currentPos.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(currentPos.x, currentPos.y, pointRadius, 0, Math.PI * 2);
            ctx.fillStyle = pointColor;
            ctx.fill();

            ctx.restore();

            requestAnimationFrame(() => animate(pixelPoints));
        }

        // --- Event Listener for Window Resizing ---
        window.addEventListener('resize', setup);

        // --- Initial Start ---
        setTimeout(setup, 1000);;