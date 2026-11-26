export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  Home: undefined;
  Work: undefined;
  Study: undefined;
  Personal: undefined;
  AddNote: undefined;
  EditNote: {
    noteId: string;
  };
  Profile: undefined;
  NoteDetails: {
    noteId: string;
  };
};