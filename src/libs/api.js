import axios from 'axios';
import config from '../../config/cursor';

export default axios.create({
  baseURL: config.api.baseURL,
});
