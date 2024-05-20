;(async function () {
  await llibs.forms.setup({ menu: execute })

  /** Compute diff */
  async function execute() {
    const action = document.querySelector("menu li.selected").dataset.for
    const a = document.querySelector("[name=a]").value
    const b = document.querySelector("[name=b]").value
    const c = document.querySelector("[name=c]").value
    const content = await fetch(`/api/diff/${action}`, { method: "POST", body: JSON.stringify({ a, b, c }) }).then((response) => response.text())
    document.querySelector("#output").innerHTML = hljs.highlight(content, { language: "diff" }).value
  }
})()
