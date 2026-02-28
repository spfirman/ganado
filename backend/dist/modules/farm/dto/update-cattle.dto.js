"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCattleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cattle_dto_1 = require("./create-cattle.dto");
class UpdateCattleDto extends (0, mapped_types_1.PartialType)(create_cattle_dto_1.CreateCattleDto) {
}
exports.UpdateCattleDto = UpdateCattleDto;
//# sourceMappingURL=update-cattle.dto.js.map