/*
This file is part of PG Routing

Copyright (c) 2013 National Mapping and Resource Information Authority

PG Routing is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PG Routing is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PG Routing.  If not, see <http://www.gnu.org/licenses/>.
*/


Ext.define('mappanel',{
	extend:'GeoExt.panel.Map',
	alias:'Widget.mappanel',	
	title: "Philippine Geoportal - Routing Map App",   			
	layout:'border',	
	region:'center',
	width:100,
	height:100,	
	gCode:function(addr, callback){	  
				var geocoder = new google.maps.Geocoder();					
				geocoder.geocode({ 'address': addr + ' Philippines' }, function (results, status) {					
					if (status == google.maps.GeocoderStatus.OK) {		
						var xx=results[0].geometry.location.lng();			
						var yy=results[0].geometry.location.lat();		
						SourceDest={a:xx, b:yy};							
					}else{
						console.log("Geocoding failed: " + status); 
						Ext.Msg.alert("Geocoding failed", "Please enter location")
					}				
					callback(SourceDest);	
				})		
			},
	
	buildItems:function(){
		var items = [];
		var me=this;		
				
		// zoom in
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox(),
				id: 'btnZoomIn',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'icons/zoom_in.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				allowDepress: false,
				tooltip: 'Zoom in',
				handler: function() {
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		
		// zoom out
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox({out: true}),
				id: 'btnZoomOut',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'icons/zoom_out.png',
				toggleGroup: 'navigation',
				tooltip: 'Zoom out',
				scale: 'large',
				width: 25, 
				height: 25,
				handler: function() {				
					
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		
		// pan
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.DragPan(),
				id: 'btnPan',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'icons/pan.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				tooltip: 'Pan',
				pressed: true,
				handler: function() {					
					me.body.applyStyles('cursor:default');
				},
				listeners: {				
				}
			}))
		);
		
		
		//search field
		items.push(
			{
				xtype:'textfield',									
				itemId:'Search',
				width:200,
				emptyText:'Location Search',
			}
		);
		
		//Go button		
		items.push(
			{
				xtype:'button',
				text:'Go',
				itemId:'btnGo',
				//disabled:true,
				handler:function(){								
					var me=this.up();				
					var findThis = (me.getComponent('Search').getValue());					
					if (findThis){
						var me=this.up().up();					
						if  (me.map.getLayersByName('My Location').length > 0) {				
							me.map.getLayersByName('My Location')[0].destroy();					
						};	 				
						
						me.gCode(findThis, function(coord){					
							if  (me.map.getLayersByName('Gcode').length > 0) {				
								me.map.getLayersByName('Gcode')[0].destroy();					
							};		 				
							var currLoc = new OpenLayers.Geometry.Point(coord.a,coord.b).transform('EPSG:4326','EPSG:900913');
							var Location = new OpenLayers.Layer.Vector(	'Gcode', {
									 styleMap: new OpenLayers.StyleMap({'default':{										
											externalGraphic: "icons/marker.png",				
											graphicYOffset: -25,
											graphicHeight: 35,
											graphicTitle: findThis
									}}), 	
									displayInLayerSwitcher: false,		
							});							
							Location.addFeatures([new OpenLayers.Feature.Vector(currLoc)]);						
							me.map.addLayer(Location);						
							me.map.zoomToExtent(Location.getDataExtent());			 		
						})	
					}else{
						Ext.Msg.alert('Message', 'Please enter a location');
					}	
				}	
			}		
		
		);				
		
		//full extent
		items.push(
			{			
				xtype:'button',
				tooltip:'Full extent',
				icon:'./icons/phil.png',
				scale:'medium',
				width:25,
				height:25,
				handler:function(){
					var me=this.up().up();									
					OthoExtent = new OpenLayers.Bounds(120.613472,14.295979, 121.550385,14.827789).transform('EPSG:4326','EPSG:900913')
					
					var lonlat = new OpenLayers.LonLat(121,14).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
					map.setCenter(lonlat);
					if (map.baseLayer.name=="BING Aerial Map")
						map.zoomTo(5);
					else if (map.baseLayer.name=="OpenStreetMap")					  
						map.zoomTo(6);
					else if (map.baseLayer.name=="Google Map - Satellite")
						map.zoomTo(6);
					else if (map.baseLayer.name=="ArcGIS Online - Imagery")
						map.zoomTo(6);		
					else if (map.baseLayer.name=="Ortho Image 2011 - Metro Manila")	
						map.zoomTo(1);
					else
						map.zoomTo(6);
				}
			}
		);
		
		items.push(
			{
				xtype:'button',
				tooltip:'Measure tool',
				icon:'icons/measure.png',
				scale:'large',
				width:25,
				height:25,
				handler:function(){
					var me = this.up().up();				
					//console.log(Ext.WindowManager.getActive())
					if(!Ext.getCmp('measureToolWindow')){
						var win = Ext.create('MeasureTool', {
							map:me.map,	
							id: 'measureToolWindow'		
						})					
						win.show();					
					}	
					
				}
			}
		);
		
		items.push(
			'->',
			{
				xtype:'tbtext',
				itemId:'basemapLabel',
				text: 'Basemap: NAMRIA Basemaps'
			
			},
			'->'
		);
		
		//switch basemap
		items.push(					
			
			{
				xtype:'button',
				scale:'large',
				itemId:'btnSwitch',
				icon:'./icons/layers.png',				
				width:68,
				height:30,	
				tooltip:'Switch basemap',
				menu     : [
					{
						text: 'NAMRIA Basemaps',
						group: 'basemap',
						checked: true,
						handler: function(){
							map.setBaseLayer(map.layers[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);													
						}
					},
					{
						text: 'Ortho Image 2011 (selected areas)',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[1]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'Bing Maps - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[2]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'ArcGIS Online - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[3]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Open Street Map',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[4]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Google Map - Satellite',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[5]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					}
			   ]
				
			}
		)
		return items;
	},
	
	
	
	initComponent:function(){				
		var popup, me=this 			
		map = new OpenLayers.Map(				
				{ 
				controls: [
					new OpenLayers.Control.Navigation(),										
					new OpenLayers.Control.MousePosition(),				
				],
				
				fallThrough: true,							
				projection: 'EPSG:900913'
				
		});		
		console.log(map);
		//Map config
		var maxExtent = new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34);
		//var layerMaxExtent = new OpenLayers.Bounds(11128623.5489416,-55718.7227285097,16484559.8541582,3072210.74548981);
		var layerMaxExtent = new OpenLayers.Bounds( 11516520.903064, 482870.29798867,  15821300.345956,  2448728.3963715);		
		var units = 'm';
		var resolutions = [ 3968.75793751588, 
							2645.83862501058, 
							1322.91931250529, 
							661.459656252646, 
							264.583862501058, 
							132.291931250529, 
							66.1459656252646, 
							26.4583862501058, 
							13.2291931250529, 
							6.61459656252646, 
							2.64583862501058, 
							1.32291931250529, 
							0.661459656252646 ];
		var tileSize = new OpenLayers.Size(256, 256);
		var projection = 'EPSG:900913';
		var tileOrigin = new OpenLayers.LonLat(-20037508.342787,20037508.342787);
		//
		
		
	   //PGP Basemap			
      var pgp_basemap_cache = new OpenLayers.Layer.XYZ(					//Use NAMRIA Basemap Tiles
					'NAMRIA Basemaps',
					'http://v2.geoportal.gov.ph/tiles/v2/PGP/${z}/${x}/${y}.png',
					{
						isBaseLayer: true,						
						sphericalMercator:true,					
						transitionEffect: "resize",								
						tileOrigin: tileOrigin,
						displayInLayerSwitcher: false  
						
			
				}
			);
			
		map.addLayer(pgp_basemap_cache);
		
		
		//New Ortho Metro Manila 2.12.16
		var pgp_ortho_mm_cache = new OpenLayers.Layer.XYZ(					//Use NAMRIA Basemap Tiles
				'Ortho Image 2011 (selected areas)',
				'http://v2.geoportal.gov.ph/tiles/v2/Orthoimage/${z}/${x}/${y}.png',
				{
					isBaseLayer: true,						
					sphericalMercator:true,
					displayInLayerSwitcher: false
						
			    }
		);
			
		//Bing 
		
		var bing_aerial = new OpenLayers.Layer.Bing({
			name: "BING Aerial Map",
			key: 'AkRWcFAhv1-J1MxSfE5URc4jiUjoL96_frNidZic_5fLeQ54al4UqXcKKr04l2ud',
			type: "Aerial",
			displayInLayerSwitcher: false
			
		}, {
			isBaseLayer: true,
			visibility: false,
			transitionEffect: "resize"
		});
		
		//ArcGIS
		
		var arcgis_world_imagery = new OpenLayers.Layer.ArcGIS93Rest("ArcGIS Online - Imagery", 
		'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export',
		{
			layers: 'show:0,1,2,3',
			format: 'png24'
		}, 
		{
			//additional options
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});
		
		//Open Street Map
		var osm  = new OpenLayers.Layer.OSM("","",
		{
			sphericalMercator: true,
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});	
		
			
	   //Google
	   var google_satellite = new OpenLayers.Layer.Google(
                "Google Map - Satellite",
                {
					type: google.maps.MapTypeId.SATELLITE, 
					numZoomLevels: 22,
					sphericalMercator: true,
					transitionEffect: "resize",
					isBaseLayer: true,
					displayInLayerSwitcher: false
				}
        );				
		//

		var Location = new OpenLayers.Layer.Vector('My Location', {
			displayInLayerSwitcher: false,		
		});	

		map.addLayers([pgp_basemap_cache,pgp_ortho_mm_cache,bing_aerial, arcgis_world_imagery, osm, google_satellite, Location]);		
		//map.zoomToMaxExtent()		
	
		Ext.apply(this, {
			map:map,
			dockedItems: [
				{ xtype: 'toolbar',
				  dock: 'top',				  
				  items: this.buildItems(),
				  enableOverflow: true
				}
			],
			center: new OpenLayers.LonLat(13610082.099764,1403622.1394924),
			zoom:6				
		});		
		
		this.callParent();   
    }	
	
	
});


