/*
移动手机touch事件
作者：曾小斌
*/

(function($,undefined){
	var $document=$(document);
	var touchControl={
		opts:{
			target:null
			,startX:0	//触摸开始X坐标
			,startY:0	//触摸开始X坐标
			,moveX:0	//触摸中X坐标
			,moveY:0	//触摸中X坐标
			,movedX:0	//触摸移动的X轴距离
			,movedY:0	//触摸移动的Y轴距离
			,onInit:$.noop
            ,onReady:$.noop         //初始化完毕
            ,onStartBefore:$.noop   //触摸前触发，若return false 则取消start事件
			,onStart:$.noop
			,onMoveBefore:$.noop    //触摸移动前触发，若return false 则取消move事件
			,onMove:$.noop
			,onEnd:$.noop
		}
		,init:function(e){
			var opts=e.data;
			$document.on("touchstart.touch",opts, touchControl.start);
		    $document.on("touchmove.touch",opts, touchControl.move);
		    $document.on("touchend.touch",opts, touchControl.end);
		    opts.onInit.call(this,opts);
		}
		,start:function(e){
			var that=this,opts=e.data;
			if(opts.onStartBefore.call(this,opts)!==false){
				var touch=e.originalEvent.touches[0];
				opts.startX=touch.pageX;
				opts.startY=touch.pageY;
				opts.onStart.call(e.target,opts,e);
			}else{
				$document.off('.touch');
			}
		}
		,move:function(e){
			//e.preventDefault();
			var that=this,opts=e.data;
			if(opts.onMoveBefore.call(this,opts)!==false){
				var touch=e.originalEvent.touches[0];
				opts.moveX=touch.pageX;
				opts.moveY=touch.pageY;
				opts.movedX=opts.moveX-opts.startX;
				opts.movedY=opts.moveY-opts.startY;
				opts.onMove.call(e.target,opts,e);
			}else{
				$document.off('.touch');
			}
		}
		,end:function(e){
			$document.off('.touch');
			var opts=e.data;
			opts.onEnd.call(e.target,opts,e);
		}
	}

	$.fn.touch=function(opts){
		return this.each(function(){
			opts=$.extend({},touchControl.opts,opts);
			opts.target=this;
			$(this).on('touchstart.touch', opts, touchControl.init);
			$.data(this, 'touch', opts);
			opts.onReady.call(this,opts);
		});
	};
})($);