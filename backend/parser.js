/**
 * SQL Parser that handles multiple dialects: MySQL, PostgreSQL, MSSQL, Oracle, MariaDB
 */
function parseSQLSchema(schemaRaw, dbType) {
    const results = [];
    
    // Normalize line endings
    const normalizedRaw = schemaRaw.replace(/\r\n/g, '\n');

    // 1. Match CREATE TABLE blocks
    // This regex looks for CREATE TABLE followed by table name and opening parenthesis, 
    // then captures everything until the closing parenthesis followed by a semicolon or end of line.
    // Handles `table`, "table", [table], or table
    const tableRegex = /CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:[`"\[]?(\w+)[`"\]]?|(\w+))\s*\(([\s\S]*?)\)(?:\s*ENGINE\s*=\s*\w+)?\s*(?:;|\n|$)/gi;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(normalizedRaw)) !== null) {
        const tableName = tableMatch[1] || tableMatch[2];
        const columnsBlock = tableMatch[3];
        const lines = columnsBlock.split('\n');

        lines.forEach(line => {
            line = line.trim();
            
            // Remove trailing comma if present
            line = line.replace(/,$/, '');

            // Skip empty lines or constraints/indexes/keys
            const upperLine = line.toUpperCase();
            if (!line || 
                upperLine.startsWith('PRIMARY KEY') || 
                upperLine.startsWith('UNIQUE KEY') || 
                upperLine.startsWith('KEY') || 
                upperLine.startsWith('CONSTRAINT') ||
                upperLine.startsWith('FOREIGN KEY') ||
                upperLine.startsWith('INDEX') ||
                upperLine.startsWith('CHECK') ||
                upperLine.startsWith('UNIQUE') ||
                upperLine.startsWith('FULLTEXT') ||
                upperLine.startsWith('SPATIAL')) {
                return;
            }

            // 2. Match column definitions
            // Look for `col`, "col", [col], or col followed by datatype
            // Regex: match identifier (quoted or not) followed by space and then datatype
            const columnMatch = line.match(/^(?:[`"\[]?(\w+)[`"\]]?|(\w+))\s+([a-zA-Z0-9()]+)/i);

            if (columnMatch) {
                const columnName = columnMatch[1] || columnMatch[2];
                let datatype = columnMatch[3].trim().toLowerCase();

                // Simple check for things that might have been accidentally captured as datatype
                if (['not', 'null', 'default', 'primary', 'unique', 'auto_increment'].includes(datatype)) {
                    return;
                }

                results.push({
                    table: tableName,
                    column: columnName,
                    datatype: datatype
                });
            }
        });
    }

    return results;
}

function parseJSONSchema(schemaRaw) {
    try {
        const parsed = JSON.parse(schemaRaw);
        const results = [];

        // Support both { table: '', columns: [] } and [{ table, column, datatype }]
        if (Array.isArray(parsed)) {
            return parsed.map(item => ({
                table: item.table || 'unknown',
                column: item.column || item.name || '',
                datatype: item.datatype || item.type || 'unknown'
            }));
        }

        if (parsed.table && Array.isArray(parsed.columns)) {
            parsed.columns.forEach(col => {
                results.push({
                    table: parsed.table,
                    column: col.name || col.column,
                    datatype: col.type || col.datatype
                });
            });
        }
        return results;
    } catch (e) {
        return [];
    }
}

function parseCSVSchema(schemaRaw) {
    const lines = schemaRaw.trim().split('\n');
    if (lines.length < 2) return [];

    return lines.slice(1).map(line => {
        const [table, column, datatype] = line.split(',').map(s => s.trim());
        return {
            table: table || 'unknown',
            column: column || '',
            datatype: datatype || 'unknown'
        };
    });
}

/**
 * Main entry point for parsing schema
 * @param {string} schemaRaw 
 * @param {string} dbType - MySQL, PostgreSQL, MSSQL, Oracle, MariaDB
 */
function parseSchema(schemaRaw, dbType) {
    if (!schemaRaw) return [];

    const trimmed = schemaRaw.trim();

    // JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return parseJSONSchema(trimmed);
    }

    // SQL (Most common)
    if (trimmed.toLowerCase().includes('create table')) {
        return parseSQLSchema(trimmed, dbType);
    }

    // Fallback to CSV
    if (trimmed.includes(',')) {
        return parseCSVSchema(trimmed);
    }

    return [];
}

module.exports = parseSchema;