Cubets
====

just for my learning purpose

```html
<canvas id="gl-canvas" width="600" height="400"></canvas>
<script type="module">
  import Cubets from "../dist/cubets.js"

  const scene = new Cubets.Scene()

  const light = new Cubets.Scene.Light(
    new Cubets.Vec3(0, 0, -1),
    new Cubets.Color(0.3, 0.3, 0.3),
    new Cubets.Color(0.8, 0.8, 0.8)
  )

  const mesh = new Cubets.Mesh(
    new Cubets.CubeGeometry(10, 10, 10),
    new Cubets.Scene.Material(),
  )

  const mesh2 = new Cubets.Mesh(
    new Cubets.CubeGeometry(5, 5, 5),
    new Cubets.Scene.Material(new Cubets.Color(0.1, 0.5, 1.0)),
  )
  mesh2.position = new Cubets.Vec3(-6, 0, 4)

  scene.add(mesh)
  scene.add(mesh2)
  scene.add(light)

  const camera = new Cubets.PerspectiveCamera("gl-canvas", 45, 0.1, 100)
  camera.position.z = 20
  camera.start(scene)

  setInterval(() => {
    mesh.rotate(Math.PI/300, new Cubets.Vec3(1,0.1,1))
    mesh2.rotate(-Math.PI/100, new Cubets.Vec3(1,0.1,1))
  }, 10)
</script>
```

Ref.
----

- https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2
- https://webglfundamentals.org/webgl/lessons/ja/