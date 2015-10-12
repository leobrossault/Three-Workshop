'use strict';

import THREE from 'three';

export default class Cube extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;
    this.magnets = [];

    // this.geom = new THREE.CubeGeometry( 100 , 5, 100 );
    this.geom = new THREE.SphereGeometry( 25 , 25, 25 );
    this.mat = new THREE.MeshPhongMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
    
    // this.addMagnets ();
    // this.distort ();
  }

  update(average, frequency) {
    this.rotation.x += 0.01;
    this.rotation.z += 0.01;


    if (average != 0) {
      this.scale.x = average * 0.01;
      this.scale.y = average * 0.01;
      this.scale.z = average * 0.01;
    }
  }

  distort () {
    var maxMagnets = this.magnets.length, 
        maxVertices = this.geom.vertices.length;

    var magneticMaxValue = this.getDistance3d( {x: 0, y: 0, z: 0}, {x: 6000, y: 6000, z: 6000} );
    var strength = 6000, 
        factor = 6;

    for (var i = 0; i < maxMagnets; i++) {
        for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
            var magnet = this.magnets[i];
            var vertex = this.geom.vertices[vertexI];

            var distance = this.getDistance3d(magnet, vertex);
            var power = magneticMaxValue / distance / strength;

            vertex.x += ( (magnet.x - vertex.x) * power ) * factor;
            vertex.y += ( (magnet.y - vertex.y) * power ) * factor;
            vertex.z += ( (magnet.z - vertex.z) * power ) * factor;
        }
    }
  }

  addMagnets (vertex) {
    var max = this.geom.vertices.length, maxMagnets = 1;
    for (var i = 1; i <= 1; i++) {
        var index = Misc.getRandomInt(0, max - 1);
        var vertex = this.geom.vertices[index];
        var magnetI = this.magnets.length;
        this.magnets[magnetI] = this.distortVertex( {x: vertex.x, y: vertex.y, z: vertex.z}, 10 );
        // this.showMagnet(this.magnets[magnetI]);
    }

    var magnetI = 0;
    this.magnets[magnetI] = {x: 0, y: -10, z: -30};
    // this.showMagnet(this.magnets[magnetI]);
  }

  getDistance3d (vertex1, vertex2) {
    var xfactor = vertex2.x - vertex1.x;
    var yfactor = vertex2.y - vertex1.y;
    var zfactor = vertex2.z - vertex1.z;
    return Math.sqrt( (xfactor*xfactor) + (yfactor*yfactor) + (zfactor*zfactor) );
  }

  distortVertex (vertex, distortion) {
    vertex.x = Misc.distort(vertex.x, distortion);
    vertex.y = Misc.distort(vertex.y, distortion);
    vertex.z = Misc.distort(vertex.z , distortion);
    return vertex;
  }
}