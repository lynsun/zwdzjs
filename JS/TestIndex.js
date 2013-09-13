define(function(require, exports, module){
	var Dream=require('core/Dream');
	var Bullet=require('./Bullet');


	var game=window.game={
		//images to be loaded ex:[{name:'background',src:'images/bg.jpg',size:120,rect:[1000,800]},...]
		config:{
			images:[
				{name:'background',src:'images/static/background.jpg',rect:[1400,600]},
				{name:'topbar',src:'images/static/top.gif',rect:[599,87]},
				{name:'bullet',src:'images/static/bullet.png',rect:[56,34]},
				/*card start*/
				{name:'sunflower',src:'images/card/Sunflower.gif'},
				{name:'peashooter',src:'images/card/PeaShooter.gif'},
				{name:'wallnut',src:'images/card/WallNut.gif'},
				{name:'potatomine',src:'images/card/PotatoMine.gif'},
				/*card end*/
				{name:'sun',src:'images/sun/sun001.png'}
			],
			audios:[],
			const:{
				gridOffsetX:260,
				gridOffsetY:80,
				gridWidth:80,
				gridHeight:95,
				rows:5,
				cols:9
			}
		},
		images:{},
		canvas:'can',
		//������Ϸ
		run:function(){
			this.initSunFlowerImage();
			this.initPeaShooterImage();
			this.initZombieRunImage();
			this.initZombieAttackImage();
			this.loadImage();
		},
		//����ͼƬ
		loadImage:function(){
			var self=this;
			var totalCount=this.totalCount=game.config.images.length;
			var countLoaded=this.countLoaded=0;
			var imageInfos=game.config.images;
			var images=game.images;
			for(var i=0,len=totalCount;i<len;i++){
				var imgInfo=imageInfos[i],
					 img=new Image();
				
				img.onload=function(){
					 self.countLoaded++;
					 self.loadOneComplete(self.countLoaded,self.totalCount);
					 if(self.countLoaded==self.totalCount){//�������
						self.onLoadComplete();
					 }
				}

				images[imgInfo.name]=img;
				img.src=imgInfo.src;
			}
		},
		//��ʼ�����տ�ͼƬ
		initSunFlowerImage:function(){
			var images=this.config.images;
			for(var i=1;i<=18;i++){
				var imgName=i>=10?('sunflower0'+i):('sunflower00'+i);
				var img={name:imgName,src:'images/sunflower/'+imgName+'.png',rect:[73,74]};
				images.push(img);
			}
		},
		//��ʼ���㶹����ͼƬ
		initPeaShooterImage:function(){
			var images=this.config.images;
			for(var i=1;i<=13;i++){
				var imgName=i>=10?('peashooter0'+i):('peashooter00'+i);
				var img={name:imgName,src:'images/peashooter/'+imgName+'.png',rect:[71,71]};
				images.push(img);
			}
		},
		//��ʼ����ʬ����ͼƬ
		initZombieRunImage:function(){
			var images=this.config.images;
			for(var i=1;i<=31;i++){
				var imgName=i>=10?('zomrun0'+i):('zomrun00'+i);
				var img={name:imgName,src:'images/Zombie/run/'+imgName+'.png',rect:[166,144]};
				images.push(img);
			}
		},
		//��ʼ����ʬ����ͼƬ
		initZombieAttackImage:function(){
			var images=this.config.images;
			for(var i=1;i<=21;i++){
				var imgName=i>=10?('zomatt0'+i):('zomatt00'+i);
				var img={name:imgName,src:'images/Zombie/attack/'+imgName+'.png',rect:[166,144]};
				images.push(img);
			}
		},
		//�������һ����Դ����
		loadOneComplete:function(countLoaded,totalCount){
			
		},
		//������Ϸ��Դ������Ϻ󴥷�
		onLoadComplete:function(){
			var goldenInfo=document.getElementById('gold');
			var stage=this.stage=window.stage=new Dream.display.Stage(this.canvas);
			stage.frameRate=20;
			stage.startup();
			var bullet=new Bullet({
				image:game.images.bullet,
				row:2,
				x:300,
				y:400
			});
			stage.addChild(bullet);
		}
	};

	return game;
	
});