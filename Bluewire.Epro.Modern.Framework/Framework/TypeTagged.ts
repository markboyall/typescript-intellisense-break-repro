import { Class } from "Framework/Class";

// Decorator used to set the type name for TypeTagged classes.
export var typeName: { (name: string): { (target: Class<TypeTagged>): void } };

var usedTypeNames: { [name: string]: boolean } = {};

typeName = name => target => {
    if (usedTypeNames[name]) throw new Error("Duplicate type name: " + name);
    usedTypeNames[name] = true;
    target.prototype.type = name;
};

// Base class for actions which get sent to the Dispatcher.
export abstract class TypeTagged {

    // Set by Framework.Initialise so that stores etc can store
    // a mapping between eg action types and handlers.
    public type: string;

    constructor() {
        if (!this.type || this.type == "TypeTagged") throw new Error("Type name not initialised, use the @typeName decorator");

        // Copy the type name property from the prototype onto this
        // particular instance so that JSON.stringify serialises it.
        this.type = this.type;
    }
}

export function isOfType<T extends TypeTagged>(value: TypeTagged | null | undefined, type: Class<T>): value is T {
    return !!(value && value.type == type.prototype.type);
}

export function asType<T extends TypeTagged>(value: TypeTagged | null | undefined, type: Class<T>): T | null {
    return isOfType(value, type) ? <T>value : null;
}