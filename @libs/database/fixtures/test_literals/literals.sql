-- quoted(value: string): {literal: string; value: string}
SELECT 'it''s ${not_a_binding}' AS literal, ${value} AS value /* {also_not_a_binding} */;
