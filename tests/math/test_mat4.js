module("pc.Mat4");

function approx(actual, expected, message) {
    var epsilon = 0.00001;
    var delta = actual - expected;
    QUnit.ok( Math.abs(delta) < epsilon, message);
}

test("create", function() {
	var m = new pc.Mat4();
    ok(m);	

    // Check the matrix is identity
	var identity = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
	for(var i=0 ; i<16; ++i) {
		QUnit.equal(m.data[i], identity[i]);
	}
});

test("clone", function() {
	var m = new pc.Mat4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
	var c = m.clone();
	
	for(var i=0;i<16;++i) {
       QUnit.equal(m.data[i], c.data[i]);	
	}
});

test("mul2: I*I = I", function() {
    var m1 = new pc.Mat4();
    var m2 = new pc.Mat4();
    var m3 = new pc.Mat4();
    var m4 = new pc.Mat4();

    m3.mul2(m1, m2);
    QUnit.deepEqual(m3.data, m4.data);
});

test("mul2: I*A = A", function() {
    var m1 = new pc.Mat4();
    var m2 = new pc.Mat4().rotate(180 / 8, pc.Vec3.UP);
    var m3 = new pc.Mat4();

    m3.mul2(m1, m2);
    QUnit.deepEqual(m2.data, m3.data);
});

test("mul2: A*I = A", function() {
    var m1 = new pc.Mat4().rotate(180 / 8, pc.Vec3.UP);
    var m2 = new pc.Mat4();
    var m3 = new pc.Mat4();

    m3.mul2(m1, m2);
    QUnit.deepEqual(m1.data, m3.data);
});

test("transformPoint", function() {
    var t = new pc.Mat4();
    var v = new pc.Vec3(1, 0, 0);
    var r = new pc.Vec3();

    t.rotate(90, pc.Vec3.BACK);
    t.transformPoint(v, r);
    
    approx(r.x, 0);
    approx(r.y, 1);
    approx(r.z, 0);
});

test("transformPoint: src and result same", function() {
    var t = new pc.Mat4();
    var v = new pc.Vec3(1, 0, 0);
    
    t.rotate(90, pc.Vec3.BACK);
    t.transformPoint(v, v);
    
    approx(v.x, 0);
    approx(v.y, 1);
    approx(v.z, 0);
});

test("lookAt", function() {
    var position = new pc.Vec3(0, 0, 10);
    var target   = new pc.Vec3(0, 0, 0);
    var up       = new pc.Vec3(0, 1, 0);

    var lookAt = new pc.Mat4().lookAt(position, target, up);

    QUnit.equal(lookAt.data[0], 1);
    QUnit.equal(lookAt.data[1], 0);
    QUnit.equal(lookAt.data[2], 0);
    QUnit.equal(lookAt.data[3], 0);

    QUnit.equal(lookAt.data[4], 0);
    QUnit.equal(lookAt.data[5], 1);
    QUnit.equal(lookAt.data[6], 0);
    QUnit.equal(lookAt.data[7], 0);

    QUnit.equal(lookAt.data[8], 0);
    QUnit.equal(lookAt.data[9], 0);
    QUnit.equal(lookAt.data[10], 1);
    QUnit.equal(lookAt.data[11], 0);

    QUnit.equal(lookAt.data[12], 0);
    QUnit.equal(lookAt.data[13], 0);
    QUnit.equal(lookAt.data[14], 10);
    QUnit.equal(lookAt.data[15], 1);
});

test("lookAt: 90deg", function () {
    var m = new pc.Mat4();
    m.rotate(90, pc.Vec3.UP);
    var r = new pc.Mat4();
    var heading = new pc.Vec3(-m.data[8], -m.data[9], -m.data[10]);
    var left    = new pc.Vec3(m.data[0], m.data[1], m.data[2]);
    var up      = new pc.Vec3(m.data[4], m.data[5], m.data[6]);

    r.lookAt(new pc.Vec3(), heading, up);

    for(var index = 0; index < 16; index++) {
        QUnit.equal(r.data[index], m.data[index]);
    }
});

test("lookAt: 180deg", function () {
    var m = new pc.Mat4();
    m.rotate(90, pc.Vec3.UP);
    var r = new pc.Mat4();
    var heading = new pc.Vec3(-m.data[8], -m.data[9], -m.data[10]);
    var left    = new pc.Vec3(m.data[0], m.data[1], m.data[2]);
    var up      = new pc.Vec3(m.data[4], m.data[5], m.data[6]);
    
    r.lookAt(new pc.Vec3(), heading, up);
    
    for(var index = 0; index < 16; index++) {
        QUnit.equal(r.data[index], m.data[index]);
    }
});

