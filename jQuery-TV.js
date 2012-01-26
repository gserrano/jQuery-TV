/*
 * jQuery TV Plugin v1.9
 * http://odesenvolvedor.com.br/
 *
 * Copyright 2011, Guilherme Serrano - http://guilhermeserrano.com.br
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Required: jQuery Javascript Library
 * http://jquery.com/
 *
 *
 *	options = {
 *		'cClass' : 'classe do componente de tvFlash',
 *		'timer' : 'tempo para autoplay / 0 = sem autoplay',
 *		'animation' : 'tipo de animação -> slider / fade',
 *		'timeAnimation' : 'tempo de duração da animação',
 *		'instance' : 'nome da instancia criada para a tv',
 *		'itens' : 'número de itens da li por página / default = 1'
 *	}
 *
 *	@todo:
 *	- jQuery plugin :)
*/

(function($){
	
	var _jTVmethods = {
		
		defaults: {
			waitForStartAutoPlay 	: 0, 		/*Tempo para aguardar autoplay em segundos*/
			effectType 		: 'slide', 	/*tipo de animacao fade/slide/custom */
			effectDuration		: 1, 		/*Tempo para execução da animação em segundos*/
			transitionDuration	: 1, 		/*Tempo para transicao entre os itens em segundos*/
			display			: 1, 		/*quantidade de itens a ser mostrada*/
			start			: 1, 		/*posicao para comecar o carrossel*/
			locked			: false, 	/*trava o carrossel durante a transicao de itens*/
			currentPosition		: 1, 		/*posicao corrente do carrossel*/
			customEffectFn		: false,	/*funcao para efeito personalizado*/
			afterTransition		: false		/*funcao executada apos a transicao de itens*/
		},		
		init: function( options ){
			return this.each(function(){
         
				var _this = $(this),
				    data = _this.data('jTV');
				
				data = $.extend({},_jTVmethods.defaults,options);
				data = $.extend({},data, {
					waitForStartAutoPlay 	: data.waitForStartAutoPlay * 1000, /*converts secs to millis*/
					effectDuration 		: data.effectDuration * 1000, /*converts secs to millis*/
					transitionDuration 	: data.transitionDuration * 1000, /*converts secs to millis*/
					total			: _this.find('> ul > li').length,
					pages			: Math.ceil(data.total / data.display),
					itemWidth		: _this.find('> ul > li:eq(0)').outerWidth(true)
				})

				//se nao estiver setado os parametros da jTV no objeto do jQuery,
				//faz merge com os options parametrizados
				if( !_this.data('jTV') ){
					_this.data('jTV', data);
				}
				if(data.typeOfAnimation == 'slide'){
					console.log('slide!')
					data.widthItem = _this.find('> ul > li').outerWidth(true);
					var width = parseInt((data.total+data.display) * data.widthItem);
					_this.find('> ul').css({'width' : width + 'px', 'position' : 'absolute'}).addClass('slider');
					if(data.pages > 1){
						_this.find('> ul > li').each(function(i){
							if(i < data.display){
								_this.find('> ul').append('<li class="' + $(this).attr('class') + '">' + $(this).html() + '</li>');
							}
						})
					}
				}
				
				/*goto initial position*/
				_this.jTV('goTo',data.start);
				
				window[data.id] = _this;
				
				/*autoplay*/
				if(data.waitForStartAutoPlay > 0){
					
					window[data.id+'_timeout'] = window.setTimeout(function(){
						
						var that = _this;
						
						/*transicao entre itens*/
						window[data.id+'_timeout'] = window.setInterval(function(){
							that.jTV('next');
						},data.transitionDuration)		
					},data.waitForStartAutoPlay)
					
				}
				
				/*events*/
				_this.find(data.prevBtn).click(function(e){
					_this.jTV('prev');
					e.preventDefault();
				})
				
				_this.find(data.nextBtn).click(function(e){
					_this.jTV('next');
					e.preventDefault();
				})
			});
			
		},
		goTo:	function(pos){
			
				var _this = $(this),
				    data = _this.data('jTV'),
				    index = 0;			   
				    
				if(data.locked === true)
					return;
						
				data.locked = true;
				
				if(pos > data.total){
					pos = 1;
				}else if(pos <= 0){
					pos = data.total;
				}else{}
				
							
				_this.jTV('doTransitionEffect', pos - 1);
							
												
				data.currentPosition = pos;
				
				if(data.afterTransition != false && typeof data.afterTransition == 'function'){
					data.afterTransition(data);
				}
				
				data.locked = false;	
			
		},
		next:	function(){
			
			var _this = $(this),
			    data = _this.data('jTV'),
			    pos = data.currentPosition + data.display;
													
			_this.jTV('goTo',pos);
		},
		prev:	function(){
			
			var _this = $(this),
			    data = _this.data('jTV'),
			    pos = data.currentPosition - data.display;
													
			_this.jTV('goTo',pos);
		},
		log: function(){
			
			if( console.log ){
				console.log($(this).data('jTV'));
			}
			
		},
		doTransitionEffect: function(pos){ /*index of li element*/
			
			var _this = $(this),
			    data = _this.data('jTV');
				
			switch(data.effectType){
				case 'slide':
					_this.find('> ul > li').hide();
					_this.find('> ul > li').eq(pos).show();
					break;
				case 'fade':
					var timeOut = (data.effectDuration/3),
					    timeIn = (2*(data.effectDuration/3));
					_this.find('> ul > li').fadeOut(timeOut);
					setTimeout(function(){
						_this.find('> ul > li').eq(pos).fadeIn(timeIn);
					},timeOut+100);
					break;
				case 'custom':
					data._this = data._this;
									
					/* not working - @fixme */
					_this.find('> ul > li').hide();
					_this.find('> ul > li').eq(pos).show();
					//data.customEffectFn(data,pos);
					break;
				default:
					_this.find('> ul > li').hide();
					_this.find('> ul > li').eq(pos).show();
			}
			
			
		}
		
		
	}
	
	$.fn.jTV = function(method){
		
		if ( _jTVmethods[method] ) {
			return _jTVmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return _jTVmethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jTV' );
		}
	}
	
})(jQuery)


