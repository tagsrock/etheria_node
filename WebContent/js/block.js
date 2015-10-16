var offset = 0;

var occupado; // occupado[coordx][coordy] contains the set of occupied x,y,z spaces in this tile

occupado = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	occupado[i] = new Array(mapsize);
	for(j = 0; j < mapsize; j++)
		occupado[i][j] = [];  // each x,y is also an array of [x,y,z] values, so occupado[0][1] might contain [[2,3,4],[5,6,7]...]
}

//initialize occupado with the floor (all the z=-1 for the tile) 

for (row = 0; row < mapsize; row++) {
	for(col = 0; col < mapsize; col++) {
		for(var y = -66; y <= 66; y++)
		{
			if(y % 2 !== 0 ) // odd
				x = -50;
			else
				x = -49;
			
			if(y >= -33 && y <= 33)
			{
				for(x; x <= 49; x++)
				{
					occupado[col][row].push([x,y,-1]);
				}
			}	
			else
			{	
				for(x; x <= 49; x++)
				{
					if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
					{
						if(y % 2 !== 0 ) // odd
						{
							if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}	
						else	// even
						{
							if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}
					}
					else
					{	
						if(y % 2 === 0 ) // even
						{
							if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}	
						else	// odd
						{
							if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}
					}
				}
			}
		}	
	}
}


