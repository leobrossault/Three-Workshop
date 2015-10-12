'use strict';

import Cube from './objects/Cube';
import THREE from 'three';
window.THREE = THREE;

var light;

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

    this.cube = new Cube();
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
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

    this.cube.update();
  }
}