//function jTV(opt){
//	var thisClass = this;
//	
//	thisClass.itens = (opt.itens > 0) ? opt.itens : 1;
//	thisClass.widthItem = $('.' + opt.cClass + ' > ul > li').outerWidth(true);
//	thisClass.blocked = false;
//	if(opt.timeAnimation == undefined || opt.timeAnimation < 0){
//		this.timeAnimation = 500;
//	}else{
//		this.timeAnimation = opt.timeAnimation;
//	}
//	this.init = function(){
//		thisClass.pos = 1;
//		thisClass.qtd = $('.' + opt.cClass + ' > ul > li').length;
//		thisClass.pages = Math.ceil((thisClass.qtd / opt.itens)); 
//		/* calculate width to slider */
//		if(opt.animation === 'slider'){
//			var width = parseInt((thisClass.qtd+thisClass.itens) * thisClass.widthItem);
//			$('.'+opt.cClass+' > ul').css({'width' : width + 'px', 'position' : 'absolute'});
//			$('.'+opt.cClass+' > ul').addClass('slider');
//			/* duplicate first itens showed to infinite loop */
//			if(thisClass.pages > 1){
//				$('.' + opt.cClass + ' > ul > li').each(function(i){
//					if(i < thisClass.itens){
//						$('.' + opt.cClass +  ' > ul').append('<li class="' + $(this).attr('class') + '">' + $(this).html() + '</li>');
//					}
//				})
//			}
//			
//		}
//		if(thisClass.pages > 1){
//			$('.'+opt.cClass+' .navigation').fadeIn(700);
//		}
//		thisClass.select(1);
//		$('.'+opt.cClass+' .next').click(function(){thisClass.next();thisClass.stop();return false;})
//		$('.'+opt.cClass+' .back').click(function(){thisClass.prev();thisClass.stop();return false;})
//		$('.'+opt.cClass+' .slide').click(function(){thisClass.select(parseInt($('div.'+opt.cClass+' .slide').index($(this))+1));thisClass.stop();return false;})
//		if(opt.timer != '' && opt.timer > 0 && opt.instance){
//			thisClass.autoPlay = window.setInterval(opt.instance+'.next()', opt.timer);
//		}
//	}
//	this.next = function(){
//		if(thisClass.pos < thisClass.pages){
//			thisClass.select(parseInt(thisClass.pos)+1);
//		}else{
//			if(opt.animation === 'slider'){
//				thisClass.select(parseInt(thisClass.pos)+1);
//				thisClass.blocked = true;
//			}else{
//				thisClass.select(1);
//			}
//		}
//	}
//	this.prev= function(){
//		if(thisClass.pos > 1){
//			thisClass.select(parseInt(thisClass.pos)-1);
//		}else{
//			if(opt.animation === 'slider'){
//				var vleft = ((thisClass.pages+1) * thisClass.widthItem * opt.itens) - (thisClass.widthItem * opt.itens);
//				vleft = '-'+vleft+'px';
//				$('.'+opt.cClass+' > ul').css('left', vleft);
//				thisClass.select(parseInt(thisClass.pages));
//			}else{
//				thisClass.select(parseInt(thisClass.pages));
//			}
//		}
//	}
//	this.select = function(id){
//		if(!thisClass.blocked === true){
//			thisClass.blocked = true;
//			var slidePos = parseInt(id);
//			$('.'+opt.cClass+' .navigation a.active').removeClass('active');
//			$('.'+opt.cClass+' .navigation a.slide:nth-child('+slidePos+')').addClass('active');
//			$('.'+opt.cClass+' .posicao').html(id);
//			if(opt.animation === 'slider'){
//				var vleft = (id * thisClass.widthItem * opt.itens) - (thisClass.widthItem * opt.itens);
//				vleft = '-'+vleft+'px';
//				$('.'+opt.cClass+' > ul').animate({left: vleft}, thisClass.timeAnimation, thisClass.free);
//			}else{
//				timeFadeOut = parseInt(thisClass.timeAnimation / 4);
//				$('.' + opt.cClass + ' > ul > li:visible').fadeOut(timeFadeOut);
//				setTimeout(function(){
//					$('.' + opt.cClass+' > ul > li').each(function(index){
//						if(index >= (slidePos-1) * opt.itens && index < ((slidePos+1) * opt.itens) - opt.itens){
//							$(this).fadeIn(timeFadeOut, thisClass.free);
//						}
//					});
//				}, timeFadeOut + 100);
//			}
//			thisClass.pos=id;
//		}
//	}
//	this.free = function(){
//		if(thisClass.pos > thisClass.pages){
//			if(opt.animation === 'slider'){
//				thisClass.pos = 1;
//				$('.'+opt.cClass+' .posicao').html('1');
//				$('.'+opt.cClass+' .navigation a.slide:nth-child(1)').addClass('active');
//				$('.'+opt.cClass+' > ul').css('left', '0');
//			}
//		}
//		
//		setTimeout(function(){thisClass.blocked = false;},300);
//	}
//	this.stop = function(){clearInterval(thisClass.autoPlay);}
//}
