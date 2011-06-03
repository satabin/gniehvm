GniehVM = function(options/*: Array[String]*/) {
  this.downloadClassFile = function(url/*: String*/) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
  }
}

decompile = function(url/*: String*/) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  if(xhr.status == 200) {
    // ok found and downloaded
    var classloader = new BootstrapClassloader();
    var start = new Date().getTime();
    var clazz = classloader.parse(xhr.mozResponseArrayBuffer);
    document.write('<b>Time to parse class file: ' + (new Date().getTime() - start) + 'ms</b><br />');
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

const CONST_POS_INFINITY = '+Infinity';
const CONST_NEG_INFINITY = '-Infinity';
const CONST_NAN          = 'Nan';

bytes_to_float = function(bits/*: int*/) {
  if(bits == 0x7f800000) {
    return CONST_POS_INFINITY;
  } else if(bits == 0xff800000) {
    return CONST_NEG_INFINITY;
  } else if((bits >= 0x7f800001 && bits <= 0x7fffffff)
            || (bits >= 0xff800001 && bits <= 0xffffffff)) {
    return CONST_NAN;
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
  if(bits == 0x7ff0000000000000) {
    return CONST_POS_INFINITY;
  } else if(bits == 0xfff0000000000000) {
    return CONST_NEG_INFINITY;
  } else if((bits >= 0x7ff0000000000001 && bits <= 0x7fffffffffffffff)
            || (bits >= 0xfff0000000000001 && bits <= 0xffffffffffffffff)) {
    return CONST_NAN;
  } else  {
    var s = ((bits >> 63) == 0) ? 1 : -1;
    var e = ((bits >> 52) & 0x7ff);
    var m = (e == 0) ?
            (bits & 0xfffffffffffff) << 1 :
            (bits & 0xfffffffffffff) | 0x10000000000000;
    return s * m * Math.pow(2, e - 1075);
  }
}

attributes_to_string = function(attributes/*: Attribute[]*/) {
  for(var i in attributes) {
    document.write('@' + attributes[i].name);
    //if()
  }
}

decompile("http://localhost/jsvm/test/Test.class");
