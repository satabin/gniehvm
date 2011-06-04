Array.prototype.filter = function(pred/*: 'a -> boolean*/) {
  var result = [];
  for(var i in this) {
    if(pred(this[i])) {
      result += this[i];
    }
  }
  return result;
}
