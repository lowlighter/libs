;(async function () {
  await llibs.forms.setup({ editor: true })

  /** Bundle CSS */
  async function bundle() {
    const body = JSON.stringify({
      code: document.querySelector("[name=code]").value,
      minify: document.querySelector("[name=minify]").checked,
      banner: document.querySelector("[name=banner]").value,
      query: document.querySelector("[name=query]").value,
    })
    const content = await fetch("/api/bundle/css/bundle", { method: "POST", body }).then((response) => response.text())
    document.querySelector("output").innerHTML = hljs.highlight(content, { language: "css" }).value
  }
  document.querySelector("form").addEventListener("submit", bundle)
})()
