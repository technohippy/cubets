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