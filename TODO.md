# TODO

## Enhancement

- **make tiny applications with cubets**
- add TSDoc comments
- build a website
- **release alpha**
- texture array
- texture properties
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
- ray tracing
- morphing
- heightfield

## Bugs

- 動的環境マップが複数あると一つ真っ白
- check spotlight direction

## Refactoring

- remove TextureType enum
- remove all 'instanceof'
- rollup.jsで一ファイルに纏める
- introduce interfaces
- performance
  - 特にpostprocessingを重ねると劣化
  - 動的環境マップもひどい
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

- fog
  - https://webglfundamentals.org/webgl/lessons/webgl-fog.html
- picker
- particle system
- BumpMap
- load 3d objects (.json)
- add axis geometry
- vertex color 
- group geometries
- reflection environment (using CubeMap)
- Skybox
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

- ライトがひとつもないとエラーになる
- CubeMapを鏡面反射に利用できない
  - ライティングを有効にするかどうかのUniformを追加
  - texturecoordsがおかしい
- Wireframe mode
  - クリックすると回転する？
- 光源の位置が直方体と球で違って見える

## Refactoring

- add rendertarget class
- super class for picker and filter
- renderMesh signature