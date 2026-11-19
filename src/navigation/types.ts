export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Work: undefined;
  Study: undefined;
  Personal: undefined;
  AddNote: undefined;
  EditNote: {
    noteId: string;
  };
  NoteDetails: {
    noteId: string;
  };
  Profile: undefined;
};