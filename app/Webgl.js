'use strict';

import Cube from './objects/Cube';
import CubeEl from './objects/CubeEl';
import Sphere from './objects/Sphere';
// import Line from './objects/Line';
import Plane from './objects/Plane';
import THREE from 'three';
window.THREE = THREE;

var light,
    nbSphere = 2,
    nbCubeEl = 2,
    objects = [],
    cubeElArray = [],
    ts = 0,
    colors = [0x1C448E, 0x3E92CC, 0xFFAD05, 0xE8D7F1, 0xDB162F],
    iColor = 0,
    activeColor = 0;

export default class Webgl {
  constructor(width, height) {
    this.scene = new THREE.Scene();


    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.z = 100;
    this.camera.position.y = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    light = new THREE.PointLight( 0xffffff, 1, 250 );
    light.position.set(10, 110, 20);
    this.scene.add(light);

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

    this.particleCount = 1800;
    this.particles = new THREE.Geometry();
    this.pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 2,
      map: THREE.ImageUtils.loadTexture(
        "app/particle.svg"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    

    for (var p = 0; p < this.particleCount; p++) {
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

    /* WAVE */
    // this.wave = new Line ();
    // this.wave.position.set(0, 0, 0);


    /* ADD */
    // this.scene.add(this.cube);
    this.addObjects ();
  }

  addObjects () {
    this.scene.add(this.plane);
    this.scene.add(this.particleSystem);
    // this.scene.add(this.wave); 
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

  render(average, frequencys) {
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

    if (average < 60) {
      iColor = 0;
      activeColor =1;
    } else if (average < 120) {
      iColor = 1;
      activeColor =1;
    } else if (average < 180) {
      iColor = 2;
      activeColor =1;
    } else if (average < 240) {
      iColor = 3;
      activeColor =1;
    } else if (average < 300) {
      iColor = 4;
      activeColor =1;
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
      } else {
        cubeElArray[q].update(average, 'bot');
      }
    }

    /* WAVE */
    for (var n = 0; n < this.plane.geom.vertices.length; n ++) {
      var vertice = this.plane.geom.vertices[n];
      var dist = new THREE.Vector2(vertice.x, vertice.y).sub(new THREE.Vector2(0,0));
      var averageWave = average;

      if (average > 30) {
        averageWave = 30;
      }

      var amplitude = 0.2 * averageWave;
      var size = 5.0;
      
      vertice.z = Math.sin(dist.length()/-size + (ts)) * amplitude;
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