tokens
  = v:token* {
        return v.reduce(function(array, value) {
            array = array.concat(value);
            return array;
        }, []);
    }

token
  = commandToken
  / stringToken

commandToken
  = !'\\' '<' v:keyValueList '>' {
        var token = {};
        v.forEach(function(kv) {
            token[kv.key] = kv.value;
        });
        return token;
    }

keyValueList
  = v:keyValue rest:(',' keyValueList)? {
        return [v].concat((rest && rest[1]) || []);
    }

keyValue
  = keyNumberValue
  / keyAnyValue
  / keyFlag

keyNumberValue
  = key:keyNumberValueIdentifier value:number {
        return { key, value };
    }

keyNumberValueIdentifier
  = $([a-zA-Z]+)

keyAnyValue
  = key:identifier ':' value:value {
        return { key, value };
    }

keyFlag
  = key:identifier {
        return { key, value: true };
    }

identifier 'identifier'
  = $([a-zA-Z][a-zA-Z0-9]*)

number 'number'
  = v:$([0-9]+('.' [0-9]+)?) {
        return parseFloat(v);
    }

value
  = number
  / string
  / boolean
  / null
  / identifier
  / objectLiteral
  / jsBlock

string
  = singleQuotedString
  / doubleQuotedString

singleQuotedString
  = "'" v:$(("\\'" / (!"'" .))+) "'" {
        return v;
    }

doubleQuotedString
  = '"' v:$(('\\"' / (!'"' .))+) '"' {
        return v;
    }

boolean
  = 'true' {
        return true;
    }
  / 'false' {
        return false;
    }

null
  = 'null' {
        return null;
    }

objectLiteral
  = '```{' v:$((!'}```' .)+) '}```' {
        return { objectLiteral: '{' + v + '}' };
    }

jsBlock
  = '```' v:$((!'```' .)+) '```' {
        return { code: v };
    }

stringToken
  = v:(
        escapedBackslashBeforeLineBreak
        / escapedLineBreak
        / escapedLessThanSign
        / otherStringTokenCharacter
    )+ {
	    return v.join('');
    }

escapedBackslashBeforeLineBreak
  = '\\\\' &'\n' {
	    return '\\';
    }

escapedLineBreak
  = '\\\n' {
	    return '';
    }

escapedLessThanSign
  = '<<' {
	    return '<';
    }

otherStringTokenCharacter
  = $(!'<' .)
