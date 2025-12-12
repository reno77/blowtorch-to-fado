declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): void
    exec(sql: string): QueryExecResult[]
    export(): Uint8Array
    close(): void
  }

  export interface QueryExecResult {
    columns: string[]
    values: any[][]
  }

  export interface SqlJsStatic {
    Database: {
      new (data?: ArrayBuffer | Uint8Array): Database
    }
  }

  export interface InitSqlJsOptions {
    locateFile?: (file: string) => string
  }

  export default function initSqlJs(
    config?: InitSqlJsOptions
  ): Promise<SqlJsStatic>
}
