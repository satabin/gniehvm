Frame = function(stack_size/*: int*/, classloader/*: ClassLoader*/) {
  // the program counter for this frame
  this.pc = 0;
  // the stack for this frame
  this.stack = new Array(stack_size);
  // store the mac size
  this.stack_size = stack_size;
  // the classloader
  this.classloader = classloader;
};

Interpreter = function() {
};

Interpreter.prototype.execute = function(clazz/*: Class*/) {
  var instructions = clazz.instructions;
  for(i in instructions) {
    // fetch the instruction
    var instruction = instructions[i];
  }
};
