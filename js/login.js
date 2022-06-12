//账号实例
const loginIdValidator = new FieldValidator("txtLoginId", async(val) => {
    if (!val) {
        return "请填写账号";
    }
});

//密码实例
const loginPwdValidator = new FieldValidator("txtLoginPwd", async(val) => {
    if (!val) {
        return "请填写密码";
    }
});

const form = $('.user-form');
form.onsubmit = async(e) => {
    e.preventDefault();
    const isCorrect = await FieldValidator.validate(loginIdValidator, loginPwdValidator);
    if (!isCorrect) {
        return;
    }
    const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const resp = await API.login(data);
    if (!resp.code) {
        alert("登陆成功，点击确定，跳转首页");
        location.href = "./index.html";
    } else {
        alert(resp.msg)
    }
};