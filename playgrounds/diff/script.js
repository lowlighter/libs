;(async function () {
  await llibs.forms.setup({ menu: execute })

  /** Compute diff or apply patch */
  async function execute() {
    const action = document.querySelector("menu li.selected").dataset.for
    const a = document.querySelector("[name=a]").value
    const b = document.querySelector("[name=b]").value
    const c = document.querySelector("[name=c]").value
    const body = action === "patch" ? { a, patch: c } : { a, b }
    const response = await fetch(`/api/diff/${action}`, { method: "POST", body: JSON.stringify(body) })
    const content = await response.text()
    const language = response.ok && action === "diff" ? "diff" : "plaintext"
    document.querySelector("#output").innerHTML = hljs.highlight(content, { language }).value
  }
})()
