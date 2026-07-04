;(function () {
  llibs.forms.setup()

  /** Generate QR Code */
  function generate() {
    const content = document.querySelector("[name=content]").value
    const format = document.querySelector("[name=format]").value
    document.querySelector("img").src = `/api/qrcode/get?${new URLSearchParams({ content, format, t: Date.now() }).toString()}`
  }
  document.querySelector("[name=content]").addEventListener("input", generate)
  document.querySelector("[name=format]").addEventListener("change", generate)
  generate()
})()
