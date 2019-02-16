/* global requestAnimationFrame, THREE */

function petal (x, y, z, r) {
  var path = new THREE.CurvePath()
  path.curves = [
    new THREE.LineCurve3(
      new THREE.Vector3(x + 5, y, z),
      new THREE.Vector3(x + 5, y, z + 20)
    ),
    new THREE.LineCurve3(
      new THREE.Vector3(x + 5, y, z + 20),
      new THREE.Vector3(x, y - 3, z + 25)
    ),
    new THREE.LineCurve3(
      new THREE.Vector3(x, y - 3, z + 25),
      new THREE.Vector3(x - 5, y, z + 20)
    ),
    new THREE.LineCurve3(
      new THREE.Vector3(x - 5, y, z + 20),
      new THREE.Vector3(x - 5, y, z)
    )
  ]
  path.autoClose = true
  var divisions = 10
  var geom = new THREE.PlaneGeometry(1, 1, divisions, 1)
  geom.vertices = path.getPoints(divisions)
  geom.rotateY(r * 2 * Math.PI)
  return geom
}

function disk (x, y, r) {
  var circle = new THREE.Shape()
  circle.moveTo(x, y + r)
  circle.quadraticCurveTo(x + r, y + r, x + r, y)
  circle.quadraticCurveTo(x + r, y - r, x, y - r)
  circle.quadraticCurveTo(x - r, y - r, x - r, y)
  circle.quadraticCurveTo(x - r, y + r, x, y + r)
  var geom = new THREE.ExtrudeGeometry(circle, {
    steps: 2,
    depth: 0.1,
    bevelThickness: 3,
    bevelSize: 10
  })
  geom.rotateX(0.5 * Math.PI)
  return geom
}

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  100
)
camera.position.z = 50
camera.position.y = -5

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x663399, 1)
document.body.appendChild(renderer.domElement)

var lights = []
lights[0] = new THREE.PointLight(0xffffff, 1, 0)
lights[1] = new THREE.PointLight(0xffffff, 1, 0)
lights[2] = new THREE.PointLight(0xffffff, 1, 0)

lights[0].position.set(0, 200, 0)
lights[1].position.set(100, 200, 100)
lights[2].position.set(-100, -200, -100)

scene.add(lights[0])
scene.add(lights[1])
scene.add(lights[2])

var group = new THREE.Group()
var petalMaterial = new THREE.MeshPhongMaterial({
  color: 0xfbdc4a,
  emissive: 0xb5520f,
  side: THREE.DoubleSide,
  flatShading: true
})
var diskMaterial = new THREE.MeshLambertMaterial({
  color: 0x3f2311,
  side: THREE.DoubleSide,
  flatShading: true
})

var petals = 20
for (var i = 0; i < petals; i++) {
  group.add(new THREE.Mesh(petal(0, 3, 0, i / petals), petalMaterial))
}
group.add(new THREE.Mesh(disk(0, 0, 5), diskMaterial))
group.rotation.x -= 0.6 * Math.PI
scene.add(group)

var render = function () {
  requestAnimationFrame(render)
  group.rotation.y += 0.001
  renderer.render(scene, camera)
}

window.addEventListener(
  'resize',
  function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  false
)

render()