test("translate", function() {
    var x = 10;
    var y = 20;
    var z = 30;
    
    // Test 1: create matrix internally
    var t = new pc.Mat4().translate(x, y, z);
    QUnit.equal(t.data[12], x);
    QUnit.equal(t.data[13], y);
    QUnit.equal(t.data[14], z);
    
    // Test 2: generate result in supplied matrix
    var r = new pc.Mat4();
    r.translate(x, y, z);
    QUnit.equal(r.data[12], x);
    QUnit.equal(r.data[13], y);
    QUnit.equal(r.data[14], z);
});

	
test("transpose", function() {
    var x = 10;
    var y = 20;
    var z = 30;
    var m = new pc.Mat4().translate(x, y, z);

    var mTrans = m.transpose();
    var mTransTrans = mTrans.transpose();
    
    QUnit.deepEqual(m.data, mTransTrans.data);
});

test("invert", function() {
    var x = 10;
    var y = 20;
    var z = 30;
    var m1 = new pc.Mat4().translate(x, y, z);

    var inv = m1.clone().invert();

    var m2 = inv.clone().invert();

    deepEqual(m1.data, m2.data);
});

test("getX", function () {
    var m = new pc.Mat4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
    var v1 = m.getX();

    QUnit.equal(v1.x, 1);
    QUnit.equal(v1.y, 2);
    QUnit.equal(v1.z, 3);

    // use existing vector
    var v2 = new pc.Vec3();
    m.getX(v2);

    QUnit.equal(v2.x, 1);
    QUnit.equal(v2.y, 2);
    QUnit.equal(v2.z, 3);
});

test("getY", function () {
    var m = new pc.Mat4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
    var v1 = m.getY();

    QUnit.equal(v1.x, 5);
    QUnit.equal(v1.y, 6);
    QUnit.equal(v1.z, 7);

    // use existing vector
    var v2 = new pc.Vec3();
    m.getY(v2);

    QUnit.equal(v2.x, 5);
    QUnit.equal(v2.y, 6);
    QUnit.equal(v2.z, 7);
});

test("getZ", function () {
    var m = new pc.Mat4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
    var v1 = m.getZ();

    QUnit.equal(v1.x, 9);
    QUnit.equal(v1.y, 10);
    QUnit.equal(v1.z, 11);

    // use existing vector
    var v2 = new pc.Vec3();
    m.getZ(v2);

    QUnit.equal(v2.x, 9);
    QUnit.equal(v2.y, 10);
    QUnit.equal(v2.z, 11);
});

test("getTranslation", function() {
    var m = new pc.Mat4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
    var v1 = m.getTranslation();

    QUnit.equal(v1.x, 13);
    QUnit.equal(v1.y, 14);
    QUnit.equal(v1.z, 15);

    // use existing vector
    var v2 = new pc.Vec3();
    m.getTranslation(v2);

    QUnit.equal(v2.x, 13);
    QUnit.equal(v2.y, 14);
    QUnit.equal(v2.z, 15);
});

test("getScale", function() {
    var m = new pc.Mat4(2,0,0,1,0,3,0,1,0,0,4,1,0,0,0,1);
    var v1 = m.getScale();
    
    QUnit.equal(v1.x, 2);
    QUnit.equal(v1.y, 3);
    QUnit.equal(v1.z, 4);

    // use existing vector
    var v2 = new pc.Vec3();
    m.getScale(v2);

    QUnit.equal(v2.x, 2);
    QUnit.equal(v2.y, 3);
    QUnit.equal(v2.z, 4);
});


