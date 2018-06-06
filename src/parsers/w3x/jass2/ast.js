let nextId = 0;

/**
 * A node.
 */
class Node {
  /**
   * @param {Object} args
   */
  constructor(args) {
    /** @member {number} */
    this.line = args.line;
    /** @member {number} */
    this.uid = nextId++;
  }
}

/**
 * A statement.
 */
class Statement extends Node {}

/**
 * An expression.
 */
class Expression extends Node {}

/**
 * A program.
 */
class Program extends Node {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {Array<Statement>} */
    this.blocks = args.blocks;
  }
}

/**
 * Globals.
 */
class Globals extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {Array<VariableDefinition>} */
    this.variables = args.variables;
  }
}

/**
 * A function definition.
 */
class FunctionDefinition extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.name = args.name;
    /** @member {Array<FunctionArgument>} */
    this.args = args.args;
    /** @member {string} */
    this.returnType = args.returnType;
    /** @member {Array<Statement>} */
    this.body = args.body;
  }
}

/**
 * A function argument.
 */
class FunctionArgument extends Node {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.type = args.type;
    /** @member {string} */
    this.name = args.name;
  }
}

/**
 * An if-then-else statement.
 */
class IfThenElse extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.condition = args.condition;
    this.thenActions = args.thenActions;
    this.elseActions = args.elseActions;
  }
}

/**
 * A variable set.
 */
class SetVariable extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.name = args.name;
    this.value = args.value;
  }
}

/**
 * A variable array set.
 */
class SetVariableArray extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.name = args.name;
    this.index = args.index;
    this.value = args.value;
  }
}

/**
 * A literal.
 */
class Literal extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.type = args.type;
    /** @member {?} */
    this.value = args.value;
  }
}

/**
 * A variable get.
 */
class GetVariable extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.name = args.name;
  }
}

/**
 * A variable array get.
 */
class GetVariableArray extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.name = args.name;
    /** @member {number} */
    this.index = args.index;
  }
}

/**
 * A return.
 */
class Return extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.value = args.value;
  }
}

/**
 * An infix expression.
 */
class Infix extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.lhs = args.lhs;
    this.operator = args.operator;
    this.rhs = args.rhs;
  }
}

/**
 * A variable definition.
 */
class VariableDefinition extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.type = args.type;
    this.name = args.name;
    this.value = args.value || null;
    this.isArray = args.isArray || false;
    this.isConstant = args.isConstant || false;
    this.isLocal = args.isLocal || false;
  }
}

/**
 * A loop.
 */
class Loop extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.actions = args.actions;
  }
}

/**
 * An exitwhen.
 */
class ExitWhen extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.condition = args.condition;
  }
}

/**
 * A function call.
 */
class FunctionCall extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.name = args.name;
    this.args = args.args;
  }
}

/**
 * A function reference.
 */
class FunctionReference extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.name = args.name;
  }
}

/**
 * An unary operator.
 */
class Unary extends Expression {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.operator = args.operator;
    this.value = args.value;
  }
}

/**
 * A type.
 */
class Type extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    this.name = args.name;
    this.extends = args.extends;
  }
}

/**
 * A native.
 */
class Native extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {string} */
    this.name = args.name;
    /** @member {Array<FunctionArgument>} */
    this.args = args.args;
    /** @member {string} */
    this.returnType = args.returnType;
    /** @member {boolean} */
    this.isConstant = args.isConstant || false;
  }
}

/**
 * A function call statement.
 */
class FunctionCallStatement extends Statement {
  /**
   * @param {Object} args
   */
  constructor(args) {
    super(args);

    /** @member {FunctionCall} */
    this.functionCall = args.functionCall;
  }
}

module.exports = {
  Node,
  Statement,
  Expression,
  Program,
  Globals,
  FunctionDefinition,
  FunctionArgument,
  IfThenElse,
  SetVariable,
  SetVariableArray,
  Literal,
  GetVariable,
  GetVariableArray,
  Return,
  Infix,
  VariableDefinition,
  Loop,
  ExitWhen,
  FunctionCall,
  FunctionReference,
  Unary,
  Type,
  Native,
  FunctionCallStatement,
};