var blocks = [{
	'which':0,
	'description': 'column',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7]],
	'attachesto':  [[0,0,-1],[0,0,8]]
},
{
	'which':1,
	'description': 'SW-NE diagonal beam',
	'occupies': [[0,0,0],[0,1,0],[1,2,0],[1,3,0],[2,4,0],[2,5,0],[3,6,0],[3,7,0]],
	'attachesto':  [[0,0,-1],[0,1,-1],[1,2,-1],[1,3,-1],[2,4,-1],[2,5,-1],[3,6,-1],[3,7,-1],
	                  [0,0,1],[0,1,1],[1,2,1],[1,3,1],[2,4,1],[2,5,1],[3,6,1],[3,7,1]]
},
{
	'which':2,
	'description': 'W-E horizontal beam',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],[6,0,0],[7,0,0]],
	'attachesto':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],[4,0,-1],[5,0,-1],[6,0,-1],[7,0,-1],
	                  [0,0,1],[1,0,1],[2,0,1],[3,0,1],[4,0,1],[5,0,1],[6,0,1],[7,0,1]],
},
{
	'which':3,
	'description': 'SE-NW diagonal beam',
	'occupies': [[0,0,0],[-1,1,0],[-1,2,0],[-2,3,0],[-2,4,0],[-3,5,0],[-3,6,0],[-4,7,0]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[-1,2,-1],[-2,3,-1],[-2,4,-1],[-3,5,-1],[-3,6,-1],[-4,7,-1],
	                  [0,0,1],[-1,1,1],[-1,2,1],[-2,3,1],[-2,4,1],[-3,5,1],[-3,6,1],[-4,7,1]]
},
{
	'which':4,
	'description': 'SW-NE diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[3,2,0],[4,2,0],[4,3,0],[5,3,0]],
	'attachesto':  [[0,0,-1],[1,0,-1],[1,1,-1],[2,1,-1],[3,2,-1],[4,2,-1],[4,3,-1],[5,3,-1],
	                  [0,0,1],[1,0,1],[1,1,1],[2,1,1],[3,2,1],[4,2,1],[4,3,1],[5,3,1]]
},
{
	'which':5,
	'description': 'SE-NW diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-2,1,0],[-3,1,0],[-3,2,0],[-4,2,0],[-5,3,0],[-6,3,0]],
	'attachesto':  [[0,0,-1],[-1,0,-1],[-2,1,-1],[-3,1,-1],[-3,2,-1],[-4,2,-1],[-5,3,-1],[-6,3,-1],
	                  [0,0,1],[-1,0,1],[-2,1,1],[-3,1,1],[-3,2,1],[-4,2,1],[-5,3,1],[-6,3,1]]
},
{
	'which':6,
	'description': 'W-E quadruple-decker',
	'occupies': [[0,0,0],[1,0,0],[0,0,1],[1,0,1],[0,0,2],[1,0,2],[0,0,3],[1,0,3]],
	'attachesto':  [[0,0,-1],[1,0,-1],
	                  [0,0,4],[1,0,4]]
},
{
	'which':7,
	'description': 'SW-NE quadruple-decker',
	'occupies': [[0,0,0],[0,1,0],[0,0,1],[0,1,1],[0,0,2],[0,1,2],[0,0,3],[0,1,3]],
	'attachesto':  [[0,0,-1],[0,1,-1],
	                  [0,0,4],[0,1,4]]
},
{
	'which':8,
	'description': 'SE-NW quadruple-decker',
	'occupies': [[0,0,0],[-1,1,0],[0,0,1],[-1,1,1],[0,0,2],[-1,1,2],[0,0,3],[-1,1,3]],
	'attachesto':  [[0,0,-1],[-1,1,-1],
	                  [0,0,4],[-1,1,4]]
},
{
	'which':9,
	'description': 'SW-NE double-decker',
	'occupies': [[0,0,0],[0,1,0],[1,2,0],[1,3,0],[0,0,1],[0,1,1],[1,2,1],[1,3,1]],
	'attachesto':  [[0,0,-1],[0,1,-1],[1,2,-1],[1,3,-1],
	                  [0,0,2],[0,1,2],[1,2,2],[1,3,2]]
},
{
	'which':10,
	'description': 'W-E double-decker',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[0,0,1],[1,0,1],[2,0,1],[3,0,1]],
	'attachesto':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],
	                  [0,0,2],[1,0,2],[2,0,2],[3,0,2]]
},
{
	'which':11,
	'description': 'SE-NW double-decker',
	'occupies': [[0,0,0],[-1,1,0],[-1,2,0],[-2,3,0],[0,0,1],[-1,1,1],[-1,2,1],[-2,3,1]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[-1,2,-1],[-2,3,-1],
	                  [0,0,2],[-1,1,2],[-1,2,2],[-2,3,2]]
},
{
	'which':12,
	'description': 'SW-NE double-decker diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[0,0,1],[1,0,1],[1,1,1],[2,1,1]],
	'attachesto':  [[0,0,-1],[1,0,-1],[1,1,-1],[2,1,-1],
	                  [0,0,2],[1,0,2],[1,1,2],[2,1,2]]
},
{
	'which':13,
	'description': 'SE-NW double-decker diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-2,1,0],[-3,1,0],[0,0,1],[-1,0,1],[-2,1,1],[-3,1,1]],
	'attachesto':  [[0,0,-1],[-1,0,-1],[-2,1,-1],[-3,1,-1],
	                  [0,0,2],[-1,0,2],[-2,1,2],[-3,1,2]]
},
{
	'which':14,
	'description': 'S-N snake',
	'occupies': [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0]],
	'attachesto':  [[0,0,-1],[0,1,-1],[0,2,-1],[0,3,-1],[0,4,-1],[0,5,-1],[0,6,-1],[0,7,-1],
	                  [0,0,1],[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1],[0,7,1]]
},
{
	'which':15,
	'description': 'S-N snake flipped',
	'occupies': [[0,0,0],[-1,1,0],[0,2,0],[-1,3,0],[0,4,0],[-1,5,0],[0,6,0],[-1,7,0]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[0,2,-1],[-1,3,-1],[0,4,-1],[-1,5,-1],[0,6,-1],[-1,7,-1],
	                  [0,0,1],[-1,1,1],[0,2,1],[-1,3,1],[0,4,1],[-1,5,1],[0,6,1],[-1,7,1]]
},
{
	'which':16,
	'description': 'S-N double-decker snake',
	'occupies': [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,0,1],[0,1,1],[0,2,1],[0,3,1]],
	'attachesto':  [[0,0,-1],[0,1,-1],[0,2,-1],[0,3,-1],
	                  [0,0,2],[0,1,2],[0,2,2],[0,3,2]]
},
{
	'which':17,
	'description': 'S-N double-decker snake flipped',
	'occupies': [[0,0,0],[-1,1,0],[0,2,0],[-1,3,0],[0,0,1],[-1,1,1],[0,2,1],[-1,3,1]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[0,2,-1],[-1,3,-1],
	                  [0,0,2],[-1,1,2],[0,2,2],[-1,3,1]]
},
{
	'which':18,
	'description': 'SW-NE stairstep',
	'occupies': [[0,0,0],[0,1,0],[0,1,1],[1,2,1],[1,2,2],[1,3,2],[1,3,3],[2,4,3]],
	'attachesto': [[0,0,-1],[0,1,-1],[1,2,0],[1,3,1],[2,4,2],
	                 [0,0,1] ,[0,1,2],[1,2,3],[1,3,4],[2,4,4]]
},
{
	'which':19,
	'description': 'W-E stairstep',
	'occupies': [[0,0,0],[1,0,0],[1,0,1],[2,0,1],[2,0,2],[3,0,2],[3,0,3],[4,0,3]],
	'attachesto': [[0,0,-1],[1,0,-1],[2,0,0],[3,0,1],[4,0,2],
	                 [0,0,1] ,[1,0,2],[2,0,3],[3,0,4],[4,0,4]]
},
{
	'which':20,
	'description': 'NW-SE stairstep',
	'occupies': [[0,0,0],[0,-1,0],[0,-1,1],[1,-2,1],[1,-2,2],[1,-3,2],[1,-3,3],[2,-4,3]],
	'attachesto': [[0,0,-1],[0,-1,-1],[1,-2,0],[1,-3,1],[2,-4,2],
	                 [0,0,1] ,[0,-1,2],[1,-2,3],[1,-3,4],[2,-4,4]]
},
{
	'which':21,
	'description': 'NE-SW stairstep',
	'occupies': [[0,0,0],[-1,-1,0],[-1,-1,1],[-1,-2,1],[-1,-2,2],[-2,-3,2],[-2,-3,3],[-2,-4,3]],
	'attachesto': [[0,0,-1],[-1,-1,-1],[-1,-2,0],[-2,-3,1],[-2,-4,2],
	                 [0,0,1] ,[-1,-1,2],[-1,-2,3],[-2,-3,4],[-2,-4,4]]
},
{
	'which':22,
	'description': 'E-W stairstep',
	'occupies': [[0,0,0],[-1,0,0],[-1,0,1],[-2,0,1],[-2,0,2],[-3,0,2],[-3,0,3],[-4,0,3]],
	'attachesto': [[0,0,-1],[-1,0,-1],[-2,0,0],[-3,0,1],[-4,0,2],
	                 [0,0,1] ,[-1,0,2],[-2,0,3],[-3,0,4],[-4,0,4]]
},
{
	'which':23,
	'description': 'SE-NW stairstep',
	'occupies': [[0,0,0],[-1,1,0],[-1,1,1],[-1,2,1],[-1,2,2],[-2,3,2],[-2,3,3],[-2,4,3]],
	'attachesto': [[0,0,-1],[-1,1,-1],[-1,2,0],[-2,3,1],[-2,4,2],
	                 [0,0,1] ,[-1,1,2],[-1,2,3],[-2,3,4],[-2,4,4]]
},
{
	'which':24,
	'description': 'SW-NE arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,1,2],[1,2,2],[1,3,2],[1,3,1],[1,3,0]],
	'attachesto': [[0,0,-1],[0,1,1],[1,2,1],[1,3,-1],
	                 [0,0,3] ,[0,1,3],[1,2,3],[1,3,3]]
},
{
	'which':25,
	'description': 'W-E arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[1,0,2],[2,0,2],[3,0,2],[3,0,1],[3,0,0]],
	'attachesto': [[0,0,-1],[1,0,1],[2,0,1],[3,0,-1],
	                 [0,0,3] ,[1,0,3],[2,0,3],[3,0,3]]
},
{
	'which':26,
	'description': 'NW-SE arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,-1,2],[1,-2,2],[1,-3,2],[1,-3,1],[1,-3,0]],
	'attachesto': [[0,0,-1],[0,-1,1],[1,-2,1],[1,-3,-1],
	                 [0,0,3] ,[0,-1,3],[1,-2,3],[1,-3,3]]
},
{
	'which':27,
	'description': 'SW-NE curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[1,0,2],[1,1,2],[1,2,2],[1,2,1],[1,2,0]],
	'attachesto': [[0,0,-1],[1,0,1],[1,1,1],[1,2,-1],
	                 [0,0,3] ,[1,0,3],[1,1,3],[1,2,3]]
},
{
	'which':28,
	'description': 'NW-SE curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[-1,-1,2],[0,-2,2],[1,-2,2],[1,-2,1],[1,-2,0]],
	'attachesto': [[0,0,-1],[-1,-1,1],[0,-2,1],[1,-2,-1],
	                 [0,0,3] ,[-1,-1,3],[0,-2,3],[1,-2,3]]
},
{
	'which':29,
	'description': 'NE-SW curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[-1,0,2],[-2,-1,2],[-1,-2,2],[-1,-2,1],[-1,-2,0]],
	'attachesto': [[0,0,-1],[-1,0,1],[-2,-1,1],[-1,-2,-1],
	                 [0,0,3] ,[-1,0,3],[-2,-1,3],[-1,-2,3]]
},
{
	'which':30,
	'description': 'NE-SW curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,1,2],[0,2,2],[-1,2,2],[-1,2,1],[-1,2,0]],
	'attachesto': [[0,0,-1],[0,1,1],[0,2,1],[-1,2,-1],
	                 [0,0,3] ,[0,1,3],[0,2,3],[-1,2,3]]
},
{
	'which':31,
	'description': 'stand',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[-1,1,0],[-1,-1,0],[1,0,0]],
	'attachesto': [[0,0,-1],[-1,1,-1],[-1,-1,-1],[1,0,-1],
	                 [0,0,5],[-1,1,1],[-1,-1,1],[1,0,1]]
}
]

