	//全局变量
var gmaxLng,gminLng,gmaxLat,gminLat;


//将区域划分为小块，并赋予id
/**
n:划分的区域数
*/
var divideRegion=function(n){

   //判断(lng,lat)属于哪个区域
   function findWhere(){

   }
}

var formatTime=function(timestamp){
	var date = new Date(timestamp);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds(); 
	console.log(Y+M+D+h+m+s);
}

var TimeMatrix=function(width,height,data){
	var values=data.values;
	this.width=width;
	this.height=height;
	this.unitW=width/24.0;
	this.unitH=Math.min(this.unitW,height/values.length);

	this.rectBuff={};
	for(var each of values){

		var date=each.key;
		var messages=each.values;
        
		this.rectBuff[date]=[];
		//初始化
		for(var hour=0;hour<24;hour++){
			this.rectBuff[date][hour]={
				time:date+"-"+hour,
				count:0,
			}
		}
		for(var message of messages){
			this.rectBuff[date][message.date.hour].time+=(":"+message.date.minute+":"+message.date.second+"/");
			this.rectBuff[date][message.date.hour].count+=1;
			this.pos=[parseFloat(message.lng),parseFloat(message.lat)]
		}
	}

	// console.log(this.rectBuff)
};

TimeMatrix.prototype.initialize = function(parent) {
	console.log(parent)
	var margin = {top: 10, right: 10, bottom: 6, left: 20}
	var _self=this;

	var svg=d3.select(parent).append("svg")
	          .attr({
	          	width:$(parent).width()*0.8,
	          	height:$(parent).height()*0.8,
	          })
	          .style({
	          	top:$(parent).width()*0.05,
	          	left:$(parent).height()*0.05,
	          })
	/* Initialize tooltip */
	cellTip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
	//add tip
    svg.call(cellTip)
	

	//add axis
	// var week_range = d3.time.weeks(d3.time.week(start_date), end_date);
	// var len = week_range.length;
	// var scale = d3.scale.ordinal().domain(week_range).rangeBands([0,len]);

	//add blank rects
	var rectArray=[];
	for(var key in _self.rectBuff){
		rectArray.push(_self.rectBuff[key]);
	}
	rectArray=d3.merge(rectArray);
	
	console.log(rectArray)

	var rectGroup=svg.append("g").attr("class","rects").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var rects=rectGroup.selectAll("rect").data(rectArray);
	
	
	rects.attr({
            class: 'cell',
            width: _self.unitW,
            height: _self.unitH,
            x: function(d,i) { return  (i%24)* _self.unitW; },
            y: function(d,i) { return  Math.floor(i/24)* _self.unitH; },
            stroke:"#333",
            fill:"#222",
        })
	   .on('mouseover', cellTip.show)
        .on('mouseout', cellTip.hide);

	rects.enter().append("rect")
	    .attr({
            class: 'cell',
            width: _self.unitW,
            height: _self.unitH,
            x: function(d,i) { return (i%24)* _self.unitW; },
            y: function(d,i) { return   Math.floor(i/24)* _self.unitH; },
            stroke:"#222",
            "stroke-width":"1px",
            fill:"#444",
        })
        .on('mouseover', cellTip.show)
        .on('mouseout', cellTip.hide);
    
	
    //add circles
    var countMax=0;
    for(var rect of rectArray){
    	var count=rect.count;
    	if(count>countMax) countMax=count;
    }
    console.log(countMax)
    var scaler=d3.scale.pow().exponent(.25).domain([0,countMax]).range([0,_self.unitW/2])
    var circleGroup=svg.append("g").attr("class","circles").attr("transform", "translate(" +20 + "," + 10 + ")");
	var circles=circleGroup.selectAll("circle").data(rectArray)
	circles.attr({
            r: function(d){return scaler(d.count);},
            cx: function(d,i) { return  (i%24)* _self.unitW+_self.unitW/2; },
            cy: function(d,i) { return  Math.floor(i/24)* _self.unitH+_self.unitH/2; },
            fill:"rgba(204,0,102,0.8)",
        })
	    .on('mouseover', cellTip.show)
        .on('mouseout', cellTip.hide);

	circles.enter().append("circle")
	    .attr({
            r:function(d){return scaler(d.count);},
            cx: function(d,i) { return (i%24)* _self.unitW+_self.unitW/2; },
            cy: function(d,i) { return   Math.floor(i/24)* _self.unitH+_self.unitH/2; },
            fill:"rgba(204,0,102,0.8)",

        })
        .on('mouseover', cellTip.show)
        .on('mouseout', cellTip.hide);

    //add axis text
    var axisGroup=svg.append("g").attr("class","axis");
	
	//y day axie
	var i=0;
	for(var key in _self.rectBuff){
		
		axisGroup.append("text")
				 .attr({
		            x: 0,
		            y: i* _self.unitH+_self.unitH,
		            dy:10,
		            fill:"#ccc",
		            "font-size":10,
		        })
		        .text(key);
       
		i+=1;
	}
	//x hour axis
	for(var j=0;j<=24;j+=4){
		axisGroup.append("text")
				 .attr({
		            x: j* _self.unitW,
		            y: _self.unitH/2,
		            dx:20,
		            fill:"#ccc",
		            "font-size":10,
		        })
		        .text(j);

		axisGroup.append("line")
		         .attr({
		         	x1:j* _self.unitW+20,
		         	x2:j* _self.unitW+20,
		         	y1:_self.unitH/2,
		         	y2:_self.unitH/2+_self.height,
		         	stroke:"black",
		         	"stroke-width":"2px",
		         })
	}

	//add lines 以不同周，每4个小时添加分割线 todo 加上周几



};

TimeMatrix.prototype.addTooltip=function(data){

};

//点击单个cell后出现的
var extendTime=function(){

}

//sanky：三个轴 stations-短信类型-地区


//day-hour  点击方格出现详情 时间轴变得更详细而不仅是聚集/每个数据点是一个饼图，表示地区？


//weekday-month??不一定要，如果发现真的和周几关系较大才要


var baseStationOverview = {
	name: "baseStationOverview",
    
	initialize: function() {
		var self = this;
		self._addListener();

		d3.csv("testdata/testdata.csv",function (e,data) {
        var $bsView=$("#basestation-view");
            
            //todo 计算一下是周几
			for(let each of data){
				var date=new Date(parseInt(each.conntime));

				each.date={
					year:date.getFullYear(),
					month:date.getMonth()+1,
					day:date.getDate(),
					hour:date.getHours(),
					minute:date.getMinutes(),
			        second: date.getSeconds(),
				}
			}

			var nested=d3.nest()
		                .key(function(d) { return d.phone; })
						.key(function(d) { return d.date.month+"-"+d.date.day; })
						.sortKeys(d3.ascending)
						.entries(data);

			var phoneSelected="10658888888";
			var stationdata=nested.find(function(station){return station.key===phoneSelected});
			
			timematrix1=new TimeMatrix($bsView.width()*0.6,$bsView.height()*0.6,stationdata);
		    console.log(stationdata);

		    timematrix1.initialize($bsView[0]);
		});
		
	},

	_addListener: function() {
		var self = this;
		observerManager.addListener(self);
	},
	OMListen: function(message, data) {
		var self = this;
		if(message === "") {
			//handle message
		}
	}
}


