define(function(require, exports, module){
	var Dream=require('core/Dream');
	
	/*
	*@���տ���
	*/
	var Bullet=function(config){
		var config=config||{};
		Bullet.superclass.constructor.call(this,config);
		this.init(config);
	}
	Dream.utils.extend(Bullet,Dream.display.Bitmap);
	
	/*
	*�յ�����	
	*/
	Bullet.prototype.init=function(config){
		this.name='bullet'+Math.random();
		this.damage=config.damage||10;//������
		this.vx=config.vx||5;
		this.row=config.row;
		this.x=config.x;
		this.y=config.y;
	};
	
	/*
	*enterframe
	*/
	Bullet.prototype.update=function(){
		this.x+=this.vx;
	};
	
	/*
	*���н�ʬ
	*/
	Bullet.prototype.onAttackZombie=function(){
		this.destory();
	};

	/*
	*��������ʱ����
	*/
	Bullet.prototype.destory=function(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		this.removeAllEventListeners();
		delete this;
	}
	
	return Bullet;
});