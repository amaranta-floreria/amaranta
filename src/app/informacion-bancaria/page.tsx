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

export default function BankInformation() {
	return (
		<div className={'relative h-full ' + avenir.className}>
			<Swiper
				className='h-full w-full'
				// install Swiper modules
				modules={[Pagination]}
				spaceBetween={50}
				slidesPerView={1}
				pagination={{ clickable: true }}
				onSwiper={(swiper) => console.log(swiper)}
				onSlideChange={() => console.log('slide change')}
			>
				<SwiperSlide>
					<div className='h-full max-w-720'>
						<Image
							className='h-full w-full bg-[#FBFBFB] xl:bg-white'
							alt="oxxo"
							src="/transfer_information_bg.svg"
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: '100%', height: '100%' }} // optional
						/>

						<div className="absolute top-20 sm:top-20 px-4 py-3 w-full text-center">
							<h1 className='text-base'> OXXO </h1>
							<h4 className="text-base"> Depósito </h4>
						</div>

						<div className="absolute bottom-10 px-4 py-3 w-full text-center">
							<p className="text-base"> 4217470021188921 </p>
							<p className="text-base"> Vanessa Urzúa </p>
							<p className="text-base"> Debito </p>
						</div>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className='h-full max-w-720'>
						<Image
							className='h-full w-full bg-[#FBFBFB] xl:bg-white'
							alt="oxxo"
							src="/transfer_information_bg.svg"
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: '100%', height: '100%' }} // optional
						/>

						<div className="absolute top-10 px-4 py-3 w-full text-center">
							<p className="text-black-200"> BBVA </p>
							<p className="text-black-200"> Transferencia </p>
						</div>

						<div className="absolute bottom-10 px-4 py-3 w-full text-center">
							<p className="text-black-200"> 012180015302741892 </p>
							<p className="text-black-200"> Vanessa Urzúa </p>
							<p className="text-black-200"> Debito </p>
						</div>
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
	)
}