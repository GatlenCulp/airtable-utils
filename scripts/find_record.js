/*
Author: Gatlen Culp
Last Edited: 2023 October 26
Title: findRecords(string_to_match, from_table, from_field)
Description: Given a string to match and a table + field to search for a match, it returns a list of matching record ids.
Link (check for updates): https://github.com/GatlenCulp/airtable-utils/blob/main/scripts/find_record.js
*/

class Utils {
  static assert(condition, message="Assertion failed") {
     if (!condition) {
        throw new Error(message);
     }
  }

  static assertType(value, type_str) {
     let passes = false;
     switch(type_str) {
        case "string":
           passes = (typeof(value) === 'string' || value instanceof String);
           break;
        case "number":
           passes = typeof(value) === "number"
           break;
        default:
           throw new Error(`Type ${type_str} not supported in assertType`);
     }
     
     if (!passes) {
        throw new Error(`Expected value of type ${type_str}, instead got ${typeof(value)}`);
     }
  }

  static getInputs() {
     let inputConfig = input.config();
     for (let [key, value] of Object.entries(inputConfig)) {
        if (value == "") {
           inputConfig[key] = undefined;
           continue;
        };

        if (!isNaN(value)) {
           inputConfig[key] = Number(value);
           continue
        };

        inputConfig[key] = value;
        
     }
     console.log(inputConfig)
     return inputConfig
  }
};

async function findRecords(s2m, table_name, field_name) {
 // Get records
 let table = base.getTable(table_name);
 let records = await table.selectRecordsAsync({});
 records = records.records;

 // Match records
 let matching_records = records.map(
     (record) => {
       return s2m == record.getCellValue(field_name) ? record.id : null;
     }
   )
   .filter((value) => value);
 
 if (matching_records == {}) console.log(`No matches in ${table_name} > ${field_name} for ${s2m}`)
 return matching_records
}

let inputConfig = Utils.getInputs();
let matching_records = await findRecords(
 inputConfig["string_to_match"],
 inputConfig["from_table"],
 inputConfig["from_field"],
);
console.log(matching_records);
output.set('matching_records', matching_records);