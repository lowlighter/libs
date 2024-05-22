globalThis.llibs = {
  forms: {
    /** Setup forms */
    async setup({ menu = false, deno = false, editor = false } = {}) {
      if (deno) {
        await llibs.deno.setup(deno)
      }
      if (editor || deno) {
        await llibs.editor(editor)
      }
      document.querySelectorAll("form").forEach((element) => {
        element.addEventListener("submit", (event) => event.preventDefault())
        element.querySelectorAll("button[type=submit]").forEach((button) => button.removeAttribute("disabled"))
      })
      if (menu) {
        await llibs.menu.setup(menu)
      }
    },
  },
  menu: {
    /** Setup menus */
    async setup(execute) {
      const actions = Array.from(document.querySelectorAll("menu li[data-for]")).map((element) => element.dataset.for)
      async function menu(action = actions[0]) {
        document.querySelectorAll("menu li[data-for]").forEach((element) => element.classList.remove("selected"))
        document.querySelector(`menu li[data-for="${action}"]`).classList.add("selected")
        document.querySelectorAll(actions.map((action) => `.${action}`).join(",")).forEach((element) => element.style.display = "none")
        document.querySelector(`.${action}`).style.display = "block"
        await execute()
      }
      document.querySelectorAll("menu li[data-for]").forEach((element) =>
        !element.classList.contains("disabled")
          ? element.addEventListener("click", function () {
            menu(this.dataset.for)
          })
          : null
      )
      document.querySelector("form").addEventListener("submit", execute)
      await menu()
    },
  },
  deno: {
    /** Setup deno environment */
    async setup(placeholder = "") {
      const html = await fetch("/.partial/deno.html").then((response) => response.text())
      const div = document.createElement("div")
      div.innerHTML = html
      for (const element of Array.from(div.children)) {
        document.querySelector("main").appendChild(element)
      }
      document.querySelector("form").addEventListener("submit", async function () {
        const body = document.querySelector("[name=content]").value
        const result = await fetch("/api/deno/run", { method: "POST", body }).then((response) => response.json())
        for (const name in result) {
          switch (name) {
            case "duration":
              document.querySelector(`#${name}`).innerText = Number(result[name] / 1000).toFixed(3)
              break
            case "code":
              document.querySelector(`#${name}`).innerText = result[name]
              break
            case "stdout":
            case "stderr":
              // deno-lint-ignore no-control-regex
              document.querySelector(`#${name}`).innerHTML = result[name].replace(/\x1b\[(?<code>\d+)m(?<content>.*?)\[39m/g, (_, code, content) => {
                const color = { 30: "black", 31: "red", 32: "green", 33: "yellow", 34: "blue", 35: "magenta", 36: "cyan", 37: "white" }[code]
                return color ? `<span style="color:${color}">${content}</span>` : content
              })
              break
          }
        }
      })
      document.querySelector("[name=content]").value = placeholder.trim()
    },
  },
  /** Setup code editors */
  async editor() {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
    document.head.appendChild(script)
    await new Promise((resolve) => script.onload = resolve)
    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "https://matcha.mizu.sh/styles/@code-editor/mod.css"
    document.head.appendChild(style)
    document.querySelectorAll(".editor").forEach((element) => {
      const textarea = element.querySelector("textarea")
      const highlight = element.querySelector(".highlight")
      textarea.addEventListener("input", () => coloration(textarea.value))
      textarea.addEventListener("scroll", function () {
        highlight.scrollTop = this.scrollTop
        highlight.scrollLeft = this.scrollLeft
      })
      function coloration(value, escape = false) {
        if (escape) {
          value = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        }
        highlight.innerHTML = hljs.highlight(value, { language: highlight.dataset.lang || "typescript" }).value
      }
      coloration(textarea.value)
    })
  },
}
;(async function () {
  // Inject partials
  const parts = {}
  await Promise.all(["header", "footer", "aside"].map((part) => fetch(`/.partial/${part}.html`).then((response) => response.text().then((text) => parts[part] = text))))
  document.body.innerHTML = `${parts.header}${parts.aside}${document.body.innerHTML}${parts.footer}`

  // Update title and navigation
  const url = new URL(globalThis.location.href)
  document.querySelector("header h1").innerText += url.pathname
  document.title = `Playground | @libs/${url.pathname}`
  document.querySelectorAll(`aside a[href="${url.pathname}"]`).forEach((element) => {
    let parent = element.parentElement
    while (parent.tagName === "LI") {
      parent.classList.add("selected")
      parent = parent.parentElement.parentElement
    }
  })

  // Include scripts
  for (const element of document.querySelectorAll("script[data-src]")) {
    const script = document.createElement("script")
    script.src = element.dataset.src
    element.replaceWith(script)
    await new Promise((resolve) => script.onload = resolve)
  }
})()
