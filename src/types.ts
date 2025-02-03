export type IUser = {
  name: string;
  photoUrl: string;
};

export type INote = {
  title: string;
  body: string;
  createdAt: string;
  user: IUser;
};