//var str1 = "";
//var str2 = "";
//var tempattachesto = [];
//for(var trick = 0; trick < blocks.length; trick++)
//{
//	str1 = str1 + "blockdefstorage.initBlockDefOccupies.sendTransaction(";
//	str2 = str2 + "blockdefstorage.initBlockDefAttachesto.sendTransaction(";
//	str1 = str1 + (blocks[trick].which*1) + ", ";
//	str2 = str2 + (blocks[trick].which*1) + ", ";
//	str1 = str1 + JSON.stringify(blocks[trick].occupies);
//	str2 = str2 + JSON.stringify(blocks[trick].attachesto);
//	str1 = str1 + ",{from:eth.coinbase, gas:3000000});\n";
//	str2 = str2 + ",{from:eth.coinbase, gas:3000000});\n";
//}	
//console.log(str1 + "\n" + str2);

function blockHexCoordsValid(x, y)
{
	if(-33 <= y && y <= 33)
	{
		if(y % 2 !== 0 ) // odd
		{
			if(-50 <= x && x <= 49)
				return true;
			else
			{
				//console.log('returning false! ' + x + ',' + y);
				return false;
			}	
		}
		else // even
		{
			if(-49 <= x && x <= 49)
				return true;
			else
			{
				//console.log('returning false! ' + x + ',' + y);
				return false;
			}	
		}	
	}	
	else
	{	
		var absx;
		var absy;
		if(x < 0)
			absx = (x*-1);
		else
			absx = (x);
		if(y < 0)
			absy = (y*-1);
		else
			absy = (y);
		if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
		{
			if(y % 2 != 0 ) // odd
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}	
			else	// even
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
				{
					return true;
				}
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}
		}
		else
		{	
			if(y % 2 == 0 ) // even
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}	
			else	// odd
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}
		}
	}
	//console.log('END returning false! ' + x + ',' + y);
	return false;
}

