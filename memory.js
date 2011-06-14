/* The memory model of the gniehvm is the following:
 *  - StaticMem: contains the loaded classes and static informations
 *  - Stack(s): the stack(s) with context (TODO one for each thread)
 *  - Heap: shared memory where object are allocated. Managed by the garbage collector
 */

Stack = function(size/*: int*/) {
  // it is an array of type Array[Long]
  // each cell in the stack is 64 bits long and is organzied as follows:
  //  - high byte -> type
  //  - low byte -> value/reference
  // long are stored in 2 cells
  stack = new Array(size);

  /* Returns the type of the variable stored at the given address */
  type_of = function(pointer/*: int*/) {
    return ((stack[pointer] & 0xffff000) >> 32);
  }

  value_of(pointer/*: int*/) {
    return (stack[pointer] & 0x0000ffff);
  }

  this.get_int = function(pointer/*: int*/) {
    if(type_of(pointer) != T_INT) {
      throw new Error('Integer expected');
    }
    return value_of(pointer);
  }

  this.get_short = function(pointer/*: int*/) {
    if(type_of(pointer) != T_SHORT) {
      throw new Error('Short expected');
    }
    return value_of(pointer);
  }

  this.get_byte = function(pointer/*: int*/) {
    if(type_of(pointer) != T_BYTE) {
      throw new Error('Byte expected');
    }
    return value_of(pointer);
  }

  this.get_boolean = function(pointer/*: int*/) {
    if(type_of(pointer) != T_BOOLEAN) {
      throw new Error('Boolean expected');
    }
    return (value_of(pointer) === 1);
  }

  this.get_char = function(pointer/*: int*/) {
    if(type_of(pointer) != T_CHAR) {
      throw new Error('Char expected');
    }
    return String.fromCharCode(value_of(pointer));
  }

  this.get_long = function(pointer/*: int*/) {
    if((type_of(pointer) != T_LONG) || (type_of(pointer + 1) != T_LONG)) {
      throw new Error('Long expected');
    }
    return bytes_to_long(value_of(pointer), value_of(pointer + 1));
  }

  this.get_float = function(pointer/*: int*/) {
    if(type_of(pointer) != T_FLOAT) {
      throw new Error('Float expected');
    }
    return bytes_to_float(value_of(pointer]));
  }

  this.get_double = function(pointer/*: int*/) {
    if((type_of(pointer) != T_DOUBLE) || (type_of(pointer + 1) != T_DOUBLE)) {
      throw new Error('Double expected');
    }
    return bytes_to_double(value_of(pointer), value_of(pointer + 1));
  }
}
