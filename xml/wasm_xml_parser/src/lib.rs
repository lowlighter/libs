use quick_xml::events::attributes::Attributes;
use quick_xml::events::Event;
use quick_xml::Reader;
use std::io::BufReader;
use std::io::{Read, Result};
use wasm_bindgen::prelude::*;
use web_sys::js_sys::{Array, Function, Reflect, Uint8Array};

// Token types enum.
#[wasm_bindgen]
#[repr(u8)]
pub enum Token {
    Error = 0,
    XMLDeclaration = 1,
    XMLDoctype = 2,
    XMLInstruction = 3,
    TagOpen = 4,
    TagClose = 5,
    TagAttribute = 6,
    Text = 7,
    CData = 8,
    Comment = 9,
}

// State enum.
#[wasm_bindgen]
#[repr(u8)]
pub enum State {
    ParseAttribute = 1,
}

// Tokenize XML document.
#[wasm_bindgen]
pub fn tokenize(js_reader: JsReader, tokens: Array, states: Array, _html: Option<bool>) {
    let mut depth = 0;
    let mut preserve = 0;
    let mut buf = Vec::new();
    let html = _html.unwrap_or(false);
    let mut reader = Reader::from_reader(BufReader::new(js_reader));
    reader.check_end_names(!html);
    loop {
        match reader.read_event_into(&mut buf) {
            Err(e) => {
                let error = format!("Error at position {}: {:?}", reader.buffer_position(), e);
                add_token(&tokens, Token::Error, &error, None);
                break;
            }
            Ok(Event::Decl(ref e)) => add_token(
                &tokens,
                Token::XMLDeclaration,
                &reader.decoder().decode(e).unwrap(),
                None,
            ),
            Ok(Event::DocType(ref e)) => add_token(
                &tokens,
                Token::XMLDoctype,
                &reader.decoder().decode(e).unwrap(),
                None,
            ),
            Ok(Event::PI(ref e)) => add_token(
                &tokens,
                Token::XMLInstruction,
                &reader.decoder().decode(e).unwrap(),
                None,
            ),
            Ok(Event::Start(ref e)) => {
                add_token(
                    &tokens,
                    Token::TagOpen,
                    &reader.decoder().decode(e.name().as_ref()).unwrap(),
                    None,
                );
                add_state(&states, State::ParseAttribute, reader.buffer_position());
                let attributes = if html {
                    e.html_attributes()
                } else {
                    e.attributes()
                };
                add_attributes(&tokens, &reader, attributes);
                states.pop();
                if let Ok(Some(attr)) = e.try_get_attribute("xml:space") {
                    if let Ok(value) = std::str::from_utf8(&attr.value) {
                        if value == "preserve" {
                            preserve = depth;
                        }
                    }
                };
                depth += 1;
            }
            Ok(Event::Empty(ref e)) => {
                add_token(
                    &tokens,
                    Token::TagOpen,
                    &reader.decoder().decode(e.name().as_ref()).unwrap(),
                    None,
                );
                add_state(&states, State::ParseAttribute, reader.buffer_position());
                let attributes = if html {
                    e.html_attributes()
                } else {
                    e.attributes()
                };
                add_attributes(&tokens, &reader, attributes);
                states.pop();
                add_token(
                    &tokens,
                    Token::TagClose,
                    &reader.decoder().decode(e.name().as_ref()).unwrap(),
                    None,
                );
            }
            Ok(Event::End(ref e)) => {
                add_token(
                    &tokens,
                    Token::TagClose,
                    &reader.decoder().decode(e.name().as_ref()).unwrap(),
                    None,
                );
                depth -= 1;
                if depth == preserve {
                    preserve = 0;
                }
            }
            Ok(Event::Text(ref e)) => {
                if depth == 0 {
                    continue;
                }
                let text = &reader.decoder().decode(e).unwrap();
                if depth > preserve && text.trim().is_empty() {
                    continue;
                }
                add_token(&tokens, Token::Text, text, None);
            }
            Ok(Event::CData(ref e)) => add_token(
                &tokens,
                Token::CData,
                &reader.decoder().decode(e).unwrap(),
                None,
            ),
            Ok(Event::Comment(ref e)) => add_token(
                &tokens,
                Token::Comment,
                &reader.decoder().decode(e).unwrap(),
                None,
            ),
            Ok(Event::Eof) => break,
        }
        buf.clear();
    }
}

// Add token.
fn add_token(tokens: &Array, id: Token, value: &str, detail: Option<&str>) {
    let token = Array::new();
    token.push(&JsValue::from(id));
    token.push(&JsValue::from_str(value));
    if let Some(detail) = detail {
        token.push(&JsValue::from_str(detail));
    }
    tokens.push(&token);
}

// Add attributes tokens.
fn add_attributes(tokens: &Array, reader: &Reader<BufReader<JsReader>>, attrs: Attributes) {
    for _attr in attrs {
        let attr = _attr.unwrap();
        let key = reader.decoder().decode(attr.key.as_ref()).unwrap();
        let value = reader.decoder().decode(&attr.value).unwrap();
        add_token(tokens, Token::TagAttribute, &key, Some(&value));
    }
}

// Add state.
fn add_state(states: &Array, id: State, value: usize) {
    let state = Array::new();
    state.push(&JsValue::from(id));
    state.push(&JsValue::from(value));
    states.push(&state);
}

// JsReader struct.
#[wasm_bindgen]
pub struct JsReader {
    data: Uint8Array,
    position: usize,
    reader: Option<Function>,
}

// JsReader implementation.
#[wasm_bindgen]
impl JsReader {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Uint8Array, reader: Option<Function>) -> JsReader {
        JsReader {
            data,
            position: 0,
            reader,
        }
    }
}

// JsReader read implementation.
impl Read for JsReader {
    fn read(&mut self, buf: &mut [u8]) -> Result<usize> {
        // If a reader is given, use it to read data
        if let Some(reader) = &self.reader {
            let js_buf = Uint8Array::new_with_length(buf.len() as u32);
            let read_sync = Reflect::get(&reader, &"readSync".into())
                .unwrap()
                .dyn_into::<Function>()
                .expect("readSync is not a function");
            let result = read_sync.call1(&reader, &js_buf).unwrap();
            if result.is_null() {
                return Ok(0);
            }
            let len = result.as_f64().unwrap() as usize;
            for i in 0..len {
                buf[i] = js_buf.get_index(i as u32) as u8;
            }
            Ok(len)
        }
        // Else read data directly from the Uint8Array provided
        else {
            let len = std::cmp::min(buf.len(), self.data.length() as usize - self.position);
            for i in 0..len {
                buf[i] = self.data.get_index((self.position + i) as u32) as u8;
            }
            self.position += len;
            Ok(len)
        }
    }
}
