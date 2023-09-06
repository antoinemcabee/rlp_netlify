import {motion} from 'framer-motion';

const transition = (OriginalComp) => {
    return () => (
        <>
        <motion.div
            // key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OriginalComp />
            </motion.div>
            {/* <motion.div
                className='slide-in'
                initial={{scaleX: 0}}
                animate={{scaleX: 0}}
                exit={{scaleX: 1}}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1]
                }}
            />
            {/* when a component is exted */}
            {/* <motion.div
                className='slide-out'
                initial={{scaleY: 1}}
                animate={{scaleY: 0}}
                exit={{scaleY: 0}}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1]
                }} 
            /> */}
        </>
    )
}

export default transition;