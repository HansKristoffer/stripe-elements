var r="https://js.stripe.com/v3",n=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,e="loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used",t=null,o=function(r,n,e){if(null===r)return null;var t=r.apply(void 0,n);return function(r,n){r&&r._registerWrapper&&r._registerWrapper({name:"stripe-js",version:"1.31.0",startTime:n})}(t,e),t},i=Promise.resolve().then((function(){return o=null,null!==t?t:t=new Promise((function(t,i){if("undefined"!=typeof window)if(window.Stripe&&o&&console.warn(e),window.Stripe)t(window.Stripe);else try{var a=function(){for(var e=document.querySelectorAll('script[src^="'.concat(r,'"]')),t=0;t<e.length;t++){var o=e[t];if(n.test(o.src))return o}return null}();a&&o?console.warn(e):a||(a=function(n){var e=n&&!n.advancedFraudSignals?"?advancedFraudSignals=false":"",t=document.createElement("script");t.src="".concat(r).concat(e);var o=document.head||document.body;if(!o)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return o.appendChild(t),t}(o)),a.addEventListener("load",(function(){window.Stripe?t(window.Stripe):i(new Error("Stripe.js not available"))})),a.addEventListener("error",(function(){i(new Error("Failed to load Stripe.js"))}))}catch(r){return void i(r)}else t(null)}));var o})),a=!1;i.catch((function(r){a||console.warn(r)}));var s=function(){for(var r=arguments.length,n=new Array(r),e=0;e<r;e++)n[e]=arguments[e];a=!0;var t=Date.now();return i.then((function(r){return o(r,n,t)}))};export{s as l}