// Written by https://github.com/Ralle
// Slightly modified.
%lex
%%

\/\/(.*)[\r\n]* // Skip comment
[\s\n]+         // Skip whitespace
[/][*][^*]*[*]+([^*/][^*]*[*]+)*[/] // Skip multiline comment
[/][*]                                    { throw "Oh noes, unterminated comment" }

[0-9]*\.[0-9]+         return 'LITERAL'
[0-9]+\.[0-9]*         return 'LITERAL'
(\$|0x)[A-Fa-f0-9]+    return 'LITERAL'
[0-9]+                 return 'LITERAL'
\"(\\.|[^\"])*\"       return 'LITERAL'
\'.{1}\'     return 'LITERAL'
\'.{4}\'     return 'LITERAL'
\b(true|false|null)\b  return 'LITERAL'

\b(array|constant|nothing)\b return yytext

// blocks
\b(function|endfunction|takes|returns|return|call|set|if|then|else|elseif|endif|globals|endglobals|loop|exitwhen|endloop|local|native|type|extends)\b return yytext

\bnot\b return yytext

// types
\b(integer|string|unit|boolean|rect|real|texttag|hashtable|timer|player|group|dialog|boolexpr|location|trigger|item|region|sound|quest|code|destructable|playercolor|camerasetup|gamecache|effect|multiboard|fogmodifier|lightning|trackable|attacktype|itemtype|multiboarditem|event|widget|ability|buff|force|triggercondition|triggeraction|conditionfunc|filterfunc|unitpool|itempool|race|alliancetype|racepreference|gamestate|igamestate|fgamestate|playerstate|playergameresult|unitstate|aidifficulty|eventid|gameevent|playerevent|playerunitevent|unitevent|limitop|widgetevent|dialogevent|unittype|gamespeed|gamedifficulty|gametype|mapflag|mapvisibility|mapsetting|mapdensity|mapcontrol|playerslotstate|volumegroup|camerafield|placement|startlocprio|raritycontrol|blendmode|texmapflags|effecttype|weathereffect|terraindeformation|fogstate|button|questitem|defeatcondition|timerdialog|leaderboard|version|agent|handle|image|ubersplat|damagetype|playerscore|weapontype|soundtype|pathingtype|mousebuttontype)\b return 'TYPE'

"*"   return '*'
"/"   return '/'
"-"   return '-'
"+"   return '+'
"("   return '('
")"   return ')'
"["   return '['
"]"   return ']'
"<="  return '<='
">="  return '>='
"=="  return '=='
"!="  return '!='
"="   return '='
"<"   return '<'
">"   return '>'
"and" return 'and'
"or"  return 'or'
","   return ","

// names
\b[a-zA-Z][a-zA-Z0-9_]*\b return 'IDENT'

<<EOF>> return 'EOF'

%%

/lex
%left 'and' 'or'
%left '<=' '>=' '==' '<' '>' '!='
%left '+' '-'
%left '*' '/'
%right 'not'

%start Program

%%

Program
  : Blocks
    {
      return new ast.Program({
        line: yylineno,
        blocks: $1
      });
    }
  ;

Blocks
  : Block Blocks
    {
      $$ = [$1].concat($2);
    }
  | 'EOF'
    {
      $$ = [];
    }
  ;

Block
  : Globals
    {
      $$ = new ast.Globals({
        line: yylineno,
        variables: $1
      });
    }
  | Function
    {
      $$ = $1;
    }
  | Native
    {
      $$ = $1;
    }
  | TypeDefinition
    {
      $$ = $1;
    }
  ;

Native
  : 'constant' 'native' IDENT 'takes' FunctionArguments 'returns' FunctionReturn
    {
      $$ = new ast.Native({
        line: yylineno,
        name: $3,
        args: $5,
        returnType: $7
      });
      $$.isConstant = true;
    }
  | 'native' IDENT 'takes' FunctionArguments 'returns' FunctionReturn
    {
      $$ = new ast.Native({
        line: yylineno,
        name: $2,
        args: $4,
        returnType: $6
      });
    }
  ;

TypeDefinition
  : 'type' TYPE 'extends' TYPE
    {
      $$ = new ast.Type({
        line: yylineno,
        name: $2,
        extends: $4
      });
    }
  ;

Globals
  : 'globals' GlobalVariableDefinitions 'endglobals'
    {
      $$ = $2;
    }
  | 'globals' 'endglobals'
    {
      $$ = [];
    }
  ;

GlobalVariableDefinitions
  : GlobalVariableDefinitions GlobalVariableDefinition
    {
      $$ = $1.concat($2);
    }
  | GlobalVariableDefinition
    {
      $$ = [$1];
    }
  ;

GlobalVariableDefinition
  : TYPE 'array' IDENT
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $1,
        name: $3,
        value: null
      });
      $$.isArray = true;
    }
  | TYPE IDENT
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $1,
        name: $2,
        value: null
      });
    }
  | TYPE IDENT '=' Expression
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $1,
        name: $2,
        value: $4
      });
    }
  | 'constant' TYPE IDENT '=' Expression
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $2,
        name: $3,
        value: $5
      });
      $$.isConstant = true;
    }
  ;

Functions
  : Function
    {
      $$ = [$1];
    }
  | Functions Function
    {
      $$ = $1.concat($2);
    }
  ;

