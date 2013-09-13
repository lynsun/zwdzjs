define(function(require, exports, module){
	var Dream=require('core/Dream');
	var Bullet=require('./Bullet');
	
	/*
	*@豌豆射手类
	*/
	var PeaShooter=function(scene){
		PeaShooter.superclass.constructor.call(this);
		this.init(scene);
	}
	Dream.utils.extend(PeaShooter,Dream.display.MovieClip);

	PeaShooter.prototype.init=function(scene){
		var scene=scene||PeaShooter.scene;
		this.name='peashooter'+Math.random();
		this.addScene(scene);
		this.health=300;//生命值,默认为300
		this.frameRate=10;
		this.width=71;
		this.height=71;
		this.shootInterval=80;//每120帧可以发射子弹
		this.currentShootIndex=0;
		this.gotoAndPlay(0,scene);
	};


	/*
	*初始化影片剪辑对象的帧和场景，这些在flash里面本来是自动实现的，js里只能手工来做了
	*/
	PeaShooter.initScene=function(){
		var scene=new Dream.display.Scene('peashooter');
		var images=game.images;
		for(var i=1;i<=13;i++){
			var imgName=i>=10?('peashooter0'+i):('peashooter00'+i);
			var img=game.images[imgName];
			var bitmap=new Dream.display.Bitmap({
				image:img
			});
			var frame=new Dream.display.Frame(bitmap,i);
			scene.add(frame);
		}
		PeaShooter.scene=scene;
	};
	

	PeaShooter.prototype.update=function(){
		if(this.canShoot){
			this.currentShootIndex++;
			if(this.currentShootIndex==this.shootInterval){
				this.shoot();
				this.currentShootIndex=0;
			}
		}
		switch(this.state){
			case 'underattack':
				this.onUnderAttack();
				break;
			default:
				break;
		}
	};
	

	/*
	*射击
	*/
	PeaShooter.prototype.shoot=function(){
		var bullet=new Bullet({
			image:game.images.bullet,
			row:this.row,
			x:this.x,
			y:this.y
		});
		game.bullets.addChild(bullet);
	}

	/*
	*@plant underattack
	*/
	PeaShooter.prototype.onUnderAttack=function(){
		if(this.health<=0){
			this.die=true;
			this.onKill();
		}
	};

	/*
	*plant kill by zombie
	*/
	PeaShooter.prototype.onKill=function(){	 
		this.rect.type='';//释放植物所占的单元格
		this.destory();
	};
	
	/*
	*对象销毁时调用
	*/
	PeaShooter.prototype.destory=function(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		this.stop();
		this.removeAllEventListener();
		delete this;
	};

	return PeaShooter;
});