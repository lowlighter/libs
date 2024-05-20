(async function () {
  await llibs.forms.setup({menu:execute, editor:true})

  /** Execute XML action */
  async function execute() {
    const action = document.querySelector("menu li.selected").dataset.for
    const endpoint = `/api/xml/${action}`
    const language = {parse:"json", stringify:"xml"}[action] ?? "text"
    const body = document.querySelector(`.${action} textarea`).value
    const content = await fetch(endpoint, { method: 'POST', body }).then(response => response.text())
    document.querySelector('#output').innerHTML = hljs.highlight(content, { language }).value
    return content
  }
})()