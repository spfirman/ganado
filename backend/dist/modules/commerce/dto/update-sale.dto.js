"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSaleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sale_dto_1 = require("./create-sale.dto");
class UpdateSaleDto extends (0, swagger_1.PartialType)(create_sale_dto_1.CreateSaleDto) {
}
exports.UpdateSaleDto = UpdateSaleDto;
//# sourceMappingURL=update-sale.dto.js.map