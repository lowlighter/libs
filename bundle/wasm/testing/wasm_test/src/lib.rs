use wasm_bindgen::prelude::*;
use web_sys::console;

// Say hello.
#[wasm_bindgen]
pub fn hello() {
    console::log_1(&"Hello, world!".into());
}
