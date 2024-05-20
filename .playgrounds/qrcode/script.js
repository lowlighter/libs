(function () {
  llibs.forms.setup()

  /** Generate QR Code */
  function generate() {
    const t = Date.now()
    const url = `/api/qrcode/get?${new URLSearchParams({content:this.value, t}).toString()}`
    document.querySelector('img').src = url
  }
  document.querySelector("[name=content]").addEventListener("keydown", generate)
  generate()
})()