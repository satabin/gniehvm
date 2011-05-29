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

decompile = function(url/*: String*/) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  if(xhr.status == 200) {
    // ok found and downloaded
    var parser = new Parser(xhr.mozResponseArrayBuffer);
    var clazz = parser.parse();
    var flags = clazz.access_flags;
    document.write(flags_to_string(flags));
    if(flags & ACC_INTERFACE) {
      document.write('interface ');
    } else {
      document.write('class ');
    }
    var constants = clazz.constants;
    document.write(constants[constants[clazz.this_class - 1].name_index - 1].value + '<br />');
    // extended class
    if(clazz.super_class != 0) {
      document.write('extends ' + constants[constants[clazz.super_class - 1].name_index - 1].value + '<br />');
    }
    // implemented interfaces
    if(clazz.interfaces.length > 0) {
      document.write('implements ');
      for(var i in clazz.interfaces) {
        document.write(constants[clazz.interfaces[i] - 1].value + ', ');
      }
      document.write('<br />');
    }
    // fields
    document.write('Fields:<br />');
    var fields = clazz.fields;
    for(var i in fields) {
      var field = fields[i];
      attributes_to_string(field.attributes);
      flags_to_string(field.access_flags);
      document.write(field.descriptor + ' ' + field.name + '<br />');
    }
    // the methods
    document.write('Methods:<br />');
    var methods = clazz.methods;
    for(var i in methods) {
      var method = methods[i];

    }
  } else {
    document.write(xhr.status + " -&gt; " + xhr.responseText);
  }
}

flags_to_string = function(flags/*: int*/) {
    if(flags & ACC_PUBLIC) {
      document.write('public ');
    }
    if(flags & ACC_FINAL) {
      document.write('final ');
    }
    if(flags & ACC_SUPER) {
      document.write('super ');
    }
    if(flags & ACC_ABSTRACT) {
      document.write('abstract ');
    }
    if(flags & ACC_PRIVATE) {
      document.write('private ');
    }
    if(flags & ACC_PROTECTED) {
      document.write('protected ');
    }
    if(flags & ACC_STATIC) {
      document.write('static ');
    }
    if(flags & ACC_VOLATILE) {
      document.write('volatile ');
    }
    if(flags & ACC_TRANSIENT) {
      document.write('transient ');
    }
}

bytes_to_float = function(bits/*: int*/) {
  if(bits == 0x7f800000) {
    return '+Infinity';
  } else if(bits == 0xff800000) {
    return '-Infinity';
  } else if((bits >= 0x7f800001 && bits <= 0x7fffffff)
            || (bits >= 0xff800001 && bits <= 0xffffffff)) {
    return 'NaN';
  } else {
    var s = ((bits >> 31) == 0) ? 1 : -1;
    var e = ((bits >> 23) & 0xff);
    var m = (e == 0) ?
              (bits & 0x7fffff) << 1 :
              (bits & 0x7fffff) | 0x800000;
    return s * m * Math.pow(2, e - 150);
  }
}

bytes_to_long = function(high_bytes/*: int*/, low_bytes/*: int*/) {
  return (high_bytes << 32) + low_bytes;
}

bytes_to_double = function(high_bytes/*: int*/, low_bytes/*: int*/) {
  var bits = (high_bytes << 32) + low_bytes;
}

attributes_to_string = function(attributes/*: Attribute[]*/) {
  for(var i in attributes) {
    document.write('@' + attributes[i].name);
    //if()
  }
}

decompile("http://localhost/jsvm/test/Test.class");
