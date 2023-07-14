import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const endpoint = `${helper.API_HOST_PREFIX}/api/sharedstories`;

const getApproveStories = (pageIndex, pageSize, isApproved) => {
  const config = {
    method: 'GET',
    url: `${endpoint}/paginate?pageIdx=${pageIndex}&pageSize=${pageSize}&isApproved=${isApproved}`,
    withCredentials: false,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addAStory = (payload) => {
  const config = {
    method: 'POST',
    url: endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const editStory = (payload, id) => {
  const config = {
    method: 'PUT',
    url: `${endpoint}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteAStory = (id) => {
  const config = {
    method: 'DELETE',
    url: `${endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateApprovedStory = (id, payload) => {
  const config = {
    method: 'PUT',
    url: `${endpoint}/approval/${id}/${payload}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const sharedstoriesService = {
  getApproveStories,
  addAStory,
  editStory,
  deleteAStory,
  updateApprovedStory,
};
export default sharedstoriesService;
