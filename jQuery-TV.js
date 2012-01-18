/*
 * jQuery LazyLoad Plugin v1.9
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
*/

function jTV(opt){
	var thisClass = this;
	
	thisClass.itens = (opt.itens > 0) ? opt.itens : 1;
	thisClass.widthItem = $('.' + opt.cClass + ' > ul > li').outerWidth(true);
	thisClass.blocked = false;
	if(opt.timeAnimation == undefined || opt.timeAnimation < 0){
		this.timeAnimation = 500;
	}else{
		this.timeAnimation = opt.timeAnimation;
	}
	this.init = function(){
		thisClass.pos = 1;
		thisClass.qtd = $('.' + opt.cClass + ' > ul > li').length;
		thisClass.pages = Math.ceil((thisClass.qtd / opt.itens)); 
		/* calculate width to slider */
		if(opt.animation === 'slider'){
			var width = parseInt((thisClass.qtd+thisClass.itens) * thisClass.widthItem);
			$('.'+opt.cClass+' > ul').css({'width' : width + 'px', 'position' : 'absolute'});
			$('.'+opt.cClass+' > ul').addClass('slider');
			/* duplicate first itens showed to infinite loop */
			if(thisClass.pages > 1){
				$('.' + opt.cClass + ' > ul > li').each(function(i){
					if(i < thisClass.itens){
						$('.' + opt.cClass +  ' > ul').append('<li class="' + $(this).attr('class') + '">' + $(this).html() + '</li>');
					}
				})
			}
			
		}
		if(thisClass.pages > 1){
			$('.'+opt.cClass+' .navigation').fadeIn(700);
		}
		thisClass.select(1);
		$('.'+opt.cClass+' .next').click(function(){thisClass.next();thisClass.stop();return false;})
		$('.'+opt.cClass+' .back').click(function(){thisClass.prev();thisClass.stop();return false;})
		$('.'+opt.cClass+' .slide').click(function(){thisClass.select(parseInt($('div.'+opt.cClass+' .slide').index($(this))+1));thisClass.stop();return false;})
		if(opt.timer != '' && opt.timer > 0 && opt.instance){
			thisClass.autoPlay = window.setInterval(opt.instance+'.next()', opt.timer);
		}
	}
	this.next = function(){
		if(thisClass.pos < thisClass.pages){
			thisClass.select(parseInt(thisClass.pos)+1);
		}else{
			if(opt.animation === 'slider'){
				thisClass.select(parseInt(thisClass.pos)+1);
				thisClass.blocked = true;
			}else{
				thisClass.select(1);
			}
		}
	}
	this.prev= function(){
		if(thisClass.pos > 1){
			thisClass.select(parseInt(thisClass.pos)-1);
		}else{
			if(opt.animation === 'slider'){
				var vleft = ((thisClass.pages+1) * thisClass.widthItem * opt.itens) - (thisClass.widthItem * opt.itens);
				vleft = '-'+vleft+'px';
				$('.'+opt.cClass+' > ul').css('left', vleft);
				thisClass.select(parseInt(thisClass.pages));
			}else{
				thisClass.select(parseInt(thisClass.pages));
			}
		}
	}
	this.select = function(id){
		if(!thisClass.blocked === true){
			thisClass.blocked = true;
			var slidePos = parseInt(id);
			$('.'+opt.cClass+' .navigation a.active').removeClass('active');
			$('.'+opt.cClass+' .navigation a.slide:nth-child('+slidePos+')').addClass('active');
			$('.'+opt.cClass+' .posicao').html(id);
			if(opt.animation === 'slider'){
				var vleft = (id * thisClass.widthItem * opt.itens) - (thisClass.widthItem * opt.itens);
				vleft = '-'+vleft+'px';
				$('.'+opt.cClass+' > ul').animate({left: vleft}, thisClass.timeAnimation, thisClass.free);
			}else{
				timeFadeOut = parseInt(thisClass.timeAnimation / 4);
				$('.' + opt.cClass + ' > ul > li:visible').fadeOut(timeFadeOut);
				setTimeout(function(){
					$('.' + opt.cClass+' > ul > li').each(function(index){
						if(index >= (slidePos-1) * opt.itens && index < ((slidePos+1) * opt.itens) - opt.itens){
							$(this).fadeIn(timeFadeOut, thisClass.free);
						}
					});
				}, timeFadeOut + 100);
			}
			thisClass.pos=id;
		}
	}
	this.free = function(){
		if(thisClass.pos > thisClass.pages){
			if(opt.animation === 'slider'){
				thisClass.pos = 1;
				$('.'+opt.cClass+' .posicao').html('1');
				$('.'+opt.cClass+' .navigation a.slide:nth-child(1)').addClass('active');
				$('.'+opt.cClass+' > ul').css('left', '0');
			}
		}
		
		setTimeout(function(){thisClass.blocked = false;},300);
	}
	this.stop = function(){clearInterval(thisClass.autoPlay);}
}