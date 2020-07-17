# TODO

## Enhancement

- add design doc
- learn typescript
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
- **release alpha**
  - build a website
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

## Bugs

- check spotlight direction

## Refactoring

- renderMesh signature
- performance
  - 特にpostprocessingがガクガクする
- glmatrix
  - //@ts-ignoreも
- sourcemap
- reduce draw calls

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