import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useQuery } from '@tanstack/react-query'
import instance from '../../configs/axios'
import { useNavigate } from 'react-router-dom'
const FeaturedDestination = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['room'],
        queryFn: () => instance.get('/room')
    })

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading rooms</p>

    const rooms = data?.data?.rooms || []
    return (

        <div className='flex flex-col items-center px-6 md:px-16 lg:px-20 xl:px-40 bg-slate-50 py-20 animate-[moveUp_1s_ease-out]'>

            <Title title='Featured Destination' subTitle='Discover our handpicked selection of
         exceptional properties around the world, offering unparalleled luxury and unforgettable experiences' />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-20 animate-[moveUp_1s_ease-out]'>
                {rooms.map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>

            <button onClick={() => { navigate('/room'); scrollTo(0, 0) }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination