define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@向日葵类
	*/
	var SunFlower=function(scene){
		SunFlower.superclass.constructor.call(this);
		this.init(scene);
	}
	Dream.utils.extend(SunFlower,Dream.display.MovieClip);
	
	/*
	*初始化影片剪辑对象的帧和场景，这些在flash里面本来是自动实现的，js里只能手工来做了
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
	*收到攻击	
	*/
	SunFlower.prototype.init=function(scene){
		var scene=scene||SunFlower.scene;
		this.name=Math.random();
		this.addScene(scene);
		this.health=300;//生命值,默认为300,普通的僵尸每帧攻击植物一点生命值
		this.frameRate=10;
		this.width=73;
		this.height=74;
		this.underAttackFrame=0;//从一次被攻击到当前经历的帧数
		this.die=false;//是否死亡
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
	*生产阳光
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
		this.rect.type='';//释放植物所占的单元格
		this.destory();
	};
	
	/*
	*对象销毁时调用
	*/
	SunFlower.prototype.destory=function(){
		this.stop();
		this.removeAllEventListener();
		delete this;
	}
	
	return SunFlower;
});