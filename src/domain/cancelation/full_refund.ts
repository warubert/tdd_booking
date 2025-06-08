import { RefundRule } from "./refund_rule.interface";

export class FullRefund implements RefundRule {
    calculateRefund(totalPrice: number){
        return 0;
    }
}