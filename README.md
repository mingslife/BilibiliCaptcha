# BilibiliCaptcha
哔哩哔哩直播验证码识别

## 说明
哔哩哔哩直播的时候每次领取银瓜子都要输验证码，很麻烦，所以就做了一个专供哔哩哔哩直播验证码的前端识别工具。现已加入哔哩哔哩直播宝箱银瓜子自动领取工具。

## Demo
[https://mingslife.github.io/bilibili-captcha/](https://mingslife.github.io/bilibili-captcha/)

## 插件
### 哔哩哔哩直播宝箱银瓜子自动领取工具
顾名思义，用于在哔哩哔哩直播间自动领取宝箱银瓜子的前端工具，需要jQuery依赖（不需要自己添加，直播间页面已有加入）。

原理就是模拟用户领取瓜子（虽然可以直接调用领取瓜子的接口，但是怕中间有坑，搞不好容易被发现，另外一个原因就是麻烦，本人很懒，略略略:P），没什么技术含量，比较简单粗暴，就是验证码识别部分下了一点点功夫而已。

[Bilibili Captcha Tool](https://github.com/mingslife/BilibiliCaptcha/blob/master/js/bilibili-captcha-tool-full.js)

在哔哩哔哩直播间页面点F12打开开发者工具，输入如下代码：
```JavaScript
var ele = document.create("script");
ele.src = "https://mingslife.github.io/bilibili-captcha/js/bilibili-captcha-tool-full.min.js";
document.body.append(ele);
```

或者直接输入（需要jQuery）：
```JavaScipt
$('body').append('<script src="https://mingslife.github.io/bilibili-captcha/js/bilibili-captcha-tool-full.min.js"></script>');
```