Instruction = function(opcode/*: byte*/) {
  this.opcode = opcode;
};

// the opcodes
const OP_nop = 0x00;
const OP_aconst_null = 0x01;
const OP_iconst_m1 = 0x02;
const OP_iconst_0 = 0x03;
const OP_iconst_1 = 0x04;
const OP_iconst_2 = 0x05;
const OP_iconst_3 = 0x06;
const OP_iconst_4 = 0x07;
const OP_iconst_5 = 0x08;
const OP_lconst_0 = 0x09;
const OP_lconst_1 = 0x0a;
const OP_fconst_0 = 0x0b;
const OP_fconst_1 = 0x0c;
const OP_fconst_2 = 0x0d;
const OP_dconst_0 = 0x0e;
const OP_dconst_1 = 0x0f;
const OP_bipush = 0x10;
const OP_sipush = 0x11;
const OP_ldc = 0x12;
const OP_ldc_w = 0x13;
const OP_ldc2_w = 0x14;
const OP_iload = 0x15;
const OP_lload = 0x16;
const OP_fload = 0x17;
const OP_dload = 0x18;
const OP_aload = 0x19;
const OP_iload_0 = 0x1a;
const OP_iload_1 = 0x1b;
const OP_iload_2 = 0x1c;
const OP_iload_3 = 0x1d;
const OP_lload_0 = 0x1e;
const OP_lload_1 = 0x1f;
const OP_lload_2 = 0x20;
const OP_lload_3 = 0x21;
const OP_fload_0 = 0x22;
const OP_fload_1 = 0x23;
const OP_fload_2 = 0x24;
const OP_fload_3 = 0x25;
const OP_dload_0 = 0x26;
const OP_dload_1 = 0x27;
const OP_dload_2 = 0x28;
const OP_dload_3 = 0x29;
const OP_aload_0 = 0x2a;
const OP_aload_1 = 0x2b;
const OP_aload_2 = 0x2c;
const OP_aload_3 = 0x2d;
const OP_iaload = 0x2e;
const OP_laload = 0x2f;
const OP_faload = 0x30;
const OP_daload = 0x31;
const OP_aaload = 0x32;
const OP_baload = 0x33;
const OP_caload = 0x34;
const OP_saload = 0x35;
const OP_istore = 0x36;
const OP_lstore = 0x37;
const OP_fstore = 0x38;
const OP_dstore = 0x39;
const OP_astore = 0x3a;
const OP_istore_0 = 0x3b;
const OP_istore_1 = 0x3c;
const OP_istore_2 = 0x3d;
const OP_istore_3 = 0x3e;
const OP_lstore_0 = 0x3f;
const OP_lstore_1 = 0x40;
const OP_lstore_2 = 0x41;
const OP_lstore_3 = 0x42;
const OP_fstore_0 = 0x43;
const OP_fstore_1 = 0x44;
const OP_fstore_2 = 0x45;
const OP_fstore_3 = 0x46;
const OP_dstore_0 = 0x47;
const OP_dstore_1 = 0x48;
const OP_dstore_2 = 0x49;
const OP_dstore_3 = 0x4a;
const OP_astore_0 = 0x4b;
const OP_astore_1 = 0x4c;
const OP_astore_2 = 0x4d;
const OP_astore_3 = 0x4e;
const OP_iastore = 0x4f;
const OP_lastore = 0x50;
const OP_fastore = 0x51;
const OP_dastore = 0x52;
const OP_aastore = 0x53;
const OP_bastore = 0x54;
const OP_castore = 0x55;
const OP_sastore = 0x56;
const OP_pop = 0x57;
const OP_pop2 = 0x58;
const OP_dup = 0x59;
const OP_dup_x1 = 0x5a;
const OP_dup_x2 = 0x5b;
const OP_dup2 = 0x5c;
const OP_dup2_x1 = 0x5d;
const OP_dup2_x2 = 0x5e;
const OP_swap = 0x5f;
const OP_iadd = 0x60;
const OP_ladd = 0x61;
const OP_fadd = 0x62;
const OP_dadd = 0x63;
const OP_isub = 0x64;
const OP_lsub = 0x65;
const OP_fsub = 0x66;
const OP_dsub = 0x67;
const OP_imul = 0x68;
const OP_lmul = 0x69;
const OP_fmul = 0x6a;
const OP_dmul = 0x6b;
const OP_idiv = 0x6c;
const OP_ldiv = 0x6d;
const OP_fdiv = 0x6e;
const OP_ddiv = 0x6f;
const OP_irem = 0x70;
const OP_lrem = 0x71;
const OP_frem = 0x72;
const OP_drem = 0x73;
//0x74
const OP_lneg = 0x75;
const OP_fneg = 0x76;
const OP_dneg = 0x77;
const OP_ishl = 0x78;
const OP_lshl = 0x79;
const OP_ishr = 0x7a;
const OP_lshr = 0x7b;
const OP_iushr = 0x7c;
const OP_lushr = 0x7d;
const OP_iand = 0x7e;
const OP_land = 0x7f;
const OP_ior = 0x80;
const OP_lor = 0x81;
const OP_ixor = 0x82;
const OP_lxor = 0x83;
const OP_iinc = 0x84;
const OP_i2l = 0x85;
const OP_i2f = 0x86;
const OP_i2d = 0x87;
const OP_l2i = 0x88;
const OP_l2f = 0x89;
const OP_l2d = 0x8a;
const OP_f2i = 0x8b;
const OP_f2l = 0x8c;
const OP_f2d = 0x8d;
const OP_d2i = 0x8e;
const OP_d2l = 0x8f;
const OP_d2f = 0x90;
const OP_i2b = 0x91;
const OP_i2c = 0x92;
const OP_i2s = 0x93;
const OP_lcmp = 0x94;
const OP_fcmpl = 0x95;
const OP_fcmpg = 0x96;
const OP_dcmpl = 0x97;
const OP_dcmpg = 0x98;
const OP_ifeq = 0x99;
const OP_ifne = 0x9a;
const OP_iflt = 0x9b;
const OP_ifge = 0x9c;
const OP_ifgt = 0x9d;
const OP_ifle = 0x9e;
const OP_if_icmpeq = 0x9f;
const OP_if_icmpne = 0xa0;
const OP_if_icmplt = 0xa1;
const OP_if_icmpge = 0xa2;
const OP_if_icmpgt = 0xa3;
const OP_if_icmple = 0xa4;
const OP_if_acmpeq = 0xa5;
const OP_if_acmpne = 0xa6;
const OP_goto = 0xa7;
const OP_jsr = 0xa8;
const OP_ret = 0xa9;
const OP_tableswitch = 0xaa;
const OP_lookupswitch = 0xab;
const OP_ireturn = 0xac;
const OP_lreturn = 0xad;
const OP_freturn = 0xae;
const OP_dreturn = 0xaf;
const OP_areturn = 0xb0;
const OP_return = 0xb1;
const OP_getstatic = 0xb2;
const OP_putstatic = 0xb3;
const OP_getfield = 0xb4;
const OP_putfield = 0xb5;
const OP_invokevirtual = 0xb6;
const OP_invokespecial = 0xb7;
const OP_invokestatic = 0xb8;
const OP_invokeinterface = 0xb9;
const OP_xxxunusedxxx1 = 0xba;
const OP_new = 0xbb;
const OP_newarray = 0xbc;
const OP_anewarray = 0xbd;
const OP_arraylength = 0xbe;
const OP_athrow = 0xbf;
const OP_checkcast = 0xc0;
const OP_instanceof = 0xc1;
const OP_monitorenter = 0xc2;
const OP_monitorexit = 0xc3;
const OP_wide = 0xc4;
const OP_multianewarray = 0xc5;
const OP_ifnull = 0xc6;
const OP_ifnonnull = 0xc7;
const OP_goto_w = 0xc8;
const OP_jsr_w = 0xc9;

