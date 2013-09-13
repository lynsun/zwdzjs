define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@僵尸类
	*/
	var Zombie=function(scene){
		Zombie.superclass.constructor.call(this);
		this.init(scene);
	}
	Dream.utils.extend(Zombie,Dream.display.MovieClip);
	
	/*
	*初始化僵尸的场景，run为僵尸行走的场景，att为僵尸攻击的场景
	*/
	Zombie.initScene=function(){
		var runScene=new Dream.display.Scene('zombieRun');
		var attackScene=new Dream.display.Scene('zombieAttack');
		var images=game.images;

		for(var i=1;i<=31;i++){
			var imgName=i>=10?('zomrun0'+i):('zomrun00'+i);
			var img=game.images[imgName];
			var bitmap=new Dream.display.Bitmap({
				image:img
			});
			var frame=new Dream.display.Frame(bitmap,i);
			runScene.add(frame);
		}

		for(var i=1;i<=21;i++){
			var imgName=i>=10?('zomatt0'+i):('zomatt00'+i);
			var img=game.images[imgName];
			var bitmap=new Dream.display.Bitmap({
				image:img
			});
			var frame=new Dream.display.Frame(bitmap,i);
			attackScene.add(frame);
		}
		
		Zombie.scene=[runScene,attackScene];
	};

	
	Zombie.prototype.init=function(scene){
		var scene=scene||Zombie.scene;
		this.name='Zombie'+Math.random();
		this.addScene(scene);
		this.health=5;//生命值,默认为10
		this.frameRate=10;
		this.width=166;
		this.height=144;
		this.vx=-1//僵尸水平速度
		this.gotoAndPlay(0,scene[0]);
		this.initEvent();
	};
	
	/*
	*行走
	*/
	Zombie.prototype.run=function(){
		if(this.state=='run') 
			return;
		this.state='run';
		var frameCount=this.scenes[0].frames.length;
		this.gotoAndPlay(parseInt(Math.random()*frameCount),'zombieRun');//这里用一个随机帧是为了防止同时攻击一个植物的多个僵尸在kill植物后行走动作一样
	};
	
	/*
	*攻击植物
	*/
	Zombie.prototype.attack=function(plant){
		if(this.state=='attack') return;
		this.state='attack';
		this.attackingPlant=plant;
		this.gotoAndPlay(0,'zombieAttack');
	};

	
	
	/*
	*初始化事件
	*/
	Zombie.prototype.initEvent=function(){
		this.addEventListener('REMOVED',function(){
			this.stop();
			delete this;
		});
	};
	

	Zombie.prototype.update=function(){
		switch(this.state){
			case 'run':
				this.x+=this.vx;
				break;
			case 'attack':
				this.onAttackPlant();
				break;
			default:
				break;
		}
	};
	
	/*
	*僵尸攻击植物
	*/
	Zombie.prototype.onAttackPlant=function(){
		var plant=this.attackingPlant;
		if(plant.health<=0){
			this.attackingPlant=null;
			this.run();
			return;
		}
		plant.health--;
	};

	/*
	*僵尸被攻击
	*/
	Zombie.prototype.onUnderAttack=function(){
		var self=this;
		this.health--;
		this.alpha=0.5;
		setTimeout(function(){
			self.alpha=1;
		},100);
		if(this.health<=0){
			this.onKill();
		}
	}

	/*
	*僵尸死亡
	*/
	Zombie.prototype.onKill=function(){
		this.die=true;
		this.destory();
	};
	
	/*
	*对象销毁
	*/
	Zombie.prototype.destory=function(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		this.stop();
		this.removeAllEventListeners();
		delete this;
	};



	return Zombie;
});