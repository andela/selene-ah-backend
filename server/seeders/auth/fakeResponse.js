const fakeResponse = {
  status() {
    return this;
  },

  json(obj) {
    return obj;
  }
};

export default fakeResponse;
