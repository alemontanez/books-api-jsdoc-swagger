export interface IBookPayload {
  title: string
  author: string
  year: number
}

export interface IBook extends IBookPayload{
  id: number
}