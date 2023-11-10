var cp = (function () {
    function time_now() {
        return new Date().getTime();
    }

    function bounceOut(x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    };
    const pow = Math.pow;
    const sqrt = Math.sqrt;
    const sin = Math.sin;
    const cos = Math.cos;
    const PI = Math.PI;
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    const c3 = c1 + 1;
    const c4 = (2 * PI) / 3;
    const c5 = (2 * PI) / 4.5;
    easeFunctions = {
        linear: (x) => x,
        easeInQuad: function (x) {
            return x * x;
        },
        easeOutQuad: function (x) {
            return 1 - (1 - x) * (1 - x);
        },
        easeInOutQuad: function (x) {
            return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
        },
        easeInCubic: function (x) {
            return x * x * x;
        },
        easeOutCubic: function (x) {
            return 1 - pow(1 - x, 3);
        },
        easeInOutCubic: function (x) {
            return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
        },
        easeInQuart: function (x) {
            return x * x * x * x;
        },
        easeOutQuart: function (x) {
            return 1 - pow(1 - x, 4);
        },
        easeInOutQuart: function (x) {
            return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
        },
        easeInQuint: function (x) {
            return x * x * x * x * x;
        },
        easeOutQuint: function (x) {
            return 1 - pow(1 - x, 5);
        },
        easeInOutQuint: function (x) {
            return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
        },
        easeInSine: function (x) {
            return 1 - cos((x * PI) / 2);
        },
        easeOutSine: function (x) {
            return sin((x * PI) / 2);
        },
        easeInOutSine: function (x) {
            return -(cos(PI * x) - 1) / 2;
        },
        easeInExpo: function (x) {
            return x === 0 ? 0 : pow(2, 10 * x - 10);
        },
        easeOutExpo: function (x) {
            return x === 1 ? 1 : 1 - pow(2, -10 * x);
        },
        easeInOutExpo: function (x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : x < 0.5
                        ? pow(2, 20 * x - 10) / 2
                        : (2 - pow(2, -20 * x + 10)) / 2;
        },
        easeInCirc: function (x) {
            return 1 - sqrt(1 - pow(x, 2));
        },
        easeOutCirc: function (x) {
            return sqrt(1 - pow(x - 1, 2));
        },
        easeInOutCirc: function (x) {
            return x < 0.5
                ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
                : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
        },
        easeInBack: function (x) {
            return c3 * x * x * x - c1 * x * x;
        },
        easeOutBack: function (x) {
            return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
        },
        easeInOutBack: function (x) {
            return x < 0.5
                ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
        },
        easeInElastic: function (x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
        },
        easeOutElastic: function (x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
        },
        easeInOutElastic: function (x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : x < 0.5
                        ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
                        : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
        },
        easeInBounce: function (x) {
            return 1 - bounceOut(1 - x);
        },
        easeOutBounce: bounceOut,
        easeInOutBounce: function (x) {
            return x < 0.5
                ? (1 - bounceOut(1 - 2 * x)) / 2
                : (1 + bounceOut(2 * x - 1)) / 2;
        },
    };
    function sqdistance(x1, y1, x2, y2) {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }


    function Action(afunc, time, tfunc) { //time(s)
        this.tfunc = tfunc || easeFunctions['linear'];  //缓动时间函数,参数0-1的小数
        this.afunc = afunc;  //缓动动作执行函数,参数为动作对象,动作进程,上次动作进程
        this.time = time * 1000 || Infinity;  //动画时间长度(ms)
        this.stime = 0;  //开始时间
        this.lasttime = 0;  //上次step时间
        this.doing = false;  //是否正在执行
        this.obj = null;  //操作对象
        this.dat = {};
        this.onFinish = () => { };
    }
    Action.prototype.start = function () {  //开始执行缓动
        this.stime = this.lasttime = time_now();
        this.doing = true;
    }
    Action.prototype.step = function () {
        if (!this.doing) return true;
        if (this.time != Infinity && time_now() > this.stime + this.time) {
            this.afunc(this.obj, 1, this.tfunc((this.lasttime - this.stime) / this.time));
            this.onFinish();
            return false;
        }
        if (this.time != Infinity) {
            this.afunc(this.obj, this.tfunc((time_now() - this.stime) / this.time),
                this.tfunc((this.lasttime - this.stime) / this.time));
        }
        else {
            this.afunc(this.obj, (time_now() - this.lasttime) / 1000);
        }
        this.lasttime = time_now();
        return true;
    }

    function getAttrfunc(particle, attr, tg, d = true) {
        var s = particle[attr];
        function afunc(obj, t) {
            obj[attr] = s + (tg - s) * t;
        }
        function afuncd(obj, t, lt) {
            obj[attr] += (tg - s) * (t - lt);
        }
        return d ? afuncd : afunc;
    }
    function getMovefunc(particle, tx, ty) {
        var xfunc = getAttrfunc(particle, 'x', tx);
        var yfunc = getAttrfunc(particle, 'y', ty);
        return function (obj, t, lt) {
            xfunc(obj, t, lt);
            yfunc(obj, t, lt);
        };
    }
    function getFixPosfunc(particle, tx, ty, speed) {
        return function (obj, t) {
            if (obj.x != tx || obj.y != ty) {
                obj.x += (tx - obj.x) * speed * t;
                obj.y += (ty - obj.y) * speed * t;
            }
        }
    }
    function getReBoundFunc(gravity, reboundy, bouncy) {
        return function (obj, t) {
            obj.enableForce = true;
            obj.vy += gravity * t;
            if (obj.y >= reboundy) {
                obj.vy = -bouncy * obj.vy;
            }
        }
    }


    function freeWalkByStep(particle, stepd, stept, steptfunc) {
        function addOneStep() {
            r = Math.random() * Math.PI * 2;
            d = stepd;
            var action = moveParticleTo(particle, particle.x + Math.cos(r) * d, particle.y + Math.sin(r) * d, stept, steptfunc, false)
            action.onFinish = addOneStep;
            action.start();
        }
        addOneStep();
    }

    function scaleInOut(particle, scale0, scale1, scalet, tfunc) {
        var s = false;
        function addOneStep() {
            var action = new Action(getAttrfunc(particle, 'scale', (s ? scale0 : scale1)), scalet, tfunc);
            particle.addAction(action, false);
            action.onFinish = addOneStep;
            action.start();
            s = !s;
        }
        addOneStep();
    }

    function randomColor() {
        return 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')'
    }
    function BallPaintFunc(r, color = null, blinking = false, tx = 0, ty = 0) {
        this.r = r;
        this.color = color;
        this.blinking = blinking;
        this.tremblingX = tx;
        this.tremblingY = ty;
    }
    BallPaintFunc.prototype.colorattr = 'BallPaintFunc.color'
    BallPaintFunc.prototype.paint = function (ctx, particle) {
        if (!particle.dat[this.colorattr]) {
            particle.dat[this.colorattr] = this.color || randomColor();
        } else {
            ctx.fillStyle = particle.dat[this.colorattr];
        }
        if (this.blinking) ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        ctx.globalAlpha = particle.alpha;
        var tx = parseInt(Math.random() * this.tremblingX), ty = parseInt(Math.random() * this.tremblingY);
        ctx.arc(particle.x + tx, particle.y + ty, this.r * particle.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    function ImgPaintFunc(img) {
        this.img = img;
        this.w = img.width;
        this.h = img.height;
    }
    ImgPaintFunc.prototype.paint = function (ctx, particle) {
        ctx.save();
        ctx.translate(particle.x + this.w * particle.scale / 2, particle.y + this.h * particle.scale / 2);
        ctx.rotate(particle.angle);
        ctx.globalAlpha = particle.alpha;
        ctx.drawImage(this.img, 0, 0, this.w * particle.scale, this.h * particle.scale);
        ctx.restore();
    }

    function shallowClone(source) {
        let target = {};
        for (let i in source) {
            if (source.hasOwnProperty(i)) {
                target[i] = source[i];
            }
        }
        return target;
    }

    function BasicShadeStep(func, life) {
        this.shadeLife = life || 0.05;
        this.stepFunc = func || (() => { return true });
    }
    BasicShadeStep.prototype.step = function (obj, t) {
        this.shadeLife -= t;
        return this.stepFunc(obj, t) && this.shadeLife >= 0;
    };
    function getBasicShadeStepGetter(func, life) {
        return function () {
            return new BasicShadeStep(func, life);
        }
    }
    function Particle(x, y, paint) {
        this.x = x || 0;
        this.y = y || 0;
        this.vx = this.vy = 0;
        this.angle = 0;
        this.actions = [];
        this.actionsQueue = [];
        this.paintfunc = paint;
        this.scale = 1;
        this.alpha = 1;
        this.enableForce = true;
        this.dat = {};
        this.world = null;

        this.enableShade = false;
        this.isShade = false;
        this.shadeInterval = 0;
        this.lastShadeInterval = 0;
        this.shadeStep = null;
        this.lastShadeX = 0;
        this.lastShadeY = 0;
        this.minShadeDis = 0;
        this.getShadeStep = () => { };

        this.alive = true;
    }
    Particle.prototype.step = function (time) {
        if (this.enableForce) {
            this.x += this.vx * time;
            this.y += this.vy * time;
        }
        if (this.enableShade) {
            if (time_now() - this.lastShadeInterval >= this.shadeInterval &&
                sqdistance(this.x, this.y, this.lastShadeX, this.lastShadeY) >= this.minShadeDis * this.minShadeDis) {
                this.shade();
                this.lastShadeX = this.x;
                this.lastShadeY = this.y;
                this.lastShadeInterval = time_now();
            }
        }
        if (this.isShade) {
            if (this.shadeStep) this.alive = this.shadeStep.step(this, time);
            return;
        }
        for (var i = 0; i < this.actions.length; i++) {
            if (!this.actions[i].step()) {
                this.actions.splice(i, 1);
                i--;
            }
        }
        if (this.actionsQueue.length) {
            if (!this.actionsQueue[0].step()) {
                this.actionsQueue.splice(0, 1);
            }
        }

    }
    Particle.prototype.shade = function () {
        var particle = new Particle(this.x, this.y, this.paintfunc);
        particle.enableShade = false;
        particle.enableForce = false;
        particle.isShade = true;
        particle.shadeStep = this.getShadeStep();
        particle.dat = shallowClone(this.dat);
        this.world.addParticle(particle);
    }
    Particle.prototype.paint = function (ctx) {
        this.paintfunc.paint(ctx, this);
    }
    Particle.prototype.addAction = function (action, queue = true) {
        if (queue) this.actionsQueue.push(action);
        else this.actions.push(action);
        action.obj = this;
    }

    function PointCircleEmitter(x, y, r, paint, sr, er, randr) {
        this.x = x;
        this.y = y;
        this.sr = sr || 0;
        this.er = er || Math.PI * 2;
        this.r = r;
        this.paint = paint;
        this.randr = randr || true;
    }
    PointCircleEmitter.prototype.emit = function () {
        var p = new Particle(this.x, this.y, this.paint), r;
        if (this.randr) r = Math.random() * this.r;
        else r = this.r;
        p.angle = Math.random() * (this.er - this.sr) + this.sr;
        p.vx = r * Math.cos(p.angle);
        p.vy = r * Math.sin(p.angle);
        return p;
    }

    function getSimpleForce(vx, vy) {
        return function (pa, t) {
            pa.vy += vx * t;
            pa.vy += vy * t;
        }
    }

    function getMouseAwayForce(canvas, forceF, forceR) {
        var mx, my;
        canvas.addEventListener('mousemove', (e) => {
            mx = e.x, my = e.y;
        });
        return function (pa, t) {
            if (!(mx && my)) return;
            var d = sqdistance(mx, my, pa.x, pa.y);
            if (forceR == 0 || d <= forceR * forceR) {
                pa.x += -(mx - pa.x) / d * forceF * t;
                pa.y += -(my - pa.y) / d * forceF * t;
            }
        }
    }

    var forces = {
        getSimpleForce: getSimpleForce,
        getMouseAwayForce: getMouseAwayForce
    };

    function World(bgFunc) {
        this.forces = [];  //'力'是改变粒子vx,vy的函数,参数为粒子的引用和调用间隔,无返回值
        this.particles = [];
        this.bgPaintFunc = bgFunc;
        this.canvas = null;
        this.ctx = null;
        this.lasttime = time_now();
        this.clock = null;
    }
    World.prototype.init = function (canvas, fps) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.lasttime = time_now();
        this.clock = setInterval(() => {
            this.step();
            this.paint();
        }, 1000 / fps);
    }
    World.prototype.addParticle = function (particle) {
        particle.world = this;
        this.particles.push(particle);
    }
    World.prototype.step = function () {
        var t = (time_now() - this.lasttime) / 1000;
        for (var particle of this.particles) {
            for (var force of this.forces) {
                force(particle, t);
            }
            particle.step(t);
        }
        for (var i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].alive) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        this.lasttime = time_now();
    }
    World.prototype.paint = function () {
        this.bgPaintFunc(this.ctx, this.canvas);
        for (var particle of this.particles) {
            particle.paint(this.ctx);
        }
    }
    World.prototype.addForce = function (force) {
        this.forces.push(force);
    }

    World.prototype.distributePosByDistance = function (srcpositions, time, distributefunc, sparefunc, newfunc, dis) {
        /*
        positions:Array({x:int,y:int}) 粒子位置数组
        time:number 运动时间
        distributefunc: func(particle,pos,time)=>void 为particle分配pos
        sparefunc:func(particle,time)=>void 对于空闲粒子的处理
        newfunc:func(pos,time)=>void 产生新粒子
        dis:number 若不为0,则粒子间间隔为dis
        */
        var positions = []
        for (var pos of srcpositions) {
            positions.push(pos);
        }
        for (var i = 0; i < this.particles.length; i++) {
            var pa = this.particles[i];
            if (pa.isShade) continue;
            var min_distance = 1e9, distance;
            var nearest = 0;
            if (positions.length) {
                for (var n = 0; n < positions.length; n++) {
                    po = positions[n];
                    distance = Math.sqrt((pa.x - po.x) * (pa.x - po.x) + (pa.y - po.y) * (pa.y - po.y));
                    if (distance <= min_distance) {
                        min_distance = distance;
                        nearest = n;
                    }
                }
                distributefunc(pa, positions[nearest], time);
                var po1 = positions[nearest];
                positions.splice(nearest, 1);

                if (dis == 0) continue;
                for (var n = 0; n < positions.length; n++) {
                    var po2 = positions[n];
                    var sqdistance = (po1.x - po2.x) * (po1.x - po2.x) + (po1.y - po2.y) * (po1.y - po2.y);
                    if (sqdistance <= dis * dis) {
                        positions.splice(n, 1);
                        n--;
                    }
                }
            } else {
                sparefunc(pa, time);
            }
        }
        for (var i = 0; i < positions.length; i++) {
            var po1 = positions[i];
            newfunc(po1, time);
            positions.splice(i, 1);
            if (dis == 0) continue;
            for (var n = i; n < positions.length; n++) {
                var po2 = positions[n];
                sqdistance = (po1.x - po2.x) * (po1.x - po2.x) + (po1.y - po2.y) * (po1.y - po2.y);
                if (sqdistance <= dis * dis) {
                    positions.splice(n, 1);
                }
            }
        }
    }

    function moveParticleTo(particle, x, y, time, tfunc, fixSpeed = 0, start = true, queue = true) {
        var mfunc;
        if (fixSpeed) time = 0;
        if (fixSpeed) {
            mfunc = getFixPosfunc(particle, x, y, fixSpeed);
        } else {
            mfunc = getMovefunc(particle, x, y);
            particle.enableForce = false;
        }
        var action = new Action(mfunc, time, tfunc);
        particle.addAction(action, queue);
        if (start) action.start();
        return action;
    }
    function moveParticleToByCircle(particle, x, y, time, tfunc, clockwise = false, start = true, queue = true) {
        //clockwise为真为顺时针
        var ox = (particle.x + x) / 2, oy = (particle.y + y) / 2;
        var r = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy));
        var sa = Math.atan2(particle.y - oy, particle.x - ox);
        var ea = Math.atan2(y - oy, x - ox);
        if (clockwise) {
            var t = sa;
            sa = ea;
            ea = t;
        }
        function afunc(obj, t) {
            var a = sa + (ea - sa) * t;
            var px = ox + Math.cos(a) * r, py = oy + Math.sin(a) * r;
            obj.x = px;
            obj.y = py;
        }
        var action = new Action(afunc, time, tfunc);
        particle.enableForce = false;
        particle.addAction(action, queue);
        if (start) action.start();
        return action;
    }

    function getLineDistribute(tfunc, fixSpeed = 0, start = true) {
        return function (particle, pos, time) {
            return moveParticleTo(particle, pos.x, pos.y, time, tfunc, fixSpeed, start);
        }
    }
    function getCircleDistribute(tfunc, clockwise = false, start = true) {
        return function (particle, pos, time) {
            return moveParticleToByCircle(particle, pos.x, pos.y, time, tfunc, clockwise, start, true);
        }
    }
    function distributeAndFix(dfunc, fixSpeed = 1) {
        return function (particle, pos, time) {
            var action = dfunc(particle, pos, time);
            action.onFinish = moveParticleTo(particle, pos.x, pos.y, null, null, fixSpeed, true).start;
            return action;
        }
    }

    var distributes = {
        getLineDistribute: getLineDistribute,
        getCircleDistribute: getCircleDistribute,
        distributeAndFix: distributeAndFix
    };

    function getMoveSpare(tfunc, posfunc) {
        return function (particle, time) {
            var pos = posfunc(particle);
            moveParticleTo(particle, pos.x, pos.y, time, tfunc, true);
        }
    }

    function getMoveOutSpare(originX, originY, w, h, offset, tfunc) {
        w += offset * 2;
        h += offset * 2;
        function posfunc(particle) {
            var px = particle.x, py = particle.y;
            px -= originX, py -= originY;
            var xk = Math.abs(w / 2 / px), yk = Math.abs(h / 2 / py);
            var k = Math.min(xk, yk);
            px *= k, py *= k;
            px += originX, py += originY;
            return { x: px, y: py };
        }
        return getMoveSpare(tfunc, posfunc);
    }
    function getMoveOutWorldSpare(world, tfunc, offset) {
        var canvas = world.canvas;
        offset = offset;
        return getMoveOutSpare(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, offset, tfunc);
    }
    function getRandomPosSpare(x, y, w, h, tfunc) {
        return getMoveSpare(tfunc, (particle, time) => {
            return { x: parseInt(x + Math.random() * w), y: parseInt(y + Math.random() * h) };
        });
    }
    function getMoveOutCircleSpare(originX, originY, r, tfunc) {
        function posfunc(particle, time) {
            var px = particle.x, py = particle.y;
            px -= originX, py -= originY;
            var angle = Math.atan2(py, px);
            px = Math.cos(angle) * r;
            py = Math.sin(angle) * r;
            px += originX;
            py += originY;
            return { x: px, y: py };
        }
        return getMoveSpare(tfunc, posfunc);
    }

    var spares = {
        getMoveSpare: getMoveSpare,
        getMoveOutSpare: getMoveOutSpare,
        getMoveOutWorldSpare: getMoveOutWorldSpare,
        getMoveOutCircleSpare: getMoveOutCircleSpare,
        getRandomPosSpare: getRandomPosSpare
    }

    function PosGenerator(w = 500, h = 500) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'top';
    }
    PosGenerator.prototype.getPos = function (w, h, scale = 1, bx = 0, by = 0) {
        var pixeldata = this.ctx.getImageData(0, 0, w, h).data;
        var poses = [];
        for (var i = 0; i < pixeldata.length; i += 4) {
            var x = parseInt((i / 4 + 1) % w), y = parseInt((i / 4 + 1) / w);
            if (pixeldata[i] != 255) {
                poses.push({
                    x: bx + x * scale,
                    y: by + y * scale
                });
            }
        }
        return poses;
    }
    PosGenerator.prototype.getPosFromText = function (text, fill = true, scale = 1, x = 0, y = 0, lineWidth = 3) {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (fill) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(text, 0, 0);
        } else {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = lineWidth;
            this.ctx.strokeText(text, 0, 0);
        }
        var w = this.canvas.width, h = this.canvas.height;
        return this.getPos(w, h, scale, x, y);
    }

    PosGenerator.prototype.getPosFromTextEx = function (text, font, fill = true, scale = 1, w, h, lineWidth = 3) {
        this.ctx.font = font;
        this.ctx.fillStyle = 'rgb(255,255,255)';
        var x=(w-this.ctx.measureText(text).width*scale)/2;
        var y=(h-parseInt(font.split('px ')[0])*scale)/2;
        return this.getPosFromText(text,fill,scale,x,y,lineWidth);
    }

    PosGenerator.prototype.getCircle = function (r, x, y, cnt) {
        var dd = Math.PI * 2 / cnt;
        var angle = 0, pos = [];
        for (var i = 0; i < cnt; i++) {
            pos.push({
                x: Math.cos(angle) * r + x,
                y: Math.sin(angle) * r + y
            });
            angle += dd;
        }
    }
    PosGenerator.prototype.getLine = function (x1, y1, x2, y2, cnt) {
        var pos = [];
        if (x1 == x2) {
            for (var i = 0; i < cnt; i++) {
                pos.push({ x: x1, y: (y1 + (y2 - y1) * i / (cnt - 1)) });
            }
        } else {
            var k = (y2 - y1) / (x2 - x1);
            for (var i = 0; i < cnt; i++) {
                var px = x1 + (x2 - x1) / (cnt - 1) * i, py = y1 + (px - x1) * k;
                pos.push({ x: px, y: py });
            }
        }
        return pos;
    }
    PosGenerator.prototype.getRect = function (x, y, w, h, cnt) {
        cnt /= 2;
        var wcnt = parseInt(cnt * w / (w + h)), hcnt = cnt - wcnt;
        return [].concat(this.getLine(x, y, x + w - 1, y, wcnt))
            .concat(this.getLine(x + w, y, x + w, y + h - 1, hcnt))
            .concat(this.getLine(x + 1, y + h, x + w, y + h, wcnt))
            .concat(this.getLine(x, y + 1, x, y + h, hcnt));
    }
    PosGenerator.prototype.getImage = function (x, y, w, h, img, scale) {
        this.ctx.drawImage(img, x, y, w, h);
        return this.getPos(w, h, scale, x, y);
    }


    return {
        easeFunctions: easeFunctions,
        Action: Action,
        getAttrfunc: getAttrfunc,
        getMovefunc: getMovefunc,
        getReBoundFunc: getReBoundFunc,
        randomColor: randomColor,
        BallPaintFunc: BallPaintFunc,
        ImgPaintFunc: ImgPaintFunc,
        Particle: Particle,
        PointCircleEmitter: PointCircleEmitter,
        World: World,
        moveParticleTo: moveParticleTo,
        getCircleDistribute: getCircleDistribute,
        PosGenerator: PosGenerator,
        freeWalkByStep: freeWalkByStep,
        scaleInOut: scaleInOut,
        forces: forces,
        spares: spares,
        distributes: distributes,
        getBasicShadeStepGetter: getBasicShadeStepGetter,
        BasicShadeStep: BasicShadeStep
    }
})();