import * as THREE from "three";

var collidableMeshList = [];

export default class Tree {
  constructor() {
    //modèle 3d
    this.mesh = new THREE.Object3D();
    this.mesh.name = "tree";

    // tronc
    var geomTronc = new THREE.PlaneGeometry(2, 4);
    var matTronc = new THREE.MeshBasicMaterial({
      color: "white",
    });
    var tronc = new THREE.Mesh(geomTronc, matTronc);
    tronc.position.set(0, 0, 0);
    tronc.rotation.x = -Math.PI * 0.5;
    tronc.castShadow = true;
    tronc.receiveShadow = true;
    this.mesh.add(tronc);

    // // arbre
    // var geomArbre = new THREE.CubeGeometry(5, 5, 5);
    // var matArbre = new THREE.MeshBasicMaterial({
    //   color: "red",
    //   wireframe: true,
    // });
    // var arbre = new THREE.Mesh(geomArbre, matArbre);
    // arbre.position.set(0, 0.03, 0);
    // tronc.add(arbre);
    collidableMeshList.push(tronc);
  }
}
