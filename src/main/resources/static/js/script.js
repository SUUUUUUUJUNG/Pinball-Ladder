document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("name-form");
    const canvas = document.getElementById("pinballCanvas");
    const ctx = canvas.getContext("2d");
    const winnerDisplay = document.getElementById("winner");

    const balls = [];
    const obstacles = [];
    const completedBalls = [];
    const gravity = 0.2;

    // 랜덤 색상 생성 함수
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    class Ball {
        constructor(name, x, y) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.dx = Math.random() * 4 - 2; // X축 속도
            this.dy = 2; // Y축 속도
            this.radius = 10; // 공의 반지름
            this.color = getRandomColor(); // 랜덤 색상
            this.finished = false; // 공이 바닥에 도달했는지 여부
        }

        move() {
            if (!this.finished) {
                this.dy += gravity; // 중력 효과 추가
                this.x += this.dx;
                this.y += this.dy;

                // 캔버스 경계 충돌 처리
                if (this.x <= this.radius || this.x >= canvas.width - this.radius) {
                    this.dx *= -1; // X축 반전
                }

                // 장애물과 충돌 처리
                obstacles.forEach((obstacle) => {
                    if (
                        this.x + this.radius > obstacle.x &&
                        this.x - this.radius < obstacle.x + obstacle.width &&
                        this.y + this.radius > obstacle.y &&
                        this.y - this.radius < obstacle.y + obstacle.height
                    ) {
                        this.dy *= -1; // Y축 반전
                        this.dx *= Math.random() > 0.5 ? 1 : -1; // X축 방향 랜덤 반전
                    }
                });

                // 캔버스 바닥에 도달하면 완료
                if (this.y >= canvas.height - this.radius) {
                    this.finished = true;
                    this.dy = 0;
                    this.dx = 0;
                    completedBalls.push(this);

                    if (completedBalls.length === balls.length) {
                        winnerDisplay.textContent = `당첨자: ${this.name}`;
                    }
                }
            }
        }

        draw() {
            // 공 그리기
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color; // 랜덤 색상 적용
            ctx.fill();
            ctx.closePath();

            // 이름 표시
            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.name, this.x, this.y - 12);
        }
    }

    class Obstacle {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        draw() {
            ctx.fillStyle = "#00f";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    function createObstacles() {
        const rows = 5;
        const cols = 5;
        const obstacleWidth = 50;
        const obstacleHeight = 10;
        const padding = 50;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * (obstacleWidth + padding) + 50;
                const y = row * (obstacleHeight + padding) + 100;
                obstacles.push(new Obstacle(x, y, obstacleWidth, obstacleHeight));
            }
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const playerNames = document.getElementById("player-names").value.split(",");
        playerNames.forEach((name) => {
            const x = Math.random() * (canvas.width - 40) + 20;
            const y = 20;
            balls.push(new Ball(name.trim(), x, y));
        });

        startGame();
    });

    function startGame() {
        createObstacles(); // 장애물 생성

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화

            // 장애물 그리기
            obstacles.forEach((obstacle) => obstacle.draw());

            // 모든 공 이동 및 그리기
            balls.forEach((ball) => {
                ball.move();
                ball.draw();
            });

            if (completedBalls.length < balls.length) {
                requestAnimationFrame(draw); // 게임 루프 유지
            }
        }

        draw(); // 게임 시작
    }
});
