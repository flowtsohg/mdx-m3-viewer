// Mix ...args into dst
export default function mix(dst, ...args) {
    for (let arg of args) {
        // Reflect not supported on Babel for now
        //const keys = Reflect.ownKeys(arg);
        let keys = Object.getOwnPropertyNames(arg).concat(Object.getOwnPropertySymbols(arg))

        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            
            //if (!Reflect.has(dst, key)) {
            if (!(key in dst)) {
                //Reflect.defineProperty(dst, key, Reflect.getOwnPropertyDescriptor(arg, key))
                Object.defineProperty(dst, key, Object.getOwnPropertyDescriptor(arg, key))
            }
        }
    }

    return dst;
};
