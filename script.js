//==================================================== CORS
/*const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));*/

//==================================================== Beginning of script

console.clear();

//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var light = new THREE.DirectionalLight(0xefefff, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);
var light = new THREE.DirectionalLight(0xffefef, 3);
light.position.set(-1, -1, -1).normalize();
scene.add(light);

//===================================================== resize
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== model
var loader = new THREE.GLTFLoader();
var mixer;
var model;
loader.load(
  "https://raw.githubusercontent.com/Puneeth-A-R/Puneeth-A-R.github.io/main/book.glb",
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
    });

    model = gltf.scene;
    model.scale.set(0.35, 0.35, 0.35);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[1]).play();
    var action = mixer.clipAction(gltf.animations[1]);
    action.play();

    createAnimation(mixer, action, gltf.animations[1]);
  }
);

var clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
  if (model) model.rotation.y += 0.025;

  renderer.render(scene, camera);
}

render();
gsap.registerPlugin(ScrollTrigger);

function createAnimation(mixer, action, clip) {
  let proxy = {
    get time() {
      return mixer.time;
    },
    set time(value) {
      action.paused = false;
      mixer.setTime(value);
      action.paused = true;
    }
  };

  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      trigger: renderer.domElement,
      start: "top top",
      end: "+=500%",
      pin: true,
      scrub: true,
      markers: true,
      onUpdate: function () {
        camera.updateProjectionMatrix();
        console.log(proxy.time)
      }
    }
  });

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 3,
  });
}
