import axios from 'axios';
import store from './store';
import { swalError, swalSuccess } from './Swal';

const actionsReward = (store) => ({
  // add the reward (post to API)
  async doAddReward(state, data) {
    const regexName = /^[^\s]+(\s+[^\s]+)*$/;
    const regexNumber = /^\d+$/;
    const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/;
    // check the form validation
    if (!regexName.test(data.name) | data.name === '') {
      await swalError('Nama tidak boleh spasi/kosong!!');
      return false;
    } if (!regexNumber.test(data.point_to_claim)) {
      await swalError('Gunakan Angka Untuk Poin!');
      return;
    } if (!regexNumber.test(data.stock)) {
      await swalError('Gunakan Angka untuk Stok!');
      return;
    } if (!regexImage.test(data.photo)) {
      await swalError('Pilih file image terlebih dahulu!');
      return;
    }
    const self = this;
    await axios
      .post(`${store.getState().url}/v1/rewards`,
        data,
        {
          headers: {
            Authorization: `Bearer ${String(localStorage.getItem('admin_token'))}`,
          },
        })
      .then(async (response) => {
        await swalSuccess('Berhasil Menambahkan Hadiah!');
        await window.location.reload();
      })
      .catch((error) => {
      });
  },

  // edit trash to database
  async doEditReward(state, data, id) {
    const regexName = /^[^\s]+(\s+[^\s]+)*$/;
    const regexNumber = /^\d+$/;
    const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/;
    // check the form validation
    if (!regexName.test(data.name) | data.name === '') {
      swalError('Nama tidak boleh spasi/kosong!!');
      return false;
    } if (!regexNumber.test(data.point_to_claim)) {
      swalError('Gunakan Angka Untuk Poin!');
      return;
    } if (!regexNumber.test(data.stock)) {
      swalError('Gunakan Angka untuk Stok!');
      return;
    } if (!regexImage.test(data.photo)) {
      swalError('Pilih file image terlebih dahulu!');
      return;
    }
    const self = this;
    const config = {
      method: 'PUT',
      url: `${store.getState().url}/v1/rewards/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    };
    await axios(config).then(async (response) => {
      await swalSuccess('Berhasil Menggnanti Hadiah!');
    }).catch(async (error) => {
      await swalError('Gagal Menambahkan');
    });
  },
});

export default actionsReward;
