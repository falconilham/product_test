import axios from './axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res)

const useGetApi = async (url) => {
    const { data } = useSWR(url, fetcher)
    return data
}

export {
    fetcher,
    useGetApi
}