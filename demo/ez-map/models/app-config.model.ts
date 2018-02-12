import { InjectionToken } from "@angular/core";

export interface AppConfig {
    apiKey: string;
    libraries: string[];
}

export const EZ_MAP_CONFIG = new InjectionToken<AppConfig>('EZ_MAP_CONFIG');