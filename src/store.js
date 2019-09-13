import createStore from 'unistore';

export const store = createStore({
  email: '',
  full_name: '',
  is_login: false,
  api_key: '',
  keyword: '',
  values: [],
  jumlah: 0,
  total: '',
  listName: [],
  gender: '',
  name: '',
  token: '',
  url: 'http://0.0.0.0:5000',
});

export const actions = (store) => ({
  setEmail(state, value) {
    return { email: value };
  },
  setName(state, value) {
    return { full_name: value };
  },
  setLogin(state, value) {
    return { is_login: value };
  },
  setKeyword(state, value) {
    return { keyword: value };
  },
  setValue(state, value) {
    return { values: value };
  },
  setApiKey(state, value) {
    return { api_key: value };
  },
  setQuestion(state, value) {
    return { question: value };
  },
  setTotal(state, value) {
    return { total: value };
  },
  setJumlah(state, value) {
    return { jumlah: value };
  },
  setPic(state, value) {
    return { pic: value };
  },
  ubahMale: (state) => {
    store.setState({ gender: 'male' });
  },
  ubahFemale: (state) => {
    store.setState({ gender: 'female' });
  },
  ubahListName: (state, baru) => {
    store.setState({ listName: baru });
  },
  ubahName: (state, baru) => {
    store.setState({ name: baru });
  },
  setToken: (state, value) => {
    store.setState({ token: value });
  },
});
