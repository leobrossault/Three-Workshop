'use strict';

import Cube from './objects/Cube';
import THREE from 'three';
window.THREE = THREE;

var light,
    nbCube = 3,
    objects = [];

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
    this.renderer.setClearColor(0xDB162F);

    this.usePostprocessing = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);
    this.initPostprocessing();

    for (var j = 0; j < nbCube; j ++) {
      this.cube = new Cube();

      if (j == 0) {
        this.cube.position.set(0, 0, 0);
      } else if (j == 1 || j == 3) {
        this.cube.position.x = -120;
      } else if  (j == 2 || j == 4) {
        this.cube.position.x = 120;
      } else if  (j == 1 || j == 2) {
        this.cube.position.z = -120;
      } else if (j == 3 || j == 4) {
        this.cube.position.z = 120;
      }
      
      objects.push(this.cube);
      this.cube.doubleSided = true;
      this.scene.add(this.cube);
    }
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    this.vignette2Pass = new WAGNER.Vignette2Pass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render() {
    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.vignette2Pass);
      this.composer.toScreen();
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera, this.light);
    }
    for (var j = 0; j < nbCube; j ++) {
      if (j == 0) {
        objects[j].update(average, 'low');
      } else {
        objects[j].update(average, 'high');
      }
      
    }
  }
}