# Written by https://github.com/Ralle
class Node
	nextId = 0

	constructor: ({@line}) ->
		@uid = nextId++
		@fileName = ''

class Statement extends Node
class Expression extends Node

class Program extends Node
	constructor: ({@blocks}) ->
		super

class Globals extends Statement
	constructor: ({@variables}) ->
		super

class FunctionDefinition extends Statement
	constructor: ({@name, @args, @returnType, @body}) ->
		super

class FunctionArgument extends Node
	constructor: ({@type, @name}) ->
		super

class IfThenElse extends Statement
	constructor: ({@condition, @thenActions, @elseActions}) ->
		super

class SetVariable extends Statement
	constructor: ({@name, @value}) ->
		super

class SetVariableArray extends Statement
	constructor: ({@name, @index, @value}) ->
		super

class Literal extends Expression
	constructor: ({@type, @value}) ->
		super


class GetVariable extends Expression
	constructor: ({@name}) ->
		super

class GetVariableArray extends Expression
	constructor: ({@name, @index}) ->
		super

class Return extends Statement
	constructor: ({@value}) ->
		super

class Infix extends Expression
	constructor: ({@lhs, @rhs, @operator}) ->
		super

class VariableDefinition extends Statement
	constructor: ({@type, @name, @value, @isArray, @isConstant, @isLocal}) ->
		super
		if not @value?
			@value = null
		@isArray = @isArray or false
		@isConstant = @isConstant or false
		@isLocal = @isLocal or false

class Loop extends Statement
	constructor: ({@actions}) ->
		super

class ExitWhen extends Statement
	constructor: ({@condition}) ->
		super

class FunctionCall extends Expression
	constructor: ({@name, @args}) ->
		super

class FunctionReference extends Expression
	constructor: ({@name}) ->
		super

class Unary extends Expression
	constructor: ({@value, @operator}) ->
		super

class Type extends Statement
	constructor: ({@name, @extends}) ->
		super

class Native extends Statement
	constructor: ({@name, @args, @returnType, @isConstant}) ->
		@isConstant = @isConstant or false
		super

class FunctionCallStatement extends Statement
	constructor: ({@functionCall}) ->
		super

module.exports = {
	Node
	Statement
	Expression
	Program
	Globals
	FunctionDefinition
	FunctionArgument
	IfThenElse
	SetVariable
	SetVariableArray
	Literal
	GetVariable
	GetVariableArray
	Return
	Infix
	VariableDefinition
	Loop
	ExitWhen
	FunctionCall
	FunctionReference
	Unary
	Type
	Native
	FunctionCallStatement
}
