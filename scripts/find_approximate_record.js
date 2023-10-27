/*
Author: Gatlen Culp
Last Edited: 2023 October 26th
Title: find_approximate_record
Description: Given a string to match and a table + field to search for a match, it returns the single closest record_id.
Link (check for updates):
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

function levenshteinDistance (str1 = '', str2 = '') {
   const track = Array(str2.length + 1).fill(null).map(() =>
   Array(str1.length + 1).fill(null));
   for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
   }
   for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
   }
   for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
         track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
         );
      }
   }
   return track[str2.length][str1.length];
};

async function find_approximate_record(string_to_match, table_str, field_str, distance_threshold=4) {
   Utils.assertType(string_to_match, "string");
   Utils.assertType(table_str, "string");
   Utils.assertType(field_str, "string");
   Utils.assertType(distance_threshold, "number");

   let table = base.getTable(table_str);
   let records = await table.selectRecordsAsync({});
   records = records["records"]
   let dist_by_id = {};
   for (let record of records) {
      let [id, name, field_to_check] = [record.id, record.name, record.getCellValue(field_str)]
      dist_by_id[id] = {field_to_check: field_to_check, name: name, distance: levenshteinDistance(string_to_match, field_to_check ? field_to_check : "")};
   };

   console.log(`Distances: `, dist_by_id);

   let closest_record_id = Object.entries(dist_by_id).reduce(
      (min, [id, match_info]) => match_info["distance"] < dist_by_id[min]["distance"] ? id : min, 
      Object.keys(dist_by_id)[0]
   )

   let closest_record = {
      id: closest_record_id,
      name: dist_by_id[closest_record_id]["name"],
      field_to_check: dist_by_id[closest_record_id]["field_to_check"],
      distance: dist_by_id[closest_record_id]["distance"]
   }

   console.log(`Closest record: `, closest_record)

   return closest_record
};

let inputConfig = Utils.getInputs();

let closest_record = await find_approximate_record(
   inputConfig["string_to_match"],
   inputConfig["from_table"],
   inputConfig["from_field"],
   inputConfig["distance_threshold (optional)"]
);

output.set("closest_record", closest_record);