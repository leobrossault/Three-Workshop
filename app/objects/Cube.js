'use strict';

import THREE from 'three';

export default class Cube extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;

    // this.geom = new THREE.CubeGeometry( 100 , 5, 100 );
    this.geom = new THREE.CubeGeometry( 25 , 25, 25 );
    this.mat = new THREE.MeshBasicMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }

  update(average, frequency) {
    // this.rotation.x += 0.01;
    // this.rotation.z += 0.01;

    if (average != 0) {

      // this.scale.x = average * 0.01;
      // this.scale.y = average * 0.01;
      // this.scale.z = average * 0.01;
    }
  }
}