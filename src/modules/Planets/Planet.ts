import type p5 from "p5";

const G = 6.6743e-11;
const DEFAULT_TIME_SPEED = 10 ** 4;

export const ZOOM = 0.05;
const RESTITUTION = 0.8; // Colision energy loss coefficient
const MAX_SPEED = 0.02;

const BLACK_HOLE_THRESHOLD = 10 ** 10;

export class Planet {
  position: p5.Vector;
  movementVector: p5.Vector;
  _mass: number;
  _density: number;
  color: string;
  overlapped: Record<number, Planet | undefined> = {};
  radius: number = 0;
  diameter: number = 0;
  tail: p5.Vector[] = [];
  tailInterval: number = 0;
  isBlackHole: boolean = false;
  isDeleted: boolean = false;
  highlighted: boolean = false;

  static _timeSpeed: number = DEFAULT_TIME_SPEED;
  static resetTailInterval: boolean = false;
  static tailLength: number = 100;
  static isSolidBorders: boolean = true;

  static get timeSpeed() {
    return Planet._timeSpeed;
  }

  static set timeSpeed(value: number) {
    Planet._timeSpeed = value;

    Planet.resetTailInterval = true;
  }

  get mass() {
    return this._mass;
  }

  get density() {
    return this._density;
  }

  set mass(value: number) {
    this._mass = value;

    if (value > BLACK_HOLE_THRESHOLD) {
      this.isBlackHole = true;
      this.density = 100;
    }

    this.recalcDiameter();
  }

  set density(value: number) {
    this._density = value;
    this.recalcDiameter();
  }

  recalcDiameter() {
    const volume = this._mass / this._density;

    this.radius = ((volume * 3) / 4 / Math.PI) ** (1 / 3);
    this.diameter = this.radius * 2;
  }

  constructor({
    mass,
    density,
    color,
    position,
    movementVector,
    isBlackHole,
  }: {
    mass: number;
    density: number;
    color: string;
    position: p5.Vector;
    movementVector: p5.Vector;
    isBlackHole?: boolean;
  }) {
    this.position = position;
    this.movementVector = movementVector.limit(MAX_SPEED);
    this._mass = mass;
    this._density = density;
    this.color = color;
    this.isBlackHole = !!isBlackHole;

    this.recalcDiameter();
  }

  getGravityVector(planets: Planet[], p: p5): p5.Vector {
    return planets
      .filter((planet) => planet !== this)
      .reduce(
        (acc, planet) => {
          const delta = planet.position.copy().sub(this.position);
          const r = Math.sqrt(Math.abs(delta.x ** 2 + delta.y ** 2));
          const multiplier = (G * planet.mass) / r ** 3;
          const vector = delta.copy().mult(multiplier * Planet.timeSpeed);

          return acc.add(vector);
        },
        p.createVector(0, 0)
      );
  }

  getEnergy() {
    return this.mass * this.movementVector.mag() * 1000;
  }

  isIntersect(point: p5.Vector, intersectSize: number = 0) {
    return this.position.dist(point) < this.radius + intersectSize;
  }

