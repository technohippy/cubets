Cubets
====

just for my learning purpose

```html
<canvas id="cubets" width="600" height="400"></canvas>
<script type="module">
  import Cubets from "../dist/cubets.js"

  const scene = new Cubets.Scene()

  const light = new Cubets.Scene.Light(
    new Cubets.Vec3(0.2, 0.3, -1),
    new Cubets.Color(0.3, 0.3, 0.3),
    new Cubets.Color(0.8, 0.8, 0.8)
  )

  const mesh = new Cubets.Mesh(
    new Cubets.CubeGeometry(10, 10, 10),
    new Cubets.Scene.Material(),
  )

  scene.add(mesh)
  scene.add(light)

  const camera = new Cubets.PerspectiveCamera("cubets", Math.PI/4, 0.1, 100)
  camera.position.z = 20
  camera.addControl(new Cubets.OrbitCameraControl())
  camera.start(scene)
</script>
```

Run Examples
----

```
$ npm install
$ npm run dev
$ open http://localhost:3001/examples/
```

Ref.
----

- https://github.com/PacktPublishing/Real-Time-3D-Graphics-with-WebGL-2
- https://webglfundamentals.org/webgl/lessons/ja/