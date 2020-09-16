export function defineDescriptor(val: PropertyDescriptor) {
    return function (target: unknown, key: string, descriptor?: PropertyDescriptor): void {
        if (descriptor) {
            const keys = Object.keys(val) as (keyof PropertyDescriptor)[];
            for(const key of keys) descriptor[key] = val[key];
        } else Object.defineProperty(target, key, {
            set(value): void {
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

export function enumerable(value: boolean): ReturnType<typeof defineDescriptor> {
    return defineDescriptor({ enumerable: value });
}

export function writeable(value: boolean): ReturnType<typeof defineDescriptor> {
    return defineDescriptor({ writable: value });
}

export function configurable(value: boolean): ReturnType<typeof defineDescriptor> {
    return defineDescriptor({ configurable: value });
}

export function hide (...args: Parameters<ReturnType<typeof defineDescriptor>>): void {
    return defineDescriptor({ enumerable: false })(...args);
}

export function visible (...args: Parameters<ReturnType<typeof defineDescriptor>>): void {
    return defineDescriptor({ enumerable: true })(...args);
}

export function constantly (...args: Parameters<ReturnType<typeof defineDescriptor>>): void {
    return defineDescriptor({ writable: false, configurable: false })(...args);
}