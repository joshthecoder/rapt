import {ENEMY_STALACBAT} from './enemy';
import {FreefallEnemy} from './freefallenemy';
import Particle from './particle';

import CollisionDetector from '../collisions/collisiondetection';
import {randInRange} from '../util/math';
import Sprite from '../util/sprite';
import Vector from '../util/vector';
import {STAT_ENEMY_DEATHS} from '../world/gamestate';

const STALACBAT_RADIUS = 0.2;
const STALACBAT_SPEED = 2;
const STALACBAT_SPRITE_BODY = 0;
const STALACBAT_SPRITE_LEFT_WING = 1;
const STALACBAT_SPRITE_RIGHT_WING = 2;

export default class Stalacbat extends FreefallEnemy {
	constructor(center, target) {
		super(ENEMY_STALACBAT, center, STALACBAT_RADIUS, 0);
		this.target = target;
		this.isFalling = false;

		this.sprites = [new Sprite(), new Sprite(), new Sprite()];
		// Draw circle for body
		this.sprites[STALACBAT_SPRITE_BODY].drawGeometry = function(c) {
			c.strokeStyle = 'black';
			c.beginPath();
			c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);
			c.stroke();
			c.fill();
		}
		// Draw the two wings
		this.sprites[STALACBAT_SPRITE_LEFT_WING].drawGeometry = this.sprites[STALACBAT_SPRITE_RIGHT_WING].drawGeometry = function(c) {
			c.strokeStyle = 'black';
			c.beginPath();
			c.arc(0, 0, 0.2, 0, Math.PI / 2, false);
			c.arc(0, 0, 0.15, Math.PI / 2, 0, true);
			c.stroke();

			c.beginPath();
			c.moveTo(0.07, 0.07);
			c.lineTo(0.1, 0.1);
			c.stroke();
		}

		this.sprites[STALACBAT_SPRITE_LEFT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);
		this.sprites[STALACBAT_SPRITE_RIGHT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);
	}

	// Falls when the target is directly beneat it
	move(seconds) {
		if (this.isFalling) {
			return super.move(seconds);
		} else if (this.target !== null && !this.target.isDead()) {
			var playerPos = this.target.getCenter();
			var pos = this.getCenter();
			if ((Math.abs(playerPos.x - pos.x) < 0.1) && (playerPos.y < pos.y)) {
				if (!CollisionDetector.lineOfSightWorld(pos, playerPos, gameState.world)) {
					this.isFalling = true;
					return super.move(seconds);
				}
			}
		}
		return new Vector(0, 0);
	}

	getTarget() {
		return this.target === gameState.playerB;
	}

	afterTick(seconds) {
		var percent = this.velocity.y * -0.25;
		if (percent > 1) {
			percent = 1;
		}

		var position = this.getCenter();
		this.sprites[STALACBAT_SPRITE_BODY].offsetBeforeRotation = new Vector(position.x, position.y + 0.1 - 0.2 * percent);

		var angle = percent * Math.PI / 2;
		this.sprites[STALACBAT_SPRITE_LEFT_WING].angle = Math.PI - angle;
		this.sprites[STALACBAT_SPRITE_RIGHT_WING].angle = angle - Math.PI / 2;
	}

	onDeath() {
		gameState.incrementStat(STAT_ENEMY_DEATHS);

		var isRed = (this.target === gameState.playerA) ? 0.8 : 0;
		var isBlue = (this.target === gameState.playerB) ? 1 : 0;

		var position = this.getCenter();
		for (var i = 0; i < 15; ++i) {
			var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(5, 10));
			Particle().position(position).velocity(direction).radius(0.2).bounces(3).decay(0.01).elasticity(0.5).color(isRed, 0, isBlue, 1).triangle();
		}
	}

	draw(c) {
		// Draw the colored "eye"
		if (this.target === gameState.playerA) {
			c.fillStyle = 'red';
		}
		else {
			c.fillStyle = 'blue';
		}

		// Draw the black wings
		this.sprites[STALACBAT_SPRITE_BODY].draw(c);
	}
}
