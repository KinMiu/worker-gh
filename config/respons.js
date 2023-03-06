const requestResponse = {
  gagal: (pesan) => {
      return {
          status: false,
          msg: pesan
      }
  },
  berhasil: (pesan) => {
      return {
          status: true,
          msg: pesan
      }
  },
  kesalahan: {
      status: false,
      msg: 'terjadi kesahan server'
  },
  suksesLogin: (data) => {
      return {
          status: true,
          msg: 'Berhasil Login',
          data: data
      }
  },
  suksesWithData: (data) => {
      return {
          status: true,
          msg: 'Berhasil Memuat Data',
          data: data
      }
  }
}

module.exports = { requestResponse }