'use strict';

import Cube from './objects/Cube';
import CubeEl from './objects/CubeEl';
import CubeElSecond from './objects/CubeElSecond';
import Sphere from './objects/Sphere';
import Line from './objects/Line';
import Plane from './objects/Plane';
import THREE from 'three';
window.THREE = THREE;

var centerLight,
    leftLight,
    rightLight,
    nbSphere = 2,
    nbCubeEl = 2,
    objects = [],
    cubeElArray = [],
    cubeElArraySecond = [],
    ts = 0,
    colors = [0x1C448E, 0x3E92CC, 0xE8D7F1, 0xFFAD05, 0xDB162F],
    iColor = 0,
    controls,
    particleCount = 1800,
    blockScene = 0,
    iColorWave = 0;

export default class Webgl {
  constructor(width, height) {
    this.scene = new THREE.Scene();
    this.scene.rotation.x = -0.5;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.z = 100;
    this.camera.position.y = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new THREE.OrbitControls(this.camera);


    centerLight = new THREE.PointLight( 0xffffff, 1, 50 );
    centerLight.position.set(0, -30, 0);

    leftLight = new THREE.PointLight( 0xffffff, 1, 200 );
    leftLight.position.set(-50, -30, 0);

    rightLight = new THREE.PointLight( 0xffffff, 1, 200 );
    rightLight.position.set(50, -30, 0);
    // centerLight = new THREE.HemisphereLight( 0xf55779, 0xf55779, 0.6 );
    // centerLight.color.setHSL( 0.6, 1, 0.6 );
    // centerLight.groundColor.setHSL( 0.095, 1, 0.75 );
    // centerLight.position.set( 0, 500, 0 );
    // this.scene.add( centerLight );

    this.scene.add(leftLight);
    this.scene.add(rightLight);
    this.scene.add(centerLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(colors[iColor]);

    this.usePostprocessing = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);
    this.initPostprocessing();

    /* CUBE CENTER */
    this.cube = new Cube();
    this.cube.position.set(0, 0 , 0);

    /* CUBE EL */
    for (var m = 0; m < nbCubeEl; m ++) {
      this.cubeEl = new CubeEl();

      if (m == 0) {
        this.cubeEl.position.y = -200;
        this.cubeEl.position.x = -200;
        this.cubeEl.rotation.z = 0.28 * Math.PI;    
      } else if (m == 1) {
        this.cubeEl.position.y = 100;
        this.cubeEl.position.x = 100;
        this.cubeEl.rotation.z = 0.28 * Math.PI;     
      }

      this.cubeEl.position.z = 0;  
      

      cubeElArray.push(this.cubeEl);
      this.scene.add(this.cubeEl);
    }

    /* CUBE EL SECOND */
    for (var h = 0; h < nbCubeEl; h ++) {
      this.CubeElSecond = new CubeElSecond();

      if (h == 0) {
        this.CubeElSecond.position.y = -150;
        this.CubeElSecond.position.x = -250;
        this.CubeElSecond.rotation.z = 0.25 * Math.PI;    
      } else if (h == 1) {
        this.CubeElSecond.position.y = 0;
        this.CubeElSecond.position.x = 140;
        this.CubeElSecond.rotation.z = 0.25 * Math.PI;     
      }

      this.CubeElSecond.position.z = 0;  
      

      cubeElArraySecond.push(this.CubeElSecond);
      this.scene.add(this.CubeElSecond);
    } 

    /* SPHERE */
    for (var j = 0; j < nbSphere; j ++) {
      this.sphere = new Sphere();

      if (j == 0) {
        this.sphere.position.x = width / 20;
      } else if (j == 1) {
        this.sphere.position.x = -width / 20;
      }
    
      objects.push(this.sphere);
      this.scene.add(this.sphere);
    }

    /* PARTICLES */

    this.particles = new THREE.Geometry();
    this.pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 2,
      map: THREE.ImageUtils.loadTexture(
        "app/assets/img/particle.svg"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    

    for (var p = 0; p < particleCount; p++) {
      this.pX = Math.random() * 500 - 250;
      this.pY = Math.random() * 500 - 250;
      this.pZ = Math.random() * 500 - 250;
      this.particle = new THREE.Vector3(this.pX, this.pY, this.pZ);

      this.particles.vertices.push(this.particle);
    }

    this.particleSystem = new THREE.ParticleSystem(this.particles, this.pMaterial);
    this.particleSystem.sortParticles = true;

    /* PLANE */
    this.plane = new Plane ();
    this.plane.position.set(0, 0, 0);
    this.plane.rotation.x = 0.5 * Math.PI;  

    /* ADD */
    this.addObjects ();
  }

  addObjects () {
    this.scene.add(this.plane);
    this.scene.add(this.particleSystem);
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    this.vignette2Pass = new WAGNER.Vignette2Pass();
    this.fxaaPass = new WAGNER.FXAAPass();
    this.noisePass = new WAGNER.NoisePass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render(average, frequencys, isLaunch) {
    ts += 0.1;
    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.vignette2Pass);
      this.composer.pass(this.noisePass);
      this.composer.pass(this.fxaaPass);
      this.composer.toScreen();
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera, this.light);
    }

    if (blockScene == 0 && isLaunch == 1) {
      this.scene.rotation.x += 0.001;

      if (this.scene.rotation.x > 0) {
        blockScene = 1;
      }
    }
    
    if (ts % 50 < 0.1 && isLaunch == 1) {
        leftLight.color.setHex (colors[iColorWave]);
        rightLight.color.setHex (colors[iColorWave]);
        iColorWave ++;

        if (iColorWave == colors.length) {
          iColorWave = 0;
        }
    }

    if (average < 80) {
      iColor = 0;
    } else if (average < 160) {
      iColor = 1;
    } else if (average < 180) {
      iColor = 2;
    } else if (average < 240) {
      iColor = 3;
    } else if (average < 300) {
      iColor = 4;
    }

    this.renderer.setClearColor(colors[iColor]);

    /* SPHERE SCALE */
    for (var j = 0; j < nbSphere; j ++) {
      if (j == 0) {
        objects[j].update(average, 'low');
      } else {
        objects[j].update(average, 'high');
      }
    }


    /* ELEMENT TRANSLATION */
    for (var q = 0; q < nbCubeEl; q ++) {
      if (q == 0) {
        cubeElArray[q].update(average, 'top');
        cubeElArraySecond[q].update(average, 'top');
      } else {
        cubeElArray[q].update(average, 'bot');
        cubeElArraySecond[q].update(average, 'bot');
      }

      if (isLaunch == 0) {
        cubeElArray[q].geom.visible = false;
      } else {
        cubeElArray[q].geom.visible = true;
      }
    }

    /* WAVE */
    for (var n = 0; n < this.plane.geom.vertices.length; n ++) {
      var vertice = this.plane.geom.vertices[n];
      var face = this.plane.geom.faces[n];
      var dist = new THREE.Vector2(vertice.x, vertice.y).sub(new THREE.Vector2(0,0));
      var averageWave = average;

      if (average > 30) {
        averageWave = 30;
      }
      var amplitude = 0.2 * averageWave;
      var size = 5.0;
      
      vertice.z = Math.sin(dist.length()/-size + (ts)) * amplitude;  
      face.color = new THREE.Color(0x15687a);;  
      this.plane.geom.verticesNeedUpdate = true;
    }

    /* CUBE */
    this.cube.rotation.x -= 0.01;
    this.cube.rotation.y -= 0.01;

    /* PARTICLE ROTATION */
    this.particleSystem.rotation.y += 0.01;
    this.particleSystem.rotation.z += 0.01;
  }
}