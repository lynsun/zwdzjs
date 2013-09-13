define(function(require, exports, module){
	var Dream=require('core/Dream');
	var Card=require('./Card');
	var SunFlower=require('./SunFlower');
	var PeaShooter=require('./PeaShooter');
	var Zombie=require('./Zombie');
	var Bullet=require('./Bullet');
	
	//主类,主场景
	var MainScene=function(){
		MainScene.superclass.constructor.call(this);
		this.initGrid();
		this.initBackground();
		this.initTopBar();
		this.initScene();
		this.initZombie();
		this.initPrePlantCard();
		this.initEvent();
		this.name='main';
		this.frameCount=0;
	};
	Dream.utils.extend(MainScene,Dream.display.Sprite);
	
	//初始化背景图片
	MainScene.prototype.initBackground=function(){
		var bgImage=game.images.background;
		var bitmap=new Dream.display.Bitmap({
			image:bgImage
		});
		bitmap.x=0;
		bitmap.y=0;
		this.addChild(bitmap);
	};
	
	//初始化顶部工具条
	MainScene.prototype.initTopBar=function(){
		var topBarImage=game.images.topbar;
		var topBar=new Dream.display.Sprite();
		var barBackground=new Dream.display.Bitmap({
			image:topBarImage
		});
		topBar.addChild(barBackground);
		
		var startX=75,
			 startY=10,
			 margin=5;
		var cardNames=['sunflower','peashooter'];
		for(var i=0,len=cardNames.length;i<len;i++){
			var name=cardNames[i];
			var card=new Card(name);
			card.name=name;
			card.x=startX+i*(card.image.width+margin);
			card.y=startY;
			topBar.addChild(card);
		}
		this.addChild(topBar);
	};


	/*
	*初始化主场景事件
	*/
	MainScene.prototype.initEvent=function(){
		this.addEventListener('mousemove',this.onMouseMoveListener);
		this.addEventListener('contextmenu',this.onContextMenuListener);
		this.addEventListener('click',this.onMouseClickListener);
	};
	
	/*
	*初始化预种植卡片,先隐藏它，当种植的时候再显示
	*/
	MainScene.prototype.initPrePlantCard=function(){
		
		//初始化半透明植物
		var transparentPlant=new Dream.display.Bitmap({
			image:game.images.sunflower001
		});
		transparentPlant.name='transparentPlant';
		transparentPlant.visible=false;
		transparentPlant.alpha=0.5;
		this.addChild(transparentPlant);

		//跟随鼠标移动的植物
		var bitmap=new Dream.display.Bitmap({
			image:game.images.sunflower001
		});
		bitmap.name='prePlantCard';
		bitmap.visible=false;
		this.addChild(bitmap);
		
		game.prePlantCard=bitmap;
		game.transparentPlant=transparentPlant;
	};
	
	/*
	*主场景鼠标移动事件
	*/
	MainScene.prototype.onMouseMoveListener=function(e){
		if(game.prePlant){//如果是预种植状态
			var prePlantCard=game.prePlantCard;
			var transparentPlant=game.transparentPlant;
			var x=e.mouseX;
			var y=e.mouseY;
			prePlantCard.x=x-prePlantCard.width/2;
			prePlantCard.y=y-prePlantCard.height/2;
			
			var rect=this.checkGrid(x,y);
			if(rect&&(rect.type=='')){//如果在网格内并且网格内没有植物
				var x=rect.x+(rect.width-transparentPlant.width)/2;
				var y=rect.y+rect.height-transparentPlant.height;
				transparentPlant.visible=true;
				transparentPlant.x=x;
				transparentPlant.y=y;
				game.canPlant=true;
				return;
			}
			game.canPlant=false;
		}
	};

	/*
	*主场景鼠标单击事件
	*/
	MainScene.prototype.onMouseClickListener=function(e){
		if(!game.canPlant) return;
		var transparentPlant=game.transparentPlant;
		var prePlantCard=game.prePlantCard;
		var x=transparentPlant.x,
			 y=transparentPlant.y;
		var type=game.selectCardType;
		var rect=this.checkGrid(x,y);
		var plant;//要种植的植物
		switch(type){
			case 'sunflower':
				plant=new SunFlower(SunFlower.scene);
				game.sunflowers.addChild(plant);
				break;
			case 'peashooter':
				plant=new PeaShooter(PeaShooter.scene);
				game.peashooters.addChild(plant);
				break;
			default:break;
		}
		plant.x=x;
		plant.y=y;
		plant.row=rect.row;
		plant.col=rect.col;
		plant.rect=rect;
		rect.type=type;
		game.canPlant=false;
		game.prePlant=false;
		transparentPlant.visible=false;
		prePlantCard.visible=false;
	}
	
	/*
	*主场景鼠标右键事件
	*/
	MainScene.prototype.onContextMenuListener=function(e){
		if(game.prePlant){
			game.prePlant=false;
			game.canPlant=false;
			game.prePlantCard.visible=false;
			game.transparentPlant.visible=false;
		}
	};
	
	/*
	*@Detect which grid the given point in 
	*@param x{number}the Horizontal coordinates
	*@param y{number}the Vertical coordinates
	*@return rect{Rectangle}the Rectangle which mouse in
	*/
	MainScene.prototype.checkGrid=function(x,y){
		var option=game.config.const,
			 sx=option.gridOffsetX,
			 sy=option.gridOffsetY,
			 w=option.gridWidth,
			 h=option.gridHeight,
			 rows=option.rows,
			 cols=option.cols,
		     row=parseInt((y-sy)/h),
			 col=parseInt((x-sx)/w);
		if((row>=0)&&(row<rows)){
			if((col>=0)&&(col<cols)){
					return this.grids[row][col];
			}
		}
		return null;
	};

	/*
	*初始化网格 5*9 start:(260,80),size:(70,90)
	*/
	MainScene.prototype.initGrid=function(){
		var option=game.config.const,
			 sx=option.gridOffsetX,
			 sy=option.gridOffsetY,
			 w=option.gridWidth,
			 h=option.gridHeight,
			 Rectangle=Dream.Rectangle;
		this.grids=[];
		for(var i=0;i<5;i++){
			var arr=[];
			for(var j=0;j<9;j++){
				var rect=new Dream.geom.Rectangle(sx+j*w,sy+i*h,w,h);
				rect.id=i*9+j;
				rect.type='';
				rect.row=i;
				rect.col=j;
				arr.push(rect);
			}
			this.grids.push(arr);
		}
	};
	
	/*
	*初始化植物和僵尸的场景
	*/
	MainScene.prototype.initScene=function(){
		game.sunflowers=new Dream.display.Sprite();
		game.peashooters=new Dream.display.Sprite();
		game.zombies=new Dream.display.Sprite();
		game.bullets=new Dream.display.Sprite();

		this.addChild(game.sunflowers);
		this.addChild(game.peashooters);
		this.addChild(game.zombies);
		this.addChild(game.bullets);

		SunFlower.initScene();
		PeaShooter.initScene();
		Zombie.initScene();
	};

	/*
	*每隔一定时间产生一些僵尸
	*/
	MainScene.prototype.initZombie=function(){
		var self=this;
		var zomTimer=this.zomTimer=new Dream.utils.Timer(3000,0);
		zomTimer.addEventListener('timer',function(e){
			var row=parseInt(Math.random()*5);
			var rect=self.grids[row][8];
			var zom=new Zombie(Zombie.scene);
			zom.x=stage.getStageWidth();	
			zom.y=rect.y+rect.height-zom.height;
			zom.vx=-1;
			zom.row=rect.row;
			zom.run();
			game.zombies.addChild(zom);
		});
		zomTimer.start();
	};
	

	MainScene.prototype.update=function(){
		this.frameCount++;
		//check
		this.checkHitPlant();
		this.checkCanShoot();
		this.checkHitZombie();
	}

	/*
	*检测僵尸是否碰到植物或僵尸越界
	*/
	MainScene.prototype.checkHitPlant=function(){
		var sunflowers=game.sunflowers.children,
			 peashooters=game.peashooters.children,
			 zombies=game.zombies.children;
			 plants=[].concat(sunflowers,peashooters);
		for(var i=0,len=zombies.length;i<len;i++){
			var zombie=zombies[i];
				 row=zombie.row;
			if(zombie.state=='attack') continue;
			for(var j=0,lenj=plants.length;j<lenj;j++){
				var plant=plants[j];
				if(plant.row!=row) 
					continue;
				var centerX=zombie.x+zombie.width/2;
				if((centerX>plant.x)&&(centerX<(plant.x+plant.width))){
					zombie.attack(plant);
					plant.state='underattack';
				}
			}
			if(zombie.x<0){
				zombie.destory();
			}
		}
	};

	/*
	*豌豆射手检测同一行是否有僵尸
	*/
	MainScene.prototype.checkCanShoot=function(){
		var peashooters=game.peashooters.children,
			 zombies=game.zombies.children,
			 stageWidth=stage.getStageWidth();
		for(var i=0,len=peashooters.length;i<len;i++){
			var peashooter=peashooters[i];
			var row=peashooter.row;
			for(var j=0,lenj=zombies.length;j<lenj;j++){
				var zombie=zombies[j];
				if((zombie.row==row)&&(zombie.x<stageWidth)){//如果在同一行，就标记可以攻击
					peashooter.canShoot=true;
					break;
				}
				peashooter.canShoot=false;
			}
		}
	};
	
	/*
	*检测子弹击中僵尸
	*/
	MainScene.prototype.checkHitZombie=function(){
		var bullets=game.bullets.children,
			 zombies=game.zombies.children,
			 stageWidth=stage.getStageWidth();
		for(var i=bullets.length-1;i>=0;i--){
			var bullet=bullets[i];
			var row=bullet.row;
			for(var j=zombies.length-1;j>=0;j--){
				var zombie=zombies[j];
				if(zombie.row==row){//如果在同一行，就进行碰撞检测
					var zombieCenterX=zombie.x+zombie.width/2;
					if((zombieCenterX>bullet.x)&&(zombieCenterX<(bullet.x+bullet.width))){//这里用僵尸的中心来做检测
						bullet.onAttackZombie();
						//bullet.parent.removeChild(bullet);
						zombie.onUnderAttack();
						break;
					}
				}
				if(bullet.x>stageWidth){//超过边界
					bullet.destory();
				}
			}
		}
	}
	
	return MainScene;
});