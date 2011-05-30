start
  = method_descriptor / field_descriptor

method_descriptor
  = '(' param_types:field_descriptor* ')' return_type:(field_descriptor / void) { return {'type': 'method', 'param_types': param_types, 'return_type': return_type};}

field_descriptor 
  = primitive_type
  / 'L' classname:[^;]+ ';' { return {'type': 'class', 'name': classname.join("")}}
  / ('[' type:start {return {'type': 'array', 'of': type}})

primitive_type
  = type:('B' / 'C' / 'D' / 'F' / 'I' / 'S' / 'Z') { return {'type': type}}

void
  = 'V' {return {'type': 'void'}}
