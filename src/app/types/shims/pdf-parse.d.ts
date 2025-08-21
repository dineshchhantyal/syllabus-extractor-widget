declare module "pdf-parse" {
    interface PDFInfo {
        numpages: number;
        numrender: number;
        info: Record<string, unknown>;
        metadata: unknown;
        version: string;
        text: string;
    }
    function pdf(
        data: Buffer | Uint8Array,
        options?: Record<string, unknown>
    ): Promise<PDFInfo>;
    export = pdf;
}
