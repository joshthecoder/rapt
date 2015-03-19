import {Enemy} from './enemy';

import Circle from '../collisions/circle';

/**
  * Abstract class representing a Hovering Enemy
  */
export default class HoveringEnemy extends Enemy {
	constructor(type, center, radius, elasticity) {
		super(type, elasticity);

		this.hitCircle = new Circle(center, radius);
	}

	getShape() {
		return this.hitCircle;
	}
}
