

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.REACT_APP_AIRTABLE_PAT
});
var base = Airtable.base(process.env.REACT_APP_AIRTABLE_BASE_ID);

async function getRecords(tableName) {
    const records = await base(tableName).select().all()
    return records
}

async function getRecord(tableName, recordId) {
    const record = await base(tableName).find(recordId)
    return record
}

async function findRecord(tableName, recordId) {
    const record = await base(tableName).find(recordId)
    return record
}

async function findRecordByField(tableName, field, searchValue) {
    const records = await base(tableName).select({
        maxRecords: 1,
        filterByFormula: `({${field}} = '${searchValue}')` 
    }).all()
    const record = records[0] ? {
        id: records[0].id,
        fields: records[0].fields
    } : {
        id: null,
        fields: null
    }
    return record
}

async function createRecord(tableName, fields) {
    const record = await base(tableName).create(fields)
    return record
}

async function updateRecord(tableName, recordId, fields) {
    const record = await base(tableName).update(recordId, fields)
    return record
}

async function deleteRecord(tableName, recordId) {
    const record = await base(tableName).destroy(recordId)
    return record
}

export {
    getRecords,
    getRecord,
    findRecord,
    findRecordByField,
    createRecord,
    updateRecord,
    deleteRecord
}