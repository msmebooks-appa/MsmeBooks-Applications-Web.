declare module 'mammoth' {
  export interface RawTextResult {
    value: string;
    messages: any[];
  }
  export function extractRawText(input: { buffer: Buffer }): Promise<RawTextResult>;
}
