define(function(require, exports, module){
	var Dream=require('core/Dream');
	var Bullet=require('./Bullet');
	
	/*
	*@�㶹������
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
		this.health=300;//����ֵ,Ĭ��Ϊ300
		this.frameRate=10;
		this.width=71;
		this.height=71;
		this.shootInterval=80;//ÿ120֡���Է����ӵ�
		this.currentShootIndex=0;
		this.gotoAndPlay(0,scene);
	};


	/*
	*��ʼ��ӰƬ���������֡�ͳ�������Щ��flash���汾�����Զ�ʵ�ֵģ�js��ֻ���ֹ�������
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
	*���
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
		this.rect.type='';//�ͷ�ֲ����ռ�ĵ�Ԫ��
		this.destory();
	};
	
	/*
	*��������ʱ����
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