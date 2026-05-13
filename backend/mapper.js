const aiMapFields = require('./aimap');
const {
    DATA_CATALOGUE,
    SYSTEM_FIELDS,
    FIELD_SYNONYMS
} = require('./constants');

function normalizeFieldName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

function mapSingleField(columnName) {
    const normalized = normalizeFieldName(columnName);

    for (const item of DATA_CATALOGUE) {
        const fieldIdNormalized = normalizeFieldName(item.field_id);

        // Exact match
        if (normalized === fieldIdNormalized) {
            return {
                ...item,
                confidence: 99,
                reasoning: 'Exact field match'
            };
        }

        // Synonym match
        const synonyms = FIELD_SYNONYMS[item.field_id] || [];
        for (const synonym of synonyms) {
            if (normalized === normalizeFieldName(synonym)) {
                return {
                    ...item,
                    confidence: 92,
                    reasoning: 'Similarity match'
                };
            }
        }
    }

    return {
        field_id: 'unknown',
        display_name: 'Unknown',
        category: 'Unknown',
        sensitivity: 'unknown',
        confidence: 20,
        reasoning: 'No mapping found'
    };
}

const SYSTEM_FIELD_SET = new Set(
    SYSTEM_FIELDS.map(normalizeFieldName)
);

function isSystemField(columnName) {
    return SYSTEM_FIELD_SET.has(normalizeFieldName(columnName));
}

async function mapFields(parsedFields) {
    const results = [];
    const unknownFields = [];

    // STEP 1 — Deterministic mapping
    for (const field of parsedFields) {
        // SKIP SYSTEM FIELDS
        if (isSystemField(field.column)) {
            continue;
        }

        const mapping = mapSingleField(field.column);

        // Unknown → queue for AI
        if (mapping.field_id === 'unknown') {
            unknownFields.push(field);
            continue;
        }

        results.push({
            ...field,
            suggested_field_id: mapping.field_id,
            display_name: mapping.display_name,
            category: mapping.category,
            sensitivity: mapping.sensitivity,
            confidence: mapping.confidence,
            reasoning: mapping.reasoning,
            status: 'pending'
        });
    }

    // STEP 2 — AI batch mapping
    if (unknownFields.length > 0) {
        // console.log(`AI mapping ${JSON.stringify(unknownFields)} fields`);
        console.log(`AI mapping ${unknownFields.length} fields`);

        const aiMappings = await aiMapFields(unknownFields);

        aiMappings.forEach(aiMapping => {
            const originalField = unknownFields.find(
                field => field.column === aiMapping.column
            );

            results.push({
                ...originalField,
                suggested_field_id: aiMapping.field_id,
                display_name: aiMapping.display_name,
                category: aiMapping.category,
                sensitivity: aiMapping.sensitivity,
                confidence: aiMapping.confidence,
                reasoning: aiMapping.reasoning,
                status: 'pending'
            });
        });
    }

    return results;
}

module.exports = mapFields;