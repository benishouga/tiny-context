(self.webpackChunktiny_context=self.webpackChunktiny_context||[]).push([[3047],{3205:e=>{"use strict";function n(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,o,r){if(t.language===a){var c=t.tokenStack=[];t.code=t.code.replace(o,(function(e){if("function"==typeof r&&!r(e))return e;for(var o,i=c.length;-1!==t.code.indexOf(o=n(a,i));)++i;return c[i]=e,o})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var o=0,r=Object.keys(t.tokenStack);!function c(i){for(var u=0;u<i.length&&!(o>=r.length);u++){var s=i[u];if("string"==typeof s||s.content&&"string"==typeof s.content){var l=r[o],p=t.tokenStack[l],g="string"==typeof s?s:s.content,f=n(a,l),k=g.indexOf(f);if(k>-1){++o;var h=g.substring(0,k),m=new e.Token(a,e.tokenize(p,t.grammar),"language-"+a,p),y=g.substring(k+f.length),d=[];h&&d.push.apply(d,c([h])),d.push(m),y&&d.push.apply(d,c([y])),"string"==typeof s?i.splice.apply(i,[u,1].concat(d)):s.content=d}}else s.content&&c(s.content)}return i}(t.tokens)}}}})}(e)}e.exports=n,n.displayName="markupTemplating",n.aliases=[]}}]);