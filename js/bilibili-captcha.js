(function(window) {
	var WIDTH = 120;
	var HEIGHT = 40;

	var CHAR_1 = "81c000008fc00000ffffffffffffffffffffffffffffffffffffffff";
	var CHAR_2 = "bfe0000fffe0003fffe000ffffe001ffffe007fff8001ffff8003feff800ff8ff801ff0ff807fc0ff81ff00fffffe00fffff800fffff000ffffc000fbff8000f";
	var CHAR_3 = "bfe003feffe003ffffe003ffffe003ffffe003fff800000ff803800ff803800ff807c00ff80fe00ff81ff00ffffffffffffefffffffc7ffffffc7fffbff83ffe";
	var CHAR_4 = "800007c080003fc08001ffc0800fffc0807fffc081ffffc08ffff3c0ffff83c0fffc03c0ffe003c0ff07fffff807ffffc007ffff8007ffff8007ffff800003c0800003c0";
	var CHAR_5 = "ffff03feffff03ffffff03ffffff03ffffff03fff80f000ff80f000ff80f000ff80f000ff80f000ff80f000ff80ffffff80ffffff80ffffff80ffffff807fffe";
	var CHAR_6 = "bffffffefffffffffffffffffffffffffffffffff803c00ff803c00ff803c00ff803c00ff803c00ff803c00fffc3ffffffc3ffffffc3ffffffc3ffffbfc1fffe";
	var CHAR_7 = "ff800000ff800000ff800000ff800000ff800007f800007ff80003fff8003ffff803fffff83ffffefbffffe0fffffe00ffffe000fffe0000ffe00000fe000000";
	var CHAR_8 = "bff83ffefffc7ffffffefffffffffffffffffffff80fe00ff807e00ff807c00ff807c00ff807e00ff80fe00ffffffffffffffffffffefffffffc7fffbff83ffe";
	var CHAR_8_1 = "bff83ffefffc7ffffffefffffffffffffffffffff80fe00ff807c00ff807c00ff807c00ff807c00ff80fe00ffffffffffffffffffffefffffffc7fffbff83ffe";
	var CHAR_9 = "bfffc1feffffe1ffffffe1ffffffe1ffffffe1fff801e00ff801e00ff801e00ff801e00ff801e00ff801e00fffffffffffffffffffffffffffffffffbffffffe";
	var CHAR_0 = "bffffffefffffffffffffffffffffffffffffffff800000ff800000ff800000ff800000ff800000ff800000fffffffffffffffffffffffffffffffffbffffffe";
	var CHAR_PLUS = "800078008000780080007800800078008000780080007800801fffe0801fffe0801fffe0801fffe0801fffe0800078008000780080007800800078008000780080007800";
	var CHAR_MINUS = "80003c0080003c0080003c0080003c0080003c0080003c0080003c0080003c0080003c00";

	var BilibiliCaptcha = function(img) {
		var captcha = img;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var analysis = function() {
			// var width = captcha.width;
			// var height = captcha.height;
			var width = WIDTH;
			var height = HEIGHT;
			ctx.drawImage(captcha, 0, 0);
			var imageData = ctx.getImageData(0, 0, width, height);
			var imageText = "";
			var matrix = [];
			for (var i = 0; i < height; i++) {
				var row = [];
				for (var j = 0; j < width; j++) {
					var x = i * 4 * width + 4 * j, r = imageData.data[x], g = imageData.data[x + 1], b = imageData.data[x + 2];
					imageData.data[x] = 255 - r;
					imageData.data[x + 1] = 255 - g;
					imageData.data[x + 2] = 255 - b;
					imageText += (r + g + b > 200 * 3) ? "□" : "■";
					row.push((r + g + b > 200 * 3) ? 0 : 1);
				}
				imageText += "\n";
				matrix.push(row);
			}
			console.info(imageText);

			for (var i = 0; i < height; i++) {
				var cut = true;
				for (var j = 0; j < width; j++) {
					if (matrix[i][j] === 1) {
						cut = false;
						break;
					}
				}
				if (cut) {
					for (var j = 0; j < width; j++) {
						matrix[i][j] = -1;
					}
				}
			}

			var result = [];
			var newResult = false;
			for (var i = 0; i < width; i++) {
				var cut = true;
				for (var j = 0; j < height; j++) {
					if (matrix[j][i] === 1) {
						cut = false;
						break;
					}
				}
				if (cut) {
					newResult = true;
					for (var j = 0; j < height; j++) {
						matrix[j][i] = -1;
					}
				} else {
					var column = "";
					for (var j = 0; j < height; j++) {
						if (matrix[j][i] !== -1) column += matrix[j][i];
					}
					// column += "\n";
					data = parseInt("1" + column, 2).toString(16);

					if (newResult) {
						result.push(data);
						newResult = false;
					} else {
						result[result.length - 1] += data;
					}
				}
			}

			console.info(result);

			var output = "";
			for (var i = 0, length = result.length; i < length; i++) {
				switch (result[i]) {
				case CHAR_1: output += "1"; break;
				case CHAR_2: output += "2"; break;
				case CHAR_3: output += "3"; break;
				case CHAR_4: output += "4"; break;
				case CHAR_5: output += "5"; break;
				case CHAR_6: output += "6"; break;
				case CHAR_7: output += "7"; break;
				case CHAR_8: output += "8"; break;
				case CHAR_8_1: output += "8"; break;
				case CHAR_9: output += "9"; break;
				case CHAR_0: output += "0"; break;
				case CHAR_PLUS: output += "+"; break;
				case CHAR_MINUS: output += "-"; break;
				}
			}
			console.info("识别结果: " + output);
			var compute = eval(output);
			console.info("计算结果: " + compute);

			return {
				output: output,
				compute: compute
			};
		};

		return {
			analysis: analysis
		};
	};

	window.BilibiliCaptcha = BilibiliCaptcha;
})(window);