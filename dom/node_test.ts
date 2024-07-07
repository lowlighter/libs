import { expect, test } from "@libs/testing"
import { internal } from "./_.ts"
import { Element } from "./element.ts"

for (
  const [property, value] of [
    ["ELEMENT_NODE", 1],
    ["ATTRIBUTE_NODE", 2],
    ["TEXT_NODE", 3],
    ["CDATA_SECTION_NODE", 4],
    ["ENTITY_REFERENCE_NODE", 5],
    ["ENTITY_NODE", 6],
    ["PROCESSING_INSTRUCTION_NODE", 7],
    ["COMMENT_NODE", 8],
    ["DOCUMENT_NODE", 9],
    ["DOCUMENT_TYPE_NODE", 10],
    ["DOCUMENT_FRAGMENT_NODE", 11],
    ["NOTATION_NODE", 12],
    ["DOCUMENT_POSITION_DISCONNECTED", 1],
    ["DOCUMENT_POSITION_PRECEDING", 2],
    ["DOCUMENT_POSITION_FOLLOWING", 4],
    ["DOCUMENT_POSITION_CONTAINS", 8],
    ["DOCUMENT_POSITION_CONTAINED_BY", 16],
    ["DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 32],
  ] as const
) {
  test()(`Document.${property} is supported`, () => {
    const element = new Element({ [internal]: true })
    expect(element).toHaveProperty(property, value)
    expect(element).toHaveImmutableProperty(property)
    expect(Element).toHaveProperty(property, value)
    expect(Element).toHaveImmutableProperty(property)
  })
}
