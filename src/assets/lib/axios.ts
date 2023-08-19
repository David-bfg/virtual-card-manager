import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3069' })

export { axios, api }