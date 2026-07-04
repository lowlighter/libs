;(async function () {
  await llibs.forms.setup()

  /** Derive encryption key */
  async function derive() {
    const data = {
      seed: document.querySelector("[name=seed]").value,
      salt: document.querySelector("[name=salt]").value,
    }
    const key = await fetch(`/api/crypto/encryption/key?${new URLSearchParams(data).toString()}`).then((r) => r.json())
    document.querySelector("[name=key]").innerText = key
  }
  document.querySelector("button[name=derive]").addEventListener("click", derive)
  await derive()

  /** Encrypt message */
  async function encrypt() {
    const body = {
      message: document.querySelector("[name=message]").value,
      key: document.querySelector("[name=key]").innerText,
    }
    const encrypted = await fetch("/api/crypto/encryption/encrypt", { method: "POST", body: JSON.stringify(body) }).then((r) => r.json())
    document.querySelector("[name=encrypted]").innerText = encrypted
    document.querySelector("[name=decrypt_message]").value = encrypted
  }
  document.querySelector("button[name=encrypt]").addEventListener("click", encrypt)

  /** Decrypt message */
  async function decrypt() {
    const body = {
      message: document.querySelector("[name=decrypt_message]").value,
      key: document.querySelector("[name=key]").innerText,
    }
    const response = await fetch("/api/crypto/encryption/decrypt", { method: "POST", body: JSON.stringify(body) })
    const output = document.querySelector("[name=decrypted]")
    output.innerText = response.ok ? await response.json() : `Decryption failed: ${await response.text()}`
    output.classList.toggle("success", response.ok)
    output.classList.toggle("danger", !response.ok)
  }
  document.querySelector("button[name=decrypt]").addEventListener("click", decrypt)
})()
