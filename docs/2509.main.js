(self.webpackChunktiny_context=self.webpackChunktiny_context||[]).push([[2509,4657,9461],{6412:e=>{"use strict";function t(e){!function(e){var t=e.util.clone(e.languages.javascript);e.languages.jsx=e.languages.extend("markup",t),e.languages.jsx.tag.pattern=/<\/?(?:[\w.:-]+(?:\s+(?:[\w.:$-]+(?:=(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s{'">=]+|\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}))?|\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}))*\s*\/?)?>/i,e.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/i,e.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s'">]+)/i,e.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,e.languages.insertBefore("inside","attr-name",{spread:{pattern:/\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}/,inside:{punctuation:/\.{3}|[{}.]/,"attr-value":/\w+/}}},e.languages.jsx.tag),e.languages.insertBefore("inside","attr-value",{script:{pattern:/=(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\})/i,inside:{"script-punctuation":{pattern:/^=(?={)/,alias:"punctuation"},rest:e.languages.jsx},alias:"language-javascript"}},e.languages.jsx.tag);var n=function(e){return e?"string"==typeof e?e:"string"==typeof e.content?e.content:e.content.map(n).join(""):""},a=function(t){for(var s=[],i=0;i<t.length;i++){var r=t[i],o=!1;if("string"!=typeof r&&("tag"===r.type&&r.content[0]&&"tag"===r.content[0].type?"</"===r.content[0].content[0].content?s.length>0&&s[s.length-1].tagName===n(r.content[0].content[1])&&s.pop():"/>"===r.content[r.content.length-1].content||s.push({tagName:n(r.content[0].content[1]),openedBraces:0}):s.length>0&&"punctuation"===r.type&&"{"===r.content?s[s.length-1].openedBraces++:s.length>0&&s[s.length-1].openedBraces>0&&"punctuation"===r.type&&"}"===r.content?s[s.length-1].openedBraces--:o=!0),(o||"string"==typeof r)&&s.length>0&&0===s[s.length-1].openedBraces){var c=n(r);i<t.length-1&&("string"==typeof t[i+1]||"plain-text"===t[i+1].type)&&(c+=n(t[i+1]),t.splice(i+1,1)),i>0&&("string"==typeof t[i-1]||"plain-text"===t[i-1].type)&&(c=n(t[i-1])+c,t.splice(i-1,1),i--),t[i]=new e.Token("plain-text",c,null,c)}r.content&&"string"!=typeof r.content&&a(r.content)}};e.hooks.add("after-tokenize",(function(e){"jsx"!==e.language&&"tsx"!==e.language||a(e.tokens)}))}(e)}e.exports=t,t.displayName="jsx",t.aliases=[]},7041:(e,t,n)=>{"use strict";var a=n(6412),s=n(4979);function i(e){e.register(a),e.register(s),function(e){var t=e.util.clone(e.languages.typescript);e.languages.tsx=e.languages.extend("jsx",t);var n=e.languages.tsx.tag;n.pattern=RegExp(/(^|[^\w$]|(?=<\/))/.source+"(?:"+n.pattern.source+")",n.pattern.flags),n.lookbehind=!0}(e)}e.exports=i,i.displayName="tsx",i.aliases=[]},4979:e=>{"use strict";function t(e){!function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},keyword:/\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,builtin:/\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/}),delete e.languages.typescript.parameter;var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript}(e)}e.exports=t,t.displayName="typescript",t.aliases=["ts"]}}]);