function wouldFallOutside(coordx, coordy, which, x, y , z)
{
	//console.log('Checking wouldOverlap for which=' + which + " " + x + "," + y + "," + z)
	// make an array of [x,y,z] objects this block would occupy and then check occupado to see if any of them are already occupied.
	var occupiesx = 0;
	var occupiesy = 0;
	
	for(var b = 0; b < blocks[which].occupies.length; b++)
	{
		occupiesx = blocks[which].occupies[b][0];
		occupiesy = blocks[which].occupies[b][1];
		if(y % 2 !== 0 && occupiesy%2 !== 0) // if y is odd, offset the x by 1
		{
			occupiesx = occupiesx + 1;
		}
		if(!blockHexCoordsValid(occupiesx+x, occupiesy+y))
			return true;
	}
	return false;
}

function wouldOverlap(coordx, coordy, which, x, y , z)
{
	//console.log('Checking wouldOverlap for which=' + which + " " + x + "," + y + "," + z)
	// make an array of [x,y,z] objects this block would occupy and then check occupado to see if any of them are already occupied.
	
	var occupiesx = 0;
	var occupiesy = 0;
	var occupiesz = 0;
	
	var wouldoccupy = [];
	for(var b = 0; b < blocks[which].occupies.length; b++)
	{
		occupiesx = blocks[which].occupies[b][0];
		occupiesy = blocks[which].occupies[b][1];
		occupiesz = blocks[which].occupies[b][2];
		if(y % 2 !== 0 && occupiesy%2 !== 0) // if y is odd, offset the x by 1
			occupiesx = occupiesx + 1;
		wouldoccupy.push([occupiesx+x, occupiesy+y, occupiesz+z]);
	}
	
	for(var w = 0; w < wouldoccupy.length; w++)
	{
		//console.log('w=' + w + " " + wouldoccupy[w][0] + "," + wouldoccupy[w][1] + "," + wouldoccupy[w][2]);
		for(var o = 0; o < occupado[coordx][coordy].length; o++)
		{
			//console.log('o=' + o);
			if(wouldoccupy[w][0] === occupado[coordx][coordy][o][0] && wouldoccupy[w][1] === occupado[coordx][coordy][o][1] && wouldoccupy[w][2] === occupado[coordx][coordy][o][2]) // are the arrays equal?
			{
				console.log('[' + wouldoccupy[w][0] + "," + wouldoccupy[w][1] + "," + wouldoccupy[w][2] + "] is contained in occupado[" + coordx + "][" + coordy + "]");
				console.log(occupado[coordx][coordy][o]);
				console.log('would occupy');
				return true;
			}
		}
	}
	return false;
}

