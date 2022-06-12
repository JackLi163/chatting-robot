const API = (() => {
    const BASE_URL = "https://study.duyiedu.com";
    const TOKEN_KEY = "token";
    /**
     * 
     * @param {string} path url路径
     * @returns PROMISE
     */
    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = "Bearer " + token;
        }
        return fetch(BASE_URL + path, { headers });
    }

    /**
     * 
     * @param {string} path url路径
     * @returns PROMISE
     */
    function post(path, bodyObj) {
        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = "Bearer " + token;
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,

            body: JSON.stringify(bodyObj),
        });
    }


    /**
     * 注册
     * @param {Object} userInfo  
     * @returns PROMISE
     */
    async function reg(userInfo) {
        return await post("/api/user/reg", userInfo).then((resp) => resp.json());
    };

    /**
     * 登陆
     * @param {Object} loginInfo  
     * @returns PROMISE 
     */
    async function login(loginInfo) {
        const resp = await post("/api/user/login", loginInfo);
        const result = await resp.json();
        if (result.code === 0) {
            localStorage.setItem(TOKEN_KEY, resp.headers.get("authorization"));
        }
        return result;
    }


    /**
     * 验证账号
     * @param {} loginId 
     * @returns PROMISE
     */
    async function exists(loginId) {
        return await get(`/api/user/exists?loginId=${loginId}`).then(resp => resp.json());
    }


    /**
     * 当前登录的用户信息
     * @returns PROMISE
     */
    async function profile() {
        return await get(`/api/user/profile`).then(resp => resp.json());
    }


    /**
     * 发送聊天消息
     * @param {*} content 
     * @returns PROMISE
     */
    async function sendChat(content) {
        return await post("/api/chat", content).then(resp => resp.json());
    }

    /**
     * 获取聊天记录
     */
    async function getHistory() {
        return await get("/api/chat/history").then(resp => resp.json());
    }
    /**
     * 注销
     */
    function setCancel() {
        localStorage.removeItem(TOKEN_KEY);
    }
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        setCancel
    }
})()