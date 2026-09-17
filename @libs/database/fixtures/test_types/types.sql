-- optional(): Optional<{value: string}>
SELECT 'value' AS value WHERE 1=0;

-- voidable(): Voidable<{value: string}>
SELECT 'value' AS value WHERE 1=0;

-- nullable(): Nullable<{value: string}>
SELECT 'value' AS value WHERE 1=0;

-- arrayable(): Arrayable<{value: string}>
SELECT 'value' AS value;

-- promisable(): Promisable<{value: string}>
SELECT 'value' AS value;

-- nonempty(): NonEmptyArray<{value: string}>
SELECT 'value' AS value;

-- nonvoid(): NonVoid<{value: string}[]>
SELECT 'value' AS value;