Function
  : 'function' IDENT 'takes' FunctionArguments 'returns' FunctionReturn Statements 'endfunction'
    {
      $$ = new ast.FunctionDefinition({
        line: yylineno,
        name: $2,
        args: $4,
        returnType: $6,
        body: $7
      });
    }
  | 'constant' 'function' IDENT 'takes' FunctionArguments 'returns' FunctionReturn Statements 'endfunction'
    {
      $$ = new ast.FunctionDefinition({
        line: yylineno,
        name: $3,
        args: $5,
        returnType: $7,
        body: $8
      });
    }
  ;

FunctionArguments
  : ArgumentList
  | 'nothing'
    {
      $$ = [];
    }
  ;

ArgumentList
  : Argument
    {
      $$ = [$1];
    }
  | ArgumentList ',' Argument
    {
      $$ = $1.concat($3);
    }
  ;

Argument
  : TYPE IDENT
    {
      $$ = new ast.FunctionArgument({
        line: yylineno,
        type: $1,
        name: $2
      });
    }
  ;

FunctionReturn
  : TYPE
    {
      $$ = $1;
    }
  | 'nothing'
    {
      $$ = $1;
    }
  ;

Statements
  : StatementsReal
  | // No Statements
    {
      $$ = [];
    }
  ;

StatementsReal
  : Statement
    {
      $$ = [$1];
    }
  | StatementsReal Statement
    {
      $$ = $1.concat($2);
    }
  ;

Statement
  : 'if' Expression 'then' Statements Elses 'endif'
    {
      $$ = new ast.IfThenElse({
        line: yylineno,
        condition: $2,
        thenActions: $4,
        elseActions: $5
      });
    }
  | 'set' IDENT '=' Expression
    {
      $$ = new ast.SetVariable({
        line: yylineno,
        name: $2,
        value: $4
      });
    }
  | 'set' IDENT '[' Expression ']' '=' Expression
    {
      $$ = new ast.SetVariableArray({
        line: yylineno,
        name: $2,
        index: $4,
        value: $7
      });
    }
  | 'call' FunctionCall
    {
      $$ = new ast.FunctionCallStatement({
        line: yylineno,
        functionCall: $2
      });
    }
  | 'return' Expression
    {
      $$ = new ast.Return({
        line: yylineno,
        value: $2
      });
    }
  | 'return'
    {
      $$ = new ast.Return({
        line: yylineno,
        value: null
      });
    }
  | 'loop' Statements 'endloop'
    {
      $$ = new ast.Loop({
        line: yylineno,
        actions: $2
      });
    }
  | 'exitwhen' Expression
    {
      $$ = new ast.ExitWhen({
        line: yylineno,
        condition: $2
      });
    }
  | 'local' TYPE 'array' IDENT
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $2,
        name: $4,
        value: null
      });
      $$.isLocal = true;
      $$.isArray = true;
    }
  | 'local' TYPE IDENT '=' Expression
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $2,
        name: $3,
        value: $5
      });
      $$.isLocal = true;
    }
  | 'local' TYPE IDENT
    {
      $$ = new ast.VariableDefinition({
        line: yylineno,
        type: $2,
        name: $3,
        value: null
      });
      $$.isLocal = true;
    }
  ;

Elses
  : ElseIf Elses
    {
      $1.elseActions = $2;
      $$ = [$1];
    }
  | 'else' Statements
    {
      $$ = $2;
    }
  | // nothing
    {
      $$ = [];
    }
  ;

ElseIf
  : 'elseif' Expression 'then' Statements
    {
      $$ = new ast.IfThenElse({
        line: yylineno,
        condition: $2,
        thenActions: $4,
        elseActions: []
      });
    }
  ;

FunctionCall
  : IDENT '(' FunctionCallArguments ')'
    {
      $$ = new ast.FunctionCall({
        line: yylineno,
        name: $1,
        args: $3
      });
    }
  ;

FunctionCallArguments
  : Expressions
  | // Nothing
    {
      $$ = [];
    }
  ;

Expressions
  : Expression
    {
      $$ = [$1];
    }
  | Expressions ',' Expression
    {
      $$ = $1.concat($3);
    }
  ;

Expression
  : Expression '+' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '-' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '*' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '/' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '<' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '>' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '>=' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '<=' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '==' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression '!=' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression 'and' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | Expression 'or' Expression
    {
      $$ = new ast.Infix({
        line: yylineno,
        lhs: $1,
        rhs: $3,
        operator: $2
      });
    }
  | 'not' Expression
    {
      $$ = new ast.Unary({
        line: yylineno,
        value: $2,
        operator: $1
      });
    }
  | '-' Expression
    {
      $$ = new ast.Unary({
        line: yylineno,
        value: $2,
        operator: $1
      });
    }
  | '(' Expression ')'
    {
      $$ = $2;
    }
  | IDENT '[' Expression ']'
    {
      $$ = new ast.GetVariableArray({
        line: yylineno,
        name: $1,
        index: $3
      });
    }
  | IDENT
    {
      $$ = new ast.GetVariable({
        line: yylineno,
        name: $1
      });
    }
  | FunctionCall
    {
      $$ = $1;
    }
  | 'function' IDENT
    {
      $$ = new ast.FunctionReference({
        line: yylineno,
        name: $2
      });
    }
  | LITERAL
    {
      const literalValue = util.literalValue($1);
      $$ = new ast.Literal({
        line: yylineno,
        type: literalValue.type,
        value: literalValue.value
      });
    }
  ;

%%

//var ast = require('./ast');
//var util = require('./util');
