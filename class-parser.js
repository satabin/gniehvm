/**
 * the class parser parses a stream representing a class file and creates a
 * class object. From the JVM Specification second edition (section 4.1):
 * <code>ClassFile {
   		u4 magic;
    	u2 minor_version;
    	u2 major_version;
    	u2 constant_pool_count;
    	cp_info constant_pool[constant_pool_count-1];
    	u2 access_flags;
    	u2 this_class;
    	u2 super_class;
    	u2 interfaces_count;
    	u2 interfaces[interfaces_count];
    	u2 fields_count;
    	field_info fields[fields_count];
    	u2 methods_count;
    	method_info methods[methods_count];
    	u2 attributes_count;
    	attribute_info attributes[attributes_count];
    }</code>
 */
Class = function(){};
Parser = function(buffer/*: ArrayBuffer */){
  this.buffer = buffer;
  this.view = new jDataView(buffer);
};

// constant types
const CONSTANT_Class = 7;
const CONSTANT_Fieldref = 9;
const CONSTANT_Methodref = 10;
const CONSTANT_InterfaceMethodref = 11;
const CONSTANT_String = 8;
const CONSTANT_Integer = 3;
const CONSTANT_Float = 4;
const CONSTANT_Long = 5;
const CONSTANT_Double = 6;
const CONSTANT_NameAndType = 12;
const CONSTANT_Utf8 = 1;

// modifiers
const ACC_PUBLIC = 0x0001;
const ACC_PRIVATE = 0x0002
const ACC_PROTECTED = 0x0004;
const ACC_STATIC = 0x0008;
const ACC_FINAL = 0x0010;
const ACC_SUPER = 0x0020;
const ACC_SYNCHRONIZED = 0x0020;
const ACC_VOLATILE = 0x0040;
const ACC_TRANSIENT = 0x0080;
const ACC_NATIVE = 0x0100;
const ACC_INTERFACE = 0x0200;
const ACC_ABSTRACT = 0x0400;
const ACC_STRICT = 0x0800;

// attributes
const ATTR_ConstantValue = "ConstantValue";
const ATTR_Code = "Code";
const ATTR_Exceptions = "Exceptions";
const ATTR_InnerClasses = "InnerClasses";
const ATTR_Synthetic = "Synthetic";
const ATTR_SourceFile = "SourceFile";
const ATTR_LineNumberTable = "LineNumberTable";
const ATTR_LocalVariableTable = "LocalVariableTable";
const ATTR_Deprecated = "Deprecated";

