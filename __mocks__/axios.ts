import axios from "axios";

const requests = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
};

export default requests;
