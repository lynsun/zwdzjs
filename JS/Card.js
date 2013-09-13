define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@工具条的卡片
	*@param type{string}:卡片类型
	*/
	var Card=function(type){
		Card.superclass.constructor.call(this);
		this.type=type;
		this.image=game.images[type];
		this.width=this.image.width;
		this.height=this.image.height;
		this.init();
		this.bind();
	}
	Dream.utils.extend(Card,Dream.display.Sprite);
	
	Card.prototype.init=function(){
		var img=this.image;
		var bitmap=new Dream.display.Bitmap({
			image:img,
			width:img.width,
			height:img.height
		});
		this.addChild(bitmap);
	}

	
	/*
	*为卡片绑定事件
	*/
	Card.prototype.bind=function(){
		this.addEventListener('click',this.onMouseClick);
	}

	/*
	*卡片单击事件
	*/
	Card.prototype.onMouseClick=function(e){
		//判断价钱是否够
		game.prePlant=true;//设置全局预种植状态
		var prePlantCard=game.prePlantCard;//get the bitmap
		var transparentPlant=game.transparentPlant;
		var img=game.images[this.type+'001'];
		
		transparentPlant.image=img;
		transparentPlant.width=img.width;
		transparentPlant.height=img.height;

		prePlantCard.image=img;
		prePlantCard.visible=true;
		prePlantCard.width=img.width;
		prePlantCard.height=img.height;
		prePlantCard.x=e.mouseX-30;
		prePlantCard.y=e.mouseY+30;

		game.selectCardType=this.type;
	}

	
	return Card;
});