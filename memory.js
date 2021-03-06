/* The memory model of the gniehvm is the following:
 *  - StaticMem: contains the loaded classes and static informations
 *  - Stack(s): the stack(s) with context (TODO one for each thread)
 *  - Heap: shared memory where object are allocated. Managed by the garbage collector
 */

/*
 * A class is represented as follows in the StaticMem part:
 * struct clazz {
 *   unsigned int32 super_class; // the super class address
 *   unsigned int32 super_interfaces[interface_count]; // implemented interfaces addresses
 * }
 */
Clazz = function(
		buffer/*: ArrayBuffer*/,
		start_offset/*: int*/,
		size/*: int*/,
		interface_count/*: int*/,
		field_count/*: int*/) {
	
	this.address = start_offset;
	this.super_class = new Uint32Array(buffer, start_offset, 1);
	this.super_interfaces = new Uint32Array(buffer, start_offset + 4, interface_count);
};

StaticMem = function(size/*: int*/) {
	// the static memory array holding class data
	var mem = new ArrayBuffer(size);
	
	// the next free address
	var next_free = 0;
	
	/*
	 * Adds the class to the memory and returns the class
	 * representation initialized with the address in memory
	 */
	this.add_class(size/*: int*/, interface_count/*: int*/) {
		
		// the memory view where this class will be stored
		var clazz = new Clazz(mem, next_free, size, interface_count);
		
		// update next free address pointer
		next_free += bytes.byteLength;
		
		return clazz;
	};
}

Stack = function(size/*: int*/) {
  // size is in bytes, a word in the stack has a length of 64bits
  // it is an array of type Array[Long]
  // each cell in the stack is 64 bits long and is organized as follows:
  //  - high byte -> type
  //  - low byte -> value/reference
  // long are stored in 2 cells
  var stack = new jDataView(ArrayBuffer(size));

  /* Returns the type of the variable stored at the given address */
  var type_of = function(pointer/*: int*/) {
    return stack.getInt8(pointer);
  };

  this.get_int = function(pointer/*: int*/) {
    if(type_of(pointer) != T_INT) {
      throw new Error('Integer expected');
    }
    return stack.getInt32(pointer + 1);
  };

  this.get_short = function(pointer/*: int*/) {
    if(type_of(pointer) != T_SHORT) {
      throw new Error('Short expected');
    }
    return stack.getInt18(pointer + 1);
  };

  this.get_byte = function(pointer/*: int*/) {
    if(type_of(pointer) != T_BYTE) {
      throw new Error('Byte expected');
    }
    return stack.getInt8(pointer + 1);
  };

  this.get_boolean = function(pointer/*: int*/) {
    if(type_of(pointer) != T_BOOLEAN) {
      throw new Error('Boolean expected');
    }
    return (stack.getInt8(pointer + 1) === 1);
  };

  this.get_char = function(pointer/*: int*/) {
    if(type_of(pointer) != T_CHAR) {
      throw new Error('Char expected');
    }
    return String.fromCharCode(stack.getUint16(pointer + 1));
  };

  this.get_long = function(pointer/*: int*/) {
    if(type_of(pointer) != T_LONG) {
      throw new Error('Long expected');
    }
    return stack.getInt64(pointer + 1);
  };

  this.get_float = function(pointer/*: int*/) {
    if(type_of(pointer) != T_FLOAT) {
      throw new Error('Float expected');
    }
    return bytes_to_float(stack.getUint32(pointer + 1));
  };

  this.get_double = function(pointer/*: int*/) {
    if(type_of(pointer) != T_DOUBLE) {
      throw new Error('Double expected');
    }
    return bytes_to_double(stack.getInt32(pointer + 1), stack.getInt32(pointer + 5));
  };
};
