import axios from 'axios';
import { DISTRICTS_URL, PROVINCES_URL, WARDS_URL } from './api';

class LocationService{
    static getProvinces() {
        return axios.get(PROVINCES_URL)
    }
    static getDistricts(provinceId) {
        return axios.get(`${DISTRICTS_URL}/${provinceId}`)
    }
    static getWards(districtId) {
        return axios.get(`${WARDS_URL}/${districtId}`)
    }
}

export default LocationService;