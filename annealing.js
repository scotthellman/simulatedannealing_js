annealing = function(){
	function getNeighbors(x,y,board){
		neighbors = [];
		if( x > 0) neighbors.push([x-1,y]);
		if( y > 0) neighbors.push([x,y-1]);
		if( x < board.length - 1) neighbors.push([x+1,y]);
		if( y < board.length - 1) neighbors.push([x,y+1]);
		return neighbors;
	}

	function getLocalEnergy(x,y,board){
		neighbors = getNeighbors(x,y,board);
		var local_energy = 0
		for(i = 0; i < neighbors.length; i++){
			local_energy += Math.abs(board[x][y] - board[neighbors[i][0]][neighbors[i][1]]);
		}
		return local_energy / neighbors.length;
	}

	function calculateEnergy(board){
		var energy = 0;
		for(var i = 0; i < board.length; i++){
			for(var j = 0; j < board[i].length; j++){
				energy += getLocalEnergy(i,j,board);
			}
		}
		return energy;
	}

	function generateRandomMove(board){
		var x = Math.floor(Math.random()*board.length);
		var y = Math.floor(Math.random()*board[0].length);
		var neighbors = getNeighbors(x,y,board);
		neighbor = neighbors[Math.floor(Math.random()*neighbors.length)];
		return {
			current : [x,y],
			swap : neighbor
		};
	}

	function performMove(move,board){
		var temp = board[move.current[0]][move.current[1]];
		board[move.current[0]][move.current[1]] = board[move.swap[0]][move.swap[1]];
		board[move.swap[0]][move.swap[1]] = temp;
		return board;
	}

	function probabilityFunction(e,t,temperature){
		if(t < e) return 1;
		return Math.exp((e - t)/temperature);
	}

	function acceptMove(move,board,temperature){
		var current_energy = calculateEnergy(board);
		board = performMove(move,board);
		var transition_energy = calculateEnergy(board);
		board = performMove(move,board);

		var probability = probabilityFunction(current_energy,transition_energy,temperature);
		return probability > Math.random();
	}

	function createBoard(x,y){
		board = []
		for(var i = 0; i < x; i++){
			board[i] = [];
			for(var j = 0; j < y; j++){
				board[i][j] = Math.random();
			}
		}
		return board;
	}

	function annealStep(board,temperature){
		move = generateRandomMove(board);
		if(acceptMove(move,board,temperature)){
			board = performMove(move,board);
		}
	}

	function annealing(board,t_i,d_t){
		var temperature = t_i;
		while(temperature > 0){
			temperature -= d_t;
			annealStep(board,temperature);
		}
		return board;
	}

	function drawBoard(board){
		for(var i = 0; i < board.length; i++){
			for(var j = 0; j < board[i].length; j++){
				HSVGrid.alterGrid(0,0,board[i][j],i,j);
			}
		}
		HSVGrid.drawGridToCanvas();
	}

	return{
		createBoard : createBoard,
		annealStep : annealStep,
		annealing : annealing,
		drawBoard : drawBoard
	}

}();

function annealingSteps(board,temperature,d_t,steps){
	for(var i = 0; i < steps; i++){
		temperature -= d_t;
		if(temperature <= 0) break;
		annealing.annealStep(board,temperature);
	}
	return temperature;
}

function init(){
	canvas = document.getElementById("game_canvas");
	canvas.height = canvas.clientHeight;
	canvas.width = canvas.clientWidth;
	HSVGrid.initGrid(canvas,20);
	board = annealing.createBoard(20,20);
	annealing.drawBoard(board);
	var temperature = 1;
	timed = function(){
		temperature = annealingSteps(board,temperature,0.000001,500);
		annealing.drawBoard(board);
		if(temperature > 0){
			setTimeout(timed,10);
		}
		$("#temperature").text("Temperature: " + temperature);
	};
	setTimeout(timed,10);
}
