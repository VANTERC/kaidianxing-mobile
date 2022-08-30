import store from '@/store'
import { router } from "@/router";
import {hasBindBySence } from '@/common/helper/user'
export default class {
    optionId = 0
    optionChoseNum = 1
    callback = null
    pickerCallback(e) {
        console.log(e,'pickerCallback');
        return new Promise(async (resolve,reject) => {
            if (e?.type === 'clickBtn' && e.data.type === 'cart') {
                // 判断绑定手机号
                if(hasBindBySence('add_cart')) {
                   store.commit('login/setModal', true)
                   resolve({type: 'clickBtn'})
                   return
                }
                await store.dispatch('creditQuickPurchase/addCart', {
                    option_id: this.optionId,
                    total: this.optionChoseNum,
                })
                resolve()
            } else if (e?.type === 'clickBtn' && e.data.type === 'buy') {
                console.log(111,this.optionId,'lllllll');
                // 下单
                let query = await store.dispatch('creditQuickPurchase/createOrder', {
                    option_id: this.optionId,
                    total: this.optionChoseNum,
                })
                resolve()
                store.commit('form/resetForm')
                router.push({
                    path: '/kdxOrder/create',
                    query,
                })
            } else if (e.type == 'choose') {
                // 规格选完回来
                this.optionId = e?.data?.options?.credit_option_id || 0

            } else if (e.type == 'changeNum') {
                //数量选完回来
                this.optionChoseNum = e.data.total
            } else if (e) {
                //
                this.callback && this.callback(e)
            }
        })
    }
    constructor(callback) {
        this.callback = callback
        this.pickerCallback = this.pickerCallback.bind(this)
    }
    getGoodDetail(id) {
        // 清除商品表单数据
        store.commit('form/resetForm')
        return new Promise((resolve, reject) => {
            store
                .dispatch('creditQuickPurchase/getQuickPurchaseData', {
                    goodId: id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                    uni.hideLoading()
                })
                .catch((err) => {
                    reject(err)
                    uni.hideLoading()
                })
        })
    }
}
