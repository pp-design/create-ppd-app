/*
 * @Author: grabbychen 
 * @Date: 2019-05-15 12:53:33 
 * @Description: 一些数学公式集合 
 */

/**
 * 限定数值范围（不能小于最小值，且不能大于最大值）
 * @param {number} value     目标值
 * @param {number} min       最小值
 * @param {number} max       最大值
 */
export function clamp(value, min, max) {
    return Math.max(Math.min(max, value), min);
}

/**
 * 截取小数点后几位
 * @param {number} value    目标值
 * @param {number} place    位数（不填则默认2位）
 */
export function decimal(value, place) {
    const digits = Math.pow(10, place || 2);
    return parseInt(value * digits) / digits;
}