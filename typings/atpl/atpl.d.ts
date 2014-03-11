declare module "atpl" {
	export interface IOptions {
		path?: string;
		root?: string;
		cache?: boolean;
		content?: string;
	}
	export interface IOptionsExpress {
		settings: {
			etag: boolean;
			env: string;
			views: string;
		};
		_locals(): any;
		cache: boolean;
	}
	export function internalCompileString(content: string, options: IOptions): (params: any) => string;
	export function express2Compile(templateString: string, options?: any): (params: any) => string;
	/**
	*
	* @param filename
	* @param options
	* @param callback
	*/
	export function express3RenderFile(filename: string, options: any, callback: (err: Error, output?: string) => void): void;
	export function registerExtension(items: any): void;
	export function registerTags(items: any): void;
	export function registerFunctions(items: any): void;
	export function registerFilters(items: any): void;
	export function registerTests(items: any): void;
	export var compile: typeof express2Compile;
	export var __express: typeof express3RenderFile;
}