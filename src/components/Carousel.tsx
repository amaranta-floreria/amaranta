'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const Carousel = ({ data }: {
	data: {
		image: string
	}[]
}) => {
	const [currentImg, setCurrentImg] = useState(0)
	const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 })
	const carouselRef = useRef(null)

	useEffect(() => {
		let elem = carouselRef.current as unknown as HTMLDivElement
		let { width, height } = elem.getBoundingClientRect()
		if (carouselRef.current) {
			setCarouselSize({
				width,
				height,
			})
		}
	}, [])

	return (
		<div>
			<div className='w-80 h-60 rounded-md overflow-hidden relative'>
				<div ref={carouselRef}
					style={{
						left: -currentImg * carouselSize.width
					}}
					className='w-full h-full absolute flex transition-all duration-300'>
					{data.map((v, i) => (
						<div key={i} className='relative shrink-0 w-full h-full'>
							<Image
								className='pointer-events-none'
								alt="random image"
								fill
								src={v.image}
							/>
						</div>
					))}
				</div>
			</div>
			<div className='flex justify-center mt-3'>
				<button
					disabled={currentImg == 0}
					onClick={() => setCurrentImg(prev => prev - 1)}
					className={`border px-4 py-2 font-bold ${currentImg == 0 && 'opacity-50'}`}
				>
					{"<"}
				</button>
				<button
					disabled={currentImg == data.length - 1}
					className={`border px-4 py-2 font-bold ${currentImg == data.length - 1 && 'opacity-50'}`}
					onClick={() => setCurrentImg(prev => prev + 1)}
				>
					{">"}
				</button>
			</div>
		</div>
	)
}

export default Carousel
