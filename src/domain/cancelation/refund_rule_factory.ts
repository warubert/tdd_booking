import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";
import { RefundRule } from "./refund_rule.interface";

export class RefundRuleFactory {
    static getRefundRule(daysUntilChekin: number): RefundRule {
        if(daysUntilChekin > 7){
            return new FullRefund
        } else if (daysUntilChekin >= 1) {
            return new PartialRefund
        }
        return new NoRefund
    }
}