function touchesAnother(coordx, coordy, which, x, y , z)
{
	//console.log('touches another?');
	var sx = 0;
	var sy = 0;
	var sz = 0;
	
	var surroundings = [];
	for(var b = 0; b < blocks[which].attachesto.length; b++)
	{
		sx = blocks[which].attachesto[b][0];
		sy = blocks[which].attachesto[b][1];
		sz = blocks[which].attachesto[b][2];
		
		if(y % 2 !== 0 && sy%2 !== 0) // if y is odd, offset the x by 1
		{
			sx = sx + 1;
		}
		surroundings.push([sx+x, sy+y, sz+z]);
	}
	//console.log(surroundings.length);
	
	var occupadolength = occupado[coordx][coordy].length;
	for(var s = 0; s < surroundings.length; s++)
	{
		//console.log('checking to see if surrounding block [' + surroundings[s][0] + "," + surroundings[s][1] + "," + surroundings[s][2] + "] is contained in occupado[" + coordx + "][" + coordy + "]");
		for(var o = 0; o < occupadolength; o++)
		{
		//	if( surroundings.every( function(n, i) { n === occupado[coordx][coordy][o]; } )) 	// are the two arrays equal?	
			if(surroundings[s][0] === occupado[coordx][coordy][o][0] && surroundings[s][1] === occupado[coordx][coordy][o][1] && surroundings[s][2] === occupado[coordx][coordy][o][2]) // are the arrays equal?
			{
				//console.log('touches another? TRUE');
				return true;
			}
		}	
	}	
	//console.log('touches another? FALSE');
	return false;
}


