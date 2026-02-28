"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePurchaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_purchase_dto_1 = require("./create-purchase.dto");
class UpdatePurchaseDto extends (0, swagger_1.PartialType)(create_purchase_dto_1.CreatePurchaseDto) {
}
exports.UpdatePurchaseDto = UpdatePurchaseDto;
//# sourceMappingURL=update-purchase.dto.js.map