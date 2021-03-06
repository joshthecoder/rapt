import Particle from './particle';
import WalkingEnemy from './walkingenemy';

import Vector from '../util/vector';

const SPIDER_LEGS_RADIUS = .45;
const SPIDER_LEGS_WEAK_SPOT_RADIUS = .2;
const SPIDER_LEGS_ELASTICITY = 1.0;
const SPIDER_LEGS_FLOOR_ELASTICITY = 0.1;

export default class RocketSpiderLegs extends WalkingEnemy {
	constructor(center, angle, body) {
		super(-1, center, SPIDER_LEGS_RADIUS, SPIDER_LEGS_ELASTICITY);
		this.body = body;
		this.weakSpot = new Circle(center, SPIDER_LEGS_WEAK_SPOT_RADIUS);
		if (angle <= Math.PI * 0.5 || angle > Math.PI * 0.6666666) {
			this.velocity = new Vector(SPIDER_SPEED, 0);
		} else {
			this.velocity = new Vector(-SPIDER_SPEED, 0);
		}
	}

	// Returns true iff the Spider and player are on the same level floor, less than 1 cell horizontal distance away,
	// and the spider is moving towards the player
	playerWillCollide(player) {
		if (player.isDead()) return false;
		var toReturn = Math.abs(player.getShape().getAabb().getBottom() - this.hitCircle.getAabb().getBottom()) < .01;
		var xRelative = player.getCenter().x - this.getCenter().x;
		toReturn = toReturn && (Math.abs(xRelative) < 1) && (this.velocity.x * xRelative > -0.01);
		return toReturn;
	}

	// Walks in a straight line, but doesn't walk into the player
	move(seconds) {
		if (this.isOnFloor()) {
			if (this.playerWillCollide(gameState.playerA) || this.playerWillCollide(gameState.playerB)) {
				this.velocity.x *= -1;
			}
			return this.velocity.mul(seconds);
		} else {
			return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);
		}
	}

	// Acts like it has elasticity of SPIDER_FLOOR_ELASTICITY on floors, and maintains constant horizontal speed
	reactToWorld(contact) {
		if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
			var perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
			var parallel = this.velocity.sub(perpendicular);
			this.velocity = parallel.unit().mul(SPIDER_SPEED).add(perpendicular.mul(SPIDER_LEGS_FLOOR_ELASTICITY));
		}
	}

	// The player can kill the Spider by running through its legs
	reactToPlayer(player) {
		this.weakSpot.moveTo(this.hitCircle.getCenter());
		if (CollisionDetector.overlapShapePlayers(this.weakSpot).length === 0) {
			this.setDead(true);
		}
	}

	// The legs of the spider are responsible for killing the body
	setDead(isDead) {
		this.body.setDead(isDead);
		super.setDead(isDead);
	}

	onDeath() {
		gameState.incrementStat(STAT_ENEMY_DEATHS);

		// make things that look like legs fly everywhere
		var position = this.getCenter();
		for (var i = 0; i < 16; ++i) {
			var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
			direction = direction.mul(randInRange(0.5, 5));

			var angle = randInRange(0, 2*Math.PI);
			var angularVelocity = randInRange(-Math.PI, Math.PI);

			Particle().position(position).velocity(direction).radius(0.25).bounces(3).elasticity(0.5).decay(0.01).line().angle(angle).angularVelocity(angularVelocity).color(0, 0, 0, 1);
		}
	}

	draw(c) {
	}
}
