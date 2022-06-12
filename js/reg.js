//账号实例
const loginIdValidator = new FieldValidator("txtLoginId", async(val) => {
    if (!val) {
        return "请填写账号";
    }
    const resp = await API.exists(val);
    if (resp.data) {
        return "该账号已存在请重新输入";
    }
});
//昵称实例
const nicknameValidator = new FieldValidator("txtNickname", async(val) => {
    if (!val) {
        return "请填写昵称";
    }
});
//密码实例
const loginPwdValidator = new FieldValidator("txtLoginPwd", async(val) => {
    if (!val) {
        return "请填写密码";
    }
});
//密码重新输入实例
const loginPwdConfirmValidator = new FieldValidator("txtLoginPwdConfirm", async(val) => {
    if (!val) {
        return "请填写密码";
    }
    if (val !== loginPwdValidator.input.value) {
        return "密码不一致，请重新填写";
    }
});

const form = $('.user-form');
form.onsubmit = async(e) => {
    e.preventDefault();
    const isCorrect = await FieldValidator.validate(loginIdValidator, nicknameValidator, loginPwdValidator, loginPwdConfirmValidator);
    console.log(isCorrect)
    if (!isCorrect) {
        return;
    }
    const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());
    const resp = await API.reg(data);
    if (!resp.code) {
        alert("注册成功，点击完成跳转到登陆界面");
        location.href = "./login.html";
    }
};