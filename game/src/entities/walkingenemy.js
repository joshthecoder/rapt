import {Enemy} from './enemy';

import Circle from '../collisions/circle';

export default class WalkingEnemy extends Enemy {
	constructor(type, center, radius, elasticity) {
		super(type, elasticity);

		this.hitCircle = new Circle(center, radius);
	}

	getShape() {
		return this.hitCircle;
	}

	move(seconds) {
		return this.velocity.mul(seconds);
	}
}
