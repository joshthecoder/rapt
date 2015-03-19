import {ENEMY_GRENADIER} from './enemy';
import SpawningEnemy from './spawningenemy';

import Sprite from '../util/sprite';
import Vector from '../util/vector';

const GRENADIER_WIDTH = .5;
const GRENADIER_HEIGHT = .5;
// Max speed at which a Grenadier can throw an enemy
const GRENADIER_RANGE = 8
const GRENADIER_SHOOT_FREQ = 1.2;

export default class Grenadier extends SpawningEnemy {
	constructor(center, target) {
		super(ENEMY_GRENADIER, center, GRENADIER_WIDTH, GRENADIER_HEIGHT, 0, GRENADIER_SHOOT_FREQ, randInRange(0, GRENADIER_SHOOT_FREQ));

		this.target = target;
		this.actualRecoilDistance = 0;
		this.targetRecoilDistance = 0;

		this.bodySprite = new Sprite();
		this.bodySprite.drawGeometry = function(c) {
			var barrelLength = 0.25;
			var outerRadius = 0.25;
			var innerRadius = 0.175;

			c.beginPath();
			c.moveTo(-outerRadius, -barrelLength);
			c.lineTo(-innerRadius, -barrelLength);
			c.lineTo(-innerRadius, -0.02);
			c.lineTo(0, innerRadius);
			c.lineTo(innerRadius, -0.02);
			c.lineTo(innerRadius, -barrelLength);
			c.lineTo(outerRadius, -barrelLength);
			c.lineTo(outerRadius, 0);
			c.lineTo(0, outerRadius + 0.02);
			c.lineTo(-outerRadius, 0);
			c.closePath();
			c.fill();
			c.stroke();
		};
	}

	getTarget() {
		return this.target === gameState.GetPlayerB();
	}

	setTarget(player) {
		this.target = player;
	}

	canCollide() {
		return false;
	}

	spawn() {
		var targetDelta = this.target.getCenter().add(new Vector(0, 3)).sub(this.getCenter());
		var direction = targetDelta.atan2();
		var distance = targetDelta.length();
		// If Player is out of range or out of line of sight, don't throw anything
		if (!this.target.isDead() && distance < GRENADIER_RANGE) {
			if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
				this.targetRecoilDistance = distance * (0.6 / GRENADIER_RANGE);
				gameState.addEnemy(new Grenade(this.getCenter(), direction, targetDelta.length()), this.getCenter());
				return true;
			}
		}
		return false;
	}

	afterTick(seconds) {
		var position = this.getCenter();
		if(!this.target.isDead()) {
			this.bodySprite.angle = this.target.getCenter().add(new Vector(0, 3)).sub(position).atan2() + Math.PI / 2;
		}
		this.bodySprite.offsetBeforeRotation = position;

		if (this.actualRecoilDistance < this.targetRecoilDistance) {
			this.actualRecoilDistance += 5 * seconds;
			if (this.actualRecoilDistance >= this.targetRecoilDistance) {
				this.actualRecoilDistance = this.targetRecoilDistance;
				this.targetRecoilDistance = 0;
			}
		} else {
			this.actualRecoilDistance -= 0.5 * seconds;
			if (this.actualRecoilDistance <= 0) {
				this.actualRecoilDistance = 0;
			}
		}

		this.bodySprite.offsetAfterRotation = new Vector(0, this.actualRecoilDistance);
	}

	draw(c) {
		c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
		c.strokeStyle = 'black';
		this.bodySprite.draw(c);
	}
}
