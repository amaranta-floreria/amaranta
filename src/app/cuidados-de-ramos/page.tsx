'use client'
import { Pagination } from 'swiper/modules';
import localFont from 'next/font/local'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image';

const avenir = localFont({ src: '../../../public/fonts/avenir_next.ttf' })

export default function BouquetCare() {
	return (
		<div className={'h-screen flex flex-col items-center justify-center animate-pulse font-semibold ' + avenir.className}>
			<Image
				className="object-none object-center"
				src="/bouquet_care.jpeg"
				alt="amaranta_logo Logo"
				width={0}
				height={0}
				sizes="100vw"
				style={{ width: '100%', height: '100%' }}
				priority
			/>
		</div>
	)
}