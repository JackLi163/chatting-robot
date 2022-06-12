// (() => {
const doms = {
    aside: {
        nickName: $("#nickname"),
        loginId: $("#loginId")
    },
    close: $(".close"),
    container: $(".chat-container"),
    msg: {
        form: $(".msg-container"),
        input: $("#txtMsg")
    }
}
async function init() {
    const user = await API.profile();
    //判断令牌是否存在，不存在退回登陆页面
    if (!user.data) {
        alert("登陆令牌已过期，请重新登陆");
        location.href = "./login.html";
        return;
    };
    // 显示用户信息
    showUserInfo(user);
    //显示聊天记录
    await showHistory();
    //初始化事件
    initEvents();
};

async function sendChat() {
    const val = doms.msg.input.value.trim();
    if (!val) {
        return;
    }
    //将发生的数据插入到节点中
    const str1 = `<div class="chat-item me"></div>`;
    const mDiv = $$$("div");
    const img = $$$("img");
    const cDiv = $$$("div");
    const dDiv = $$$("div");
    mDiv.className = "chat-item me";
    img.src = "./asset/avatar.png";
    img.className = "chat-avatar";
    cDiv.className = "chat-content";
    dDiv.className = "chat-date"
    cDiv.innerText = val
    dDiv.innerText = changeDate(+new Date());
    mDiv.appendChild(img);
    mDiv.appendChild(cDiv);
    mDiv.appendChild(dDiv);
    doms.container.appendChild(mDiv);
    //调整滚动条高度
    doms.container.scrollTop = doms.container.scrollHeight;
    doms.msg.input.value = "";
    //等待服务器发送信息
    const txt = await API.sendChat({ content: val });
    //将服务器发送的信息插入到节点
    const str2 = `<div class="chat-item">
                    <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
                    <div class="chat-content">${txt.data.content}</div>
                    <div class="chat-date">${changeDate(txt.data.createdAt)}</div>
                </div>`;
    doms.container.innerHTML += str2;
    doms.container.scrollTop = doms.container.scrollHeight;
}

/**
 * 生成历史记录
 */
async function showHistory() {
    //请求服务器聊天记录
    const user = await API.getHistory();
    // 拼接成字符串后插入到容器里
    const html = user.data.map(item => {
        // 将日期进行转换
        const date = changeDate(parseFloat(item.createdAt));
        let str = null;
        if (item.from) {
            str = `<div class="chat-item me">
                <img class="chat-avatar" src="./asset/avatar.png" />
                <div class="chat-content">${item.content}</div>
                <div class="chat-date">${date}</div>
                </div>`
        } else {
            str = `<div class="chat-item">
                    <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
                    <div class="chat-content">${item.content}</div>
                    <div class="chat-date">${date}</div>
                </div>`
        };
        return str;

    }).join("");
    doms.container.innerHTML = html;
    doms.container.scrollTop = doms.container.scrollHeight;
}

/**
 * 将时间转换成规定格式
 * @param {number} data 
 * @returns 
 */
function changeDate(data) {
    const time = new Date(data);
    const year = time.getFullYear(),
        month = (time.getMonth() + 1).toString().padStart(2, "0"),
        date = (time.getDate()).toString().padStart(2, "0"),
        hours = (time.getHours()).toString().padStart(2, "0"),
        minutes = (time.getMinutes()).toString().padStart(2, "0"),
        seconds = (time.getSeconds()).toString().padStart(2, "0");
    return `${year}:${month}:${date} ${hours}:${minutes}:${seconds}`
}

/**
 * 初始化注册事件
 */
function initEvents() {
    doms.close.onclick = cancelLogin;
    doms.msg.form.onsubmit = async(e) => {
        e.preventDefault();
        sendChat();
    }
}


/**
 * 账户注销，返回登陆界面
 */
function cancelLogin() {
    API.setCancel();
    location.href = "./login.html";
}
/**
 * 显示用户信息
 * @param {Object}  userData 
 */
function showUserInfo(userData) {
    doms.aside.nickName.innerText = userData.data.nickname;
    doms.aside.loginId.innerText = userData.data.loginId;
}
init();
// })()