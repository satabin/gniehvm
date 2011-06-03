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

/*
 * The bootstrap class loader used by the VM. It searches for classes
 * at the given url
 */
BootstrapClassloader = function(base_url/*: String*/) {
  // this map contain the classes already loaded by this class loader
  // String -> Class
  this.classes = {};

  this.loadClass = function(name/*: String*/) {
    // only load the class if not loaded yet
    if(this.classes[name] === undefined) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", base_url + '/' + name + '.class', false);
      xhr.send(null);
      if(xhr.status == 200) {
        // TODO this is firefox specific
        this.classes[name] = this.parse(xhr.mozResponseArrayBuffer);
      } else if(xhr.status == 404) {
        throw new NoClassDefFoundError(name);
      } else {
        // TODO throw VM error
      }

    }
  };
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
BootstrapClassloader.prototype.parse = function(buffer/*: ArrayBuffer*/) {
  var view = new jDataView(buffer);
  var clazz = new Class();
	// https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBufferView
	var magic = view.getUint32(0);
  if(magic != 0xCAFEBABE) {
    // wrong magic number...
    throw new Error("Wrong magic number");
  }
	clazz.minor_version = view.getUint16(4);
	clazz.major_version = view.getUint16(6);
	var constant_pool_count = view.getUint16(8);
  var currentOffset = 10;
  var constants = [];
  for(var i = 0; i < constant_pool_count - 1; i++) {
    // read the constant pool
    constants[i] = {};
    var type = view.getUint8(currentOffset);
    constants[i].type = type;
    currentOffset++;
    switch(type) {
      case CONSTANT_Class:
        constants[i].name_index = view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Fieldref:
      case CONSTANT_Methodref:
      case CONSTANT_InterfaceMethodref:
        constants[i].class_index = view.getUint16(currentOffset);
        currentOffset += 2;
        constants[i].name_and_type_index = view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_String:
        constants[i].string_index = view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Integer:
        constants[i].bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        break;
      case CONSTANT_Float:
        constants[i].bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        constant[i].value = bytes_to_float(constants[i].bytes);
        break;
      case CONSTANT_Long:
        constants[i].high_bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        constants[i].low_bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        constants[i].value = bytes_to_long(constants[i].high_bytes, constants[i].low_bytes);
        break;
      case CONSTANT_Double:
        constants[i].high_bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        constants[i].low_bytes = view.getUint32(currentOffset);
        currentOffset += 4;
        constants[i].value = bytes_to_double(constants[i].high_bytes, constants[i].low_bytes);
        break;
      case CONSTANT_NameAndType:
        constants[i].name_index = view.getUint16(currentOffset);
        currentOffset += 2;
        constants[i].descriptor_index = view.getUint16(currentOffset);
        currentOffset += 2;
        break;
      case CONSTANT_Utf8:
        if(i == 4) {
          i;
        }
        var string_length = view.getUint16(currentOffset);
        constants[i].length = string_length;
        currentOffset += 2;
        var bytes = [];
        var result = "";
        for(var j = 0; j < string_length; j++) {
          var first = view.getUint8(currentOffset);
          currentOffset++;
          if(!(first & 0x80)) {
            result += String.fromCharCode(first & 0x7f);
            bytes[j] = first & 0x7f;
          } else if(first & 0xc0) {
            var second = view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0x1f) << 6) + (second & 0x3f));
            bytes[j] = first & 0x1f;
            bytes[j+1] = second & 0x3f;
            j++;
          } else if(first & 0xe0) {
            var second = view.getUint8(currentOffset);
            currentOffset++;
            var third = view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0xf) << 12) + ((second & 0x3f) << 6) + (third & 0x3f));
            bytes[j] = first & 0xf;
            bytes[j+1] = second & 0x3f;
            bytes[j+2] = third & 0x3f;
            j += 2;
          }
        }
        document.write(i + ' -&gt; ' + result.replace('<', '&lt;').replace('>', '&gt;') + '<br />');
        constants[i].value = result;
        constants[i].bytes = bytes;
        break;
    }
  }
  clazz.constants = constants;

  // read the access flags
  clazz.access_flags = view.getUint16(currentOffset);
  currentOffset += 2;

  // read the this_class
  clazz.this_class = view.getUint16(currentOffset);
  currentOffset += 2;

  // read the super_class
  clazz.super_class = view.getUint16(currentOffset);
  currentOffset += 2;

  // read the parent interfaces
  var interfaces_count = view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.interfaces = [];
  for(var i = 0; i < interfaces_count; i++) {
    var idx = view.getUint16(currentOffset);
    var class_info = clazz.constants[idx - 1];
    if(class_info.type !== CONSTANT_Class) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a Class");
    }
    clazz.interfaces[i] = class_info.name_index;
    currentOffset += 2;
  }

  // read the fields
  var fields_count = view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.fields = [];
  for(var i = 0; i < fields_count; i++) {
    var field = {}
    field.access_flags = view.getUint16(currentOffset);
    currentOffset += 2;
    var idx = view.getUint16(currentOffset);
    var name = clazz.constants[idx - 1];
    if(name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    field.name = name.value
    idx = view.getUint16(currentOffset);
    var descriptor = clazz.constants[idx - 1];
    if(descriptor.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    field.descriptor = descriptor.value;
    // read the attributes
    currentOffset = this.parseAttributes(buffer, view, currentOffset, clazz, false, field);
    clazz.fields[i] = field;
  }

  // read the methods
  var methods_count = view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.methods = [];
  for(var i = 0; i < methods_count; i++) {
    var method = {};
    method.access_flags = view.getUint16(currentOffset);
    currentOffset += 2;
    var idx = view.getUint16(currentOffset);
    var name = clazz.constants[idx - 1];
    if(name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    method.name = name.value;
    idx = view.getUint16(currentOffset);
    var descriptor = clazz.constants[idx - 1];
    if(descriptor.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String");
    }
    currentOffset += 2;
    method.descriptor = descriptor.value;
    // read the attributes
    currentOffset = this.parseAttributes(buffer, view, currentOffset, clazz, false, method);

    clazz.methods[i] = method;
  }

  // TODO for the moment we ignore all class attributes because they are only debug value
  // TODO add support for it later.
  currentOffset = this.parseAttributes(buffer, view, currentOffset, clazz, true);

  return clazz;
};

BootstrapClassloader.prototype.parseAttributes = function(buffer/*: ArrayBuffer*/, view/*: jDataView*/, currentOffset/*: int */, clazz/*: Class*/, ignore/*: Boolean*/, object/*: Any = null*/) {
  var attributes_count = view.getUint16(currentOffset);
  currentOffset += 2;
  var attributes = [];
  var real_index = 0;
  for(var i = 0; i < attributes_count; i++) {
    var idx = view.getUint16(currentOffset);
    var attribute_name = clazz.constants[idx - 1];
    if(attribute_name.type !== CONSTANT_Utf8) {
      throw new Error("Wrong bytecode format at " + currentOffset + ". This should be a String. Actually it is " + attribute_name.type);
    }
    currentOffset += 2;
    var attribute_length = view.getUint32(currentOffset);
    currentOffset += 4;
    attributes[real_index] = {'name': attribute_name.value};
    switch(attribute_name.value) {
      case ATTR_ConstantValue:
        if(attribute_length !== 2) {
          throw new Error("Wrong bytecode format at " + (currentOffset - 4) + ". Attribute length should be 2 for a ConstantValue attribute");
        }
        var constantvalue_index = view.getUint16(currentOffset);
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
        attributes[real_index].max_stack = view.getUint16(currentOffset);
        currentOffset += 2;
        attributes[real_index].max_locals = view.getUint16(currentOffset);
        currentOffset += 2;
        var code_length = view.getUint32(currentOffset);
        if(code_length <= 0) {
          throw new Error("Wrong bytecode format at "+ currentOffset + ". Code length must be greater than zero");
        }
        currentOffset += 4;
        // read the instructions.
        attributes[real_index].instructions = parseInstructions(new jDataView(buffer, currentOffset, code_length));
        currentOffset += code_length;
        var exception_table_length = view.getUint16(currentOffset);
        currentOffset += 2;
        var exceptions = []
        for(var j = 0; j < exception_table_length; j++) {
          var exception = {};
          exception.start_pc = view.getUint16(currentOffset);
          currentOffset += 2;
          exception.end_pc = view.getUint16(currentOffset);
          currentOffset += 2;
          exception.handler_pc = view.getUint16(currentOffset);
          currentOffset += 2;
          var catch_type = view.getUint16(currentOffset);
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
        currentOffset = this.parseAttributes(buffer, view, currentOffset, clazz, true);

        real_index++;
        break;
      case ATTR_Exceptions:
        var number_of_exceptions = view.getUint16(currentOffset);
        currentOffset += 2;
        var exception_table = [];
        for(var j = 0; j < number_of_exceptions; j++) {
          var idx = view.getUint16(currentOffset);
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
};

/* Links the class object with the runtime */
Class.prototype.link = function(frame/*: Frame*/) {
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
        constant.class_type = DescriptorParser.parse(ref.value, 'field_descriptor');
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
        // set the resolved field type name
        constant.field_type = DescriptorParser.parse(descriptor.value, 'field_descriptor');
        var name = constants[constants[name_and_type_index.name_index - 1] - 1];
        if(name.type !== CONSTANT_Utf8) {
          throw new Error('Name must be a string');
        }
        // set the resolved field name
        constant.field_name = name.value;
        break;
      case CONSTANT_Methodref:
        var clazz = constants[constant.class_index - 1];
        if(clazz.type != CONSTANT_Class) {
          throw new Error('Methodref constant must reference a class.');
        }
        // check that the class is not an interface
        if(this.access_flags & ACC_INTERFACE) {
          throw new Error('Referenced class cannot be an interface');
        }
        var name_and_type = constants[constant.name_and_type_index - 1];
        if(name_and_type.type != CONSTANT_NameAndType) {
          throw new Error('Methodref constant must reference a class.');
        }
        var descriptor = constants[name_and_type.descriptor_index - 1];
        if(descriptor.type != CONSTANT_Utf8) {
          throw new Error('Descriptor must be a string.');
        }
        // set the resolved method types
        var meth_descriptor = DescriptorParser.parse(descriptor.value, 'method_descriptor');
        constant.method_param_types = meth_descriptor.param_types;
        constant.method_return_type = meth_descriptor.return_type;
        var name = constants[constants[name_and_type_index.name_index - 1] - 1];
        if(name.type !== CONSTANT_Utf8) {
          throw new Error('Name must be a string');
        }
        if(name.value.charAt(0) === '<' && name.value !== '<init>') {
          throw new Error('Only method <init> may start with \'<\'');
        }
        if(name.value === '<init>' && meth_descriptor.return_type.type !== 'void') {
          throw new Error('Constructor must return void');
        }
        // set the resolved method name
        constant.name = name.value;
        break;
      case CONSTANT_InterfaceMethodref:
        var clazz = constants[constant.class_index - 1];
        if(clazz.type != CONSTANT_Class) {
          throw new Error('InterfaceMethodref constant must reference an interface.');
        }
        // check that the class is an interface
        if(!(this.access_flags & ACC_INTERFACE)) {
          throw new Error('Referenced class must be an interface');
        }
        var name_and_type = constants[constant.name_and_type_index - 1];
        if(name_and_type.type != CONSTANT_NameAndType) {
          throw new Error('InterfaceMethodref constant must reference an interface.');
        }
        var descriptor = constants[name_and_type.descriptor_index - 1];
        if(descriptor.type != CONSTANT_Utf8) {
          throw new Error('Descriptor must be a string.');
        }
        // set the resolved method types
        var meth_descriptor = DescriptorParser.parse(descriptor.value, 'method_descriptor');
        constant.method_param_types = meth_descriptor.param_types;
        constant.method_return_type = meth_descriptor.return_type;
        var name = constants[constants[name_and_type_index.name_index - 1] - 1];
        if(name.type !== CONSTANT_Utf8) {
          throw new Error('Name must be a string');
        }
        // set the resolved method name
        constant.name = name.value;
        break;
      case CONSTANT_String:
        var ref = constants[constant.string_index - 1];
        if(ref.type != CONSTANT_Utf8) {
          throw new Error('A string must reference an UTF8 string.');
        }
        constant.value = ref.value;
        break;
      case CONSTANT_NameAndType:
        var name = constants[constants[name_and_type_index.name_index - 1] - 1];
        if(name.type !== CONSTANT_Utf8) {
          throw new Error('Name must be a string');
        }
        constant.name = name;
        var descriptor = constants[constant.descriptor_index - 1];
        if(descriptor.type != CONSTANT_Utf8) {
          throw new Error('Descriptor must be a string.');
        }
        constant.descriptor = descriptor;
        break;
      default:
        throw new Error('Unknown constant type: ' + constant.type);
    }
  }
}
