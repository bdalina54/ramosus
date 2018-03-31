/*
 * Ramosus Image Viewer is an Open Source  Code Licence Under MIT
 * Created by: Bradley B. Dalina; March 27, 2018
 * Please include the credits when you use this.
 */

(function(w, d)
    {
        'use_strict';
        function _()
        {
            var r = {};

            //Global variables--------------------------------------------------------
            var $params ={};
            var $months =["January", "February", "March", "April", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var shadowView='j-shadow-view', controlView='j-control-view', infoView='j-info-view',styleView='j-style-view',
                imageView  = 'j-image-view', detailView = 'j-detail-view', titleView  = 'j-title-view', descriptionView ='j-description-view';

            //Functions---------------------------------------------------------------
            function hasClass(el, className)
						{
                if (el.classList) return el.classList.contains(className);
                else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
						}

						function addClass(el, className)
						{
                if (el.classList)el.classList.add(className);
                else if (!hasClass(el, className)) el.className += " " + className;
						}

						function removeClass(el, className)
						{
  							if (el.classList) el.classList.remove(className);
  							else if (hasClass(el, className))
  							{
    							  var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    							  el.className=el.className.replace(reg, ' ');
  							}
						}

            function objectID(id){return d.getElementById(id);}
					  function objectEL(el){return d.querySelector(el);}
            function objectELS(el){return d.querySelectorAll(el);}
					  function ucfirst(str){return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})};
            function clean(str){return str.replace(/[^\w\s]/gi, ''); } /*input.replace(/\W/g, '')  input.replace(/[^0-9a-z]/gi, '')   string.replace(/[^A-Za-z0-9]/g, '');*/
            function cleanspace(str){return str.replace(/[^\w\s]/gi, ' '); }

            function getInfo(obj, par)
						{
                var link = (obj.getAttribute('data-url') !== null) ? obj.getAttribute('data-url') : obj.getAttribute('src');
                return new Promise(function(resolve, reject)
                {
                      var xhr = new XMLHttpRequest();
        							xhr.open('POST', link, true);
        							xhr.onreadystatechange = function()
                      {
          							  if ( xhr.readyState == 4 )
                          {
              								if ( xhr.status == 200 )
                              {
              								    resolve({'filesize':xhr.getResponseHeader('Content-Length'), 'date':xhr.getResponseHeader('Last-Modified'), 'url':link});
              								}
                              else
                              {
                								 console.error('Error: File not found "'+link+'" the default image source will be loaded');
                								 reject({'filesize':'Unavailable', 'date':'Unavailable','url':obj.getAttribute('src')});
              								}
          							  }
        							};
							        xhr.send(null);
							 });
						}


            function initView()
            {
                  //Adding stylesheet
                  if(!objectID(styleV))
                  {
                      var styleV = d.createElement('style');
                      styleV.setAttribute('id', 'ramosusView');
                      styleV.setAttribute('rel', 'stylesheet');
                      styleV.setAttribute('type', 'text/css');
                      var h = objectEL('head');
                      if(!h)
                      {
                          h=objectEL('html');
                      }
                      h.append(styleV);
                      styleV.innerHTML="#j-shadow-view{background-color: #000; position:fixed; margin:auto; top:0; left:0; bottom:0; right:0; z-index:999;}"+
                                        "#j-detail-view{background-color: rgba(0, 0, 0, .3); position:absolute; bottom:0; left:0; right:0; padding: 30px 20px; color:#ccc !important;text-align:center; vertical-align:middle; z-index:999;}"+
                                        "#j-detail-content{text-align:left; display:block;margin: 0 auto; float:none;}"+
                                        "#j-detail-content a, #j-detail-content a:link, #j-detail-content a:visited,#j-info-view,#j-info-view b {color:#ccc !important; font-size:1.3rem !important; text-decoration:none;}"+
                                        "#j-description {color:#ccc;}"+

                                        "#j-control-view{background-color: rgba(0, 0, 0, .3); position:absolute; top:0; left:0; right:0; padding: 10px; color:#ccc !important;text-align:center; vertical-align:middle; z-index:999; }"+
                                        "#j-title{text-align:left; display:block;margin: 0;}"+
                                        "#j-control-title h3{padding:10px;}"+
                                        "#j-control-content{text-align:right; display:block;margin: 0 auto; }"+
                                        "#j-control-content a{padding:10px; display:inline-block; color:#ccc; text-decoration:none;}"+
                                        "#j-control-content h1,#j-control-content h2, #j-control-content h3,#j-control-content h4, #j-control-content h5{padding:0; margin:0;}"+

                                        "#j-image-container{width:100%; height:100%; border:0; outline:0;  overflow:hidden; position:relative; display: -webkit-box;"+
                                          "display: -moz-box;"+
                                          "display: -ms-flexbox;"+
                                          "display: -webkit-flex;"+
                                          "display: flex;"+
                                          "-webkit-box-align: center;"+
                                             "-moz-box-align: center;"+
                                             "-ms-flex-align: center;"+
                                          "-webkit-align-items: center;"+
                                                  "align-items: center;"+
                                          "-webkit-box-pack: center;"+
                                             "-moz-box-pack: center;"+
                                             "-ms-flex-pack: center;"+
                                          "-webkit-justify-content: center;"+
                                          "justify-content: center;}"+
                                        "#j-image-view{height:100%; position:relative; display: -webkit-box;"+
                                          "display: -moz-box;"+
                                          "display: -ms-flexbox;"+
                                          "display: -webkit-flex;"+
                                          "display: flex;"+
                                          "-webkit-box-align: center;"+
                                             "-moz-box-align: center;"+
                                             "-ms-flex-align: center;"+
                                          "-webkit-align-items: center;"+
                                                  "align-items: center;"+
                                          "-webkit-box-pack: center;"+
                                             "-moz-box-pack: center;"+
                                             "-ms-flex-pack: center;"+
                                          "-webkit-justify-content: center;"+
                                          "justify-content: center;}"+
                                        "#j-actual-image{height:85%; margin: auto; position:absolute; cursor:move;}"+
                                        ".b-clear{clear:both;} .b-block{display:block; .b-none{display:none;}";
                  }

                  //Adding the element for image viewer
                  if(!objectID(shadowView))
                  {
                      var shadowV = d.createElement('div');
                      shadowV.setAttribute('id',shadowView);
                      shadowV.setAttribute('class','b-none');

                      var b = objectEL('body');
                      if(!b){b=objectEL('html');}
                      b.prepend(shadowV);


                      $viewer='<div id="j-image-view" class="">'+
                                    //Controls-------------------------------------------------------
                              			'<div id="j-control-view" class="b-none">'+
                                  				'<div id="j-control-title" class="col-md-6"><h3 id="j-title">Image Title</h3></div>'+
                                  				'<div id="j-control-content" class="col-md-6"><a href="#" class="b-expand"><h3>&#x26F6;</h3></a><a href="#" class="b-close"><h3>&#10006;</h3></a></div>'+
                                          '<div class="b-clear"></div>'+
                              			'</div>'+
                                    //Actual Image---------------------------------------------------
                              			'<div id="j-image-container">'+
                                          '<img src="#" id="j-actual-image" class="b-none"/>'+
                              			'</div>'+
                                    //Image Details--------------------------------------------------
                              			'<div id="j-detail-view" class="b-none">'+
                                  				'<div id="j-detail-content" class="col-md-12">'+
                                    					'<font id="j-description">Image long long description...</font>'+
                                    					'<span id="j-info-view"></span>'+
                                  				'</div>'+
                              			'</div>'+
                      	       '</div>';

                        objectID(shadowView).innerHTML = $viewer;
                  }
            }

            function animate($params)
            {
                var source = $params.url.split("/").pop();
                objectID('j-title').innerHTML= ($params.title !=='') ? $params.title : cleanspace(ucfirst(source.split(".").shift()));
                objectID('j-description').innerHTML= $params.description;
                objectID('j-actual-image').src=$params.url;

                objectID(shadowView).setAttribute('class', 'b-block');

                var selected = null, // Object of the element to be moved
                    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
                    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

                    // Will be called when user starts dragging an element

                var fadein = objectID(shadowView).animate([{ opacity: 0 },{ opacity: 1 }], {duration: 700,easing: 'ease-in', iterations: 1,fill :"forwards"});

                    fadein.onfinish = function(e)
                          {
                              objectID('j-actual-image').setAttribute('class','b-block');
                                  var t;
                                  var bars = true;

                                  function resetTimer()
                                  {
                                      clearTimeout(t);
                                      t = setTimeout(show_infobars, 5000) // 1000 milisec = 1 sec
                                  }
                                  function show_infobars() {
                                    bars = true;
                                      objectID(controlView).setAttribute('class', 'b-block');
                                      var slidedown = objectID(controlView).animate([{ transform: 'translateY(-100%)'},{ transform:'translateY(0%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                                          if($params['show-details']===true)
                                          {
                                              slidedown.onfinish = function(e)
                                                        {
                                                            objectID(detailView).setAttribute('class', 'b-block');
                                                            var slideup = objectID(detailView).animate([{ transform: 'translateY(100%)'},{ transform:'translateY(0%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});

                                                        }
                                          }
                                    }

                                    function hide_infobars(){
                                      bars = false;
                                    var hideup = objectID(controlView).animate([{ transform: 'translateY(0%)'},{ transform:'translateY(-100%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                                    hideup.onfinish = function(e)
                                                       {
                                                             objectID(controlView).setAttribute('class', 'b-none');
                                                             if($params['show-details']===true)
                                                             {
                                                               var hidedown = objectID(detailView).animate([{ transform: 'translateY(0%)'},{ transform:'translateY(100%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                                                               hidedown.onfinish = function(e)
                                                               {
                                                                 objectID(detailView).setAttribute('class', 'b-none');
                                                               }
                                                             }
                                                        }
                                  }
                                  function _drag_init(elem) {
                                      // Store the object of the element which needs to be moved
                                      selected = elem;
                                      x_elem = x_pos - selected.offsetLeft;
                                      y_elem = y_pos - selected.offsetTop;
                                  }

                                  // Will be called when user dragging an element
                                  function _move_elem(e)
                                  {

                                      x_pos = document.all ? window.event.clientX : e.pageX; //window.event.clientX
                                      y_pos = document.all ? window.event.clientY : e.pageY; //window.event.clientY
                                      if (selected !== null) {
                                          hide_infobars();
                                          selected.style.left =(x_pos - x_elem) + 'px'; ///(x_pos - x_elem) + 'px';
                                          selected.style.top = (y_pos - y_elem) + 'px';/// (y_pos - y_elem) + 'px';
                                      }
                                  }

                                  // Destroy the object when we are done
                                  function _destroy()
                                  {
                                    if(bars===false)
                                    {
                                      resetTimer();
                                    }

                                      selected = null;
                                  }
                              document.getElementById('j-actual-image').onmousedown = function ()
                              {
                                  _drag_init(this);
                                  return false;
                              };

                              document.onmousemove = _move_elem;
                              document.onmouseup = _destroy;

                              var zoomin = objectID('j-actual-image').animate([{ transform: 'scale(0,0) '},{ transform:'scale(1,1)' }], {duration: 750,easing: 'ease-in', iterations: 1,fill :"forwards"});

                                  zoomin.onfinish = function(e)
                                        {
                                            objectID(controlView).setAttribute('class', 'b-block');
                                            var slidedown = objectID(controlView).animate([{ transform: 'translateY(-100%)'},{ transform:'translateY(0%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                                                if($params['show-details']===true)
                                                {
                                                    slidedown.onfinish = function(e)
                                                              {
                                                                  objectID(detailView).setAttribute('class', 'b-block');
                                                                  var slideup = objectID(detailView).animate([{ transform: 'translateY(100%)'},{ transform:'translateY(0%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});

                                                              }
                                                }

                                        }
                          }

                var expanded = false;
                objectEL('.b-expand').onclick =function(e)
                {
                    var $this = this;
                          if(expanded===false)
                          {
                          var expand =  objectID('j-actual-image').animate([{ transform: 'scale(1,1)'},{ transform: 'scale(2,2)'}], {duration: 750,iterations: 1, fill:"forwards"});
                                        expand.onfinish = function(e)
                                            {
                                                expanded = true;
                                            }
                          }
                          else
                          {
                          var contract =  objectID('j-actual-image').animate([{ transform: 'scale(2,2)'},{ transform: 'scale(1,1)'}], {duration: 750,iterations: 1, fill:"forwards"});
                                          contract.onfinish = function(e)
                                              {
                                                  expanded = false;
                                              }
                          }
                }

                function destroy_viewer()
                {
                      objectID(controlView).setAttribute('class', 'b-block');
                      var hideup = objectID(controlView).animate([{ transform: 'translateY(0%)'},{ transform:'translateY(-100%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                               hideup.onfinish = function(e)
                                                  {

                                                        objectID(controlView).setAttribute('class', 'b-none');
                                                        if($params['show-details']===true)
                                                        {

                                                          objectID(detailView).setAttribute('class', 'b-block');

                                                          var hidedown = objectID(detailView).animate([{ transform: 'translateY(0%)'},{ transform:'translateY(100%)' }], {duration: 800,easing: 'ease-in', iterations: 1,fill :"forwards"});
                                                                         hidedown.onfinish = function(e)
                                                                         {
                                                                            var shrink =  objectID('j-actual-image').animate([{ transform: 'scale(1,1)', opacity:1 },{ transform: 'scale(0,0)', opacity:0 }], {duration: 750,iterations: 1});
                                                                                          shrink.onfinish = function(e)
                                                                                              {
                                                                                                  objectID('j-actual-image').setAttribute('class', 'b-block');
                                                                                                  objectID(detailView).setAttribute('class', 'b-none');
                                                                                                  objectID('j-actual-image').src='#';
                                                                                                  objectID('j-actual-image').setAttribute('class', 'b-none');
                                                                                              }
                                                                            var fadeout = objectID(shadowView).animate([{ opacity: 1 },{ opacity: 0 }], {duration: 800,easing: 'ease-in', iterations: 1});
                                                                                            fadeout.onfinish = function(e)
                                                                                            {
                                                                                                objectID(shadowView).setAttribute('class', 'b-none');
                                                                                                objectID('j-actual-image').removeAttribute('style');
                                                                                            }

                                                                         }
                                                        }
                                                        else
                                                        {
                                                          var shrink =  objectID('j-actual-image').animate([{ transform: 'scale(1,1)', opacity:1 },{ transform: 'scale(0,0)', opacity:0 }], {duration: 750,iterations: 1});
                                                                        shrink.onfinish = function(e)
                                                                            {
                                                                                objectID('j-actual-image').setAttribute('class', 'b-block');
                                                                                objectID('j-actual-image').src='#';
                                                                                objectID('j-actual-image').setAttribute('class', 'b-none');
                                                                            }
                                                          var fadeout = objectID(shadowView).animate([{ opacity: 1 },{ opacity: 0 }], {duration: 800,easing: 'ease-in', iterations: 1});
                                                                          fadeout.onfinish = function(e)
                                                                          {
                                                                              objectID(shadowView).setAttribute('class', 'b-none');
                                                                              objectID('j-actual-image').removeAttribute('style');
                                                                          }
                                                        }
                                                  }
                }

                objectEL('.b-close').addEventListener('click', function(e)
                {
                    destroy_viewer();
                }, false);
                objectID('j-image-container').addEventListener('click', function(e)
                {
                  if(e.target !== objectID('j-actual-image'))
                  {
                    destroy_viewer();
                  }
                }, false);


            //end of function animate
            }



            r.view = function view(params=null)
                      {

                        if(!d.querySelector('.view'))
                        {
                          console.error('Cannot initialize, no ".view" class found');
                          return false;
                        }

                        initView();
                        var $img_elements = d.querySelectorAll('.view');

                        for (var i = 0; i < $img_elements.length; i++)
                        {
                        $img_elements[i].addEventListener('click', function()
                          {

                                if(this.getAttribute('show-details') !==null)
                                {
                                    $params['show-details'] = (typeof this.getAttribute('show-details')=== 'boolean') ? this.getAttribute('show-details') : (typeof this.getAttribute('show-details')  ==='string' && this.getAttribute('show-details').toLowerCase() ==='false') ? false : true;
                                }
                                else
                                {
                                    if(params !==null)
                                    {
                                        $params['show-details'] = (typeof params['show-details'] !== "undefined") ? ((typeof params['show-details']  ==='boolean') ? params['show-details'] : (typeof params['show-details']  ==='string' && params['show-details'].toLowerCase() ==='false') ? false : true) : true;
                                    }
                                    else
                                    {
                                        $params['show-details'] =true;
                                    }

                                }
                                $params.title = (this.getAttribute('title') !==null) ?  clean(this.getAttribute('title')) : (this.getAttribute('alt') !==null) ? clean(this.getAttribute('alt')) : '';
                                $params.description = (this.getAttribute('data-description') !==null) ?  clean(this.getAttribute('data-description')) : '';

                                getInfo(this, params).then(function(detail)
                                {
                                    $params.url = detail.url;
                                    var tempdate = new Date(detail.date);
                                    $params.date=$months[tempdate.getMonth()] + ' ' + tempdate.getDate() + ',' +  tempdate.getFullYear();
                                    $params.filesize = detail.filesize/1000 + 'kb';

                                    $params.cleanedurl =ucfirst($params.url.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0]);
                                    $params.info = '<small id="j-date"><b>Date:</b> '+$params.date+'</small>&nbsp;&nbsp;&nbsp;<small id="j-filesize"><b>Filesize:</b> '+$params.filesize+'</small>&nbsp;&nbsp;&nbsp;<small id="j-url"><b>Url:</b> <a href="'+$params.url+'" target="_blank">'+$params.cleanedurl+'</a></small>';

                                    objectID('j-info-view').innerHTML = $params.info;

                                   //Animate and run the image viewer
                                   animate($params);

                                }).catch(function(detail)
                                {
                                    $params.url = detail.url;
                                    var tempdate = new Date(detail.date);
                                    $params.date=$months[tempdate.getMonth()] + ' ' + tempdate.getDate() + ',' +  tempdate.getFullYear();
                                    $params.filesize = detail.filesize/1000 + 'kb';

                                    $params.cleanedurl =ucfirst($params.url.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0]);
                                    $params.info = '<small id="j-date"><b>Date:</b> '+$params.date+'</small>&nbsp;&nbsp;&nbsp;<small id="j-filesize"><b>Filesize:</b> '+$params.filesize+'</small>&nbsp;&nbsp;&nbsp;<small id="j-url"><b>Url:</b> <a href="'+$params.url+'" target="_blank">'+$params.cleanedurl+'</a></small>';

                                    objectID('j-info-view').innerHTML = $params.info;

                                   //Animate and run the image viewer
                                   animate($params);

                                });

                           }, true);

                         }

                      };

            return r;
    		};
		if(typeof(r) === 'undefined')
    {
      w.r = _();
    }
		else
    {
      console.log("Ramosus viewer library is already defined.");
    }

    })(window, document);
