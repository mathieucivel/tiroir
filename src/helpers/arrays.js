/**
 * Modify a source array with the elements given in a target array
 *
 * @param  {Array} source - Source array
 *
 * @param  {Array} target - Target array
 *
 * @param  {Function} [update] - Update function called for each source element that
 * can be updated with elements from the target array. Parameters are the source
 * element, the target element, and their corresponding index. Value returned will
 * replace the coresponding slot in the source array. If this function is not
 * provided, shallow copy of target elements will replace source elements.
 *
 * @param  {Function} [add] - Called once with a shallow copy of the target elements
 * that can be added to the source array (when target.length > source.length),
 * if an array is returned, it will be concatened to the source array.
 * By default, or if a non-array value is returned, target elements will be added to
 * the source array.
 *
 * @param  {Function} [remove] - Called once with a shallow copy of elements to be
 * removed from the source array (when target.length < source.length).
 * Those elements are allready removed from the source array when this method is called.
 * If an array is returned, it will be concatened to the spliced source array.
 *
 * @return {Array} source array reference
 */
export function arrayMerge({source, target, update, add, remove}) {
  let i;

  //update
  for (i = 0; i < source.length; i++) {
    if (!target[i]) break;
    source[i] = update ? update(source[i], target[i], i) : target[i];
  }

  //add
  if (target.length > i) {
    const items = target.slice(i);
    const append = add ? add(items) : items;
    if (Array.isArray(append)) {
      source.push(...append);
    }
  }

  //remove
  else if (source.length > i) {
    const items = source.splice(i);
    const append = remove ? remove(items) : null;
    if (Array.isArray(append)) {
      source.push(...append);
    }
  }

  return source;
}
