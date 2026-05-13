const { pipeline } = require('@xenova/transformers');
const { DATA_CATALOGUE } = require('./constants');

function getExpectedDatatype(fieldId) {

    const map = {

        email: 'varchar text string',

        mobile_number:
            'varchar bigint numeric string',

        full_name:
            'varchar text string',

        date_of_birth:
            'date datetime timestamp',

        photo:
            'photo image selfie profile picture document scan face image url',

        pan_number:
            'varchar char string',

        aadhaar_number:
            'varchar bigint numeric',

        address:
            'text varchar string',

        bank_account_number:
            'varchar bigint numeric'

    };

    return map[fieldId] || '';

}

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/.*\./, '')
        .replace(/[_-]/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();

}

function cosineSimilarity(a, b) {

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {

        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];

    }

    return dot / (
        Math.sqrt(normA) *
        Math.sqrt(normB)
    );

}

let extractor = null;

async function getExtractor() {

    if (!extractor) {

        console.log(
            'Loading embedding model...'
        );

        extractor = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2'
        );

    }

    return extractor;

}

async function createEmbedding(text) {

    const model =
        await getExtractor();

    const output =
        await model(text, {

            pooling: 'mean',
            normalize: true

        });

    return Array.from(output.data);

}

async function aiMapFields(fields) {

    try {

        // STEP 1 — Precompute catalogue embeddings
        const catalogueEmbeddings = [];

        for (const item of DATA_CATALOGUE) {

            const semanticText = `
${item.field_id}
${item.display_name}
${item.category}

Common datatype:
${getExpectedDatatype(item.field_id)}
`;

            const embedding =
                await createEmbedding(
                    normalizeText(semanticText)
                );

            catalogueEmbeddings.push({

                item,
                embedding

            });

        }

        // STEP 2 — Match fields
        const results = [];

        for (const field of fields) {

            const fieldText =
                normalizeText(`
                ${field.column}
                ${field.datatype}
                `);

            const fieldEmbedding =
                await createEmbedding(fieldText);

            let bestMatch = null;
            let bestScore = -1;

            for (const catalogueItem of catalogueEmbeddings) {

                const score =
                    cosineSimilarity(
                        fieldEmbedding,
                        catalogueItem.embedding
                    );

                if (score > bestScore) {

                    bestScore = score;
                    bestMatch = catalogueItem.item;

                }

            }

            // Convert similarity to confidence
            const confidence =
                Math.round(bestScore * 100);


            results.push({

                column: field.column,

                field_id:
                    bestMatch.field_id,

                display_name:
                    bestMatch.display_name,

                category:
                    bestMatch.category,

                sensitivity:
                    bestMatch.sensitivity,

                confidence,

                reasoning:
                    'AI similarity match'

            });

        }

        return results;

    } catch (error) {

        console.error(
            'Embedding Mapping Error:',
            error.message
        );

        return [];

    }

}

module.exports = aiMapFields;