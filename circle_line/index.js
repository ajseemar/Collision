var c, ctx;
document.addEventListener("DOMContentLoaded", () => {
    let initialTime = Date.now();

    c = document.getElementById('canvas');
    ctx = c.getContext('2d');

    const w = new Wall(new Point(0, c.height - (c.height / 4)), new Point(c.width, c.height - (c.height / 4)));
    const e = new Wall(new Point(0, 0), new Point(c.width, c.height));
    const p = new Circle(new Point(10, c.height / 2), 5);
    const o = new Circle(new Point(c.width / 2, c.height / 4), 5);

    const CollisionDemo = new Demo();
    CollisionDemo.addCircle(p);
    // CollisionDemo.addCircle(o);
    CollisionDemo.addWall(w);
    CollisionDemo.addWall(e);
    // w.render();

    const startDemo = () => {
        let time = Date.now();
        let dt = (initialTime - time) / 1000.0;

        CollisionDemo.update(dt);
        CollisionDemo.render();

        initialTime = time;
        requestAnimationFrame(startDemo);
    }

    startDemo();
});

class Demo {
    constructor() {
        this.cirlcles = [];
        this.walls = [];
    }

    addWall(wall) {
        this.walls.push(wall);
    }

    addCircle(circle) {
        this.cirlcles.push(circle);
    }

    update(dt) {
        this.cirlcles.forEach(c => c.update(dt, this.walls));
    }

    render() {
        ctx.clearRect(0, 0, c.width, c.height);
        this.walls.forEach(wall => wall.render());
        this.cirlcles.forEach(circle => circle.render());
    }
}

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

        this.speed = 50;

        this.velocity = {
            x: 0,
            y: this.speed
        };
    }

    checkCollision(wall) {
        const dist = (Math.abs(wall.a * this.position.x + wall.b * this.position.y + wall.c)) /
            Math.sqrt(wall.a * wall.a + wall.b * wall.b);
        if (this.radius - dist === .15) { debugger; console.log('Touch'); }
        else if (this.radius > dist) { this.velocity.y *= -1; console.log('COLLISION'); }
        else console.log('safe');
    }

    update(dt, walls) {
        this.position.y -= this.velocity.y * dt;
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

const lineToLineCollision = (wall1, wall2) => {
    const a1 = wall1.p2.y - wall1.p1.y;
    const b1 = wall1.p1.x - wall1.p2.x;
    const c1 = a1 * wall1.p1.x + b1 * wall1.p1.y;

    const a2 = wall2.p2.y - wall2.p1.y;
    const b2 = wall2.p1.x - wall2.p2.x;
    const c2 = a2 * wall2.p1.x + b2 * wall2.p1.y;

    const det = a1 * b2 - a2 * b1;

    if (det !== 0) {
        const x = (b2 * c1 - b1 * c2) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        if (x >= Math.min(wall1.p1.x, wall1.p2.x) && x <= Math.max(wall1.p1.x, wall1.p2.x) &&
            x >= Math.min(wall2.p1.x, wall2.p2.x) && x <= Math.max(wall2.p1.x, wall2.p2.x) &&
            y >= Math.min(wall1.p1.y, wall1.p2.y) && y <= Math.max(wall1.p1.y, wall1.p2.y) &&
            y >= Math.min(wall2.p1.y, wall2.p2.y) && y <= Math.max(wall2.p1.y, wall2.p2.y)) {
            return new Point(x, y);
        }
    }
    return null;
}

const closestPointOnLine = (wall, circle) => {
    const a = wall.p2.y - wall.p1.y;
    const b = wall.p1.x - wall.p2.x;

    const c1 = a * wall.p1.x + b * wall.p1.y;
    const c2 = -b * circle.position.x + a * circle.position.y;

    const det = a * a + b * b;
    let cx = cy = 0;

    if (det != 0) {
        cx = (a * c1 - b * c2) / det;
        cy = (a * c2 + b * c1) / det;
    } else {
        cx = circle.position.x;
        cy = circle.position.y;
    }

    return new Point(cx, cy);
}