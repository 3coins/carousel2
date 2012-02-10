(function($){
	
	/**
	 *  Creates a new Carousel from an unordered list of elements
	 *  
	 *  @param options options for the Carousel
	 *  @param options.animate true if sliding behavior is expected
	 *  @param list unordered list element
	 */
	function Carousel(options, list){
		
		this.list = $(list);
		
		if(this.list.data("carousel")){
			this.list.data("carousel")._destroy();
		}
		this.list.data("carousel", this);
		
		this.settings = $.extend({},{
			animate: true
		}, options);
		
		this.action = this.settings.animate ? "animate" : "css";
		
		this._init();
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._init = function(){
		var list = this.list;
		var settings = this.settings;
		
		var backBtn = list.parent().find(".back-button");
		var nextBtn = list.parent().find(".next-button");
		var items = list.find(">li");
		
		this.contentWidth = $(items[0]).width();
		this.list.width(items.length * this.contentWidth);
		this.loopIndex = 0;
		this.noOfLoops = items.length;
		
		backBtn.click($.proxy(this._goBack, this));
		nextBtn.click($.proxy(this._goForward, this));
	}
	
	
	/**
	 *  @private
	 */
	Carousel.prototype._goBack = function(e){
		e.preventDefault();
		
		if(this.loopIndex < 1){
			this.loopIndex = this.noOfLoops;
		}
		this._updateListPos(-this.contentWidth * (--this.loopIndex));
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._goForward = function(e){
		e.preventDefault();
		if(this.loopIndex >= this.noOfLoops - 1){
			this.loopIndex = -1;
		}
		this._updateListPos(-this.contentWidth * (++this.loopIndex));
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._updateListPos = function(pos){
		this.list[this.action]({"left": pos});
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._destroy = function(){
		var list = this.list;
		list.parent().parent().find(">a").unbind("click");
		var self = this;
		// IE7 needs some redirection when deleting "this"
		setTimeout(function(){
			delete self;
		}, 100);
	}
	
	
	// jQuery plugin
	$.fn.Carousel = function(options){
		
		return this.each(function(){
			new Carousel(options, this);
		});
	}
})(jQuery);