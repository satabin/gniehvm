throwException = function(frame/*: Frame*/, class_name/*: String*/) {
  // TODO construct the call stack for the current frame and throws the exception
  // of the given name
  var cl = frame.classloader;
  cl.loadClass(class_name);
  var clazz = cl.classes[class_name];
  var exc = clazz.newInstance();
}

NoClassDefFoundError = function(name) {
  this.name = name;
  this.toString = function() {
    return "Class not found " + name;
  }
}
