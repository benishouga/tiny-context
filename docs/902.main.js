(self.webpackChunktiny_context=self.webpackChunktiny_context||[]).push([[902],{9858:e=>{"use strict";function a(e){!function(e){var a=e.languages.javadoclike={parameter:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/};Object.defineProperty(a,"addSupport",{value:function(a,n){"string"==typeof a&&(a=[a]),a.forEach((function(a){!function(a,n){var t="doc-comment",i=e.languages[a];if(i){var o=i[t];if(!o){o=(i=e.languages.insertBefore(a,"comment",{"doc-comment":{pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,lookbehind:!0,alias:"comment"}}))[t]}if(o instanceof RegExp&&(o=i[t]={pattern:o}),Array.isArray(o))for(var r=0,s=o.length;r<s;r++)o[r]instanceof RegExp&&(o[r]={pattern:o[r]}),n(o[r]);else n(o)}}(a,(function(e){e.inside||(e.inside={}),e.inside.rest=n}))}))}}),a.addSupport(["java","javascript","php"],a)}(e)}e.exports=a,a.displayName="javadoclike",a.aliases=[]}}]);