import { TypeTagged } from "Framework/TypeTagged"
import { NominalType } from "Framework/NominalType";

export abstract class Action extends TypeTagged {
    protected nominal: NominalType;
}

export interface HandleAction {
    (action: Action): Action;
}
