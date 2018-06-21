/**
 * Returns the keys of a path
 *
 * @param   {string} path   a/path/like.this
 * @returns {array} with keys
 */
function getKeysFromPath (path) {
  if (!path) return []
  return path.match(/\w+/g)
}
export { getKeysFromPath }
