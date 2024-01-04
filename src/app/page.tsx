import Image from 'next/image'
import localFont from 'next/font/local'
import Link from 'next/link'
const avenir = localFont({ src: '../../public/fonts/avenir_next.ttf' })

export default function Home() {
	return (
		<div className={'h-screen flex flex-col items-center justify-center font-bold ' + avenir.className}>
			<div className='flex flex-row space-x-4'>
				<Link className='text-base tracking-wide' href="/informacion-bancaria">Informacion bancaria</Link>
				<Link className='text-base tracking-wide' href="/cuidados-de-ramos">Cuidado de ramos</Link>
				<Link className='text-base tracking-wide' href="/cuidados-de-cajas">Cuidado de cajas</Link>
			</div>
			<Image
				className="object-none object-center  animate-pulse"
				src="/amaranta_logo.png"
				alt="amaranta_logo Logo"
				width={180}
				height={37}
				priority
			/>
			<p className='text-[50px] text-[#d89f94] tracking-wide  animate-pulse'>Amaranta</p>
		</div>
	)
}
