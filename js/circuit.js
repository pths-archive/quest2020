var rotateAngles = [ 90, 270, 180, 90, 180, 90, 270, 180, 180, 0, 180, 90, 90, 180, 270, 90 ];
var types = [ 3, 2, 3, 3, 1, 2, 1, 1, 3, 4, 1, 1, 2, 3, 1, 3 ];

function isLeftConnectionPossible(t, r) {
	return (
			(t == 1 && (r == 0 || r == 90)) ||
			(t == 2 && (r == 0 || r == 180)) ||
			(t == 3 && (r != 90)) ||
			(t == 4));
}

function isBottomConnectionPossible(t, r) { return isLeftConnectionPossible(t, (r + 90) % 360); }

function isRightConnectionPossible(t, r) { return isBottomConnectionPossible(t, (r + 90) % 360); }

function isTopConnectionPossible(t, r) { return isRightConnectionPossible(t, (r + 90) % 360); }

function isLeftConnectionPossibleById(i) { return isLeftConnectionPossible(types[i], rotateAngles[i]); }

function isBottomConnectionPossibleById(i) { return isBottomConnectionPossible(types[i], rotateAngles[i]); }

function isRightConnectionPossibleById(i) { return isRightConnectionPossible(types[i], rotateAngles[i]); }

function isTopConnectionPossibleById(i) { return isTopConnectionPossible(types[i], rotateAngles[i]); }

function isConnected(id1, id2) {
	if (id1 - id2 == 1) {
		return isLeftConnectionPossible(types[id1], rotateAngles[id1]) && isRightConnectionPossible(types[id2], rotateAngles[id2]);
	} else if (id1 - id2 == -1) {
		return isRightConnectionPossible(types[id1], rotateAngles[id1]) && isLeftConnectionPossible(types[id2], rotateAngles[id2]);
	} else if (id1 - id2 == 4) {
		return isTopConnectionPossible(types[id1], rotateAngles[id1]) && isBottomConnectionPossible(types[id2], rotateAngles[id2]);
	} else if (id1 - id2 == -4) {
		return isBottomConnectionPossible(types[id1], rotateAngles[id1]) && isTopConnectionPossible(types[id2], rotateAngles[id2]);
	} else { false;	}
}

function isGameOver() {
	var used = [ [ false, false, false, false ], [ false, false, false, false ], [ false, false, false, false ], [ false, false, false, false ] ];
	if (isLeftConnectionPossibleById(0)) {
		used[0][0] = true;
		for (var a = 0; a < 16; a++) {
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					if (used[row][col]) {
						if (col > 0 && isLeftConnectionPossibleById(col + row * 4)) { used[row][col - 1] = used[row][col - 1] || isRightConnectionPossibleById(col - 1 + row * 4); }
						if (col < 3 && isRightConnectionPossibleById(col + row * 4)) { used[row][col + 1] = used[row][col + 1] || isLeftConnectionPossibleById(col + 1 + row * 4); }
						if (row > 0 && isTopConnectionPossibleById(col + row * 4)) { used[row - 1][col] = used[row - 1][col] || isBottomConnectionPossibleById(col + (row - 1) * 4); }
						if (row < 3 && isBottomConnectionPossibleById(col + row * 4)) { used[row + 1][col] = used[row + 1][col] || isTopConnectionPossibleById(col + (row + 1) * 4); } 
					}
				}
			}
		}
		return used[3][3] && isRightConnectionPossibleById(types.length - 1);
	} else { return false; }
}

function imageOnClick(e) {
	var id = e.target.id;
	rotateAngles[id] = (rotateAngles[id] + 90) % 360;
	rotateElement(e.target.id);
	if (isGameOver()) { document.getElementById('secret-key').style.visibility = 'visible'; }
	else { document.getElementById('secret-key').style.visibility = 'hidden'; }
}

function rotateElement(id) {
	document.getElementById(id).style.transform = 'rotate(' + rotateAngles[id] + 'deg)';
}

for (var i = 0; i < types.length; i++) {
	var elem = document.getElementById(i);
	var curType = types[i];

	elem.src = curType == 1 ? "../icons/circuit_g_part.png" : (curType == 2 ? "../icons/circuit_s_part.png" : (curType == 3 ? "../icons/circuit_t_part.png" : "../icons/circuit_x_part.png")) 
	elem.onclick = imageOnClick;
	rotateElement(i);
}