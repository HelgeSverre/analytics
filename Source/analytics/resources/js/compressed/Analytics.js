var Analytics={GoogleVisualizationCalled:!1,GoogleVisualizationReady:!1};Analytics.Visualization=Garnish.Base.extend({options:null,afterInitStack:[],init:function(t){this.options=t,0==Analytics.GoogleVisualizationCalled?(Analytics.GoogleVisualizationCalled=!0,"undefined"==typeof AnalyticsChartLanguage&&(AnalyticsChartLanguage="en"),google.load("visualization","1",{packages:["corechart","table"],language:AnalyticsChartLanguage,callback:$.proxy(function(){Analytics.GoogleVisualizationReady=!0,this.onAfterInit(),this.onAfterFirstInit()},this)})):this.onAfterInit()},onAfterFirstInit:function(){for(i=0;i<this.afterInitStack.length;i++)this.afterInitStack[i]()},onAfterInit:function(){Analytics.GoogleVisualizationReady?this.options.onAfterInit():this.afterInitStack.push(this.options.onAfterInit)}}),Analytics.Chart=Garnish.Base.extend({type:null,chart:null,data:null,period:null,options:null,visualization:null,init:function(t,i){this.visualization=new Analytics.Visualization({onAfterInit:$.proxy(function(){this.$chart=t,this.$graph=$('<div class="graph" />').appendTo(this.$chart),this.data=i,"undefined"!=typeof this.data.chartOptions&&(this.chartOptions=this.data.chartOptions),"undefined"!=typeof this.data.type&&(this.type=this.data.type),"undefined"!=typeof this.data.period&&(this.period=this.data.period),this.addListener(Garnish.$win,"resize","resize"),this.initChart(),"undefined"!=typeof this.data.onAfterInit&&this.data.onAfterInit()},this)})},initChart:function(){switch(this.$graph.addClass(this.type),this.type){case"area":this.initAreaChart();break;case"counter":this.initCounterChart();break;case"geo":this.initGeoChart();break;case"pie":this.initPieChart();break;case"table":this.initTableChart();break;default:console.error('Chart type "'+this.type+'" not supported.')}},initAreaChart:function(){if($period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.area(this.data.period),"year"==this.data.period){var t=new google.visualization.DateFormat({pattern:"MMMM yyyy"});t.format(this.dataTable,0)}this.chart=new google.visualization.AreaChart(this.$graph.get(0)),this.draw()},initCounterChart:function(){$value=$('<div class="value" />').appendTo(this.$graph),$label=$('<div class="label" />').appendTo(this.$graph),$period=$('<div class="period" />').appendTo(this.$graph),$value.html(this.data.counter.count),$label.html(this.data.metric),$period.html(" "+this.data.periodLabel)},initPieChart:function(){$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.dimension),$period.html(this.data.metric+" "+this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.pie(),this.chart=new google.visualization.PieChart(this.$graph.get(0)),this.draw()},initTableChart:function(){$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.table(),this.chart=new google.visualization.Table(this.$graph.get(0)),this.draw()},initGeoChart:function(){$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.geo(this.data.dimensionRaw),this.chart=new google.visualization.GeoChart(this.$graph.get(0)),this.draw()},draw:function(){this.dataTable&&this.chartOptions&&this.chart.draw(this.dataTable,this.chartOptions)},resize:function(){this.chart&&this.dataTable&&this.chartOptions&&this.chart.draw(this.dataTable,this.chartOptions)}}),Analytics.ChartOptions=Garnish.Base.extend({},{area:function(t){switch(options=this.defaults.area,t){case"week":options.hAxis.format="E",options.hAxis.showTextEvery=1;break;case"month":options.hAxis.format="MMM d",options.hAxis.showTextEvery=1;break;case"year":options.hAxis.showTextEvery=1,options.hAxis.format="MMM yy"}return options},table:function(){return this.defaults.table},geo:function(t){switch(options=this.defaults.geo,t){case"ga:city":options.displayMode="markers";break;case"ga:country":options.resolution="countries",options.displayMode="regions";break;case"ga:continent":options.resolution="continents",options.displayMode="regions";break;case"ga:subContinent":options.resolution="subcontinents",options.displayMode="regions"}return options},pie:function(){return this.defaults.pie},field:function(){return{colors:["#058DC7"],backgroundColor:"#fdfdfd",areaOpacity:.1,pointSize:8,lineWidth:4,legend:!1,hAxis:{textStyle:{color:"#888"},baselineColor:"#fdfdfd",gridlines:{color:"none"}},vAxis:{maxValue:5},series:{0:{targetAxisIndex:0},1:{targetAxisIndex:1}},vAxes:[{textStyle:{color:"#888"},format:"#",textPosition:"in",baselineColor:"#eee",gridlines:{color:"#eee"}},{textStyle:{color:"#888"},format:"#",textPosition:"in",baselineColor:"#eee",gridlines:{color:"#eee"}}],chartArea:{top:10,bottom:10,width:"100%",height:"80%"}}},defaults:{area:{theme:"maximized",legend:"none",backgroundColor:"#FFF",colors:["#058DC7"],areaOpacity:.1,pointSize:8,lineWidth:4,chartArea:{},hAxis:{format:"E",textPosition:"in",textStyle:{color:"#058DC7"},showTextEvery:1,baselineColor:"#fff",gridlines:{color:"none"}},vAxis:{textPosition:"in",textStyle:{color:"#058DC7"},baselineColor:"#ccc",gridlines:{color:"#fafafa"},maxValue:0}},geo:{displayMode:"auto"},pie:{theme:"maximized",height:282,pieHole:.5,legend:{alignment:"center",position:"top"},chartArea:{top:40,height:"82%"},sliceVisibilityThreshold:1/120},table:{}}}),Analytics.Utils={responseToDataTable:function(response){console.log("responseToDataTable",response);var data=new google.visualization.DataTable;return $.each(response.cols,function(t,i){data.addColumn(i)}),console.log("response",response),$.each(response.rows,function(kRow,row){$.each(row,function(kCell,cell){switch(response.cols[kCell].type){case"date":$dateString=cell.v,8==$dateString.length?($year=eval($dateString.substr(0,4)),$month=eval($dateString.substr(4,2))-1,$day=eval($dateString.substr(6,2)),$date=new Date($year,$month,$day),row[kCell]=$date):6==$dateString.length&&($year=eval($dateString.substr(0,4)),$month=eval($dateString.substr(4,2))-1,$date=new Date($year,$month,"01"),row[kCell]=$date)}}),data.addRow(row)}),data}};