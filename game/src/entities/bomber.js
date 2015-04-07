import Bomb from './bomb';
import {ENEMY_BOMBER} from './enemy';
import SpawningEnemy from './spawningenemy';

import Vector from '../util/vector';

const BOMBER_WIDTH = .4;
const BOMBER_HEIGHT = .4;
const BOMBER_SPEED = 2;
// Frequency is in seconds
const BOMB_FREQUENCY = 1.0;
const BOMBER_ELASTICITY = 1.0;
const BOMBER_EXPLOSION_POWER = 6;

export default class Bomber extends SpawningEnemy {

	constructor(center, angle) {
		super(ENEMY_BOMBER, center, BOMBER_WIDTH, BOMBER_HEIGHT, BOMBER_ELASTICITY, BOMB_FREQUENCY, randInRange(0, BOMB_FREQUENCY));

		if (angle < Math.PI * 0.25) this.setVelocity(new Vector(BOMBER_SPEED, 0));
		else if (angle < Math.PI * 0.75) this.setVelocity(new Vector(0, BOMBER_SPEED));
		else if (angle < Math.PI * 1.25) this.setVelocity(new Vector(-BOMBER_SPEED, 0));
		else if (angle < Math.PI * 1.75) this.setVelocity(new Vector(0, -BOMBER_SPEED));
		else this.setVelocity(new Vector(BOMBER_SPEED, 0));
	}

	move(seconds) {
		return this.velocity.mul(seconds);
	}

	reactToPlayer(player) {
		var relativePos = player.getCenter().sub(this.getCenter());
		// If player jumps on top of the Bomber, it explodes
		if (relativePos.y > (BOMBER_HEIGHT - .05)) {
			player.setVelocity(new Vector(player.getVelocity().x, BOMBER_EXPLOSION_POWER));
			this.setDead(true);
		} else if (player.isSuperJumping) {
			this.setDead(true);
		} else {
			player.setDead(true);
		}
	}

	spawn() {
		var spawnPoint = new Vector(this.hitBox.lowerLeft.x + this.hitBox.getWidth() * 0.5, this.hitBox.getBottom());
		gameState.addEnemy(new Bomb(spawnPoint, new Vector(0, Math.min(this.velocity.y, -.3))), spawnPoint);
		return true;
	}

	afterTick() {
		// drawing stuff
	}

	onDeath() {
		super.onDeath();

		gameState.incrementStat(STAT_ENEMY_DEATHS);
	}

	draw(c) {
		var pos = this.getCenter();
		c.strokeStyle = 'black';
		c.beginPath();
		c.moveTo(pos.x - 0.25, pos.y - 0.2);
		c.lineTo(pos.x - 0.25, pos.y - 0.1);
		c.lineTo(pos.x - 0.1, pos.y + 0.05);
		c.lineTo(pos.x + 0.1, pos.y + 0.05);
		c.lineTo(pos.x + 0.25, pos.y - 0.1);
		c.lineTo(pos.x + 0.25, pos.y - 0.2);
		c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS, 0, Math.PI, false);
		c.lineTo(pos.x - 0.25, pos.y - 0.2);
		c.moveTo(pos.x - 0.1, pos.y + 0.05);
		c.lineTo(pos.x - 0.2, pos.y + 0.15);
		c.moveTo(pos.x + 0.1, pos.y + 0.05);
		c.lineTo(pos.x + 0.2, pos.y + 0.15);
		c.stroke();

		c.fillStyle = 'black';
		c.beginPath();
		c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS * this.getReloadPercentage(), 0, 2*Math.PI, false);
		c.fill();
	}
}
