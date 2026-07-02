// 狗狗问诊智能体 - 网页版核心逻辑
// 知识库参考基础兽医常识，通俗易懂，专业术语附带解释

// ========== 智能体核心诊断匹配函数（简易规则引擎）==========
function consultRobot(syms, age, size) {
    // 定义病症知识库：症状匹配规则、病症介绍、护理、就医标记
    const illDatabase = [
        {
            match: ["持续呕吐", "腹泻、便血", "不吃不喝精神萎靡"],
            name: "细小病毒感染",
            desc: "高危烈性传染病，幼犬高发，肠胃黏膜破损出血，致死率较高。",
            care: "立刻断食断水，禁止自行喂药，隔离其他宠物。",
            hospital: true
        },
        {
            match: ["发烧、鼻头干燥发烫", "频繁咳嗽、流鼻涕", "不吃不喝精神萎靡"],
            name: "犬瘟热/上呼吸道感染",
            desc: "病毒或细菌引发呼吸道炎症，幼犬极易转为肺炎，伴随全身性发热。",
            care: "做好保暖，多喂温水，禁止外出接触其他动物。",
            hospital: true
        },
        {
            match: ["皮肤瘙痒、掉毛、红斑"],
            name: "皮肤真菌/螨虫皮炎",
            desc: "寄生虫或真菌感染，环境潮湿、洗澡频繁容易诱发，无生命危险。",
            care: "停止频繁洗澡，暴晒狗窝，外用宠物专用皮肤喷剂，清淡饮食。",
            hospital: false
        },
        {
            match: ["频繁抓耳、耳朵发臭"],
            name: "耳道耳螨/中耳炎",
            desc: "耳道寄生虫或细菌滋生，长期不处理会损伤听力。",
            care: "每日宠物洗耳液清洁耳道，保持耳朵干燥。",
            hospital: false
        },
        {
            match: ["尿频、尿血、排尿疼痛"],
            name: "膀胱尿道结石/尿路感染",
            desc: "饮水过少、高盐饮食诱发，严重会尿路堵塞无法排尿。",
            care: "大量补水，停止含盐零食，观察1天无好转必须就医。",
            hospital: true
        },
        {
            match: ["持续呕吐"],
            name: "消化不良/误食异物",
            desc: "乱吃杂物、暴饮暴食引发肠胃应激，无便血风险较低。",
            care: "禁食6小时，少量喂温水，后续喂易消化流食。",
            hospital: false
        }
    ];

    // 遍历知识库，匹配重合症状最多的病症
    let bestMatch = null;
    let maxSame = 0;

    illDatabase.forEach(ill => {
        // 计算当前勾选症状和病症所需症状重合数量
        let sameCount = 0;
        ill.match.forEach(item => {
            if (syms.includes(item)) {
                sameCount++;
            }
        });
        
        // 更新最优匹配
        if (sameCount > maxSame && sameCount > 0) {
            maxSame = sameCount;
            bestMatch = ill;
        }
    });

    // 无匹配症状
    if (!bestMatch) {
        return {
            name: "暂无匹配病症",
            desc: "你勾选的症状较少，无法准确判断，请补充更多异常表现。",
            care: "持续观察狗狗精神、饮食、排便情况，记录变化。",
            hospital: false
        };
    }

    return bestMatch;
}

// 提交诊断按钮触发
function startConsult() {
    // 获取用户输入
    const age = document.getElementById('dogAge').value.trim();
    const size = document.getElementById('dogSize').value;
    
    // 获取勾选的症状
    const checkboxes = document.querySelectorAll('#symptomList input[type="checkbox"]:checked');
    const selectedSyms = Array.from(checkboxes).map(cb => cb.value);

    // 简单输入校验
    if (selectedSyms.length === 0) {
        alert("请至少勾选一项症状");
        return;
    }

    if (!age) {
        alert("请填写狗狗年龄");
        return;
    }

    // 调用问诊智能体，拿到诊断结果
    const result = consultRobot(selectedSyms, age, size);

    // 渲染结果到页面
    document.getElementById('illName').textContent = result.name;
    document.getElementById('illDesc').textContent = result.desc;
    document.getElementById('careTip').textContent = result.care;
    
    // 显示结果区域
    document.getElementById('resultBox').style.display = 'block';
    
    // 显示/隐藏就医警告
    const warnBox = document.getElementById('warnBox');
    if (result.hospital) {
        warnBox.style.display = 'block';
    } else {
        warnBox.style.display = 'none';
    }

    // 滚动到结果区域
    document.getElementById('resultBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐶 狗狗智能问诊系统已启动');
});
