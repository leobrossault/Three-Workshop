'use strict';

import THREE from 'three';

export default class Cube extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;

    this.geom = new THREE.BoxGeometry( 25 , 25, 25 );
    this.mat = new THREE.MeshBasicMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }

  update(average, frequency) {
     
  }
}