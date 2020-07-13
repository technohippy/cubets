= TODO

== Enhancement

- Texture
- BumpMap
- Animation
- postprocessing
- particle system
- drop shadow
- vertex color 
- Gouraud Scene追加
- 複雑なモデルの読み込み
- ジオメトリ追加
  - 座標軸
  - 平面
- PBR
- Stencil Buffer
- VR mode
  - 樽型変形: postprocessing
  - viewportを指定して2視点出力
- Skybox
- group geometries
- multi lights

== Bugs

== Refactoring

- glmatrixの型定義？
- importから.jsを除けない？
  - //@ts-ignoreも
- sourcemap
- organize files with subdirecories
- reduce draw calls

= DONE

- phong shading
- ジオメトリ追加
  - 球
- Wireframe mode
  - シェーディングをOFFに
- viewportの一部に出力
  - cameraで設定
- OrbitControlにzoom追加
- Camera Controls (Orbit)
- implement Light class

= Bug Fix

- Wireframe mode
  - クリックすると回転する？
- 光源の位置が直方体と球で違って見える