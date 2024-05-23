use wasm_bindgen::prelude::*;
use quick_xml::Reader;
use quick_xml::events::Event;
use quick_xml::events::attributes::Attributes;
use web_sys::js_sys::{Array, Uint8Array};
use std::io::{Read, Result};
use std::io::BufReader;
use web_sys::console;

// Token types.
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

// Tokenize XML document.
#[wasm_bindgen]
pub fn tokenize(data: JSReader, html: Option<bool>) -> JsValue {
    //let data_vec = data.to_vec();
    let js_reader = BufReader::new(data);
    let mut reader = Reader::from_reader(js_reader);
    reader.check_comments(true).check_end_names(true);
    let mut buf = Vec::new();
    let tokens = Array::new();
    let mut depth = 0;
    let mut preserve = 0;
    loop {
        match reader.read_event_into(&mut buf) {
            Err(e) => {
                let error = format!("Error at position {}: {:?}", reader.buffer_position(), e);
                add_token(&tokens, Token::Error, &error, None);
                break;
            },
            Ok(Event::Decl(ref e)) => add_token(&tokens, Token::XMLDeclaration, &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::DocType(ref e)) => add_token(&tokens, Token::XMLDoctype, &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::PI(ref e)) => add_token(&tokens, Token::XMLInstruction, &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Start(ref e)) => {
                add_token(&tokens, Token::TagOpen, &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
                let attributes = if html.unwrap_or(true) { e.html_attributes() } else { e.attributes() };
                add_attributes(&tokens, &reader, attributes);
                depth += 1;
                if let Ok(Some(attr)) = e.try_get_attribute("xml:space") {
                    if let Ok(value) = std::str::from_utf8(&attr.value) {
                        if value == "preserve" {
                        preserve = depth;
                    }
                }
                };
            },
            Ok(Event::Empty(ref e)) => {
                add_token(&tokens, Token::TagOpen, &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
                let attributes = if html.unwrap_or(true) { e.html_attributes() } else { e.attributes() };
                add_attributes(&tokens, &reader, attributes);
                add_token(&tokens, Token::TagClose, &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
            },
            Ok(Event::End(ref e)) => {
                add_token(&tokens, Token::TagClose, &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
                depth -= 1;
            },
            Ok(Event::Text(ref e)) => {
                if depth > 0 {
                    let text = &reader.decoder().decode(e).unwrap();
                    if preserve > 0 && text.trim().is_empty() {
                        continue;
                    }
                    add_token(&tokens, Token::Text, text, None);
                }
            },
            Ok(Event::CData(ref e)) => add_token(&tokens, Token::CData, &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Comment(ref e)) => add_token(&tokens, Token::Comment, &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Eof) => break,
        }
        buf.clear();
    }
    JsValue::from(tokens)
}

// Add token.
fn add_token(tokens: &Array, id:Token, value:&str, detail:Option<&str>) {
    let token = Array::new();
    token.push(&JsValue::from(id));
    token.push(&JsValue::from_str(value));
    if let Some(detail) = detail {
        token.push(&JsValue::from_str(detail));
    }
    tokens.push(&token);
}

// Add attributes tokens.
fn add_attributes(tokens: &Array, reader: &Reader<BufReader<JSReader>>, attrs: Attributes) {
    for _attr in attrs {
        let attr = _attr.unwrap();
        let key = reader.decoder().decode(attr.key.as_ref()).unwrap();
        let value = reader.decoder().decode(&attr.value).unwrap();
        add_token(tokens, Token::TagAttribute, &key, Some(&value));
    }
}


#[wasm_bindgen]
pub struct JSReader {
    data: Uint8Array,
    position: usize,
}

#[wasm_bindgen]
impl JSReader {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Uint8Array) -> JSReader {
        JSReader {
            data,
            position: 0,
        }
    }
}

impl Read for JSReader {
    fn read(&mut self, buf: &mut [u8]) -> Result<usize> {
        let len = std::cmp::min(buf.len(), self.data.length() as usize - self.position);
        for i in 0..len {
            buf[i] = self.data.get_index((self.position + i) as u32) as u8;
        }
        self.position += len;
        Ok(len)
    }
}