/* parses the stream and returns the corresponding class object */
Parser.prototype.parse = function() {
  var clazz = new Class();
	// https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBufferView
	var magic = this.view.getUint32(0);
  if(magic != 0xCAFEBABE) {
    // wrong magic number...
    throw new Error("Wrong magic number");
  }
	clazz.minor_version = this.view.getUint16(4);
	clazz.major_version = this.view.getUint16(6);
	var constant_pool_count = this.view.getUint16(8);
  var currentOffset = 10;
  var constants = [];
  for(var i = 0; i < constant_pool_count - 1; i++) {
    // read the constant pool
    constants[i] = {};
    var type = this.view.getUint8(currentOffset);
    constants[i].type = type;
    currentOffset++;
    switch(type) {
      case CONSTANT_Class:
        constants[i].name_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Fieldref:
      case CONSTANT_Methodref:
      case CONSTANT_InterfaceMethodref:
        constants[i].class_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        constants[i].name_and_type_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_String:
        constants[i].string_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Integer:
      case CONSTANT_Float:
        constants[i].bytes = this.view.getUint32(currentOffset);
        currentOffset += 4;
        break;
      case CONSTANT_Long:
      case CONSTANT_Double:
        constants[i].high_bytes = this.view.getUint32(currentOffset);
        currentOffset += 4;
        constants[i].low_bytes = this.view.getUint32(currentOffset);
        currentOffset += 4;
        break;
      case CONSTANT_NameAndType:
        constants[i].name_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        constants[i].descriptor_index = this.view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Utf8:
        if(i == 4) {
          i;
        }
        var string_length = this.view.getUint16(currentOffset);
        constants[i].length = string_length;
        currentOffset += 2;
        var bytes = [];
        var result = "";
        for(var j = 0; j < string_length; j++) {
          var first = this.view.getUint8(currentOffset);
          currentOffset++;
          if((first & 0x80) == 0x00) {
            result += String.fromCharCode(first & 0x7f);
            bytes[j] = first & 0x7f;
          } else if((first & 0xc0) == 0xc0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0x1f) << 6) + (second & 0x3f));
            bytes[j] = first & 0x1f;
            bytes[j+1] = second & 0x3f;
            j++;
          } else if((first & 0xe0) == 0xe0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            var third = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0xf) << 12) + ((second & 0x3f) << 6) + (third & 0x3f));
            bytes[j] = first & 0xf;
            bytes[j+1] = second & 0x3f;
            bytes[j+2] = third & 0x3f;
            j += 2;
          }
        }
        document.write(i + ' -> ' + result.replace('<', '&lt;').replace('>', '&gt;') + '<br />');
        constants[i].value = result;
        constants[i].bytes = bytes;
        break;
    }
  }
  clazz.constants = constants;

  // read the access flags
  clazz.access_flags = this.view.getUint16(currentOffset);
  currentOffset += 2;

  // read the this_class
  clazz.this_class = this.view.getUint16(currentOffset);
  currentOffset += 2;

  // read the super_class
  clazz.super_class = this.view.getUint16(currentOffset);
  currentOffset += 2;

  // read the parent interfaces
  var interfaces_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.interfaces = [];
  for(var i = 0; i < interfaces_count; i++) {
    var idx = this.view.getUint16(currentOffset);
    var class_info = clazz.constants[idx - 1];
    if(class_info.type !== CONSTANT_Class) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a Class");
    }
    clazz.interfaces[i] = class_info.name_index;
    currentOffset += 2;
  }

  // read the fields
  var fields_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.fields = [];
  for(var i = 0; i < fields_count; i++) {
    var field = {}
    field.access_flags = this.view.getUint16(currentOffset);
    currentOffset += 2;
    var idx = this.view.getUint16(currentOffset);
    var name = clazz.constants[idx - 1];
    if(name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    field.name = name.value
    idx = this.view.getUint16(currentOffset);
    var descriptor = clazz.constants[idx - 1];
    if(descriptor.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    field.descriptor = descriptor.value;
    // read the attributes
    currentOffset = this.parseAttributes(currentOffset, clazz, false, field);
    clazz.fields[i] = field;
  }

  // read the methods
  var methods_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.methods = [];
  for(var i = 0; i < methods_count; i++) {
    var method = {};
    method.access_flags = this.view.getUint16(currentOffset);
    currentOffset += 2;
    var idx = this.view.getUint16(currentOffset);
    var name = clazz.constants[idx - 1];
    if(name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    method.name = name.value;
    idx = this.view.getUint16(currentOffset);
    var descriptor = clazz.constants[idx - 1];
    if(descriptor.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    method.descriptor = descriptor.value;
    // read the attributes
    currentOffset = this.parseAttributes(currentOffset, clazz, false, method);

    clazz.methods[i] = method;
  }

  // TODO for the moment we ignore all class attributes because they are only debug value
  // TODO add support for it later.
  currentOffset = this.parseAttributes(currentOffset, clazz, true);

  return clazz;
};

Parser.prototype.parseAttributes = function(currentOffset/*: int */, clazz/*: Class*/, ignore/*: Boolean*/, object/*: Any = null*/) {
  var attributes_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  var attributes = [];
  var real_index = 0;
  for(var i = 0; i < attributes_count; i++) {
    var idx = this.view.getUint16(currentOffset);
    var attribute_name = clazz.constants[idx - 1];
    if(attribute_name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String. Actually it is " + attribute_name.type);
    }
    currentOffset += 2;
    var attribute_length = this.view.getUint32(currentOffset);
    currentOffset += 4;
    attributes[real_index] = {'name': attribute_name.value};
    switch(attribute_name.value) {
      case ATTR_ConstantValue:
        if(attribute_length !== 2) {
          throw new Error("Wrong bytecode format at " + (currentOffset - 4) + ". Attribute length should be 2 for a ConstantValue attribute");
        }
        var constantvalue_index = this.view.getUint16(currentOffset);
        var constantvalue = clazz.constants[constantvalue_index - 1];
        switch(constantvalue.type) {
          case CONSTANT_Long:
          case CONSTANT_Double:
            
            break;
          case CONSTANT_Float:
          case CONSTANT_Integer:
            break;
          case CONSTANT_String:
            attributes[real_index].constantvalue = constantvalue.value;
            // ok
            break;
          default:
            throw new Error("Wrong bytecode format at " + currentOffset + ". Attribute of type ConstantValue may only contain base type values");
        }
        currentOffset += 2;
        attributes[real_index].type = attribute_name.value;
        real_index++;
        break;
      case ATTR_Code:
        attributes[real_index].max_stack = this.view.getUint16(currentOffset);
        currentOffset += 2;
        attributes[real_index].max_locals = this.view.getUint16(currentOffset);
        currentOffset += 2;
        var code_length = this.view.getUint32(currentOffset);
        if(code_length <= 0) {
          throw new Error("Wrong bytecode format at "+ currentOffset + ". Code length must be greater than zero");
        }
        currentOffset += 4;
        // read the instructions.
        attributes[real_index].instructions = parseInstructions(new jDataView(this.buffer, currentOffset, code_length));
        currentOffset += code_length;
        var exception_table_length = this.view.getUint16(currentOffset);
        currentOffset += 2;
        var exceptions = []
        for(var j = 0; j < exception_table_length; j++) {
          var exception = {};
          exception.start_pc = this.view.getUint16(currentOffset);
          currentOffset += 2;
          exception.end_pc = this.view.getUint16(currentOffset);
          currentOffset += 2;
          exception.handler_pc = this.view.getUint16(currentOffset);
          currentOffset += 2;
          var catch_type = this.view.getUint16(currentOffset);
          if(catch_type != 0) {
            var type = clazz.constants[catch_type - 1];
            if(type.type != CONSTANT_Class) {
              throw new Error("Wrong bytecode format at " + currentOffset + ". The catch type should be a class");
            }
            exception.catch_type = type.name_index;
          }
          exceptions = exception;
          currentOffset += 2;
        }
        attributes[real_index].exception_table = exceptions;
        // TODO these are only debug attributes, ignore them for now, but implement later
        currentOffset = this.parseAttributes(currentOffset, clazz, true);

        real_index++;
        break;
      case ATTR_Exceptions:
        var number_of_exceptions = this.view.getUint16(currentOffset);
        currentOffset += 2;
        var exception_table = [];
        for(var j = 0; j < number_of_exceptions; j++) {
          var idx = this.view.getUint16(currentOffset);
          var exception = clazz.constants[idx - 1];
          if(exception.type != CONSTANT_Class) {
            throw new Error("Wrong bytecode format at " + currentOffset + ". Thrown exceptions must be classes");
          }
          currentOffset += 2;
          exception_table[j] = exception;
        }
        attributes[real_index].exception_table = exception_table;

        real_index++;
        break;
      default:
        // unknown attribute, ignore it.
        // TODO add support for other predefined attributes
        // TODO when the VM is running good enough, maybe take it into account and add API to retrieve it at runtime
        currentOffset += attribute_length;
    }
  }
  if(!ignore) {
    object.attributes = attributes;
  }

  return currentOffset;
}

/* Links the class object with the runtime */
Class.prototype.link(context) {
  var constants = this.constants;
  for(var i in constants) {
    var constant = constants[i];
    switch(constant.type) {
      case CONSTANT_Class:
        var ref = constants[constant.name_index - 1];
        if(ref.type != CONSTANT_Utf8) {
          throw new Error('Class constant must reference an UTF8 name.');
        }
        constant.name = ref.value;
        break;
      case CONSTANT_Fieldref:
        if(constants[constant.class_index - 1].type != CONSTANT_Class) {
          throw new Error('Fieldref constant must reference a class.');
        }
        var name_and_type = constants[constant.name_and_type_index - 1];
        if(name_and_type.type != CONSTANT_NameAndType) {
          throw new Error('Fieldref constant must reference a class.');
        }
        var descriptor = constants[name_and_type.descriptor_index - 1];
        if(descriptor.type != CONSTANT_Utf8) {
          throw new Error('Descriptor must be a string.');
        }
        if(!isFieldDescriptor(descriptor.value) {
          throw new Error(descriptor.value + ' is not a valid field descriptor');
        }
        break;
      default:
        throw new Error('Unknown constant type: ' + constant.type);
    }
  }
}

TYPE = function(name) {
  this.type = name;
}
const TYPE_byte    = TYPE('byte');
const TYPE_char    = TYPE('char');
const TYPE_float   = TYPE('float');
const TYPE_double  = TYPE('double');
const TYPE_int     = TYPE('int');
const TYPE_long    = TYPE('long');
const TYPE_short   = TYPE('short');
const TYPE_boolean = TYPE('boolean');
const TYPE_class   = function(name) {
  return TYPE(name);
}
const TYPE_Array   = function(type) {
  var t = TYPE('array');
  t.content_type = type;
  return t;
}

parseFieldDescriptor = function(name/*: String*/) {
  switch(name) {
    case 'B':
      return TYPE_byte;
    case 'C':
      return TYPE_char;
    case 'D':
      return TYPE_double;
    case 'F':
      return TYPE_float;
    case 'I':
      return TYPE_int;
    case 'J':
      return TYPE_long;
    case 'S':
      return TYPE_short;
    case 'Z':
      return TYPE_boolean;
    default:
      if(name.charAt(0) === 'L') {
        return TYPE_class(name.substring(1, name.length - 1));
      } else if(name.charAt(0) ==='[') {
        return TYPE_Array(parseFieldDescriptor(name.substring(1)));
      } else {
        throw new Error('Unknown field descriptor ' + name);
      }
  }
}
isFieldDescriptor = function(name/*: String*/) {
  if(name in ['B', 'C', 'D', 'F', 'I', 'J', 'S', 'Z']) {
    return true;
  } else if(name.charAt(0) === 'L') {
    return true;
  } else if(name.charAt(0) === '[') {
    return isFieldDescriptor(name.substring(1));
  } else {
    return false;
  }
}

parseMethodDescriptor = function(name/*: String*/) {

}
isMethodDescriptor = function(name/*: String*/) {

}
