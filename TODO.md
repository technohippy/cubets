# TODO

## Enhancement

- group geometries
- load 3d objects (.json)
- Skybox
- picker
- BumpMap
- particle system
- **make tiny applications with cubets**
- texture properties
- multi textures for one mesh
- add axis geometry
- vertex color 
- add TSDoc comments
- build a website
- **release alpha**
- drop shadow
- PBR
- Stencil Buffer
- VR mode
  - 樽型変形: postprocessing
    - https://jp.mathworks.com/help/images/creating-a-gallery-of-transformed-images.html
  - viewportを指定して2視点出力
- Animation tools
- add Gouraud Scene (or other scene/shader)
- shader toy
- morphing

## Bugs

- check spotlight direction

## Refactoring

- rollup.jsで一ファイルに纏める
- introduce interfaces
- performance
  - 特にpostprocessingがガクガクする
- glmatrix
  - //@ts-ignoreも
- sourcemap
- reduce draw calls

## Apps

- パーリンノイズによる地形生成
  - fly control
  - firstperson control
  - skybox
  - 時間の変化によるカラーパレット変更
  - 二重テクスチャ
    - 青空と星空
- birdboids
- l-systems

# DONE

## Enhancement

- postprocessing
- add plane geometry
- point light
- multi lights
- organize files with subdirecories
- Texture
- phong shading
- add sphere geometry
- Wireframe mode
- viewport setting
- add zoom function to OrbitControl
- Camera Controls (Orbit)
- implement Light class

## Bug Fix

- Wireframe mode
  - クリックすると回転する？
- 光源の位置が直方体と球で違って見える

## Refactoring

- renderMesh signature