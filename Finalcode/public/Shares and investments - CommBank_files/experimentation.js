(function (window, document) {

   'use strict';

   var queuedFiles = [],
       head = document.getElementsByTagName('head')[0];

   var domReady = function (callback) {
          if (document.addEventListener) {
             document.addEventListener('DOMContentLoaded', callback);
          }
          else {
             window.attachEvent('onload', callback);
          }
       },

       writeCss = function (str) {
          var style = document.createElement('style');

          style.setAttribute('type', 'text/css');

          try {
             style.innerHTML = str;
          }
          catch (error) {
             style.styleSheet.cssText = str;
          }

          head.appendChild(style);
       },

       createNode = function (type, attrs, callback) {

          var node = document.createElement(type);

          attrs['class'] = 'switchblade-lite-tt';

          for (var key in attrs) {

             if (attrs.hasOwnProperty(key)) node.setAttribute(key, attrs[key]);

          }

          if (type === 'script') {

             node.setAttribute('state', 'loading');

             //ie
             if ('onreadystatechange' in node) {

                node.onreadystatechange = function () {

                   node.setAttribute('state', 'loaded');

                   if (callback) callback();

                };

                //everything else
             } else {

                node.onload = function () {

                   node.setAttribute('state', 'loaded');

                   if (callback) callback();

                };

             }

          }

          return node;

       },

       loadCss = function (files) {

          for (var i = 0; i < files.length; i++) {

             head.appendChild(createNode('link', {type: 'text/css', rel: 'stylesheet', 'href': files[i]}));

          }

       },

       loadJs = function (files, loadOnDomReady, loadInOrder) {

          var i = 0,

              loadFilesInOrder = function () {

                 var checkLoadState = function (file) {

                        //check if already loaded
                        for (var i = 0, ql = queuedFiles.length; i < ql; i++) {

                           if (queuedFiles[i] === file) return true;

                        }

                        return false;

                     },

                     executeLoad = function (files) {

                        var file = files[0], node;

                        if (!checkLoadState(file)) {

                           //add to loaded queue
                           queuedFiles.push(file);

                           node = createNode('script', {src: files[i], charset: 'utf-8'}, function () {

                              files = files.slice(1);

                              if (files.length > 0) executeLoad(files, file);

                           });

                           head.appendChild(node);

                           //if loaded
                        } else {

                           files = files.slice(1);

                           if (files.length > 0) executeLoad(files);

                        }


                     };

                 //loop trough each file in array.

                 executeLoad(files);

              },

              loadFiles = function () {

                 for (var j = 0, lngth = files.length; j < lngth; j++) {

                    head.appendChild(createNode('script', {src: files[j], charset: 'utf-8'}));

                 }

              };

          if (loadOnDomReady && loadInOrder) {

             domReady(function () {

                loadFilesInOrder();

             });

          } else if (loadInOrder) {

             loadFilesInOrder();

          } else if (loadOnDomReady) {

             domReady(function () {

                loadFiles();

             });

          } else {

             loadFiles();

          }

       };

   var SwitchBladeLiteTnt = function (options) {
      this.mbox = options.mbox;
      this.offerMap = options.offerMap;
      this.experiments = options.experiments;
      //the default experience to load.
      this['default'] = options['default'];
      //check whether to run experiment.
      this.enabled = typeof(options.enabled) === 'undefined' || options.enabled === true;
      this.cacheOffer = (typeof options.cacheOffer !== 'undefined') ? options.cacheOffer : true;

      if (!this.mbox || !this.offerMap || !this.experiments) {
         throw new Error('missing one or more parameters');
      }

      this.loaded = false;
      return this;
   };


   SwitchBladeLiteTnt.prototype = {
      init: function (callback) {

         //load default experience if options.enabled !true || undefined
         var cachedOfferId;

         if (!this.enabled) {
            sessionStorage.setItem(this.mbox, this['default']);
         }

         cachedOfferId = sessionStorage ? sessionStorage[this.mbox] : null;

         this.initCss();

         if (!mboxCreate) {
            throw new Error('mbox.js is not loaded');
         }

         if (this.cacheOffer && cachedOfferId) {
            this.load(cachedOfferId);
         }
         else {
            mboxCreate(this.mbox);
            if(typeof(callback) === 'function') callback();
         }

         return this;
      },

      load: function (offerId) {

         if (!this.loaded) {

            this.loaded = true;

            if (this.cacheOffer && sessionStorage) {
               sessionStorage[this.mbox] = offerId;
            }

            var experiments = this.offerMap[offerId];

            if (experiments) {

               for (var experimentName in experiments) {

                  var experiment = this.experiments[experimentName];

                  var variationName = experiments[experimentName];

                  var variation = experiment.variations[variationName];

                  if (!experiment.condition || experiment.condition.call(this)) {

                     this.loadVariation(variation);

                  }

               }

            }

         }

      },

      loadVariation: function (variation) {

         if (variation.show) {
            writeCss(variation.show + ' { display:block !important; }');
         }

         if (variation.hide) {
            writeCss(variation.hide + ' { display:none !important; }');
         }

         if (variation.css) {
            loadCss(variation.css);
         }

         if (variation.js) {
            loadJs(variation.js, variation.loadOnDomReady, variation.loadInOrder);
         }

         if (variation.onLoad) {
            variation.onLoad.call(this);
         }

      },

      initCss: function () {
         var css = '';

         for (var experimentName in this.experiments) {

            var experiment = this.experiments[experimentName];

            if (experiment.condition || experiment.condition.call(this)) {

               for (var variationId in experiment.variations) {

                  var variation = experiment.variations[variationId];

                  if (variation['default']) {
                     if (variation.show) {
                        css += variation.show + ' { display:block; }\n';
                     }
                     if (variation.hide) {
                        css += variation.hide + ' { display:none; }\n';
                     }
                  }

               }
            }
         }

         if (css !== '') {
            writeCss(css);
         }
      }

   };

   window.SwitchBladeLiteTnt = SwitchBladeLiteTnt;

})(window, document);
