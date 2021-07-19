import { ApiExtensionType, AppExtensionType, ExtensionPackageType, ExtensionType } from '../types';

export const APP_SHARED_DEPS = ['@directus/extension-sdk', 'vue'];
export const API_SHARED_DEPS = ['@directus/extension-sdk', 'axios'];

export const APP_EXTENSION_TYPES: AppExtensionType[] = ['interface', 'display', 'layout', 'module'];
export const API_EXTENSION_TYPES: ApiExtensionType[] = ['endpoint', 'hook'];
export const EXTENSION_TYPES: ExtensionType[] = [...APP_EXTENSION_TYPES, ...API_EXTENSION_TYPES];
export const EXTENSION_PACKAGE_TYPES: ExtensionPackageType[] = [...EXTENSION_TYPES, 'pack'];

export const EXTENSION_NAME_REGEX = /^(?:(?:@[^/]+\/)?directus-extension-|@directus\/extension-).+$/;

export const EXTENSION_PKG_KEY = 'directus:extension';
