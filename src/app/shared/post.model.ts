export interface ClientPost {
  id: string;
  title: string;
  content: string;
}

export interface ServerPost {
  _id: string;
  id?: string;
  title: string;
  content: string;
}
