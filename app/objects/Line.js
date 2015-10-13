'use strict';

import THREE from 'three';

export default class Line extends THREE.Object3D {
  

  constructor() {
    super ();

    this.material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 50
    });

    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(
      new THREE.Vector3( -10, 0, 0 ),
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );

    this.line = new THREE.Line(this.geometry, this.material);
    this.add(this.line);
  }

  update() {

  }
}