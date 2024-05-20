(async function () {
  await llibs.forms.setup({editor:true})

  /** Bundle TypeScript */
  async function bundle() {
    const body = JSON.stringify({
      code: document.querySelector("[name=code]").value,
      minify: document.querySelector("[name=minify]").value,
      banner: document.querySelector("[name=banner]").value,
      debug: document.querySelector("[name=debug]").checked,
      shadow: document.querySelector("[name=shadow]").checked,
    })
    const content = await fetch("/api/bundle/ts/bundle", { method: "POST", body }).then(response => response.text())
    document.querySelector("output").innerHTML = hljs.highlight(content, { language: "typescript" }).value
  }
  document.querySelector("form").addEventListener("submit", bundle)
})()