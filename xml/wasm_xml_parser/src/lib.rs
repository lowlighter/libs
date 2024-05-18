use wasm_bindgen::prelude::*;
use quick_xml::Reader;
use quick_xml::events::Event;
use quick_xml::events::attributes::Attributes;
use web_sys::js_sys::{Array, Uint8Array};

// Tokenize XML document.
#[wasm_bindgen]
pub fn tokenize(data: Uint8Array, strict: Option<bool>) -> JsValue {
    let data_vec = data.to_vec();
    let mut reader = Reader::from_reader(data_vec.as_slice());
    if let Some(strict) = strict {
        if strict {
            reader.check_comments(true).check_end_names(true);
        }
    }
    let mut buf = Vec::new();
    let tokens = Array::new();
    loop {
        match reader.read_event_into(&mut buf) {
            Ok(Event::Start(ref e)) => {
                add_token(&tokens, "tag:open", &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
                add_attributes(&tokens, &reader, e.attributes());
            },
            Ok(Event::Empty(ref e)) => {
                add_token(&tokens, "tag:open", &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
                add_attributes(&tokens, &reader, e.attributes());
                add_token(&tokens, "tag:close", &reader.decoder().decode(e.name().as_ref()).unwrap(), None);
            },
            Ok(Event::End(ref e)) => add_token(&tokens, "tag:close", &reader.decoder().decode(e.name().as_ref()).unwrap(), None),
            Ok(Event::Text(ref e)) => add_token(&tokens, "text", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::CData(ref e)) => add_token(&tokens, "cdata", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Comment(ref e)) => add_token(&tokens, "comment", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Decl(ref e)) => add_token(&tokens, "xml:declaration", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::PI(ref e)) => add_token(&tokens, "xml:instruction", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::DocType(ref e)) => add_token(&tokens, "xml:doctype", &reader.decoder().decode(e).unwrap(), None),
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at position {}: {:?}", reader.buffer_position(), e),
        }
        buf.clear();
    }
    JsValue::from(tokens)
}

// Add token.
fn add_token(tokens: &Array, name: &str, value:&str, detail:Option<&str>) {
    let token = Array::new();
    token.push(&JsValue::from_str(name));
    token.push(&JsValue::from_str(value));
    if let Some(detail) = detail {
        token.push(&JsValue::from_str(detail));
    }
    tokens.push(&token);
}

// Add attributes tokens.
fn add_attributes(tokens: &Array, reader: &Reader<&[u8]>, attrs: Attributes) {
    for _attr in attrs {
        let attr = _attr.unwrap();
        let key = reader.decoder().decode(attr.key.as_ref()).unwrap();
        let value = reader.decoder().decode(&attr.value).unwrap();
        add_token(tokens, "tag:attribute", &key, Some(&value));
    }
}

