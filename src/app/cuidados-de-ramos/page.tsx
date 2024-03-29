import Image from "next/image"

export default function BouquetCare() {
	return (
		<div className='h-screen flex flex-col items-center justify-center font-bold'>
			<Image
				className="w-full max-w-[500px]"
				src="/bouquet_care.png"
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