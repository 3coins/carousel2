(function($){
	
	/**
	 *  Creates a new Carousel from an unordered list of elements
	 *  
	 *  @param options options for the Carousel
	 *  @param options.animate (optional, default is true) true if sliding behavior is expected
	 *  @param options.autoRotate (optional, default is true) true if want to rotate elements automagically
	 *  @param options.autoRotateDelay (optional, default is 3s) delay in seconds between element rotation
	 *  @param list unordered list element
	 */
	function Carousel(options, list){
		
		this.list = $(list);
		
		if(this.list.data("carousel")){
			this.list.data("carousel")._destroy();
		}
		this.list.data("carousel", this);
		
		this.settings = $.extend({},{
			animate: true,
			autoRotate: true,
			autoRotateDelay: 3
		}, options);
		
		this.action = this.settings.animate ? "animate" : "css";
		
		this._init();

		this.autoRotate = this.settings.autoRotate;
		if(this.autoRotate){
			this._startRotation();
		}
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
		this.items = items;
		
		this.contentWidth = $(items[0]).width();
		this.list.width(items.length * this.contentWidth);
		this.loopIndex = 0;
		this.noOfLoops = items.length;
		
		backBtn.click($.proxy(this._goBack, this));
		nextBtn.click($.proxy(this._goForward, this));
	}
	
	/**
	 *	@private
	 */
	Carousel.prototype._startRotation = function(){
		var self = this;
		if(this.autoRotate){
			this.autoRotateTimer = setTimeout(function(){
				self._goForward();
			}, this.settings.autoRotateDelay * 1000);
		}
	};

	/**
	 *	@private
	 */
	Carousel.prototype._stopRotation = function(){
		if(this.autoRotateTimer) clearTimeout(this.autoRotateTimer);
		this.autoRotate = false;	
	};

	/**
	 *  @private
	 */
	Carousel.prototype._resetRotation = function(){
		this._stopRotation();
		this.autoRotate = true;
		this._startRotation();
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._isLastPage = function(){
		 return (this.loopIndex == this.noOfLoops - 1);
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._isFirstPage = function(){
		return (this.loopIndex < 1);
	}


	/**
	 *	@private
	 */ 
	Carousel.prototype._handleEvent = function(e){
		if(e){
			e.preventDefault();
			this._resetRotation();
		}else{
			this._startRotation();
		}
	
	};


	/**
	 *  @private
	 */
	Carousel.prototype._updateListToEmulateBackSliding = function(){
		var list = this.list;
		var items = this.items;
		var contentWidth = this.contentWidth;
		list.width(contentWidth * (items.length + 1));
		$(items[items.length - 1]).clone().prependTo(list);
		list.css({left: -contentWidth});	
	}

	/**
	 *  @private
	 */
	Carousel.prototype._resetListAfterBackSliding = function(){
		
		var list = this.list;
		var items = this.items;

		this.loopIndex = items.length - 1;
		list.find(">li").first().remove();
		list.width($(items[0]).width() * items.length);
		list.css({"left": -this.contentWidth * (items.length - 1)});
		
	}


	/**
	 *  @private
	 */
	Carousel.prototype._goBack = function(e){
		
		this._handleEvent(e);
				
		var callback;
		var position = -this.contentWidth;

		if(this._isFirstPage()){
			this._updateListToEmulateBackSliding();
			callback = this._resetListAfterBackSliding;
			position = 0;
		}

		this._updateListPos(position * (--this.loopIndex), callback);	

	};
	
	/**
	 *	@private
	 */ 
	Carousel.prototype._updateListToEmulateForwardSliding = function(){
		
		var list = this.list;
		var items = this.items;
		
		list.width(this.contentWidth * (items.length + 1));
		$(items[0]).clone().appendTo(list);
	
	};

	/**
	 *	@private
	 */ 
	Carousel.prototype._resetListAfterForwardSliding = function(){
		
		var list = this.list;
		var items = this.items;
		
		this.loopIndex = 0;
		list.css({"left": 0});
		list.find(">li").last().remove();
		list.width($(items[0]).width() * items.length);	
	};

	/**
	 *  @private
	 */
	Carousel.prototype._goForward = function(e){
		
		this._handleEvent(e);
		
		var callback;
		var position = -this.contentWidth * (this.loopIndex + 1);
		
		if(this._isLastPage()){
			this._updateListToEmulateForwardSliding();
			callback = this._resetListAfterForwardSliding;
		} else {
			this.loopIndex = this.loopIndex + 1;
		}
		
		this._updateListPos(position, callback);
		
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._updateListPos = function(pos, callback){
		var self = this;
		this.list[this.action]({"left": pos}, 500, function(){
			if(callback) callback.apply(self);
		});
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._destroy = function(){
		var list = this.list;
		if(this.autoRotateTimer){
			clearTimeout(autoRotateTimer);	
		}
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
