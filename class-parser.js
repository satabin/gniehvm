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
ACC_FINAL = 0x0010;
ACC_SUPER = 0x0020;
ACC_INTERFACE = 0x0200;
ACC_ABSTRACT = 0x0400;

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
        var characters = [];
        var result "";
        for(j = 0; j < constants[i].length; j++) {
          var first = this.view.getUint8(currentOffset);
          currentOffset++;
          if(first & 0x80 == 0) {
            result += String.fromCharCode(first & 0x7f);
          } else if(first & 0xe0 == 0xc0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0x1f) << 6) + (second & 0x3f));
          } else if(first & 0xf0 == 0xe0) {
            var second = this.view.getUint8(currentOffset);
            currentOffset++;
            var third = this.view.getUint8(currentOffset);
            currentOffset++;
            result += String.fromCharCode(((first & 0xf) << 12) + ((second & 0x3f) << 6) + (third & 0x3f));
          }
          constants[i].value = result;
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
    clazz.interfaces[i] = clazz.constants[this.view.getUint16(currentOffset)];
    currentOffset += 2;
  }

  // read the fiels
  var fiels_count = this.view.getUint16(currentOffset);
  currentOffset += 2;

  return clazz;
};

