(function($, window) {
	var SCAN_TIME = 1000; // 检测间隔时间
	var SCRIPT_ADDRESS = "https://mingslife.github.io/bilibili-captcha/js/bilibili-captcha.min.js"; // 验证码识别插件下载地址

	var isInit = false;
	var lock = false;

	var timer = null;

	// 初始化
	var init = function() {
		if ($ == undefined) {
			console.error("插件需要jQuery");
			clearTimeout(timer);
			return;
		}

		var scriptElement = document.createElement("script");
		scriptElement.src = SCRIPT_ADDRESS;
		scriptElement.onload = function() {
			isInit = true;
		};
		document.body.appendChild(scriptElement);
	};

	// 领取瓜子
	var getAward = function() {
		lock = true;

		// 打开宝箱
		$(".treasure-box-ctnr .treasure-box").click();

		var captchaImg = $(".captcha-img");
		var bilibiliCaptcha = BilibiliCaptcha(captchaImg[0]);
		captchaImg.load(function(event) {
			$(this).unbind("load");
			var result = bilibiliCaptcha.analysis();
			var compute = result.compute;
			$('[placeholder="小学算数"]').val(compute);
			$("button.get-award-btn").click();

			lock = false;
		});
	};

	// 定时检测宝箱是否开启
	timer = setInterval(function() {
		if (!isInit || lock) return;

		var countTiming = $('[ms-text="countTiming"]').text();
		if (countTiming === "00:00") {
			getAward();
		} else if (countTiming === "--:--") {
			console.info("宝箱领取完毕");
			clearTimeout(timer);
		}
	}, SCAN_TIME);

	// 初始化插件
	init();
})(jQuery, window);