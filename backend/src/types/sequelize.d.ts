declare module 'sequelize' {
  interface ModelAttributeColumnOptions {
    /**
     * После какой колонки вставлять новую. Странно,
     * но в Sequelize 6 нет описания этого свойства в интерфейсе
     */
    after: string;
  }
}

export {};
