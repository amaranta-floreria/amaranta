import Image from 'next/image';

export default function BouquetCare() {
	return (
		<div className='h-screen flex flex-col items-center justify-center font-bold'>
			<Image
				className="w-full max-h-[700px]"
				src="/box_care.jpeg"
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