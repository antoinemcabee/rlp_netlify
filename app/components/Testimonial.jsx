

export default function Testimonial({ content, author }) {
    return (
        <div id={content.length+author.length + (new Date().getUTCSeconds() * Math.random()) } className="px-6  pt-8 pb-4 bg-[#3D362C] relativen flex align-center items-center flex-col">
            <Quote />
            <p id={content.length*14+Math.random()} className="text-[#DBB198] text-xs text-center px-8 pt-10 leading-7 transition-opacity ease-in-out duration-700 ">{ content }</p>
            <p className="text-[#DBB198] text-xs text-center italic mb-4">- { author }</p>
            <h3 className=" text-[#DBB198] self-end text-3xl leading-[inherit]">The Scoop</h3>
        </div>
    )
}

export const Quote = () => {
    return <h1 className="text-[#DBB198] text-[175px] w-fit h-fit absolute leading-none">"</h1>
}