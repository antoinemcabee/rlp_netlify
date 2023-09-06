import { useSwipeable } from "react-swipeable";
import { useState } from "react";


export default function Carousel ({items}) {
    const numItems = items.length

    const [position, setPosition] = useState(0)
    
    const handleInc = () => {
        if (position < numItems -1) {
            setPosition(pos => pos+1)
        }
    }

    const handleDec = () => {
        if (position > 0) {
            setPosition(pos => pos-1)
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => handleInc(),
        onSwipedRight: () => handleDec(),
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    });
    
    return (
        <div {...handlers}>
            {
                items[position]
            }
        </div>
    )

}


// framer motion to slide them
const SlideIndicator = (numItems) => (
    <div></div>
)