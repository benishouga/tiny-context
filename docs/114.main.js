(window.webpackJsonp=window.webpackJsonp||[]).push([[114,182],{194:function(e,n,a){"use strict";var t=a(46);function d(e){e.register(t),function(e){for(var n=/\((?:[^();"#\\]|\\[\s\S]|;.*(?!.)|"(?:[^"\\]|\\.)*"|#(?:\{(?:(?!#\})[\s\S])*#\}|[^{])|<expr>)*\)/.source,a=0;a<5;a++)n=n.replace(/<expr>/g,(function(){return n}));n=n.replace(/<expr>/g,/[^\s\S]/.source);var t=e.languages.lilypond={comment:/%(?:(?!\{).*|\{[\s\S]*?%\})/,"embedded-scheme":{pattern:RegExp(/(^|[=\s])#(?:"(?:[^"\\]|\\.)*"|[^\s()"]*(?:[^\s()]|<expr>))/.source.replace(/<expr>/g,(function(){return n})),"m"),lookbehind:!0,greedy:!0,inside:{scheme:{pattern:/^(#)[\s\S]+$/,lookbehind:!0,alias:"language-scheme",inside:{"embedded-lilypond":{pattern:/#\{[\s\S]*?#\}/,greedy:!0,inside:{punctuation:/^#\{|#\}$/,lilypond:{pattern:/[\s\S]+/,alias:"language-lilypond",inside:null}}},rest:e.languages.scheme}},punctuation:/#/}},string:{pattern:/"(?:[^"\\]|\\.)*"/,greedy:!0},"class-name":{pattern:/(\\new\s+)[\w-]+/,lookbehind:!0},keyword:{pattern:/\\[a-z][-\w]*/i,inside:{punctuation:/^\\/}},operator:/[=|]|<<|>>/,punctuation:{pattern:/(^|[a-z\d])(?:'+|,+|[_^]?-[_^]?(?:[-+^!>._]|(?=\d))|[_^]\.?|[.!])|[{}()[\]<>^~]|\\[()[\]<>\\!]|--|__/,lookbehind:!0},number:/\b\d+(?:\/\d+)?\b/};t["embedded-scheme"].inside.scheme.inside["embedded-lilypond"].inside.lilypond.inside=t,e.languages.ly=t}(e)}e.exports=d,d.displayName="lilypond",d.aliases=[]},46:function(e,n,a){"use strict";function t(e){e.languages.scheme={comment:/;.*/,string:{pattern:/"(?:[^"\\]|\\.)*"/,greedy:!0},symbol:{pattern:/'[^()#'\s]+/,greedy:!0},character:{pattern:/#\\(?:[ux][a-fA-F\d]+|[-a-zA-Z]+|\S)/,greedy:!0,alias:"string"},"lambda-parameter":[{pattern:/(\(lambda\s+)[^()'\s]+/,lookbehind:!0},{pattern:/(\(lambda\s+\()[^()']+/,lookbehind:!0}],keyword:{pattern:/(\()(?:define(?:-library|-macro|-syntax|-values)?|defmacro|(?:case-)?lambda|let(?:(?:\*|rec)?(?:-values)?|-syntax|rec-syntax)|else|if|cond|begin|delay(?:-force)?|parameterize|guard|set!|(?:quasi-)?quote|syntax-(?:case|rules))(?=[()\s]|$)/,lookbehind:!0},builtin:{pattern:/(\()(?:(?:cons|car|cdr|list|call-with-current-continuation|call\/cc|append|abs|apply|eval)\b|null\?|pair\?|boolean\?|eof-object\?|char\?|procedure\?|number\?|port\?|string\?|vector\?|symbol\?|bytevector\?)(?=[()\s]|$)/,lookbehind:!0},number:{pattern:/(^|[\s()])(?:(?:#d(?:#[ei])?|#[ei](?:#d)?)?[+-]?(?:(?:\d*\.?\d+(?:[eE][+-]?\d+)?|\d+\/\d+)(?:[+-](?:\d*\.?\d+(?:[eE][+-]?\d+)?|\d+\/\d+)i)?|(?:\d*\.?\d+(?:[eE][+-]?\d+)?|\d+\/\d+)i)|(?:#[box](?:#[ei])?|#[ei](?:#[box])?)[+-]?(?:[\da-fA-F]+(?:\/[\da-fA-F]+)?(?:[+-][\da-fA-F]+(?:\/[\da-fA-F]+)?i)?|[\da-fA-F]+(?:\/[\da-fA-F]+)?i))(?=[()\s]|$)/,lookbehind:!0},boolean:{pattern:/(^|[\s()])#[ft](?=[()\s]|$)/,lookbehind:!0},operator:{pattern:/(\()(?:[-+*%\/]|[<>]=?|=>?)(?=[()\s]|$)/,lookbehind:!0},function:{pattern:/(\()[^()'\s]+(?=[()\s]|$)/,lookbehind:!0},punctuation:/[()']/}}e.exports=t,t.displayName="scheme",t.aliases=[]}}]);