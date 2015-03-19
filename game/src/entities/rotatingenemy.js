import Circle from '../collisions/circle';

import {Enemy} from './enemy';

/**
  * Abstract class representing enemies that may rotating, including seeking enemies.
  * These enemies are all circular.
  */
export default class RotatingEnemy extends Enemy {
	constructor(type, center, radius, heading, elasticity) {
		super(type, elasticity);

		this.hitCircle = new Circle(center, radius);
		this.heading = heading;
	}

	getShape() {
		return this.hitCircle;
	}
}
