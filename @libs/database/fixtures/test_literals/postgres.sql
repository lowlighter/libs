-- quoted(value: string): {literal: string; value: string}
SELECT E'it\'s {not_a_binding}' AS literal, ${value}::text AS value /* outer /* nested */ comment */;

-- dollars(): {literal: string}
SELECT $body$ ${not_a_binding} $body$ AS literal;
