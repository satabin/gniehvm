GniehVM = function(options/*: Array[String]*/) {
  this.downloadClassFile = function(url/*: String*/) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);

    buffer = xhr.mozResponseArrayBuffer;
    if(buffer) {
      var parser = new Parser(buffer);
      var clazz = parser.parse();
      alert(clazz.methods);
    }
  }
}

vm = new GniehVM();
vm.downloadClassFile("http://localhost/GTuringCompiler.class");
