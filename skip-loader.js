// Just like null-loader, but returns empty string when requried (useful
// for skipping CSS urls).
module.exports = function() {
  this.cacheable();
  return "module.exports='';";
}
