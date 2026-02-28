"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAction = exports.RequireEntity = exports.RequireModule = void 0;
const common_1 = require("@nestjs/common");
const RequireModule = (moduleName) => (0, common_1.SetMetadata)('requireModule', moduleName);
exports.RequireModule = RequireModule;
const RequireEntity = (entityName) => (0, common_1.SetMetadata)('requireEntity', entityName);
exports.RequireEntity = RequireEntity;
const RequireAction = (actionName) => (0, common_1.SetMetadata)('requireAction', actionName);
exports.RequireAction = RequireAction;
//# sourceMappingURL=application-permissions.decorator.js.map