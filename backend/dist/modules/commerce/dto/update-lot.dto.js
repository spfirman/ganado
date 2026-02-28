"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_lot_dto_1 = require("./create-lot.dto");
class UpdateLotDto extends (0, swagger_1.PartialType)(create_lot_dto_1.CreateLotDto) {
}
exports.UpdateLotDto = UpdateLotDto;
//# sourceMappingURL=update-lot.dto.js.map