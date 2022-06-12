// 用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
    constructor(txtId, validatorFunc) {
            this.input = $("#" + txtId);
            this.validatorFunc = validatorFunc;
            this.p = this.input.nextElementSibling;
            this.input.onblur = () => {
                this.validate();
            }
        }
        // 验证，成功返回true，失败返回false
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerHTML = err;
            return false;
        } else {
            this.p.innerHTML = "";
            return true;
        }
    }
    static async validate(...validators) {
        const proms = validators.map(validator => validator.validate())
        const isCorrect = await Promise.all(proms);
        return isCorrect.every(i => i);
    }
}