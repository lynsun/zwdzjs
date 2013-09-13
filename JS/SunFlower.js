define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@���տ���
	*/
	var SunFlower=function(scene){
		SunFlower.superclass.constructor.call(this);
		this.init(scene);
	}
	Dream.utils.extend(SunFlower,Dream.display.MovieClip);
	
	/*
	*��ʼ��ӰƬ���������֡�ͳ�������Щ��flash���汾�����Զ�ʵ�ֵģ�js��ֻ���ֹ�������
	*/
	SunFlower.initScene=function(){
		var scene=new Dream.display.Scene('sunflower');
		var images=game.images;
		for(var i=1;i<=18;i++){
			var imgName=i>=10?('sunflower0'+i):('sunflower00'+i);
			var img=game.images[imgName];
			var bitmap=new Dream.display.Bitmap({
				image:img
			});
			var frame=new Dream.display.Frame(bitmap,i);
			scene.add(frame);
		}
		SunFlower.scene=scene;
	}

	/*
	*�յ�����	
	*/
	SunFlower.prototype.init=function(scene){
		var scene=scene||SunFlower.scene;
		this.name=Math.random();
		this.addScene(scene);
		this.health=300;//����ֵ,Ĭ��Ϊ300,��ͨ�Ľ�ʬÿ֡����ֲ��һ������ֵ
		this.frameRate=10;
		this.width=73;
		this.height=74;
		this.underAttackFrame=0;//��һ�α���������ǰ������֡��
		this.die=false;//�Ƿ�����
		this.gotoAndPlay(0,scene);
	}
	
	/*
	*enterframe
	*/
	SunFlower.prototype.update=function(){
		switch(this.state){
			case 'underattack':
				this.onUnderAttack();
				break;
			default:
				this.product();
				break;
		}
	};

	/*
	*��������
	*/
	SunFlower.prototype.product=function(){
		
	};
	
	/*
	*@plant underattack
	*/
	SunFlower.prototype.onUnderAttack=function(){
		if(this.health<=0){
			this.die=true;
			this.onKill();
		}
	};

	/*
	*plant kill by zombie
	*/
	SunFlower.prototype.onKill=function(){	 
		this.parent.removeChild(this);
		this.rect.type='';//�ͷ�ֲ����ռ�ĵ�Ԫ��
		this.destory();
	};
	
	/*
	*��������ʱ����
	*/
	SunFlower.prototype.destory=function(){
		this.stop();
		this.removeAllEventListener();
		delete this;
	}
	
	return SunFlower;
});