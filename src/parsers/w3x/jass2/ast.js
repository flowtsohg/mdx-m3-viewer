let nextId = 0;

/**
 * @constructor
 */
class Node {
    constructor(args) {
        /** @member {number} */
        this.line = args.line;
        /** @member {number} */
        this.uid = nextId++;
    }
}

/**
 * @constructor
 */
class Statement extends Node {

}

/**
 * @constructor
 */
class Expression extends Node {

}

/**
 * @constructor
 */
class Program extends Node {
    constructor(args) {
        super(args);

        /** @member {Array<Statement>} */
        this.blocks = args.blocks;
    }
}

/**
 * @constructor
 */
class Globals extends Statement {
    constructor(args) {
        super(args);

        /** @member {Array<VariableDefinition>} */
        this.variables = args.variables;
    }
}

/**
 * @constructor
 */
class FunctionDefinition extends Statement {
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
 * @constructor
 */
class FunctionArgument extends Node {
    constructor(args) {
        super(args);

        /** @member {string} */
        this.type = args.type;
        /** @member {string} */
        this.name = args.name;
    }
}

/**
 * @constructor
 */
class IfThenElse extends Statement {
    constructor(args) {
        super(args);

        this.condition = args.condition;
        this.thenActions = args.thenActions;
        this.elseActions = args.elseActions;
    }
}

/**
 * @constructor
 */
class SetVariable extends Statement {
    constructor(args) {
        super(args);

        this.name = args.name;
        this.value = args.value;
    }
}

/**
 * @constructor
 */
class SetVariableArray extends Statement {
    constructor(args) {
        super(args);

        this.name = args.name;
        this.index = args.index;
        this.value = args.value;
    }
}

/**
 * @constructor
 */
class Literal extends Expression {
    constructor(args) {
        super(args);

        /** @member {string} */
        this.type = args.type;
        /** @member {?} */
        this.value = args.value;
    }
}

/**
 * @constructor
 */
class GetVariable extends Expression {
    constructor(args) {
        super(args);

        /** @member {string} */
        this.name = args.name;
    }
}

/**
 * @constructor
 */
class GetVariableArray extends Expression {
    constructor(args) {
        super(args);

        /** @member {string} */
        this.name = args.name;
        /** @member {number} */
        this.index = args.index;
    }
}

/**
 * @constructor
 */
class Return extends Statement {
    constructor(args) {
        super(args);

        this.value = args.value;
    }
}

/**
 * @constructor
 */
class Infix extends Expression {
    constructor(args) {
        super(args);

        this.lhs = args.lhs;
        this.operator = args.operator;
        this.rhs = args.rhs;
    }
}

/**
 * @constructor
 */
class VariableDefinition extends Statement {
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
 * @constructor
 */
class Loop extends Statement {
    constructor(args) {
        super(args);

        this.actions = args.actions;
    }
}

/**
 * @constructor
 */
class ExitWhen extends Statement {
    constructor(args) {
        super(args);

        this.condition = args.condition;
    }
}

/**
 * @constructor
 */
class FunctionCall extends Expression {
    constructor(args) {
        super(args);

        this.name = args.name;
        this.args = args.args;
    }
}

/**
 * @constructor
 */
class FunctionReference extends Expression {
    constructor(args) {
        super(args);

        /** @member {string} */
        this.name = args.name;
    }
}

/**
 * @constructor
 */
class Unary extends Expression {
    constructor(args) {
        super(args);

        this.operator = args.operator;
        this.value = args.value;
    }
}

/**
 * @constructor
 */
class Type extends Statement {
    constructor(args) {
        super(args);

        this.name = args.name;
        this.extends = args.extends;
    }
}

/**
 * @constructor
 */
class Native extends Statement {
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
 * @constructor
 */
class FunctionCallStatement extends Statement {
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
    FunctionCallStatement
};
