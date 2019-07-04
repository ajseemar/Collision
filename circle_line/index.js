var c, ctx;
document.addEventListener("DOMContentLoaded", () => {
    c = document.getElementById('canvas');
    ctx = c.getContext('2d');

    w = new Wall(new Point(0, c.height - (c.height / 4)), new Point(c.width, c.height - (c.height / 4)));
    e = new Wall(new Point(0, 0), new Point(5, 5));
    w.render();
});

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Wall {
    constructor(p1, p2) {
        this.p1 = p1
        this.p2 = p2

        this.a = this.p2.y - this.p1.y;
        this.b = this.p1.x - this.p2.x;
        this.c = this.a * this.p1.x + this.b * this.p1.y;

        console.log(this.p1, this.p2);
        console.log('formula:', `${this.a}x + ${this.b}y + ${this.c} = 0`);
    }

    render() {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.closePath();
        ctx.stroke();
    }
}

class Circle {
    constructor(pos, size) {
        this.position = pos;
        this.radius = size;

        this.velocity = {
            x: 0,
            y: 50
        };
    }

    checkCollision(wall) {
        const dist = (Math.abs(wall.a * this.position.x + wall.b * this.position.y + wall.c)) /
            Math.sqrt(wall.a * wall.a + wall.b * wall.b);
        if (this.radius === dist) console.log('Touch');
        else if (this.radius > dist) console.log('COLLISION');
        else console.log('safe');
    }

    update(dt, walls) {
        this.position.y += this.velocity.y * dt;
        walls.forEach(wall => this.checkCollision(wall));
    }

    render() {
        ctx.fillStyle = "#0ff";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}
