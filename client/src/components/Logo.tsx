import { Link } from "react-router-dom"

const Logo = () => {
  return (
    <Link to={"/"} className='hover:scale-95 duration-300 flex items-center justify-start gap-2'>
        <div className="w-12 h-12 rounded-2xl overflow-hidden">
            <img className="object-cover w-full h-full" src="/icon.svg" alt="" />
        </div>
        <h1 className="text-2xl font-bold">
            Tolio
        </h1>
    </Link>
  )
}

export default Logo