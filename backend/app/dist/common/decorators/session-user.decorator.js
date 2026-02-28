"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionUser = void 0;
const common_1 = require("@nestjs/common");
exports.SessionUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=session-user.decorator.js.map