# TODO

## Enhancement

- add plane geometry
- postprocessing
- load 3d objects (.json)
- Skybox
- group geometries
- picker
- particle system
- BumpMap
- drop shadow
- add axis geometry
- PBR
- Stencil Buffer
- vertex color 
- VR mode
  - 樽型変形: postprocessing
    - https://jp.mathworks.com/help/images/creating-a-gallery-of-transformed-images.html
  - viewportを指定して2視点出力
- Animation tools
- add Gouraud Scene
- multi textures for one mesh
- add TSDoc comments

## Bugs

## Refactoring

- glmatrix
  - //@ts-ignoreも
- sourcemap
- reduce draw calls

# DONE

- point light
- multi lights
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