// atype
T_BOOLEAN = 4;
T_CHAR = 5;
T_FLOAT = 6;
T_DOUBLE = 7;
T_BYTE = 8;
T_SHORT = 9;
T_INT = 10;
T_LONG = 11;

parseInstructions = function(input/*: DataView*/, length/*: int*/, clazz/*: Class*/) {
  var offset = 0;
  var i = 0;
  var instructions = [];
  while(offset < length) {
    var opcode = input.getUint8(offset);
    offset++;
    instructions[i] = new Instruction(opcode);
    switch(opcode) {
      case OP_aload:
      case OP_astore:
      case OP_dload:
      case OP_dstore:
      case OP_fload:
      case OP_fstore:
      case OP_iload:
      case OP_istore:
      case OP_ldc:
      case OP_lload:
      case OP_lstore:
      case OP_ret:
        instructions[i].index = input.getUint8(offset);
        offset++;
        break;
      case OP_anewarray:
      case OP_checkcast:
      case OP_getfield:
      case OP_getstatic:
      case OP_instanceof:
      case OP_invokespecial:
      case OP_invokestatic:
      case OP_invokevirtual:
      case OP_ldc_w:
      case OP_ldc2_w:
      case OP_new:
      case OP_putfield:
      case OP_putstatic:
        instructions[i].index = input.getUint16(offset);
        offset += 2;
        break;
      case OP_bipush:
        instructions[i].sbyte = input.getInt8(offset);
        offset++;
        break;
      case OP_goto:
      case OP_if_acmpeq:
      case OP_if_acmpne:
      case OP_if_icmpeq:
      case OP_if_icmpne:
      case OP_if_icmplt:
      case OP_if_icmpge:
      case OP_if_icmpgt:
      case OP_if_icmple:
      case OP_ifeq:
      case OP_ifne:
      case OP_iflt:
      case OP_ifge:
      case OP_ifgt:
      case OP_ifle:
      case OP_ifnonnull:
      case OP_ifnull:
      case OP_jsr:
        instructions[i].branchoffset = input.getInt16(offset);
        offset += 2;
        break;
      case OP_goto_w:
      case OP_jsr_w:
        instructions[i].branchoffset = input.getInt32(offset);
        offset += 4;
        break;
      case OP_iinc:
        instructions[i].index = input.getUint8(offset);
        offset++;
        instructions[i].sconst = input.getInt8(offset);
        offset++;
        break;
      case OP_invokeinterface:
        instructions[i].index = input.getUint16(offset);
        offset += 2;
        instructions[i].count = input.getUint8(offset);
        offset++;
        if(input.getUint8(offset) != 0) {
          throw new Error("Wrong bytecode format at " + offset + ". 0 is expected");
        }
        offset++;
        break;
      case OP_lookupswitch:
        while((offset % 4) != 0) {
          // at most three null bytes to align instruction
          if(input.getUint8(offset) != 0) {
            throw new Error("Wrong bytecode format at " + offset + ". 0x00 is expected");
          }
          offset++;
        }
        var instruction = instructions[i];
        instruction.sdefault = input.getInt32(offset);
        offset += 32;
        instruction.npairs = input.getInt32(offset);
        instruction.pairs = []
        offset += 32;
        for(var j = 0; j < instruction.npairs; j++) {
          var match = input.getInt32(offset);
          offset += 32;
          var offs = input.getInt32(offset);
          offset += 32;
          instruction.pairs[j][match] = offs;
        }
        break;
      case OP_multianewarray:
        instructions[i].index = input.getUint16(offset);
        offset += 2;
        instructions[i].dimensions = input.getUint8(offset);
        if(instructions[i].dimensions < 1) {
          throw new Error("Wrong bytecode format at " + offset + ". Array dimensions should be at least 1");
        }
        offset++;
        break;
      case OP_newarray:
        var atype = input.getUint8(offset);
        if(atype < T_BOOLEAN || atype > T_LONG) {
          throw "Wrong bytecode format at " + offset + ". Unknown atype: " + atype;
        }
        instructions[i].atype = atype;
        offset++;
        break;
      case OP_sipush:
        instructions[i].value = input.getInt16(offset);
        offset += 2;
        break;
      case OP_tableswitch:
        while((offset % 4) != 0) {
          // at most three null bytes to align instruction
          if(input.getUint8(offset) != 0) {
            throw new Error("Wrong bytecode format at " + offset + ". 0x00 is expected");
          }
          offset++;
        }
        var instruction = instructions[i];
        instruction.sdefault = input.getInt32(offset);
        offset += 4;
        instruction.low = input.getInt32(offset);
        offset += 4;
        instruction.high = input.getInt32(offset);
        if(instruction.low > instruction.high) {
          throw new Error("Wrong bytecode format at " + (offset - 4) + ". Low offset cannot be greater than high offset");
        }
        offset += 4;
        var jumps = [];
        for(var j = 0; j < (instruction.high - instruction.low + 1); j++) {
          jumps[j] = input.getInt32(offset);
          offset += 4;
        }
        instruction.jumps = jumps;
        break;
      case OP_wide:
        var opcode_w = input.getInt8(offset);
        offset++;
        switch(opcode_w) {
          case OP_iload:
          case OP_fload:
          case OP_aload:
          case OP_lload:
          case OP_dload:
          case OP_istore:
          case OP_fstore:
          case OP_astore:
          case OP_lstore:
          case OP_dstore:
          case OP_ret:
            instructions[i].opcode_w = opcode_w;
            instructions[i].index = input.getUint16(offset);
            offset += 2;
            break;
          case OP_iinc:
            instructions[i].opcode_w = opcode_w;
            instructions[i].index = input.getUint16(offset);
            offset += 2;
            instructions[i].sconst = input.getInt16(offset);
            offset += 2;
            break;
          default:
            throw "Wrong bytecode format at " + (offset - 1) + ". opcode not allowed after wide: " + opcode_w;
        }
        break;
      default:
        // do nothing
    }
    i++;
  }
  return instructions;
}
