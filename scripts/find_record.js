/*
Author: Gatlen Culp
Last Edited: 2023 October 26
Title: find_record(string_to_match, from_table, from_field)
Description: Given a string to match and a table + field to search for a match, it returns a list of matching record ids.
Link (check for updates): https://github.com/GatlenCulp/airtable-utils/blob/main/scripts/find_record.js
*/

// Get config
let inputConfig = input.config();
let s2m = inputConfig.string_to_match;
let table_name = inputConfig.from_table;
let field_name = inputConfig.from_field;

// Get records
let table = base.getTable(table_name);
let records = await table.selectRecordsAsync({});
records = records.records;

function find_record(records, string_to_match, field_name) {
  return records.map(
    (record) => {
      return string_to_match == record.getCellValue(field_name) ? record.id : null;
    }
  )
  .filter((value) => value);
}

// Match records
let matching_records = find_record(records, s2m, field_name);

output.set('matching_records', matching_records);