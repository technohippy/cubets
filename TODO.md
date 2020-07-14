# TODO

## Enhancement

- multi lights
- postprocessing
- load 3d objects (.json)
- Skybox
- group geometries
- particle system
- picker
- BumpMap
- drop shadow
- add some geometries
  - axis
  - plane
- PBR
- Stencil Buffer
- vertex color 
- VR mode
  - 樽型変形: postprocessing
  - viewportを指定して2視点出力
- Animation
- Gouraud Scene追加
- multi textures for one mesh

## Bugs

## Refactoring

- glmatrixの型定義？
- importから.jsを除けない？
  - //@ts-ignoreも
- sourcemap
- reduce draw calls

# DONE

- organize files with subdirecories
- Texture
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