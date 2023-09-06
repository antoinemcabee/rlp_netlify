import { Image } from "@shopify/hydrogen";

require('../../public/arch-template.svg')

export default function ImageArch({img, mt}) {
    return (
        <Image
            data={img}
            className={`rounded-t-full w-full h-[500px] object-cover px-6 mt-8 [clip-path:polygon(0%_0%,100%_0%,100%_100%)]`}
            // style={{borderRadius: '200px 200px 0px 0px'}}
            sizes="(min-width: 45em) 50vw, 100vw"
            aspectRatio="4/5"
            loading="lazy"
            width=' 100%'
            height='auto'
        />
    )
}