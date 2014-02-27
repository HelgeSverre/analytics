google.load("visualization","1",{packages:["corechart","table","geochart"]});AnalyticsCountReport=Garnish.Base.extend({init:function(e){this.$element=$(e);this.$inject=$(".analytics-inject",e);this.$error=$(".analytics-error",e);var t={start:this.$element.data("start"),end:this.$element.data("end")};this.$element.addClass("analytics-loading");Craft.postActionRequest("analytics/charts/getCountReport",t,function(e){if(typeof e.error!="undefined"){$(".inject",this.$error).html(e.error);this.$error.removeClass("hidden");$(this.$element).addClass("error")}else this.$inject.html(e.html);this.$element.removeClass("analytics-loading")},this)}});AnalyticsChart=Garnish.Base.extend({$element:null,$inject:null,$data:null,$chart:null,$googleData:null,$googleChart:null,$lastWindowWidth:null,init:function(e){this.$element=e;this.$inject=$(".inject",e);this.$error=$(".analytics-error",e);this.$data=$(".data",e);this.$data.css("display","none");this.$data=this.$data.html();this.$data=$.parseJSON(this.$data);Craft.postActionRequest("analytics/charts/getChart",{data:this.$data},function(e){if(typeof e.error!="undefined"){$(".inject",this.$error).html(e.error);this.$error.removeClass("hidden");$(this.$element).addClass("error")}else this.initChart(e.chart);$(this.$element).removeClass("analytics-loading")},this)},initChart:function(e){this.$chart=e;this.$googleData=new google.visualization.DataTable;var t=this;$.each(e.columns,function(e,n){t.$googleData.addColumn(n.type,n.label)});this.$googleData.addRows(e.rows);switch(e.type){case"AreaChart":this.$googleChart=new google.visualization.AreaChart(this.$inject.get(0));break;case"LineChart":this.$googleChart=new google.visualization.LineChart(this.$inject.get(0));break;case"Table":this.$googleChart=new google.visualization.Table(this.$inject.get(0));break;case"ColumnChart":this.$googleChart=new google.visualization.ColumnChart(this.$inject.get(0));break;case"BubbleChart":this.$googleChart=new google.visualization.BubbleChart(this.$inject.get(0));break;case"BarChart":this.$googleChart=new google.visualization.BarChart(this.$inject.get(0));break;case"ColumnChart":this.$googleChart=new google.visualization.ColumnChart(this.$inject.get(0));break;case"PieChart":this.$googleChart=new google.visualization.PieChart(this.$inject.get(0));break;case"GeoChart":this.$googleChart=new google.visualization.GeoChart(this.$inject.get(0))}this.drawChart();$("body").bind("redraw",function(e){t.drawChart()});$(window).resize(function(){var e=$(t.$element);e.width()>0&&t.$lastWindowWidth!=e.width()&&t.drawChart();t.$lastWindowWidth=e.width()})},drawChart:function(){this.$googleChart&&this.$googleChart.draw(this.$googleData,this.$chart.options)}});$(document).ready(function(){var e=$(".analytics-chart"),t=[];e.each(function(e,n){t=new AnalyticsChart(n)});var n=$(".analytics-report-count"),r=[];n.each(function(e,t){r=new AnalyticsCountReport(t)})});