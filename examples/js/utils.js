function loadCode(url, id) {
  if (!url) url = location.href
  if (!id) id = "code"
  fetch(url).then(resp => resp.text()).then(text => {
    const pre = document.createElement("pre")
    const code = document.createElement("code")
    code.className = "javascript"
    const m1 = text.match(/<script\s+type=["']module["']>(\s+import Cubets from[\s\S]*?)<\/script>/m)
    const source = m1[1]
    code.textContent = source

    pre.append(code)
    document.getElementById(id).append(pre)
  })
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.src = url
  })
}

function loadImages(urls) {
  return Promise.all(urls.map(url => loadImage(url)))
}

function radToDeg(r) { return r * 180 / Math.PI }
function degToRad(d) { return d * Math.PI / 180 }