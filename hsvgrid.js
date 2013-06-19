
HSVGrid = function(){
	var true_canvas;
	var grid;
	var width;
	var height; 
	var spacing;
	var dirty = [];

	function initGrid(canvas,square_count) {
		true_canvas = canvas;
		spacing = canvas.clientWidth/square_count
	    width = canvas.clientWidth/square_count;
	    height = canvas.clientHeight/square_count;
	    grid = new Array();
	    for(var i = 0; i < square_count; i++){
	  	    grid[i] = new Array();
		    for(var j = 0; j < square_count; j++){
		  	    grid[i][j] = [0,0,0];
		  	    dirty.push([i,j]);
		    }
	    }
	}

	function alterGrid(hue,sat,val,x,y){
		if(grid[x][y][0] == hue && grid[x][y][1] == sat && grid[x][y][2] == val){
			return;
		}
		dirty.push([x,y]);
		grid[x][y] = [hue,sat,val];
	}

	function getGridValue(x,y){
		return grid[x][y];
	}

	function drawGridToCanvas() {
	    var ctx = true_canvas.getContext("2d");
	    // ctx.fillStyle = "#000";
	    // ctx.fillRect(0,0,canvas.width,canvas.height);
		for(var i = 0; i < dirty.length; i++){
			var x = dirty[i][0];
			var y = dirty[i][1]
			var color_info = grid[x][y];
			ctx.fillStyle = getRGBfromHSV(color_info[0],color_info[1],color_info[2]);
			ctx.fillRect(x*spacing,y*spacing,spacing,spacing);
		}
		dirty = [];
	}

	function getRGBfromHSV(hue,sat,val){
		var C = val * sat;
		var prime = hue / 60.0;
		var X = C * (1 - Math.abs((prime % 2) - 1));
		
		var r1 = g1 = b1 = 0;
		
		if(prime < 1){
			r1 = C;
			g1 = X;
		}
		else if(prime < 2){
			r1 = X;
			g1 = C;
		}
		else if(prime < 3){
			g1 = C;
			b1 = X;
		}
		else if(prime < 4){
			g1 = X;
			b1 = C;
		}
		else if(prime < 5){
			r1 = X;
			b1 = C;
		}
		else{
			r1 = C;
			b1 = X;
		}
		
		var sat_correction = val - C;
		
		var r = Math.round((r1 + sat_correction) * 255);
		var g = Math.round((g1 + sat_correction) * 255);
		var b = Math.round((b1 + sat_correction) * 255);

		//make things play nicely with weird hsv values
		(r < 0) ? r = 0 : (r > 255) ? r = 255 : r = r;
		(b < 0) ? b = 0 : (b > 255) ? b = 255 : b = b;
		(g < 0) ? g = 0 : (g > 255) ? g = 255 : g = g;
		
		var result =  "#" + toColorString(r) + toColorString(g) + toColorString(b);
		return result;
	}

	function toColorString(value){
		var hex = value.toString(16);
		while(hex.length < 2) hex = "0" + hex;
		return hex;
	}

	return {
		initGrid : initGrid,
		alterGrid : alterGrid,
		getGridValue : getGridValue,
		drawGridToCanvas : drawGridToCanvas
	}
}();