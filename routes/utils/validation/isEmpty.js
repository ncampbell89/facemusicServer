// undefined: value not defined, null: nothing is there
const isEmpty = value => 
    value == undefined ||
    value == null ||
    // If the keys and value of the object is empty
    (typeof value == "object" && Object.keys(value).length === 0) ||

    // If the value of the string is empty with or without whitespace
    (typeof value == "string" && value.trim().length === 0);

module.exports = isEmpty;