define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@��ʬ��
	*/
	var Zombie=function(scene){
		Zombie.superclass.constructor.call(this);
		this.init(scene);
	}
	Dream.utils.extend(Zombie,Dream.display.MovieClip);
	
	/*
	*��ʼ����ʬ�ĳ�����runΪ��ʬ���ߵĳ�����attΪ��ʬ�����ĳ���
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
		this.health=5;//����ֵ,Ĭ��Ϊ10
		this.frameRate=10;
		this.width=166;
		this.height=144;
		this.vx=-1//��ʬˮƽ�ٶ�
		this.gotoAndPlay(0,scene[0]);
		this.initEvent();
	};
	
	/*
	*����
	*/
	Zombie.prototype.run=function(){
		if(this.state=='run') 
			return;
		this.state='run';
		var frameCount=this.scenes[0].frames.length;
		this.gotoAndPlay(parseInt(Math.random()*frameCount),'zombieRun');//������һ�����֡��Ϊ�˷�ֹͬʱ����һ��ֲ��Ķ����ʬ��killֲ������߶���һ��
	};
	
	/*
	*����ֲ��
	*/
	Zombie.prototype.attack=function(plant){
		if(this.state=='attack') return;
		this.state='attack';
		this.attackingPlant=plant;
		this.gotoAndPlay(0,'zombieAttack');
	};

	
	
	/*
	*��ʼ���¼�
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
	*��ʬ����ֲ��
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
	*��ʬ������
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
	*��ʬ����
	*/
	Zombie.prototype.onKill=function(){
		this.die=true;
		this.destory();
	};
	
	/*
	*��������
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