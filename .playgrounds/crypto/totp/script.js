(async function () {
  await llibs.forms.setup()

  /** Regenerate OTP secret */
  async function regenerate() {
    document.querySelector('[name=secret]').innerText = await fetch('/api/crypto/totp/secret').then(r => r.json())
    await update()
  }
  document.querySelector('button[name=regenerate]').addEventListener('click', regenerate)

  /** Regenerate QR Code */
  function update() {
    const data = {
      secret: document.querySelector('[name=secret]').innerText,
      issuer: document.querySelector('[name=issuer]').value,
      account: document.querySelector('[name=account]').value,
      image: document.querySelector('[name=image]').value,
      t: Date.now()
    }
    document.querySelector('img').src = `/api/crypto/totp/qrcode?${new URLSearchParams(data).toString()}`
  }
  update()
  document.querySelector("button[name=update]").addEventListener("click", update)

  /** Get OTP */
  async function totp() {
    const data = {
      secret: document.querySelector('[name=secret]').innerText,
      t: Date.now()
    }
    const value = await fetch(`/api/crypto/totp/get?${new URLSearchParams(data).toString()}`).then(r => r.json())
    document.querySelector('[name=totp]').innerText = value
    document.querySelector('time').innerText = new Date()
  }
  totp()
  setInterval(totp, 5 * 1000)

  /** Verify OTP */
  async function verify() {
    const data = {
      secret: document.querySelector('[name=secret]').innerText,
      token: document.querySelector('[name=totp_verify]').value,
      tolerance: document.querySelector('[name=tolerance]').value,
      t: Date.now()
    }
    const value = await fetch(`/api/crypto/totp/verify?${new URLSearchParams(data).toString()}`).then(r => r.json())
    document.querySelector('output.verify').innerText = value ? "Valid" : "Invalid"
    document.querySelector('output.verify').classList.toggle("success", value === true)
    document.querySelector('output.verify').classList.toggle("danger", value === false)
  }
  document.querySelector("button[name=verify]").addEventListener("click", verify)

})()
