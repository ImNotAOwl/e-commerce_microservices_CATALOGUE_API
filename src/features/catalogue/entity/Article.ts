export class Article {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly image: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly brand: string,
    public readonly createdAt?: number | null,
    public readonly rating?: number | null,
    public readonly id?: string
  ) {}
}
