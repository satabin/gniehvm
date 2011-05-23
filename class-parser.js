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
load("opcodes.js");

Class = function(){};
Parser = function(input/*: ArrayBuffer */){
  this.view = new DataView(input);
};

// constant types
CONSTANT_Class = 7;
CONSTANT_Fieldref = 9;
CONSTANT_Methodref = 10;
CONSTANT_InterfaceMethodref = 11;
CONSTANT_String = 8;
CONSTANT_Integer = 3;
CONSTANT_Float = 4;
CONSTANT_Long = 5;
CONSTANT_Double = 6;
CONSTANT_NameAndType = 12;
CONSTANT_Utf8 = 1;

// modifiers
ACC_PUBLIC = 0x0001;
ACC_PRIVATE = 0x0002
ACC_PROTECTED = 0x0004;
ACC_STATIC = 0x0008;
ACC_FINAL = 0x0010;
ACC_SUPER = 0x0020;
ACC_VOLATILE = 0x0040;
ACC_TRANSIENT = 0x0080;
ACC_INTERFACE = 0x0200;
ACC_ABSTRACT = 0x0400;

// attributes
ATTR_ConstantValue = "ConstantValue";
ATTR_Code = "Code";
ATTR_Exceptions = "Exceptions";
ATTR_InnerClasses = "InnerClasses";
ATTR_Synthetic = "Synthetic";
ATTR_SourceFile = "SourceFile";
ATTR_LineNumberTable = "LineNumberTable";
ATTR_LocalVariableTable = "LocalVariableTable";
ATTR_Deprecated = "Deprecated";

/* parses the stream and returns the corresponding class object */
Parser.parse = function(classBuffer/*: ArrayBuffer */) {
  var clazz = new Class();
	// https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBufferView
	var magic = this.view.getUint32(0);
  if(magic[0] != 0xCAFEBABE) {
    // wrong magic number...
    throw "Wrong magic number";
  }
	clazz.minor_version = this.view.getUint16(4);
	clazz.major_version = this.view.getUint16(6);
	var constant_pool_count = this.view.getUint16(8);
  var currentOffset = 10;
  var constants = [];
  for(i = 0; i < constant_pool_count - 1; i++) {
    // read the constant pool
    constants[i].type = this.view.getUint8(currentOffset);
    currentOffset++;
    switch(this.view.getUint8(currentOffset)) {
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
        constants[i].length = this.view.getUint16(currentOffset);
        currentOffset += 2;
        var bytes = [];
        var result = "";
        for(j = 0; j < constants[i].length; j++) {
          var first = this.view.getUint8(currentOffset);
          currentOffset++;
          if(first & 0x80 == 0) {
            result += String.fromCharCode(first & 0x7f);
            bytes[j] = (byte)(first & 0x7f);
          } else if(first & 0xe0 == 0xc0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0x1f) << 6) + (second & 0x3f));
            bytes[j] = (byte)(first & 0x1f);
            bytes[j+1] = (byte)(second & 0x3f);
            j++;
          } else if(first & 0xf0 == 0xe0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            var third = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0xf) << 12) + ((second & 0x3f) << 6) + (third & 0x3f));
            bytes[j] = (byte)(first & 0xf);
            bytes[j+1] = (byte)(second & 0x3f);
            bytes[j+2] = (byte)(third & 0x3f);
            j += 2;
          }
          constants[i].value = result;
          constants[i].bytes = bytes;
        }
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
  for(i = 0; i < interfaces_count; i++) {
    var class_info = clazz.constants[this.view.getUint16(currentOffset)];
    if(class_info.type !== CONSTANT_Class) {
      throw "Wrong bytecode format at " + currentOffset + ". This should be a Class";
    }
    clazz.interfaces[i] = class_info.name_index;
    currentOffset += 2;
  }

  // read the fields
  var fields_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  clazz.fields = [];
  for(i = 0; i < fields_count; i++) {
    clazz.fields[i].access_flags = this.view.getUint16(currentOffset);
    currentOffset += 2;
    var name = clazz.constants[this.view.getUint16(currentOffset)];
    if(name.type !== CONSTANT_Utf8) {
      throw "Wrong bytecode format at " + currentOffset + ". This should be a String";
    }
    currentOffset += 2;
    clazz.fields[i].name = name.value
    var descriptor = clazz.constants[this.view.getUint16(currentOffset)];
    if(descriptor.type !== CONSTANT_Utf8) {
      throw "Wrong bytecode format at " + currentOffset + ". This should be a String";
    }
    currentOffset += 2;
    clazz.fields[i].descriptor = descriptor.value;

  }

  // read the attributes
  currentOffset = this.parseAttributes(currentOffset, clazz);
  // TODO check the attributes

  return clazz;
};

Parser.parseAttributes = function(currentOffset/*: int */, clazz/*: Class*/) {
  var attributes_count = this.view.getUint16(currentOffset);
  currentOffset += 2;
  var attributes = [];
  var real_index = 0;
  for(i = 0; i < attributes_count; j++) {
    var attribute_name = clazz.constants[this.view.getUint16(currentOffset)];
    if(attribute_name.type !== CONSTANT_Utf8) {
      throw "Wrong bytecode format at " + currentOffset + ". This should be a String";
    }
    currentOffset += 2;
    var attribute_length = this.view.getUint32(currentOffset);
    currentOffset += 4;
    switch(attribute_name.value) {
      case ATTR_ConstantValue:
        if(attribute_length !== 2) {
          throw "Wrong bytecode format at " + (currentOffset - 4) + ". Attribute length should be 2 for a ConstantValue attribute";
        }
        var constantvalue_index = this.view.getUint16(currentOffset);
        switch(clazz.constants[constantvalue_index].type) {
          case CONSTANT_Long:
          case CONSTANT_Float:
          case CONSTANT_Double:
          case CONSTANT_Integer:
          case CONSTANT_String:
            // ok
            break;
          default:
            throw "Wrong bytecode format at " + currentOffset + ". Attribute of type ConstantValue may only contain base type values";
        }
        currentOffset += 2;
        attributes[real_index].type = attribute_name.value;
        attributes[real_index].constantvalue_index = constantvalue_index;
        real_index++;
        break;
      case ATTR_Code:
        attributes[real_index].max_stack = this.view.getUint16(currentOffset);
        currentOffset += 2;
        attributes[real_index].max_locals = this.view.getUint16(currentOffset);
        currentOffset += 2;
        var code_length = this.view.getUint32(currentOffset);
        if(code_length <= 0) {
          throw "Wrong bytecode format at "+ currentOffset + ". Code length must be greater than zero";
        }
        currentOffset += 4;
        // TODO read the instructions.

        real_index++;
        break;
      case ATTR_Exceptions:
        // TODO
        real_index++;
        break;
      default:
        // unknown attribute, ignore it.
        // TODO add support for other predefined attributes
        // TODO when the VM is running good enough, maybe take it into account and add API to retrieve it at runtime
        currentOffset += attribute_length;
    }
  }
  clazz.attributes = attributes;

  return currentOffset;
}