  draw(p: p5) {
    const spaceSize = {
      width: p.width / ZOOM,
      height: p.height / ZOOM,
    };

    this.position = this.position.add(
      this.movementVector.copy().mult(Planet.timeSpeed)
    );

    const { x, y } = this.position;

    if (Planet.isSolidBorders) {
      if (
        (x < this.radius && this.movementVector.x < 0) ||
        (x > spaceSize.width - this.radius && this.movementVector.x > 0)
      ) {
        this.movementVector.x *= -1;
      }

      if (
        (y < this.radius && this.movementVector.y < 0) ||
        (y > spaceSize.height - this.radius && this.movementVector.y > 0)
      ) {
        this.movementVector.y *= -1;
      }
    } else {
      if (x + this.radius < 0 || x - this.radius > spaceSize.width) {
        this.isDeleted = true;
      }

      if (y + this.radius < 0 || y - this.radius > spaceSize.height) {
        this.isDeleted = true;
      }
    }

    p.noFill();
    p.strokeWeight(30);
    p.stroke(this.color);
    p.beginShape();
    const c = p.color(this.color);

    p.vertex(this.position.x, this.position.y);

    this.tail.forEach((point, i) => {
      if (i > 0 && i > this.tail.length - 20) {
        p.endShape();
        p.beginShape();
        const alpha = ((this.tail.length - i) * 255) / 20;
        c.setAlpha(alpha);
        p.stroke(c);
        p.vertex(this.tail[i - 1].x, this.tail[i - 1].y);
      }

      p.vertex(point.x, point.y);
    });
    p.endShape();

    let fillColor = this.isBlackHole ? p.color(255) : p.color(this.color);

    if (this.isBlackHole) {
      p.stroke(255);
    }

    p.noStroke();
    fillColor.setAlpha(150);
    p.fill(fillColor);
    p.circle(x, y, this.diameter * 1.3);

    if (!this.isBlackHole) {
      fillColor.setAlpha(100);
      p.fill(fillColor);
      p.circle(x, y, this.diameter * 1.8);
    }

    fillColor = this.isBlackHole ? p.color(0) : p.color(this.color);
    p.fill(fillColor);
    p.circle(x, y, this.diameter);

    if (this.highlighted) {
      p.fill(255);
    }

    p.fill(0);

    if (this.tailInterval <= 0 || Planet.resetTailInterval) {
      this.tail.unshift(this.position.copy());

      const tailInterval = (DEFAULT_TIME_SPEED / Planet.timeSpeed) ** 2;

      this.tailInterval = tailInterval;
    } else {
      this.tailInterval--;
    }

    if (this.tail.length > Planet.tailLength) {
      this.tail.pop();
    }
    // p.textSize(this.diameter / 4);
    // p.text(`${this.getEnergy().toFixed(2)}`, x - this.diameter / 4, y + 6);
  }

  accelerate(acceleration: p5.Vector) {
    this.movementVector = this.movementVector
      .add(acceleration)
      .limit(MAX_SPEED);
  }

  increase(factor: number = 1.1) {
    this.mass *= factor;
    this.density = this.density * factor ** 0.33;
  }

  static bouncePlanets(planet1: Planet, planet2: Planet, distance?: number) {
    if (!distance) {
      distance = planet1.position.dist(planet2.position);
    }

    if (distance == 0) return;

    // Normal vector from planet2 to planet1
    const normalizedVector = planet1.position
      .copy()
      .sub(planet2.position)
      .div(distance);

    const overlap = planet1.radius + planet2.radius - distance;

    // Separate the planets to prevent overlap
    const separationVector = normalizedVector.copy().mult(overlap * 0.5);
    planet1.position.add(separationVector);
    planet2.position.sub(separationVector);

    // Calculate relative velocity
    const relativeVelocity = planet1.movementVector
      .copy()
      .sub(planet2.movementVector);

    // Get velocity component along collision normal (dot product)
    const velocityAlongNormal = relativeVelocity.dot(normalizedVector);

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;

    // Calculate impulse scalar
    const impulseScalar = -(1 + RESTITUTION) * velocityAlongNormal;
    const totalMass = planet1.mass + planet2.mass;
    const impulse = impulseScalar / totalMass;

    // Apply impulse to velocities
    const impulseVector = normalizedVector.copy().mult(impulse);

    // console.log(impulseVector);
    planet1.movementVector.add(impulseVector.copy().mult(planet2.mass));
    planet2.movementVector.sub(impulseVector.copy().mult(planet1.mass));
  }

  static checkColision(planets: Planet[]) {
    planets.forEach((first, i) => {
      planets.slice(i + 1).forEach((second, j) => {
        const dist = first.position.dist(second.position);

        if (first.radius + second.radius > dist) {
          if (!first.isBlackHole && !second.isBlackHole) {
            Planet.bouncePlanets(first, second, dist);
            first.overlapped[j] = second;
          } else {
            const [blackHole, mergingObject] = first.isBlackHole
              ? [first, second]
              : [second, first];

            blackHole.mass = blackHole.mass + mergingObject.mass;
            planets.splice(planets.indexOf(mergingObject), 1);
          }
        }
      });
    });
  }
}
