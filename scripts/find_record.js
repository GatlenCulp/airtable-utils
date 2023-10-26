/*
Author: Gatlen Culp
Title: find_record.js
Description: Given a string to match and a table + field to search for a match, it returns a list of matching record ids.
Link to scripts: https://drive.google.com/file/d/1XgnyLVEfYij1sqPnilKnmHXtTypFpt0x/view?usp=sharing
*/

let inputConfig = input.config();
let s2m = inputConfig.string_to_match;
let table_name = inputConfig.from_table;
let field_name = inputConfig.from_field;

// Get records
let table = base.getTable(table_name);
console.log(`Table fields: `, table.fields);
let records = await table.selectRecordsAsync({});
records = records.records;

console.log(`All records found at ${table_name}:`, records);
console.log(`Test of first record's field ${field_name}: `, records[0].getCellValue(field_name));

// Match records
let matching_records = records.map(
  (record) => {
    return s2m == record.getCellValue(field_name) ? record.id : null;
  }
)
.filter((value) => value);

console.log(matching_records);

output.set('matching_records', matching_records);

