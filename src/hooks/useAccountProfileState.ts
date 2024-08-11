import React from "react";


type Action = {
  field: keyof AccountProfileState;
  value: any;
};

export interface AccountProfileState {
  userName: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  fileImage: File | null;  // You can replace `any` with a specific type if needed
  previewImage: string;
  isInfoUpdating: boolean;
  isUserUpdateFailed: boolean;
  isImageUploadFailed: boolean;
}

const initialState: AccountProfileState = {
  userName: "",
  name: "",
  email: "",
  phone: "",
  gender: "",
  birthday: "",
  fileImage: null,
  previewImage: '',
  isInfoUpdating: false,
  isUserUpdateFailed: false,
  isImageUploadFailed: false,
};

// move the state update logic from event handlers into a single function outside of our component
function reducer(state: AccountProfileState, action: Action): AccountProfileState {
  return { ...state, [action.field]: action.value }
}

export default function useAccountProfileState() {
  const [state, dispatch] = React.useReducer(reducer, initialState, () => initialState);
  //make sure field is correct type
  //can use form event as param to replace field and value but need to set other place than form
  function handleChangeState<K extends keyof AccountProfileState>(field: K, value: AccountProfileState[K]) {
    dispatch({ field, value });
  };
  return { state, handleChangeState }
}
