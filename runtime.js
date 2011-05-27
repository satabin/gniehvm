/* The memory model of the gniehvm is the following:
 *  - StaticMem: contains the loaded classes and static informations
 *  - Stack(s): the stack(s) with context (TODO one for each thread)
 *  - Heap: shared memory where object are allocated. Managed by the garbage collector
 */
Frame = function() {
  // the program counter for this frame
  this.pc = 0;
}

Interpreter = function() {
}

Interpreter.prototype.execute(clazz/*: Class*/) {
  var instructions = clazz.instructions;
  for(i in instructions) {
    // fetch the instruction
    var instruction = instructions[i];
  }
}
