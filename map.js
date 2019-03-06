/*
This file is part of PG Road Net

Copyright (c) 2013 National Mapping and Resource Information Authority

PG Road Net is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PG Road Net is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PG Road Net.  If not, see <http://www.gnu.org/licenses/>.
*/
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


Ext.Loader.setConfig({
	disableCaching: false,
	enabled: true,
	paths: {
	    GeoExt:'./lib/GeoExt'
	} 
});


Ext.application({
    name: 'OL3EXT4',
	requires: ['routing', 'mappanel', 'MeasureTool'],
    launch: function () {
		
       var mappanel= Ext.create('mappanel');
	   
		
		vHeight=Ext.getBody().getViewSize().height	
		console.log(Ext.getBody())
		
		Ext.create('Ext.container.Viewport', {
		    layout: 'border',
		    items: [
				/* {
		        	region: 'north',
		        	html: '<h1 class="x-panel-header">Routing</h1>',
		        	border: false,
		        	margins: '0 0 5 0',
		    	}, */
				mappanel,
				
				
				{
					xtype: 'routing',
		        	region: 'east',
		        	title: 'Routing',
		        	width: 500,					
					split: true,
					mapContainer: mappanel,	
					vHeight:vHeight,					
					hidden: false
				},	
				
				
			]
		});
		
    }
});

