'use strict';

import THREE from 'three';

export default class Cube extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;
    this.nbVertices = 0;

    this.geom = new THREE.PlaneGeometry(100, 100, 40, 40);
    this.mat = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true});
    this.plane = new THREE.Mesh(this.geom, this.mat);

    this.add(this.plane);
  }

  update() {

  }
}