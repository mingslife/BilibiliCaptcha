(function($, window) {
	"use strict";

	var SCAN_TIME = 1000; // 检测间隔时间
	var SLEEP_TIME = 3000; // 领取瓜子后的休眠时间
	var SCRIPT_ADDRESS = "https://mingslife.github.io/bilibili-captcha/js/bilibili-captcha.min.js"; // 验证码识别插件下载地址

	var isInit = false;
	var lock = false;

	var timer = null;

	// 初始化
	var init = function() {
		console.info("%cBilibili Captcha Tool by Ming", "font-size:30px;color:#09f;")

		if ($ == undefined) {
			console.error("插件需要jQuery");
			clearTimeout(timer);
			return;
		}

		var scriptElement = document.createElement("script");
		scriptElement.src = SCRIPT_ADDRESS;
		scriptElement.onload = function() {
			isInit = true;

			console.info("初始化完成");
		};
		document.body.appendChild(scriptElement);
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