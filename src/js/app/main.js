// Global imports -
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

// Local imports -
// Components
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Light from "./components/light";
import Controls from "./components/controls";
import Geometry from "./components/geometry";

// Helpers
import Stats from "./helpers/stats";
import MeshHelper from "./helpers/meshHelper";

// Model
import Texture from "./model/texture";
import Model from "./model/model";

// Managers
import Interaction from "./managers/interaction";
import DatGUI from "./managers/datGUI";

// data
import Config from "./../data/config";
// -- End of imports

//
import Tree from "./src/make-tree";

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor({ container }) {
    // Set container property to container element
    this.container = container;

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if (window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(this.camera.threeCamera, container);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ["ambient", "directional", "point", "hemi"];
    lights.forEach((light) => this.light.place(light));

    // Create and place geo in scene
    // this.geometry = new Geometry(this.scene);
    // this.geometry.make("plane")(150, 150, 10, 10);
    // this.geometry.place([0, -20, 0], [Math.PI / 2, 0, 0]);

    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 2, 2),
      new THREE.MeshBasicMaterial({
        color: "gray",
        opacity: 0,
        wireframe: false,
      })
    );

    this.tree = new THREE.Object3D();
    this.tree.name = "tree";

    // Set up rStats if dev environment
    // if (Config.isDev && Config.isShowingStats) {
    this.stats = new Stats(this.renderer);
    this.stats.setUp();
    // }

    // Set up gui
    // if (Config.isDev) {
    this.gui = new DatGUI(this);
    // }

    this.scene.add(this.sphere);

    // Instantiate texture class
    // this.texture = new Texture();

    // Start loading the textures and then go on to load the model after the texture Promises have resolved
    // this.texture.load().then(() => {
    //   this.manager = new THREE.LoadingManager();

    // Textures loaded, load model
    // this.model = new Model(this.scene, this.manager, this.texture.textures);
    // this.model.load(Config.models[Config.model.selected].type);

    // onProgress callback
    // this.manager.onProgress = (item, loaded, total) => {
    //   console.log(`${item}: ${loaded} ${total}`);
    // };

    //   // All loaders done now
    // this.manager.onLoad = () => {
    //   // Set up interaction manager with the app now that the model is finished loading
    //   new Interaction(
    //     this.renderer.threeRenderer,
    //     this.scene,
    //     this.camera.threeCamera,
    //     this.controls.threeControls
    //   );

    //     // Add dat.GUI controls if dev
    // if (Config.isDev) {
    // this.meshHelper = new MeshHelper(this.scene, this.model.obj);
    // if (Config.mesh.enableHelper) this.meshHelper.enable();

    this.gui.load(this);
    // }

    //     // Everything is now fully loaded
    Config.isLoaded = true;
    // this.container.querySelector("#loading").style.display = "none";
    // };
    // });
    this.createTree(Config.numberofleaves.count);

    // Start render which does not wait for model fully loaded
    this.render();
  }

  createTree(numberoftrees) {
    for (var i = 0; i < numberoftrees; i++) {
      let leafGeometry = new THREE.PlaneGeometry(1, 1);
      let color = new THREE.Color(0xffffff);
      color.setHex(Math.random() * 0xffffff);
      let leafMAterial = new THREE.MeshBasicMaterial({
        color: color,
      });
      let leaf = new THREE.Mesh(leafGeometry, leafMAterial);
      leaf.position.set(0, 0, 0);
      leaf.rotation.y = 2;
      let rx = Math.random() * Math.PI * 2;
      let ry = Math.random() * Math.PI;
      let rz = 30 * Math.random() * Math.PI;
      leaf.position.setFromSphericalCoords(rz, ry, rx);
      leaf.lookAt(this.sphere.position);
      this.tree.add(leaf);
    }
    this.scene.add(this.tree);
  }
  render() {
    // Render rStats if Dev
    // if (Config.isDev && Config.isShowingStats) {
    Stats.start();
    // }

    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.camera.threeCamera);

    // rStats has finished determining render call now
    // if (Config.isDev && Config.isShowingStats) {
    Stats.end();
    // }

    // Delta time is sometimes needed for certain updates
    // const delta = this.clock.getDelta();

    // Call any vendor or module frame updates here
    TWEEN.update();
    this.controls.threeControls.update();

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
