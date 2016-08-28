var Analytics={GoogleVisualizationCalled:!1,GoogleVisualizationReady:!1,reports:{}};Analytics.ChartOptions=Garnish.Base.extend({},{area:function(t){switch(options=this.defaults.area,t){case"week":options.hAxis.format="E",options.hAxis.showTextEvery=1;break;case"month":options.hAxis.format="MMM d",options.hAxis.showTextEvery=1;break;case"year":options.hAxis.showTextEvery=1,options.hAxis.format="MMM yy"}return options},table:function(){return this.defaults.table},geo:function(t){switch(options=this.defaults.geo,t){case"ga:city":options.displayMode="markers";break;case"ga:country":options.resolution="countries",options.displayMode="regions";break;case"ga:continent":options.resolution="continents",options.displayMode="regions";break;case"ga:subContinent":options.resolution="subcontinents",options.displayMode="regions"}return options},pie:function(){return this.defaults.pie},field:function(){return{theme:"maximized",legend:"none",backgroundColor:"#fdfdfd",colors:["#058DC7"],areaOpacity:.1,pointSize:0,lineWidth:4,height:120,hAxis:{format:"MMM d",textPosition:"in",textStyle:{color:"#058DC7"},showTextEvery:1,baselineColor:"#fff",gridlines:{color:"none"}},vAxis:{textPosition:"in",textStyle:{color:"#058DC7"},baselineColor:"#ccc",gridlines:{color:"#f4f4f4"},minValue:0,maxValue:10,format:"#"}}},defaults:{area:{theme:"maximized",legend:"none",backgroundColor:"#FFF",colors:["#058DC7"],areaOpacity:.1,pointSize:7,lineWidth:4,chartArea:{},hAxis:{format:"E",textPosition:"in",textStyle:{color:"#058DC7"},showTextEvery:1,baselineColor:"#fff",gridlines:{color:"none"}},vAxis:{textPosition:"in",textStyle:{color:"#058DC7"},baselineColor:"#ccc",gridlines:{color:"#fafafa"},minValue:0,maxValue:10,format:"#"}},geo:{displayMode:"auto"},pie:{theme:"maximized",height:282,pieHole:.5,legend:{alignment:"center",position:"top"},chartArea:{top:40,height:"82%"},sliceVisibilityThreshold:1/120},table:{}}}),Analytics.Metadata={getContinentByCode:function(t){var a;return $.each(Analytics.continents,function(e,i){t==i.code&&(a=i.label)}),a?a:t},getSubContinentByCode:function(t){var a;return $.each(Analytics.subContinents,function(e,i){t==i.code&&(a=i.label)}),a?a:t}},Analytics.Utils={responseToDataTable:function(t){var a=new google.visualization.DataTable;return $.each(t.cols,function(t,e){var i;switch(e.type){case"percent":case"time":case"integer":case"currency":case"float":i="number";break;case"continent":case"subContinent":i="string";break;default:i=e.type}a.addColumn({type:i,label:e.label+"("+e.type+")",id:e.id})}),$.each(t.rows,function(e,i){$.each(i,function(a,e){switch(t.cols[a].type){case"continent":case"subContinent":case"currency":case"percent":case"time":i[a]={v:e,f:Analytics.Utils.formatByType(t.cols[a].type,e)};break;default:i[a]=Analytics.Utils.formatByType(t.cols[a].type,e)}}),a.addRow(i)}),a},formatByType:function(type,value){switch(type){case"continent":return Analytics.Metadata.getContinentByCode(value);case"subContinent":return Analytics.Metadata.getSubContinentByCode(value);case"currency":return Analytics.Utils.formatCurrency(value);case"time":return Analytics.Utils.formatDuration(value);case"percent":return Analytics.Utils.formatPercent(value);case"date":if($dateString=value,8==$dateString.length)return $year=eval($dateString.substr(0,4)),$month=eval($dateString.substr(4,2))-1,$day=eval($dateString.substr(6,2)),$date=new Date($year,$month,$day),$date;if(6==$dateString.length)return $year=eval($dateString.substr(0,4)),$month=eval($dateString.substr(4,2))-1,$date=new Date($year,$month,"01"),$date;break;default:return value}},formatPercent:function(t){return this.getD3Locale().numberFormat(Analytics.formats.percentFormat)(t/100)},formatCurrency:function(t){return this.getD3Locale().numberFormat(Analytics.formats.currencyFormat)(t)},getD3Locale:function(){var t=window.d3_locale;return d3.locale(t)},formatDuration:function(t){var a=parseInt(t,10),e=Math.floor(a/3600),i=Math.floor((a-3600*e)/60),n=a-3600*e-60*i;return e<10&&(e="0"+e),i<10&&(i="0"+i),n<10&&(n="0"+n),e+":"+i+":"+n}},Analytics.Visualization=Garnish.Base.extend({options:null,afterInitStack:[],init:function(t){this.options=t,0==Analytics.GoogleVisualizationCalled?(Analytics.GoogleVisualizationCalled=!0,"undefined"==typeof AnalyticsChartLanguage&&(AnalyticsChartLanguage="en"),google.load("visualization","1",{packages:["corechart","table"],language:AnalyticsChartLanguage,callback:$.proxy(function(){Analytics.GoogleVisualizationReady=!0,this.onAfterInit(),this.onAfterFirstInit()},this)})):this.onAfterInit()},onAfterFirstInit:function(){for(i=0;i<this.afterInitStack.length;i++)this.afterInitStack[i]()},onAfterInit:function(){Analytics.GoogleVisualizationReady?this.options.onAfterInit():this.afterInitStack.push(this.options.onAfterInit)}}),Analytics.reports.BaseChart=Garnish.Base.extend({$chart:null,$graph:null,type:null,chart:null,chartOptions:null,data:null,period:null,options:null,visualization:null,init:function(t,a){this.visualization=new Analytics.Visualization({onAfterInit:$.proxy(function(){this.$chart=t,this.$chart.html(""),this.$graph=$('<div class="chart" />').appendTo(this.$chart),this.data=a,"undefined"!=typeof this.data.chartOptions&&(this.chartOptions=this.data.chartOptions),"undefined"!=typeof this.data.type&&(this.type=this.data.type),"undefined"!=typeof this.data.period&&(this.period=this.data.period),this.addListener(Garnish.$win,"resize","resize"),this.initChart(),"undefined"!=typeof this.data.onAfterInit&&this.data.onAfterInit()},this)})},initChart:function(){this.$graph.addClass(this.type)},draw:function(){this.dataTable&&this.chartOptions&&this.chart.draw(this.dataTable,this.chartOptions)},resize:function(){this.chart&&this.dataTable&&this.chartOptions&&this.chart.draw(this.dataTable,this.chartOptions)}}),Analytics.reports.Area=Analytics.reports.BaseChart.extend({initChart:function(){if(this.base(),$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.area(this.data.period),"undefined"!=typeof this.data.chartOptions&&$.extend(this.chartOptions,this.data.chartOptions),"year"==this.data.period){var t=new google.visualization.DateFormat({pattern:"MMMM yyyy"});t.format(this.dataTable,0)}this.chart=new google.visualization.AreaChart(this.$graph.get(0)),this.draw()}}),Analytics.reports.Counter=Analytics.reports.BaseChart.extend({initChart:function(){this.base(),$value=$('<div class="value" />').appendTo(this.$graph),$label=$('<div class="label" />').appendTo(this.$graph),$period=$('<div class="period" />').appendTo(this.$graph),$value.html(this.data.counter.count),$label.html(this.data.metric),$period.html(" "+this.data.periodLabel)}}),Analytics.reports.Geo=Analytics.reports.BaseChart.extend({initChart:function(){this.base(),$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.geo(this.data.dimensionRaw),this.chart=new google.visualization.GeoChart(this.$graph.get(0)),this.draw()}}),Analytics.reports.Pie=Analytics.reports.BaseChart.extend({initChart:function(){this.base(),$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.dimension),$period.html(this.data.metric+" "+this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.pie(),this.chart=new google.visualization.PieChart(this.$graph.get(0)),this.draw()}}),Analytics.reports.Table=Analytics.reports.BaseChart.extend({initChart:function(){this.base(),$period=$('<div class="period" />').prependTo(this.$chart),$title=$('<div class="title" />').prependTo(this.$chart),$title.html(this.data.metric),$period.html(this.data.periodLabel),this.dataTable=Analytics.Utils.responseToDataTable(this.data.chart),this.chartOptions=Analytics.ChartOptions.table(),this.chart=new google.visualization.Table(this.$graph.get(0)),this.draw()},resize:function(){}});