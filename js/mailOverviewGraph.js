
//桑基图来描述区域类型时间的分布关系
 var color1 = d3.scale.category20();
 var color=["#006600","#00663","#006666","#006699","#0066CC","#0066FF","#CC3300",
 "#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CCCC00","#CCCC33","#CCFFFF","#FFCC66"]
var mailOverviewGraph={

  initialize: function(){
    console.log(color)
    var mailView=d3.select('#mail-category-view').append('svg');
    console.log(mailView,$("#mail-category-view").width())

    d3.json("testdata/sankeytest.json", function(error, data) {
        console.log(data)
        //https://raw.githubusercontent.com/q-m/d3.chart.sankey/master/example/data/energy.json
        //https://raw.githubusercontent.com/q-m/d3.chart.sankey/master/example/data/product.json
        SankeyGraph($("#mail-category-view").width()*0.9,$("#mail-category-view").height()*0.9,mailView,data);
    });  
    
    //节点和连接数据
    
    // SankeyGraph($("#mail-category-view").width()*0.8,$("#mail-category-view").height()*0.8,mailView,data);


  }
}

var SankeyGraph=function(width,height,parentNode,data){
    // 定义桑基布局
    // nodeWidth表示节点水平宽度，这个属性可以用来设置矩形的宽度等；
    // nodePadding表示矩形的垂直方向的间距；
    // size表示整个sankey图占用的空间大小；
    // nodes加载如上所述的节点数组；
    // 同理links函数加载链接数组；
    var margin = {top: 30, right: 1, bottom: 6, left: 30},
        width=width- margin.left - margin.right,
        height=height- margin.top - margin.bottom;

    var sankeyVis=parentNode.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var categorys=parentNode.append('g').attr("class","ctgry");


    // console.log(data.nodes,data.links)

    var sankey = d3.sankey()
            .nodeWidth(10) 
            .nodePadding(10) 
            .size([width*0.8, height*0.8]) 
            .nodes(data.nodes)  
            .links(data.links)
            .layout(5); //桑基布局用来优化流布局的时间

    // // 路径数据生成器
    var path = sankey.link();

    // 绑定连接数据
    var links = sankeyVis.append("g").selectAll("path")
                .data(data.links)
                .enter()

    // 绑定节点数据
    var nodes = sankeyVis.append("g").selectAll(".node")
                    .data(data.nodes)
                    .enter();
    //绘制连接
    var link=links.append("path")
        .attr({
            fill: "none",   //填充色
            stroke: function(d,i){ return color1(i); },  //描边色 todo 要改成和类型等相关的颜色
            "stroke-opacity": 0.5,  //描边透明度
            d: path,  //路径数据
            id: function(d,i){ return 'link' +i },  //ID
            class:"link",
        })
        .style("stroke-width",function(d){
            return Math.max(1,d.dy);
        })
        .sort(function(a,b){ //？
            return b.dy - a.dy;
        })
        ;


    // // 绘制连接文本 ？？
    // links.append('text')
    //     .append('textPath')
    //     .attr('xlink:href', function (d,i) { return '#link' + i; })
    //     .attr('startOffset','50%')
    //     .text(function (d) { return d.value; });

    // //绘制节点时给节点添加拖动行为，并绑定拖动事件监听器。
    // 绘制矩形节点   
    nodes.append("rect")
          .attr({
                x: function (d) { return d.x; },
                y: function (d) { return d.y; },
                height: function (d) { return d.dy; },
                width: sankey.nodeWidth(), 
                fill:  function(d,i){ return color[i]; },//todo 改为和类型相关
          })
          .call(d3.behavior.drag()
                    .origin(function(d) { return d; }) //防止拖动时出现跳动
                    .on("drag", dragmove)
           );

    // 拖动事件响应函数
    //在拖动过程中重新计算矩形的坐标位置,并重新启动桑基布局，之后给路径元素绑定新的路径数据
    function dragmove(d) {
         d3.select(this).attr({
            // "x": (d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))),
            "x":d.x,//仅竖直方向拖动
            "y": (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y)))
         });

         sankey.relayout();
         link.attr('d',path);
    }
    
    // nodes.append("text")
    //     .attr("text-anchor","middle")
    //     .attr({
    //         x: function (d) { return d.x+sankey.nodeWidth() / 2; },
    //         y: function (d) { return d.y+d.dy / 2; }

    //     })
    //     .text(function(d) { return d.name; })
    //     .filter(function(d) {
    //         return d.x < width / 2 ;
    //     })
    //     ;
    
    //todo 之后绑定数据
    var labels=["短信类型","时间段","分布区域"]
    categorys.selectAll("text").data(labels)
             .enter()
             .append("text")
             .attr({
                x:function(d,i){return width/3*i+15*i+15;},
                y:15,
                fill:"white",
                fontSize:12,
             })
             .text(function(d){return d;})
}
