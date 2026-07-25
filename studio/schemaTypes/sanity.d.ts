// Type declarations for sanity package
// This is a workaround for network connectivity issues during installation

declare module 'sanity' {
  export function defineType(config: any): any
  export function defineField(config: any): any
  export function defineConfig(config: any): any
}

declare module 'sanity/structure' {
  export function structureTool(): any
}

declare module '@sanity/vision' {
  export function visionTool(): any
}