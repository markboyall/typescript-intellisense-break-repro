import { Class } from "Framework/Class";

interface EproUserDto {
    prop1: string;
}

interface ConfigDto {
    prop2: string;
}

export class Page {

}

export interface PageClass<P = Page> extends Class<P> {
    path(): string;
    fromParams(params: any, queryParams: any): P;
    toParams(page: P): any;
    pageName(page: P | null): string;
    shortName: { (page: P | null): string };
    parents: { (): PageClass[] | null };
    isEnabled(config: ConfigDto, user: EproUserDto, isKiosk: boolean): boolean;
}

export function isOverlay(page: PageClass) {
    return page && page.parents() === null;
}
