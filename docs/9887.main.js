(self.webpackChunktiny_context=self.webpackChunktiny_context||[]).push([[9887,8244],{8774:(e,a,t)=>{"use strict";var n=t(4691);function E(e){e.register(n),e.languages.sparql=e.languages.extend("turtle",{boolean:/\b(?:true|false)\b/i,variable:{pattern:/[?$]\w+/,greedy:!0}}),e.languages.insertBefore("sparql","punctuation",{keyword:[/\b(?:A|ADD|ALL|AS|ASC|ASK|BNODE|BY|CLEAR|CONSTRUCT|COPY|CREATE|DATA|DEFAULT|DELETE|DESC|DESCRIBE|DISTINCT|DROP|EXISTS|FILTER|FROM|GROUP|HAVING|INSERT|INTO|LIMIT|LOAD|MINUS|MOVE|NAMED|NOT|NOW|OFFSET|OPTIONAL|ORDER|RAND|REDUCED|SELECT|SEPARATOR|SERVICE|SILENT|STRUUID|UNION|USING|UUID|VALUES|WHERE)\b/i,/\b(?:ABS|AVG|BIND|BOUND|CEIL|COALESCE|CONCAT|CONTAINS|COUNT|DATATYPE|DAY|ENCODE_FOR_URI|FLOOR|GROUP_CONCAT|HOURS|IF|IRI|isBLANK|isIRI|isLITERAL|isNUMERIC|isURI|LANG|LANGMATCHES|LCASE|MAX|MD5|MIN|MINUTES|MONTH|ROUND|REGEX|REPLACE|sameTerm|SAMPLE|SECONDS|SHA1|SHA256|SHA384|SHA512|STR|STRAFTER|STRBEFORE|STRDT|STRENDS|STRLANG|STRLEN|STRSTARTS|SUBSTR|SUM|TIMEZONE|TZ|UCASE|URI|YEAR)\b(?=\s*\()/i,/\b(?:GRAPH|BASE|PREFIX)\b/i]}),e.languages.rq=e.languages.sparql}e.exports=E,E.displayName="sparql",E.aliases=["rq"]},4691:e=>{"use strict";function a(e){e.languages.turtle={comment:{pattern:/#.*/,greedy:!0},"multiline-string":{pattern:/"""(?:(?:""?)?(?:[^"\\]|\\.))*"""|'''(?:(?:''?)?(?:[^'\\]|\\.))*'''/,greedy:!0,alias:"string",inside:{comment:/#.*/}},string:{pattern:/"(?:[^\\"\r\n]|\\.)*"|'(?:[^\\'\r\n]|\\.)*'/,greedy:!0},url:{pattern:/<(?:[^\x00-\x20<>"{}|^`\\]|\\(?:u[\da-fA-F]{4}|U[\da-fA-F]{8}))*>/,greedy:!0,inside:{punctuation:/[<>]/}},function:{pattern:/(?:(?![-.\d\xB7])[-.\w\xB7\xC0-\uFFFD]+)?:(?:(?![-.])(?:[-.:\w\xC0-\uFFFD]|%[\da-f]{2}|\\.)+)?/i,inside:{"local-name":{pattern:/([^:]*:)[\s\S]+/,lookbehind:!0},prefix:{pattern:/[\s\S]+/,inside:{punctuation:/:/}}}},number:/[+-]?\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i,punctuation:/[{}.,;()[\]]|\^\^/,boolean:/\b(?:true|false)\b/,keyword:[/(?:\ba|@prefix|@base)\b|=/,/\b(?:graph|base|prefix)\b/i],tag:{pattern:/@[a-z]+(?:-[a-z\d]+)*/i,inside:{punctuation:/@/}}},e.languages.trig=e.languages.turtle}e.exports=a,a.displayName="turtle",a.aliases=[]}}]);