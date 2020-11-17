/**
 * Gives the 'toString' type of a value
 *  type();                 //Undefined
 *  type(undefined);        //Undefined
 *  type(null);             //Null
 *  type(NaN);              //Number
 *  type(5);                //Number
 *  type('');               //String
 *  type({});               //Object
 *  type([]);               //Array
 *  type(/a/)               //Regexp
 *  type(new Date())        //Date
 *  type(new Error)         //Error
 *  type(new Map())         //Map
 *  type(new WeakMap())     //Weakmap
 *  type(Promise.resolve()) //Promise
 *  type(new Uint16Array()) //Uint16Array
 *  type(function () {})    //Function
 *  type(async () => 4)     //AsyncFunction
 *  type(function *() {})   //GeneratorFunction
 *
 * @param {*} _value An objet or primitive value
 */
export function type(_value) {
  return ({}).toString.call(_value).split(' ')[1].slice(0, -1);
}

/**
 * Test if the given value is an object (exclude arrays)
 *
 * @param  {*}  o - value to test
 * @return {Boolean} - return true if the value is an object
 */
export function isObject(o) {
  return (!!o) && (o.constructor === Object);
}

/**
 * Test if the given value is an empty object ({})
 *
 * @param  {*}  o - value to test
 * @return {Boolean} - return true if the value is an object
 */
export function isEmptyObject(o) {
  return isObject(o) && Object.keys(o).length === 0
}

/**
 * Test if the given value is numeric
 *
 * @param  {*} n - value to test
 * @return {Boolean} - return true if the value is numeric
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Test if all of the content of the given array are numeric values
 * @param  {Array} a - an array
 * @return {Boolean} - return true if the value is numeric
 */
export function isArrayNumeric(a) {
  for (let value of a) {
    if (!isNumeric(value)) return false;
  }
  return true;
}
