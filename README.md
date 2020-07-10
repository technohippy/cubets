Cubets
====

just for my learning purpose

```html
<canvas id="gl-canvas" width="600" height="400"></canvas>
<script type="module">
  import Cubets from "../dist/cubets.js"

  const scene = new Cubets.PhongScene()

  const light = new Cubets.PhongScene.Light(
    new Cubets.Vec3(0, 0, -1),
    new Cubets.RGBAColor(0.3, 0.3, 0.3),
    new Cubets.RGBAColor(0.8, 0.8, 0.8)
  )

  const mesh = new Cubets.Mesh(
    new Cubets.CubeGeometry({x:10, y:10, z:10}),
    new Cubets.PhongScene.Material(),
  )

  const mesh2 = new Cubets.Mesh(
    new Cubets.CubeGeometry({x:5, y:5, z:5}),
    new Cubets.PhongScene.Material(new Cubets.RGBAColor(0.1, 0.5, 1.0)),
  )
  mesh2.translate(new Cubets.Vec3(-6, 0, 4))

  scene.add(mesh)
  scene.add(mesh2)
  scene.add(light)

  const camera = new Cubets.PerspectiveCamera("gl-canvas", 45, 0.1, 100)
  // const camera = new Cubets.OrthogonalCamera("cubets", 0, 0, 40, -50, 50)
  camera.start(scene)

  setInterval(() => {
    mesh.rotate(Math.PI/300, new Cubets.Vec3(1,0.1,1))
    mesh2.rotate(-Math.PI/100, new Cubets.Vec3(1,0.1,1))
  }, 10)
</script>
```