test("toEulers", function () {
    var m, e;
    
    m = new pc.Mat4(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    e = new pc.Vec3();
    m.toEulers(e);
    QUnit.equal(e.x, 0);
    QUnit.equal(e.y, 0);
    QUnit.equal(e.z, 0);

    m = new pc.Mat4(1,0,0,0, 0,0,1,0, 0,-1,0,0, 0,0,0,1);
    m.toEulers(e);
    approx(e.x, 90, e.x.toString() + " ~= " + 90);
    QUnit.equal(e.y, 0);
    QUnit.equal(e.z, 0);

    m = new pc.Mat4(1,0,0,0 ,0,1,0,0, 0,0,1,0, 0,0,0,1);
    m.toEulers(e);
    QUnit.equal(e.x, 0);
    QUnit.equal(e.y, 0);
    QUnit.equal(e.z, 0);
    
    m = new pc.Mat4(0.7071067811865476,0,0.7071067811865476,0,0,1,0,0,-0.7071067811865476,0,0.7071067811865476,0,0,0,0,1);
    m.toEulers(e);
    QUnit.equal(e.x, 0);
    approx(e.y, -45, e.y.toString() + " ~= " + -45);
    QUnit.equal(e.z, 0);

    m = new pc.Mat4(1,0,0,0, 0,0.7071067811865476,-0.7071067811865476,0, 0,0.7071067811865476,0.7071067811865476,0, 0,0,0,1);
    m.toEulers(e);
    approx(e.x, -45, e.x.toString() + " ~= " + -45);
    QUnit.equal(e.y, 0);
    QUnit.equal(e.z, 0);

    m = new pc.Mat4(0.7071067811865476,-0.7071067811865476,0,0, 0.7071067811865476,0.7071067811865476,0,0, 0,0,1,0, 0,0,0,1);
    m.toEulers(e);
    QUnit.equal(e.x, 0);
    QUnit.equal(e.y, 0);
    approx(e.z, -45, e.z.toString() + " ~= " + -45);
});

test("setFromEulers", function () {
    var m, mr, mrx, mry, mrz, x, y, z;

    /** clip to 3 decimal places and convert to string for comparison **/
    var clip = function (m) {
        var i,l = m.length;
        var a = [];
        for(i = 0;i < l; i++) {
            a[i] = parseFloat(m[i].toFixed(3));
        }
        
        return a;
    };
    
    // no rotation -> identity
    x = y = z = 0;
    m = new pc.Mat4().setFromEulers(x,y,z);
    QUnit.deepEqual(m.data, new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]));

    // Rotate 45 around y
    y = 45;
    x = z = 0;
    m = new pc.Mat4().setFromEulers(x,y,z);
    var m1 = pc.math.mat4.makeRotate(y, [0, 1, 0]);
    QUnit.deepEqual(clip(m.data), [0.707,0,-0.707,0,0,1,0,0,0.707,0,0.707,0, 0,0,0,1]);

    // Rotate 45 around x
    x = 45;
    y = z = 0;
    m = new pc.Mat4().setFromEulers(x,y,z);
    QUnit.deepEqual(clip(m.data), [1,0,0,0, 0,0.707,0.707,0, 0,-0.707,0.707,0, 0,0,0,1]);

    // Rotate 45 around z
    z = 45;
    y = x = 0;
    m = new pc.Mat4().setFromEulers(x,y,z);
    QUnit.deepEqual(clip(m.data), [0.707,0.707,0,0, -0.707,0.707,0,0, 0,0,1,0, 0,0,0,1]);

    // Arbitrary rotation
    x = 33;
    y = 44;
    z = 55;
    m = new pc.Mat4().setFromEulers(x,y,z);
    mrx = new pc.Mat4().rotate(x, pc.Vec3.RIGHT);
    mry = new pc.Mat4().rotate(y, pc.Vec3.UP);
    mrz = new pc.Mat4().rotate(z, pc.Vec3.BACK);
    mr = new pc.Mat4().mul2(mrz, mry);
    mr.mul(mrx);
    QUnit.deepEqual(clip(m.data), clip(mr.data));
});

test("fromEuler and back", function () {
    var clip = function (m) {
        var i,l = m.length;
        var a = []
        for(i = 0;i < l; i++) {
            a[i] = parseFloat(m[i].toFixed(3));
        }
        
        return a;
    };
    
    var m1 = new pc.Mat4(0.7071067811865476,0,0.7071067811865476,0,0,1,0,0,-0.7071067811865476,0,0.7071067811865476,0, 0,0,0,1);
    var m2;

    var r = new pc.Vec3();
    m1.toEulers(r);
    m2 = new pc.Mat4().setFromEulers(r.x, r.y, r.z);
    
    QUnit.deepEqual(clip(m1.data),clip(m2.data));
});

test("setTRS", function() {
    var clip = function (m) {
        var i,l = m.length;
        var a = []
        for(i = 0;i < l; i++) {
            a[i] = parseFloat(m[i].toFixed(3));
        }
        
        return a;
    };

    var tx = 10;
    var ty = 20;
    var tz = 30;

    var t = new pc.Vec3(tx, ty, tz);
    var r = new pc.Quat(0, 0, Math.sqrt(0.5), Math.sqrt(0.5));
    var s = new pc.Vec3(2, 2, 2);
    var m1 = new pc.Mat4().setTRS(t, r, s);

    var mt = new pc.Mat4().translate(tx, ty, tz);
    var mr = new pc.Mat4().rotate(90, pc.Vec3.BACK);
    var ms = new pc.Mat4().scale(2, 2, 2);
    var temp = new pc.Mat4().mul2(mt, mr);
    var m2 = new pc.Mat4().mul2(temp, ms);

    for (var i = 0; i < m1.length; i++) {
        QUnit.close(m1.data[i], m2.data[i], 0.0001);
    }

    t = new pc.Vec3(tx, ty, tz);
    r = new pc.Quat(0, Math.sqrt(0.5), 0, Math.sqrt(0.5));
    s = new pc.Vec3(2, 3, 4);
    m1 = new pc.Mat4().setTRS(t, r, s);
    m2 = [0, 0, -2, 0, 0, 3, 0, 0, 4, 0, 0, 0, 10, 20, 30, 1];

    QUnit.deepEqual(clip(m1.data),clip(m2));
});


/*

test("makeRotate", function() {
    ok(false, "Not written");
});    
    
test("makeFrustum", function() {
    ok(false, "Not written")
});
    
test("makePerspective", function() {
    ok(false, "Not written");
});

*/