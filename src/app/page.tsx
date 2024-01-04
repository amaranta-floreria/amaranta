import Image from 'next/image'
import localFont from 'next/font/local'
const avenir = localFont({ src: '../../public/fonts/avenir_next.ttf' })

export default function Home() {
	return (
		<div className={'h-screen flex flex-col items-center justify-center animate-pulse font-semibold ' + avenir.className}>
			<Image
				className="object-none object-center"
				src="/amaranta_logo.png"
				alt="amaranta_logo Logo"
				width={180}
				height={37}
				priority
			/>
			<p className='text-[50px]'>Amaranta</p>
		</div>
	)
}
