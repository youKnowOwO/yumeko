"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantly = exports.visible = exports.hide = exports.configurable = exports.writeable = exports.enumerable = exports.defineDescriptor = void 0;
function defineDescriptor(val) {
    return function (target, key, descriptor) {
        if (descriptor) {
            const keys = Object.keys(val);
            for (const key of keys)
                descriptor[key] = val[key];
        }
        else
            Object.defineProperty(target, key, {
                set(value) {
                    Object.defineProperty(this, key, {
                        value,
                        enumerable: true,
                        writable: true,
                        configurable: true,
                        ...val
                    });
                },
                ...val
            });
    };
}
exports.defineDescriptor = defineDescriptor;
function enumerable(value) {
    return defineDescriptor({ enumerable: value });
}
exports.enumerable = enumerable;
function writeable(value) {
    return defineDescriptor({ writable: value });
}
exports.writeable = writeable;
function configurable(value) {
    return defineDescriptor({ configurable: value });
}
exports.configurable = configurable;
function hide(...args) {
    return defineDescriptor({ enumerable: false })(...args);
}
exports.hide = hide;
function visible(...args) {
    return defineDescriptor({ enumerable: true })(...args);
}
exports.visible = visible;
function constantly(...args) {
    return defineDescriptor({ writable: false, configurable: false })(...args);
}
exports.constantly = constantly;
