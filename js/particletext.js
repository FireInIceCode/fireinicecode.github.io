const configSite = {
	size: 6,
	count: 500,
	text_scale: 3,
	text_size: 70,
	space: 7
};
const configPost = {
	size: 5,
	count: 300,
	text_scale: 3,
	text_size: 40,
	space: 9
}
var config;

var world = new cp.World((ctx, canvas) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function newParticle(emitter, canvas) {
	var particle = emitter.emit();
	world.addParticle(particle);
	var action = new cp.Action(cp.getReBoundFunc(100, canvas.height - config.size, 0.8));
	particle.addAction(action, false);
	action.type = 'rebound';
	action.start();
	action.doing = false;
	setTimeout(() => {
		cp.scaleInOut(particle, 1, 1.5, 0.5, cp.easeFunctions['easeInOut']);
	}, parseInt(Math.random() * 1000));
	particle.enableShade = true;
	particle.minShadeDis = 15;
	particle.getShadeStep = cp.getBasicShadeStepGetter((obj, t) => {
		obj.alpha -= t / 2;
		obj.scale -= t;
		return true;
	}, 0.6);
	return particle;
}

function show() {
	var header = document.querySelector('header');
	var canvas = document.createElement('canvas');
	canvas.width = header.clientWidth;
	canvas.height = header.clientHeight;
	canvas.className = 'particle-canvas';
	header.appendChild(canvas);

	var pos_gener = new cp.PosGenerator(1000, 500);
	var title = (document.querySelector('#site-title') || document.querySelector('.post-title'));
	config = title.classList.contains('post-title') ? configPost : configSite;
	title.parentElement.removeChild(title);
	var str = title.innerText;
	var poses = pos_gener.getPosFromTextEx(str, config.text_size + 'px 微软雅黑', true, config.text_scale, canvas.width, canvas.height);

	var emitter = new cp.PointCircleEmitter(canvas.width / 2, canvas.height / 2, 100, new cp.BallPaintFunc(config.size, null, true));
	world.addForce(cp.forces.getMouseAwayForce(canvas, 10000, 100));
	for (var i = 0; i < config.count; i++) {
		newParticle(emitter, canvas);
	};
	world.init(canvas, 60);

	// var dfunc=cp.distributes.getLineDistribute(cp.easeFunctions['easeInOutBack']);
	var dfunc1 = cp.distributes.getCircleDistribute(cp.easeFunctions['easeInOutBack']);
	var dfunc = cp.distributes.distributeAndFix(cp.easeFunctions['easeInOutBack'], 1);
	var tdfunc = (particle, pos, time) => {
		particle.enableForce = false;
		for (var a of particle.actions) {
			if (a.type == 'rebound') {
				a.doing = false;
			}
		}
		dfunc(particle, pos, time);
	}
	var tdfunc1 = (particle, pos, time) => {
		particle.enableForce = false;
		for (var a of particle.actions) {
			if (a.type == 'rebound') {
				a.doing = false;
			}
		}
		dfunc1(particle, pos, time);
	}

	var spfunc = (particle, t) => {
		particle.vy = 0;
		for (var a of particle.actions) {
			if (a.type == 'rebound') {
				a.start();
			}
		}
	}

	var nfunc = (pos, time) => {
		var p = newParticle(emitter, canvas);
		tdfunc(p, pos, time);
		return p;
	};
	var nfunc1 = (pos, time) => {
		var p = newParticle(emitter, canvas);
		tdfunc1(p, pos, time);
		return p;
	};

	setTimeout(() => {
		world.distributePosByDistance(poses, 2, tdfunc1, spfunc, nfunc1, config.space);
		setTimeout(() => {
			world.distributePosByDistance(poses, 2, tdfunc, spfunc, nfunc, config.space);
		}, 2000);
	}, 1000);
}

// window.addEventListener('DOMContentLoaded', show);