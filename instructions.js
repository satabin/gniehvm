Instruction = function(opcode/*: byte*/) {
  this.opcode = opcode;
};

// the opcodes
OP_nop = 0x00;
OP_aconst_null = 0x01;
OP_iconst_m1 = 0x02;
OP_iconst_0 = 0x03;
OP_iconst_1 = 0x04;
OP_iconst_2 = 0x05;
OP_iconst_3 = 0x06;
OP_iconst_4 = 0x07;
OP_iconst_5 = 0x08;
OP_lconst_0 = 0x09;
OP_lconst_1 = 0x0a;
OP_fconst_0 = 0x0b;
OP_fconst_1 = 0x0c;
OP_fconst_2 = 0x0d;
OP_dconst_0 = 0x0e;
OP_dconst_1 = 0x0f;
OP_bipush = 0x10;
OP_sipush = 0x11;
OP_ldc = 0x12;
OP_ldc_w = 0x13;
OP_ldc2_w = 0x14;
OP_iload = 0x15;
OP_lload = 0x16;
OP_fload = 0x17;
OP_dload = 0x18;
OP_aload = 0x19;
OP_iload_0 = 0x1a;
OP_iload_1 = 0x1b;
OP_iload_2 = 0x1c;
OP_iload_3 = 0x1d;
OP_lload_0 = 0x1e;
OP_lload_1 = 0x1f;
OP_lload_2 = 0x20;
OP_lload_3 = 0x21;
OP_fload_0 = 0x22;
OP_fload_1 = 0x23;
OP_fload_2 = 0x24;
OP_fload_3 = 0x25;
OP_dload_0 = 0x26;
OP_dload_1 = 0x27;
OP_dload_2 = 0x28;
OP_dload_3 = 0x29;
OP_aload_0 = 0x2a;
OP_aload_1 = 0x2b;
OP_aload_2 = 0x2c;
OP_aload_3 = 0x2d;
OP_iaload = 0x2e;
OP_laload = 0x2f;
OP_faload = 0x30;
OP_daload = 0x31;
OP_aaload = 0x32;
OP_baload = 0x33;
OP_caload = 0x34;
OP_saload = 0x35;
OP_istore = 0x36;
OP_lstore = 0x37;
OP_fstore = 0x38;
OP_dstore = 0x39;
OP_astore = 0x3a;
OP_istore_0 = 0x3b;
OP_istore_1 = 0x3c;
OP_istore_2 = 0x3d;
OP_istore_3 = 0x3e;
OP_lstore_0 = 0x3f;
OP_lstore_1 = 0x40;
OP_lstore_2 = 0x41;
OP_lstore_3 = 0x42;
OP_fstore_0 = 0x43;
OP_fstore_1 = 0x44;
OP_fstore_2 = 0x45;
OP_fstore_3 = 0x46;
OP_dstore_0 = 0x47;
OP_dstore_1 = 0x48;
OP_dstore_2 = 0x49;
OP_dstore_3 = 0x4a;
OP_astore_0 = 0x4b;
OP_astore_1 = 0x4c;
OP_astore_2 = 0x4d;
OP_astore_3 = 0x4e;
OP_iastore = 0x4f;
OP_lastore = 0x50;
OP_fastore = 0x51;
OP_dastore = 0x52;
OP_aastore = 0x53;
OP_bastore = 0x54;
OP_castore = 0x55;
OP_sastore = 0x56;
OP_pop = 0x57;
OP_pop2 = 0x58;
OP_dup = 0x59;
OP_dup_x1 = 0x5a;
OP_dup_x2 = 0x5b;
OP_dup2 = 0x5c;
OP_dup2_x1 = 0x5d;
OP_dup2_x2 = 0x5e;
OP_swap = 0x5f;
OP_iadd = 0x60;
OP_ladd = 0x61;
OP_fadd = 0x62;
OP_dadd = 0x63;
OP_isub = 0x64;
OP_lsub = 0x65;
OP_fsub = 0x66;
OP_dsub = 0x67;
OP_imul = 0x68;
OP_lmul = 0x69;
OP_fmul = 0x6a;
OP_dmul = 0x6b;
OP_idiv = 0x6c;
OP_ldiv = 0x6d;
OP_fdiv = 0x6e;
OP_ddiv = 0x6f;
OP_irem = 0x70;
OP_lrem = 0x71;
OP_frem = 0x72;
OP_drem = 0x73;
//0x74
OP_lneg = 0x75;
OP_fneg = 0x76;
OP_dneg = 0x77;
OP_ishl = 0x78;
OP_lshl = 0x79;
OP_ishr = 0x7a;
OP_lshr = 0x7b;
OP_iushr = 0x7c;
OP_lushr = 0x7d;
OP_iand = 0x7e;
OP_land = 0x7f;
OP_ior = 0x80;
OP_lor = 0x81;
OP_ixor = 0x82;
OP_lxor = 0x83;
OP_iinc = 0x84;
OP_i2l = 0x85;
OP_i2f = 0x86;
OP_i2d = 0x87;
OP_l2i = 0x88;
OP_l2f = 0x89;
OP_l2d = 0x8a;
OP_f2i = 0x8b;
OP_f2l = 0x8c;
OP_f2d = 0x8d;
OP_d2i = 0x8e;
OP_d2l = 0x8f;
OP_d2f = 0x90;
OP_i2b = 0x91;
OP_i2c = 0x92;
OP_i2s = 0x93;
OP_lcmp = 0x94;
OP_fcmpl = 0x95;
OP_fcmpg = 0x96;
OP_dcmpl = 0x97;
OP_dcmpg = 0x98;
OP_ifeq = 0x99;
OP_ifne = 0x9a;
OP_iflt = 0x9b;
OP_ifge = 0x9c;
OP_ifgt = 0x9d;
OP_ifle = 0x9e;
OP_if_icmpeq = 0x9f;
OP_if_icmpne = 0xa0;
OP_if_icmplt = 0xa1;
OP_if_icmpge = 0xa2;
OP_if_icmpgt = 0xa3;
OP_if_icmple = 0xa4;
OP_if_acmpeq = 0xa5;
OP_if_acmpne = 0xa6;
OP_goto = 0xa7;
OP_jsr = 0xa8;
OP_ret = 0xa9;
OP_tableswitch = 0xaa;
OP_lookupswitch = 0xab;
OP_ireturn = 0xac;
OP_lreturn = 0xad;
OP_freturn = 0xae;
OP_dreturn = 0xaf;
OP_areturn = 0xb0;
OP_return = 0xb1;
OP_getstatic = 0xb2;
OP_putstatic = 0xb3;
OP_getfield = 0xb4;
OP_putfield = 0xb5;
OP_invokevirtual = 0xb6;
OP_invokespecial = 0xb7;
OP_invokestatic = 0xb8;
OP_invokeinterface = 0xb9;
OP_xxxunusedxxx1 = 0xba;
OP_new = 0xbb;
OP_newarray = 0xbc;
OP_anewarray = 0xbd;
OP_arraylength = 0xbe;
OP_athrow = 0xbf;
OP_checkcast = 0xc0;
OP_instanceof = 0xc1;
OP_monitorenter = 0xc2;
OP_monitorexit = 0xc3;
OP_wide = 0xc4;
OP_multianewarray = 0xc5;
OP_ifnull = 0xc6;
OP_ifnonnull = 0xc7;
OP_goto_w = 0xc8;
OP_jsr_w = 0xc9;

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
