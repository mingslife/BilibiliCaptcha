(function($, window) {
	"use strict";

	var BilibiliCaptcha = (function() {
		"use strict";

		var WIDTH = 120;
		var HEIGHT = 40;

		var CHARACTER_INDEXS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-"];
		var CHARACTERS = [
			"81c000008fc00000ffffffffffffffffffffffffffffffffffffffff",
			"bfe0000fffe0003fffe000ffffe001ffffe007fff8001ffff8003feff800ff8ff801ff0ff807fc0ff81ff00fffffe00fffff800fffff000ffffc000fbff8000f",
			"bfe003feffe003ffffe003ffffe003ffffe003fff800000ff803800ff803800ff807c00ff80fe00ff81ff00ffffffffffffefffffffc7ffffffc7fffbff83ffe",
			"800007c080003fc08001ffc0800fffc0807fffc081ffffc08ffff3c0ffff83c0fffc03c0ffe003c0ff07fffff807ffffc007ffff8007ffff8007ffff800003c0800003c0",
			"ffff03feffff03ffffff03ffffff03ffffff03fff80f000ff80f000ff80f000ff80f000ff80f000ff80f000ff80ffffff80ffffff80ffffff80ffffff807fffe",
			"bffffffefffffffffffffffffffffffffffffffff803c00ff803c00ff803c00ff803c00ff803c00ff803c00fffc3ffffffc3ffffffc3ffffffc3ffffbfc1fffe",
			"ff800000ff800000ff800000ff800000ff800007f800007ff80003fff8003ffff803fffff83ffffefbffffe0fffffe00ffffe000fffe0000ffe00000fe000000",
			"bff83ffefffc7ffffffefffffffffffffffffffff80fe00ff807e00ff807c00ff807c00ff807e00ff80fe00ffffffffffffffffffffefffffffc7fffbff83ffe",
			"bfffc1feffffe1ffffffe1ffffffe1ffffffe1fff801e00ff801e00ff801e00ff801e00ff801e00ff801e00fffffffffffffffffffffffffffffffffbffffffe",
			"bffffffefffffffffffffffffffffffffffffffff800000ff800000ff800000ff800000ff800000ff800000fffffffffffffffffffffffffffffffffbffffffe",
			"800078008000780080007800800078008000780080007800801fffe0801fffe0801fffe0801fffe0801fffe0800078008000780080007800800078008000780080007800",
			"80003c0080003c0080003c0080003c0080003c0080003c0080003c0080003c0080003c00"
		];

		var BilibiliCaptcha = function(img) {
			var captcha = img;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var analysis = function() {
				// var width = captcha.width;
				// var height = captcha.height;
				var width = WIDTH;
				var height = HEIGHT;
				ctx.drawImage(captcha, 0, 0, WIDTH, HEIGHT);
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
						var data = parseInt("1" + column, 2).toString(16);

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
					case CHARACTERS[0]: output += CHARACTER_INDEXS[0]; break;
					case CHARACTERS[1]: output += CHARACTER_INDEXS[1]; break;
					case CHARACTERS[2]: output += CHARACTER_INDEXS[2]; break;
					case CHARACTERS[3]: output += CHARACTER_INDEXS[3]; break;
					case CHARACTERS[4]: output += CHARACTER_INDEXS[4]; break;
					case CHARACTERS[5]: output += CHARACTER_INDEXS[5]; break;
					case CHARACTERS[6]: output += CHARACTER_INDEXS[6]; break;
					case CHARACTERS[7]: output += CHARACTER_INDEXS[7]; break;
					case CHARACTERS[8]: output += CHARACTER_INDEXS[8]; break;
					case CHARACTERS[9]: output += CHARACTER_INDEXS[9]; break;
					case CHARACTERS[10]: output += CHARACTER_INDEXS[10]; break;
					case CHARACTERS[11]: output += CHARACTER_INDEXS[11]; break;
					default: console.info("尝试识别: " + result[i]); output += test(result[i]);
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
			var count = function(result) {
				var sum = 0, string = Number(result).toString(2);
				for (var i = 0, length = string.length; i < length; i++) {
					if (string.charAt(i) === '1') sum++;
				}
				return sum;
			};
			var hexToBin = function(number) {
				return parseInt(number, 16).toString(2);
			};
			var compare = function(a, b) {
				var score = Math.abs(a.length - b.length), minLength = Math.min(a.length, b.length);
				for (var i = 0; i < minLength; i++) {
					if (a.charAt(i) !== b.charAt(i)) score++;
				}
				return score;
			};
			var test = function(temp) {
				// var temp = parseInt(result, 16);
				var min = Number.MAX_VALUE;
				var minIndex = -1;
				var tempBin = hexToBin(temp);
				for (var i = 0, length = CHARACTERS.length; i < length; i++) {
					// var result = count(parseInt(CHARACTERS[i], 16) ^ temp);
					var result = compare(hexToBin(CHARACTERS[i]), tempBin);
					if (result < min) {
						min = result;
						minIndex = i;
					}
				}
				return minIndex === -1 ? "" : CHARACTER_INDEXS[minIndex];
			};

			return {
				analysis: analysis
			};
		};

		return BilibiliCaptcha;
	})();

	var SCAN_TIME = 1000; // 检测间隔时间
	var SLEEP_TIME = 3000; // 领取瓜子后的休眠时间

	var isInit = false;
	var lock = false;

	var timer = null;

	// 初始化
	var init = function() {
		console.info("%cBilibili Captcha Tool by Ming", "font-size:30px;color:#09f;");

		if ($ == undefined) {
			console.error("插件需要jQuery");
			clearTimeout(timer);
			return;
		}

		isInit = true;

		console.info("初始化完成");
	};

	// 领取瓜子
	var getAward = function() {
		lock = true;

		// 打开宝箱
		if (!$(".box-panel.live-popup-panel").is(":visible")) $(".treasure-box-ctnr .treasure-box").click();

		var captchaImg = $(".captcha-img");
		var bilibiliCaptcha = BilibiliCaptcha(captchaImg[0]);
		captchaImg.load(function(event) {
			$(this).unbind("load");
			var result = bilibiliCaptcha.analysis();
			var compute = result.compute;
			$('[placeholder="小学算数"]').val(compute);
			$("button.get-award-btn").click();

			setTimeout(function() {
				lock = false;
			}, SLEEP_TIME);
		});
	};

	// 定时检测宝箱是否开启
	timer = setInterval(function() {
		if (!isInit || lock) return;

		var countTimingElement = $('[ms-text="countTiming"]');
		var countTiming = countTimingElement.text();
		if (countTiming === "00:00") {
			getAward();
		} else if (countTiming === "--:--" || !countTimingElement.is(":visible")) {
			console.info("宝箱领取完毕");
			clearTimeout(timer);
		}
	}, SCAN_TIME);

	// 初始化插件
	init();
})(jQuery, window);