function isValidLocation(coordx,coordy,which,x,y,z)
{
	//console.log("isValidLocation which=" + which + " " + x + ", "+ y + ", "+ z);
	if(!wouldFallOutside(coordx,coordy,which,x,y,z))
	{
		//console.log("falls inside");
		if(!wouldOverlap(coordx,coordy,which,x,y,z))
		{
			//console.log("doesn't overlap");
			if(touchesAnother(coordx,coordy,which,x,y,z))
			{
				//console.log("touches another");
				return true;
			}	
		}	
	}	
	return false;
}

function drawBlock(coordx, coordy, which, x, y, z, color)
{
	// This seems more complicated than it should be, but I don't think it is. 
	// The issue is that a block of a certain configuration,
	// is actually a different configuration depending on whether its rows are odd or even
	// e.g. a straight line to the NE, starting at 0,0 the other 3 blocks are 0,1, 1,2 and 1,3 (x,y+1, x+1,y+2 and x+1,y+3)
	// but starting at 0,1 the other 3 blocks are 1,2, 1,3 and 1, 3 (x+1,y+1, x+1,y+2 and x+2,y+3)
	// See? Kinda weird.
	//console.log("drawblock(" + coordx + ", "+ coordy + ", " + which + "," + x + ", "+ y + ", "+ z + ", " + color);
	var occupiesx = 0;
	var occupiesy = 0;
	var occupiesz = 0;
	
	if(isValidLocation(coordx, coordy, which, x, y, z)) // have not sent offset to these functions. Must take care of inside them.
	{
		for(var b = 0; b < blocks[which].occupies.length; b++)
		{
			occupiesx = blocks[which].occupies[b][0];
			occupiesy = blocks[which].occupies[b][1];
			occupiesz = blocks[which].occupies[b][2];
			if(y % 2 !== 0 && occupiesy%2 !== 0) // if y is odd, offset the x by 1
			{
				occupiesx = occupiesx + 1;
			}
			//console.log('drawing ' + (occupiesx+x) + " " + (occupiesy+y) + " " + occupiesz+z);
			drawBlockHex(coordx, coordy, occupiesx+x, occupiesy+y, occupiesz+z, color,1);
			occupado[coordx][coordy].push([occupiesx+x, occupiesy+y, occupiesz+z]);
		}
		return true;
	}
	else
		return false;
}

var	texture1 = THREE.ImageUtils.loadTexture( "images/concrete.jpg" );

function drawBlockHex(coordx, coordy, x, y, z, color, extrusion_multiple)
{
	if(extrusion_multiple === null || extrusion_multiple === 0)
		extrusion_multiple = 1;
	
	//console.log("drawBlockHex " + coordx + "," + coordy);
	var xpoint = (coordx - (mapsize-1)/2) * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (coordy - (mapsize-1)/2) * tilevert;
	
	xpoint = xpoint + x * blockwidth;
	if(y%2 !== 0)
		xpoint = xpoint + blockwidth/2;
	ypoint = ypoint + y * blockvert;
	
	var extrudeSettings = {
			amount			: blockextrude * extrusion_multiple,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
		};
	
	var	material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set( 1.3,1.3 );
	var hexShape = new THREE.Shape();
	var centerPoint = new Point(xpoint, ypoint);
	var points = [];
	points.push(hex_corner(centerPoint, blocksize, 0));
	points.push(hex_corner(centerPoint, blocksize, 1));
	points.push(hex_corner(centerPoint, blocksize, 2));
	points.push(hex_corner(centerPoint, blocksize, 3));
	points.push(hex_corner(centerPoint, blocksize, 4));
	points.push(hex_corner(centerPoint, blocksize, 5));
	
	for(var p = 0; p < points.length; p++)
	{
		if(p === 0)
			hexShape.moveTo( points[p].x , points[p].y );
		else
			hexShape.lineTo( points[p].x, points[p].y );
	}
	hexShape.moveTo( points[0].x , points[0].y );
	
	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );

	var mesh = new THREE.Mesh( hexGeom, material );
	var tileextrusion;
	if(map[coordx][coordy].elevation < SEA_LEVEL)
	{
		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		tileextrusion = map[coordx][coordy].elevation * EXTRUSION_FACTOR;
	}	
	//console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
	mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	scene.add( mesh );
}
