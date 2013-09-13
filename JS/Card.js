define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@�������Ŀ�Ƭ
	*@param type{string}:��Ƭ����
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
	*Ϊ��Ƭ���¼�
	*/
	Card.prototype.bind=function(){
		this.addEventListener('click',this.onMouseClick);
	}

	/*
	*��Ƭ�����¼�
	*/
	Card.prototype.onMouseClick=function(e){
		//�жϼ�Ǯ�Ƿ�
		game.prePlant=true;//����ȫ��Ԥ��ֲ״̬
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