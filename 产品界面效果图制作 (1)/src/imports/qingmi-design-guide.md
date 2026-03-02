晴幂科技视觉规范 v1.0
文档状态：生效中
核心理念：Dopamine Warmth (多巴胺暖流)
适用范围：App / 小程序 / Web 官网
1. 设计哲学 (Design Philosophy)
我们的视觉语言不仅仅是“好看”，而是情绪的容器。基于积极心理学背景，我们将无形的“幸福感”转化为可触碰的视觉体验。
1.1 核心关键词
Soft (柔软)：拒绝尖锐的直角，一切皆圆润，像刚晒过的棉被。
Luminous (光辉)：利用内发光与漫反射，模拟晨光与希望。
Tactile (触感)：利用 Claymorphism (软陶/轻质3D)，创造一种“想让人戳一下”的解压质感。
Embrace (拥抱)：呼应 Logo 的双心拥抱形态，传递包容与连接。
2. 色彩体系 (Color System)
色彩提取自品牌 Logo，旨在构建一个高饱和度但不刺眼的“情绪调色盘”。
2.1 品牌主色 (Primary Colors)
用于核心交互组件、强调文字及品牌识别区。
色彩名称	Hex代码	说明	情感隐喻
Empathy Pink (拥抱粉)	#FF7E95	核心主色	爱、包容、心跳
Sunny Yellow (晴空黄)	#FFD56B	辅助主色	希望、高光时刻、金币
Vitality Orange (活力橙)	#FF9F43	强调色	能量、成长、引导
2.2 背景色 (Canvas Colors)
用于界面的底色，区分日夜模式。
Day Mode (日间): #FFF9F0
描述：暖米白。避免使用纯白 (#FFFFFF)，以减少视觉刺激，营造纸质书般的温润感。
Night Mode (夜间): #2D1B36
描述：深紫暖灰。避免使用纯黑 (#000000)，营造梦幻的极光夜晚氛围。
2.3 功能色 (Functional Colors)
Success (治愈): #A7F3D0 (柔和的薄荷绿)
Text (正文): #475569 (深蓝灰，非纯黑)
Sub-text (辅文): #94A3B8 (蓝灰)
3. 字体规范 (Typography)
字体选择应强化“圆润”与“亲和力”，严禁使用尖锐的衬线体。
3.1 中文字体
首选：Happy Zcool (站酷快乐体) - 用于标题、Slogan、分享海报（需确认商用授权）。
正文：PingFang SC Rounded (圆体) 或系统默认无衬线字体。
3.2 英文字体 / 数字
首选：Nunito 或 VAG Rounded。
特征：笔画末端为圆头，字形胖乎乎的，特别是在显示“坚持天数”等数字时，能增加可爱度。
4. UI 组件规范 (Component Library)
4.1 核心风格：Claymorphism (软陶风)
所有卡片和按钮需具备以下 CSS 属性特征，营造“充气感”或“软陶感”：
大圆角 (Radius): 最小 24px，卡片推荐 32px。
内发光 (Inner Shadow): 模拟光照，使物体看起来有体积感。
柔和投影 (Drop Shadow): 弥散大，颜色浅，模拟悬浮感。
CSS 参考片段：
code
CSS
.clay-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 32px;
  box-shadow: 
    inset 2px 2px 5px rgba(255, 255, 255, 1), /* 高光 */
    inset -3px -3px 7px rgba(0, 0, 0, 0.05), /* 阴影 */
    10px 10px 20px rgba(166, 180, 200, 0.15); /* 外部投影 */
  backdrop-filter: blur(10px); /* 毛玻璃 */
}
4.2 按钮 (Buttons)
主按钮：使用 Empathy Pink 或 Sunny Yellow 渐变，点击时要有明显的 Scale Down (缩小) 动效，模拟按压海绵的物理反馈。
图标：使用 Fill (填充) 风格而非 Stroke (描边)，图标边缘需圆润。
4.3 输入框 (Inputs)
常态：半透明背景，无边框。
激活态 (Focus)：出现 Empathy Pink 颜色的柔和光晕（Glow Effect），而非实线边框。
5. 核心视觉隐喻 (Visual Metaphors)
产品的核心在于将心理活动具象化，所有插画需遵循 3D Cute Render (盲盒风格)。
5.1 生命树 (The Soul Tree)
风格：参考《动物森友会》或 PopMart。
质感：树冠不是复杂的叶片，而是像棉花糖或云朵一样的团块。
动态：随着用户记录，树会轻轻呼吸（缩放动画）。
5.2 能量单位 (Energy)
输入前：文字。
输入后：转化为 Sun Drops (太阳水滴) —— 金色发光的水滴状粒子（取自 Logo 元素），飞入树中。
5.3 社交元素 (Social)
他人：表现为 Fireflies (萤火虫) 或 Glowing Bubbles (发光气泡)。
共鸣：点击气泡时，气泡破裂变成两颗心互相拥抱的动画（Logo 动态化）。
6. 平台差异化适配 (Platform Adaptation)
平台	策略	关键设计点
Native APP	沉浸式	全屏 3D 渲染树木；复杂的粒子特效；触觉反馈 (Haptics)。
微信小程序	轻量化	将 3D 树木转为 2.5D 插画；重点优化“生成海报”的分享视觉；色彩更明快。
Web 官网	展示面	巨型会呼吸的 Logo 展示；鼠标跟随互动；极光渐变背景。
7. 动态与声音 (Motion & Sound)
7.1 加载动画 (Loading)
Logo 演绎：Logo 中的两颗心轻轻靠近、拥抱、分开、再拥抱。
7.2 声音设计 (Sound FX)
点击：类似戳破泡泡的“波”声。
完成记录：温暖的风铃声或和弦（C大调）。
背景音：白噪音（雨声、森林风声），默认音量 20%。
8. 错误示范 (Don'ts)
❌ 禁止 使用直角矩形卡片。
❌ 禁止 使用纯黑色 (#000000) 作为文字或背景。
❌ 禁止 使用细线条描边图标（看起来太锋利）。
❌ 禁止 树木设计得过于写实或枯瘦（必须圆润饱满）。
HappyKua Design Team
让每一次记录，都像是一个温暖的拥抱。