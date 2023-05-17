import axios from './axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

const useGetApi = async (url) => {
    const { data } = useSWR(url, fetcher)
    return data.data
}

export {
    fetcher,
    useGetApi
}