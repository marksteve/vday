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

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  100
)
camera.position.z = 50
camera.position.y = -5

var controls = new THREE.OrbitControls(camera)
controls.enableZoom = false
controls.enablePan = false

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
var outerSeedMaterial = new THREE.MeshLambertMaterial({
  color: 0x3f2311,
  flatShading: true
})
var innerSeedMaterial = new THREE.MeshLambertMaterial({
  color: 0xa36d34,
  flatShading: true
})

var petals = 20
for (var i = 0; i < petals; i++) {
  // group.add(new THREE.Mesh(petal(0, 3, 0, i / petals), petalMaterial))
}
var sphere = new THREE.SphereBufferGeometry(0.5)
var n = 2618
var phi = (Math.sqrt(5) - 1) / 2
function rho (k) {
  return Math.pow(k, phi)
}
function theta (k) {
  return k * 2 * Math.PI * phi
}
for (var k = 0; k < n; k++) {
  var a = theta(k)
  var d = rho(k) * 0.105
  var x = d * Math.cos(a)
  var y = d * Math.sin(a)
  // var r = 0.9 + k / n * 0.3
  var mesh = new THREE.Mesh(
    sphere,
    k < 1000 ? innerSeedMaterial : outerSeedMaterial
  )
  mesh.position.x = x
  mesh.position.y = k < 1000 ? 1 : -0.5 * Math.sin((k / n * 3 + 0.5) * Math.PI)
  mesh.position.z = y
  group.add(mesh)
}

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
