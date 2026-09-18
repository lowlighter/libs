-- search(actor: string): { actor: string }[]
SELECT value AS actor
-- <sqlite>
FROM json_each('["one","two"]')
-- </sqlite>
-- <postgres>
FROM jsonb_array_elements_text('["one","two"]'::jsonb) AS targets(value)
-- </postgres>
WHERE value = ${1}
-- <postgres>
AND '["one","two"]'::jsonb @> jsonb_build_array(CAST(${1} AS TEXT))
-- </postgres>
ORDER BY value;

-- ordered(first: string, second: string): { value: string }
SELECT
--<sqlite>
${1} || ${2}
--</sqlite>
-- <postgres>
CAST(${2} AS TEXT) || CAST(${1} AS TEXT) || CAST(${2} AS TEXT)
-- </postgres>
AS value;

-- common(value: string): { value: string }
SELECT CAST(${1} AS TEXT) AS value;

-- hooked(value: string): { value: string }
-- #trim()
-- @observe()
SELECT
-- <sqlite>
${1}
-- </sqlite>
-- <postgres>
CAST(${1} AS TEXT)
-- </postgres>
AS value;

-- quoted(): { value: string }
SELECT '-- <postgres>
-- </sqlite>' AS value
/* -- <sqlite>
-- </postgres> */;
